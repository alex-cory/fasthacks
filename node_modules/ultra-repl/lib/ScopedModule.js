var vm, NativeModule;

/* Hack to get a reference to node's internal NativeModule */
(function(){
  // intercept NativeModule.require's call to process.moduleLoadList.push
  process.moduleLoadList.push = function(){
    // `NativeModule.require('native_module')` returns NativeModule
    NativeModule = arguments.callee.caller('native_module');

    // delete the interceptor and forward normal functionality
    delete process.moduleLoadList.push;
    return Array.prototype.push.apply(process.moduleLoadList, arguments);
  }

  // force an initial call to the interceptor
  vm = require('vm');
})();

var util        = require('util'),
    fs          = require('fs'),
    path        = require('path'),
    Module      = require('module'),
    natives     = process.binding('natives'),
    explorePath = require('./utility/explorePath');


// Hide the pages and pages of sourcecode in case inspected in the REPL
if (typeof NativeModule === 'function') {
  Object.defineProperty(NativeModule, '_source', {
    enumerable: false,
    writable: true,
    configurable: true,
    value: NativeModule._source || {}
  });
  // globally override node's internal Module system
  // NativeModule._cache.module.exports = module.exports = ScopedModule;
}


module.exports = ScopedModule;


// experimental declaration of imports externally
// imports are provided in local scope to modules
var importsCache = {};

function readImports(request){
  if (typeof request === 'string') request = explorePath(request);
  if (!request.isDir) request = request.parent;
  if (request in importsCache) return importsCache[request];

  var imports = request.resolve('.imports.json');
  if (!imports.exists()) return importsCache[request] = [];

  try {
    return importsCache[request] = imports.read(JSON.parse);
  } catch (e) {
    e.path = imports.path;
    e.message = 'Error parsing ' + imports.path + ': ' + e.message;
    throw e;
  }
}






// ScopedModule is a superset of node's builtin Module which allows for customized local variables
function ScopedModule(){
  Module.apply(this, arguments);
  this.locals = {};
  this.context = this.parent ? this.parent.context : global;
}

Object.defineProperties(ScopedModule, {

  main: _(null),

  _resolveFilename: _(function _resolveFilename(request, parent) {
    if (NativeModule.exists(request)) {
      return request;
    }

    var resolvedModule = Module._resolveLookupPaths(request, parent);
    var id = resolvedModule[0];
    var paths = resolvedModule[1];

    var filename = Module._findPath(request, paths);
    if (!filename) {
      var err = new Error("Cannot find module '" + request + "'");
      err.code = 'MODULE_NOT_FOUND';
      throw err;
    }
    return filename;
  }),


  _load: _(function _load(request, parent, isMain){
    if (request in natives) return Module._load.apply(this, arguments);

    var resolved = ScopedModule._resolveFilename(request, parent);
    var filename = resolved;

    if (parent == null || !parent._cache) {
      var _module = new ScopedModule(filename, null);
      Object.defineProperty(_module, '_cache', {
        writable: true,
        configurable: true,
        value: []
      });
    } else {
      if (parent && parent._cache && filename in parent._cache) {
        return parent._cache[filename].exports;
      } else {
        var _module = new ScopedModule(filename, parent);
        Object.defineProperty(_module, '_cache', {
          writable: true,
          configurable: true,
          value: parent._cache
        });
      }
    }
    _module._cache[filename] = _module;

    if (isMain) {
      Object.defineProperty(process, 'mainModule', {
        value: _module,
        configurable: true,
        writable: true,
        enumerable: false
      });
      _module.id = '.';
    }


    var info = explorePath(filename);
    if (!info.isDir) info = info.parent;

    var imports = {};

    readImports(info).forEach(function(rule){
      if (rule.receivers[0] === '*' || ~rule.receivers.indexOf(info.basename)) {
        rule.providers.forEach(function(provider){
          if (NativeModule.exists(provider)) {
            imports[provider] = provider;
          } else {
              provider = info.resolve(provider);
            if (provider.isDir) {
              provider.read(function(file){ imports[file] = file });
            } else {
              imports[provider] = provider;
            }
          }
        });
      }
    });


    Object.keys(imports).forEach(function(name){
      if (NativeModule.exists(name)) {
        this.locals[imports[name]] = NativeModule.require(name);
      } else {
        this.locals[imports[name].toIdentifier()] = _module.require(name);
      }
    }, _module);


    _module.load(resolved);

    return _module.exports;
  }),

  _nodeModulePaths: _(function _nodeModulePaths(from){
    var paths = [];
    from = explorePath(from);
    while (!from.root) {
      from = from.parent;
      if (from.basename !== 'node_modules') {
        paths.push(from.resolve('node_modules').path);
      }
    }
    from = explorePath(process.execPath);
    while (!from.root) {
      from = from.parent;
      if (from.basename !== 'node_modules') {
        paths.push(from.resolve('node_modules').path);
      }
    }
    return paths;
  }),

  wrap: _(function wrap(context, code, scope, name){
    var names = Array.isArray(scope) ? scope.slice() : Object.getOwnPropertyNames(scope);
    names = names.filter(jsIdentifier);
    var wrapper = ScopedModule.wrapper[0]+names+ScopedModule.wrapper[1]+code+ScopedModule.wrapper[2];
    if (context === global || context === undefined)
      var wrapped = vm.runInThisContext(wrapper, name);
    else
      var wrapped = vm.runInContext(wrapper, context, name);

    function run(scope){
      return function(){
        "use strict";
        return wrapped.apply(this, names.map(function(s){ return scope[s] }));
      }.call(this.exports);
    }

    return Array.isArray(scope) ? run : run.call(scope, scope);
  }),

  _imports: _({}),
  wrapper: _(['(function (', '){', '\n});']),
  _debug: _(Module._debug),

  runMain: _(function(){ return ScopedModule._load(process.argv[1], null, true) }),
  requireRepl: _(function(){ return ScopedModule._load('repl', '.') }),
});

//Module.globalPaths
//Module._cache
//Module._findPath
//Module._resolveLookupPaths
//Module._resolveFilename
//Module._initPaths
//Module._pathCache
//Module._realpathCache
//Module._extensions
//Module._contextLoad



function jsIdentifier(name){
  return !/$[a-zA-Z_$][\w_$]*$/.test(name);
}


ScopedModule.prototype = Object.create(Module.prototype, {
  constructor: _(ScopedModule),

  require: _(function require(path){
    return ScopedModule._load(path, this);
  }),
  _compile: _(function _compile(content, filename){
    var self = this;

    function require(path){
      return self.require(path);
    }

    require.resolve = function(request) {
      return ScopedModule._resolveFilename(request, self);
    }

    require.extensions = Module._extensions;
    require.main = ScopedModule.main;

    var scopeArgs = Object.create(this.locals);
    scopeArgs.exports = this.exports;
    scopeArgs.require = require;
    scopeArgs.module = this;
    scopeArgs.__filename = filename;
    scopeArgs.__dirname = path.dirname(filename);

    var names = Object.getOwnPropertyNames(this.locals).concat(Object.keys(scopeArgs));
    var compiledWrapper = ScopedModule.wrap(this.context, content.replace(/^\#\!.*/, ''), names, filename);

    return compiledWrapper.call(this, scopeArgs);
  })
});



function _(v){ return { configurable: true, writable: true, value: v } }


