var path         = require('path'),
    vm           = require('vm'),
    ScopedModule = require('./ScopedModule'),
    Results      = require('./Results'),
    Script       = require('./Script'),
    names        = require('../data/text').names,
    builtins     = require('../data/builtins');

var namecolors = styling.context.names,
    inspector  = new Script(path.resolve(__dirname, './inspect.js')),
    contexts   = [];



module.exports = Context;

function Context(globalSettings, isGlobal){
  if (isGlobal) {
    if (module.globalContext) return module.globalContext;
    Object.defineProperty(module, 'globalContext', { value: this });

    this.name = 'global';
    this.isGlobal = true;
  } else {
    this.name = names.shift();
  }

  Object.defineProperties(this, {
    id:           { value: contexts.length },
    displayName:  { value: namecolors[contexts.length % namecolors.length](this.name) }
  });

  this.settings = Object.keys(options.inspector).reduce(function(r,s){
    return r[s] = options.inspector[s], r;
  }, {});

  this.initialize(globalSettings);
}


Context.presets = {
  node: function(){ return { source: global, properties: builtins.node } },
};

Context.inspector = inspector;



var mainFakeModule = new ScopedModule('.', null);
mainFakeModule.filename = path.resolve(__dirname, '..', 'workspace');
mainFakeModule.paths = ScopedModule._nodeModulePaths(mainFakeModule.filename);
mainFakeModule.loaded = true;

Context.prototype = {
  constructor: Context,

  get ctx(){ return contexts[this.id] },
  set ctx(v){ contexts[this.id] = v },

  get lastResult(){ return this.history.length && this.history[this.history.length-1] },

  initialize: function initialize(globalSettings){
    this.presets = {};
    this.ctx = vm.createContext();
    Object.defineProperty(this, 'global', desc(vm.runInContext('this', this.ctx), true));

    var init = inspector.run(this.ctx)(this.settings, globalSettings, builtins, styling.inspector);
    for (var k in init) this[k] = init[k];
    this.history = [];
    this.setGlobal();

    if (this.isGlobal) {
      this.installPresets('node');
    }

    var fakename = path.resolve(this.isGlobal ? process.cwd() : __dirname + '/../workspace', this.name+'.repl.js');
    this.setupModule(fakename);
    this.refresh();
    return this;
  },

  setupModule: function setupModule(name){
    var module = new ScopedModule(name, null);
    module.context = this.ctx;

    function require(path){
      if (path === 'rainbow') {
        return rainbow;
      }
      if (path === 'introspect') {
        path = __dirname + '/utility/introspect.js';
      }
      return module.require(path);
    }

    require.resolve = function resolve(request){
      return ScopedModule._resolveFilename(request, module);
    }

    module.paths = ScopedModule._nodeModulePaths(name);
    module._cache = [];
    module.filename = name;
    module.loaded = true;
    module.locals = {
      require: require,
      module: module,
      exports: module.exports,
      __dirname: path.dirname(name),
      __filename: name
    };
    desc.toggleHidden();
    this.defines({
      __dirname: desc(path.dirname(name)),
      __filename: desc(name),
      require: desc(require),
      module: desc(module),
      exports: desc(function get(){ return module.exports },
                    function set(v){ module.exports = v }),
    });
    desc.toggleHidden();
    Object.defineProperty(this, 'locals', desc(function get(){ return module.locals }));
    return module;
  },

  view: function view(){
    return new Results.Success(this, new Script('this'), this.global, null, 'Global Object');
  },

  setGlobal: function setGlobal(){
    vm.runInContext('global = this', this.ctx);
  },

  defines: function defines(o){
    Object.keys(o).forEach(function(key){
      this.define(key, o[key]);
    }, this);
  },

  installPresets: function installPresets(name){
    if (name in this.presets) return false;
    var preset = Context.presets[name]();
    var decls = preset.properties.map(function(prop){
      this.define(prop, Object.getOwnPropertyDescriptor(preset.source, prop));
    }, this);
    this.refresh();
    this.presets[name] = true;
    return true;
  },

  refresh: function refresh(){
    vm.runInContext('this', this.ctx);
  },

  run: function run(script, noRecord, callback){
    if (typeof noRecord === 'function') {
      callback = noRecord, noRecord = false;
    }
    noRecord = noRecord === true;

    if (typeof script === 'string') {
      script = new Script(script);
      if (script.type === 'file') {
        this.setupModule(script.path+'');
      }
    }
    if (script instanceof vm.Script) {
      script = Script.wrap(script);
    }

    this.snapshot();
    var outcome = this.settings.globalExec ? script.run(this.ctx) : script.scoped(this.ctx, this.locals);
    var globals = this.snapshot();

    if (outcome && outcome.error) {
      var result = new Results.Fail(this, script, outcome.error);
    } else {
      var result = new Results.Success(this, script, outcome, globals);
    }

    if (callback) {
      var self = this;
      process.nextTick(function(){
        if (!noRecord) self.history.push(result);
        callback(result)
      });
    } else {
      if (!noRecord) this.history.push(result);
      return result;
    }
  },

  runCode: function runCode(code, name){
    var script = new Script(code, name);
    this.snapshot();
    var outcome = vm.runInContext(code, this.ctx, name);
    var globals = this.snapshot();
    if (outcome && outcome.error) {

      return new Results.Fail(this, script, outcome.error);
    } else {
      return new Results.Success(this, script, outcome, globals);
    }
  },

  clone: function clone(){
    var context = new this.constructor(this.isGlobal);
    Object.keys(options.inspector).forEach(function(prop){
      context[prop] = this[prop];
    }, this);
    this.history.forEach(function(event){
      context.run(event.script);
    });
    return context;
  },

  getExecutedCode: function getExecutedCode(){
    return this.history.filter(function(s){ return s.status ==='Success' }).map(function(s){
      return s.script.code;
    }).join('\n');
  }
};

function desc(v, h, r){ return new Desc(v, h, r) }
desc.toggleHidden = function(){ Desc.prototype.enumerable = !Desc.prototype.enumerable }

function Desc(v, h, r){
  if (Object(v) === v) {
     if (typeof v === 'function') {
      if (v.name === 'get' || v.name === 'set') {
        this[v.name] = v;
        if (typeof h === 'function') {
          this[this.get ? 'set' : 'get'] = h;
          h = r;
        }
      } else if (typeof h === 'function') {
        this.get = v;
        this.set = h;
        h = r;
      } else {
        this.value = v;
      }
    } else if ('value' in v) {
      this.value = v.value;
      if (W in v && !v[W]) this[W] = false;
      if (E in v && !v[E]) this[E] = false;
      if (C in v && !v[C]) this[C] = false;
    } else if ('get' in v || 'set' in v) {
      this.get = v.get;
      this.set = v.set;
      if (E in v && !v[E]) this[E] = false;
      if (C in v && !v[C]) this[C] = false;
    } else {
      this.value = v;
    }
  } else {
    this.value = v;
  }
  if (h) this[E] = false;
  if ('value' in this) this[W] = !r;
}

Desc.prototype.enumerable = true;
Desc.prototype.configurable = true;

var W = 'writable', E='enumerable', C='configurable';
