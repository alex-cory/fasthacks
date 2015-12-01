var vm     = require('vm'),
    fs     = require('fs'),
    path   = require('path'),
    crypto = require('crypto');



module.exports = Script;

function Script(code, name){
  var type;
  var desc = {
    type: { value: null, enumerable: true },
    name: { value: null || '', enumerable: true },
    code: { value: null }
  };
  if (typeof code === 'function') {
    type = 'function';
    name = code.name;
    code = code + '';
  } else if (code instanceof Path || !~code.indexOf('\n') && require('path').extname(code) === '.js') {
    type = 'file';
    var path = new Path(code);
    desc.path = { value: path, enumerable: true }
    if (!path.exists())
      throw new Error('File not found: ' + path);

    if (path.script)
      return path.script;

    path.script = this;

    name = name || path.basename();
    code = path.read().replace(/^\#\!.*/, '');
  } else {
    type = 'string';
    name = name || '';
  }

  var hash = sha(code);
  if (hash in Script.cache)
    return Script.cache[hash];

  Script.cache[hash] = this;

  desc.type.value = type;
  desc.name.value = name;
  desc.code.value = code;
  desc.size = { value: code.length, enumerable: true };
  desc.wrap = { value: Script.compile(code, name) }

  Object.defineProperties(this, desc);
}

Script.compile = function compile(code, name){
  try { return new vm.Script(code, name) }
  catch (e) {
    try { return new vm.Script('( '+code+'\n)', name) }
    catch (e2) { return e }
  }
}

Script.wrap = function wrap(script, name){
  return Object.create(Script.prototype, {
    type: { value: script instanceof Error ? 'error' : 'unknown', enumerable: true },
    name: { value: name || '', enumerable: true },
    code: { value: '"unknown";' },
    wrap: { value: script }
  });
}

Script.cache = {};
Script.fileCache = {};

Script.scopeWrap = function scopeWrap(names, src){
  if (!src.match(/^\s*(var|function)/)) src = 'return '+src;
  return '(function(global){'+
           'return function('+names+'){\n'+
             src+
           '\n}'+
         '})(this)';
}

Script.tryrun = function tryrun(script, context){
  if (typeof script === 'string') script = Script.compile(script);
  if (script instanceof SyntaxError) {
    return { error: script };
  }
  var method = (context && context !== global) ? 'runInContext' : 'runInThisContext';
  try { return script[method](context) }
  catch (e) { return { error: e } }
}

Script.prototype = {
  constructor: Script,
  run: function run(context){
    return Script.tryrun(this.wrap, context);
  },

  scoped: function scoped(context, scope){
    var names = Array.isArray(scope) ? scope : Object.getOwnPropertyNames(scope);
    names = names.filter(function(name){
      return !/$[a-zA-Z_$][\w_$]*$/.test(name);
    });

    var unbound = Script.tryrun(Script.scopeWrap(names, this.code), context);
    if (!unbound || unbound.error) {
      return unbound;
    }

    function bind(scope, binding){
      try { return unbound.apply(binding || global, names.map(function(s){ return scope[s] })); }
      catch (e) { return { error: e } }
    }
    return Array.isArray(scope) ? bind : bind(scope);
  },
  resolve: function resolve(pathname){
    if (this.type === 'file') {
      var path = Path.find(this.path, pathname);
      if (path)
        return new Script(path.path);
    }
  }
}


function quotes(s) {
  s = String(s).replace(/\\/g, '\\\\');
  var q = ['"', "'"];
  var qMatch = [/(')/g, /(")/g];
  var qWith = +(s.match(qMatch[0]) === null);
  return q[qWith] + s.replace(qMatch[1-qWith], '\\$1') + q[qWith];
}



function resolve(name){
  var resolved = name;
  if (!fs.existsSync(resolved)) {
    if (!fs.existsSync(resolved = path._makeLong(name))) {
      if (!fs.existsSync(resolved = path._makeLong(path.resolve(__dirname, name)))) {
        return false;
      }
    }
  }
  return resolved;
}


function sha(code){
  var shasum = crypto.createHash('sha1');
  shasum.update(code);
  return shasum.digest('hex');
}




function Path(pathname){
  if (pathname instanceof Path)
    return pathname;

  pathname = path.resolve(pathname+'');
  if (pathname in Path.cache)
    return Path.cache[pathname];

  Path.cache[pathname] = this;
  Object.defineProperty(this, 'path', { enumerable: true, value: pathname });
}

Path.root = path.resolve('/');
Path.cache = {};

Path.find = function find(start, name){
  start = new Path(start).dir();
  var curr = start.resolve(name);
  if (curr.exists())
    return curr;
  var paths = nodeModulePaths(start);
  for (var i=0; i < paths.length; i++) {
    curr = paths[i].resolve(name);
    if (curr.exists())
      return curr;
  }
}

Path.prototype = {
  explode: function explode(){
    return this.path.split('/');
  },
  toUnix: function toUnix(){
    return this.path.replace(/^\w\:\\/, '/').replace(/\\+/g, '/');
  },
  toWindows: function toWindows(){
    return this.path.replace(/^\//, 'C:\\').replace(/\//g, '\\');
  },
  resolve: function resolve(subpath){
    return new Path(path.resolve(this.path, subpath+''));
  },
  relative: function relative(subpath){
    return path.relative(this.path, subpath+'');
  },
  parent: function parent(){
    return this.resolve('..');
  },
  isRoot: function isRoot(){
    return this.path === Path.root;
  },
  basename: function basename(){
    return path.basename(this.path);
  },
  extname: function extname(){
    return path.extname(this.path);
  },
  dirname: function dirname(){
    return path.dirname(this.path);
  },
  dir: function dir(){
    return new Path(path.dirname(this.path));
  },
  inspect: function inspect(){
    return '<Path "'+this.path+'">';
  },
  toString: function toString(){
    return this.path;
  },
  has: function has(path){
    return this.resolve(path).exists();
  },
  read: function read(encoding){
    return fs.readFileSync(this.path, encoding || 'utf8');
  },
  list: function list(){
    return fs.readdirSync(this.path);
  },
  exists: function exists(){
    return fs.existsSync(this.path);
  }
};


var normalPaths = [];
[].push.apply(normalPaths, nodeModulePaths(process.execPath));

function nodeModulePaths(from){
  var paths = [];
  from = new Path(from);
  while (!from.isRoot()) {
    from = from.parent();
    if (from.basename() !== 'node_modules') {
      paths.push(from.resolve('node_modules'));
    }
  }
  return unique(paths.concat(normalPaths));
}

function unique(array){
  var seen = Object.create(null);
  var out = [];
  for (var i=0; i < array.length; i++) {
    if (!(array[i] in seen)) {
      out.push(array[i]);
      seen[array[i]] = true;
    }
  }
  return out;
}
