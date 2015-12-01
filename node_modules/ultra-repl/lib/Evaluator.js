var EventEmitter = process.EventEmitter,
    Context      = require('./Context');

module.exports = Evaluator;


[ 'assert', 'debug', 'error', 'watchFile',
  'unwatchFile', 'mixin', 'createChildProcess',
  'inherits', '_byteLength'
].forEach(function(s){ delete process[s] });


function Evaluator(settings){
  this.contexts = new Group;
  this.settings = settings;
  this.create(true);
  this.history = [];
}

Evaluator.prototype = {
  __proto__: EventEmitter.prototype,
  constructor: Evaluator,

  get index(){ return this.contexts.index },
  get count(){ return this.contexts.length },
  get current(){ return this.contexts.current },
  get introspect(){ return this.contexts.current.introspect },
  get inspector(){ return this.contexts.current.inspector },
  get displayName(){ return this.contexts.current[this.settings.colors ? 'displayName' : 'name'] },
  get global(){ return this.contexts.current.global },
  get name(){ return this.contexts.current.name },
  get ctx(){ return this.contexts.current.ctx },
  get locals(){ return this.contexts.current.locals },
  set locals(v){ this.contexts.current.locals = v },
  set name(v){ this.contexts.current.name = v },

  view: function view(){
    return this.lastResult = this.contexts.current.view();
  },

  run: function run(code, noRecord, callback){
    if (typeof noRecord === 'function') {
      callback = noRecord, noRecord = false;
    }
    if (callback) {
      var self = this;
      this.contexts.current.run(code, noRecord, function(result){
        if (!noRecord) self.lastResult = result;
        callback(result);
      });
    } else {
      var result = this.contexts.current.run(code, noRecord);
      if (!noRecord) this.lastResult = result;
      this.emit('execution', result);
      return result;
    }
  },

  create: function create(isGlobal){
    var context = this.contexts.append(new Context(this.settings, isGlobal));
    var current = this.current;
    this.contexts.last();
    this.emit('create', context, current);
    return context;
  },

  next: function next(){
    var current = this.current;
    var context = this.contexts.next();
    this.emit('change', context, current);
    return context;
  },

  prev: function prev(){
    var current = this.current;
    var context = this.contexts.prev();
    this.emit('change', context, current);
    return context;
  },

  remove: function remove(){
    if (this.current.isGlobal) {
      return new Error("can't remove global");
    }
    var current = this.current;
    var context = this.contexts.remove();
    this.emit('remove', context, current);
    return context;
  },

  reset: function reset(){
    var ctx = this.contexts.current.initialize(this.settings);
    this.emit('reset', this.current);
    return ctx;
  },
};
