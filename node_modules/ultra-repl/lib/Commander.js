var path       = require('path'),
    exporePath = require('./utility/explorePath'),
    inherit    = require('./utility/objects').inherit,
    define     = require('./utility/objects').define;

var push = [].push;


module.exports = Commander;


function Commander(rli, controls){
  var self = this;

  this.rli = rli;
  this.lastpress = Date.now();
  this.matches = [];
  this.help = [];
  this.binds = new Dict;
  this.kws = new Dict;
  this.controls = require(controls || '../settings/controls')(api.keywords, api.command, api.keybind);

  rli.on('keybind', function(key){
    if (self.binds.has(key.bind)) {
      key.used = true;
      self.binds.get(key.bind).forEach(function(action){
        self.emit('keybind', action);
      });
    }
    self.lastpress = Date.now();
  });
}

inherit(Commander, process.EventEmitter, [
  function addCommand(command){
    var control = this.controls[command.name] || command.defaultTrigger;

    if (control.type) {
      this[control.type](control.trigger, command.action);
    }

    return {
      name: command.name,
      help: command.help,
      type: control.type,
      trigger: control.trigger
    };
  },

  function cadence(keybind, action){
    var self = this;
    return function(){
      if (Date.now() - self.lastpress > 5000) return;

      self.rli.once('keybind', function(key){
        if (keybind === key.bind) {
          key.used = true;
          self.emit('keybind', action);
        }
      });
    }
  },

  function autoload(){
    options.autoload.forEach(function(name){
      push.apply(this.help, this.loadPlugin(name));
    }, this);
  },

  function loadPlugin(name){
    try {
      var plugin = require('../plugins/' + name);
    } catch (e) {
      return [];
    }

    if ('init' in plugin) {
      this.emit('initplugin', plugin.init);
    }

    if (Array.isArray(plugin)) {
      return plugin.map(this.addCommand, this);
    }
    return plugin.commands ? plugin.commands.map(this.addCommand, this) : [];
  },

  function keybind(bind, action){
    var keys = bind.split(' ');
    bind = keys.pop()

    while (keys.length) {
      action = this.cadence(bind, action);
      bind = keys.pop();
    }

    this.binds.getDefault(bind, Array).push(action);
  },

  function keywords(kws, action){
    kws.forEach(function(kw){
      this.kws.set(kw, action);
    }, this);
  },

  function command(cmd, action){
    this.kws.set(cmd, action);
  },

  function match(match, action){
    this.matches.push({ pattern: match, action: action })
  },

  function keyword(cmd){
    if (this.kws.has(cmd)) {
      this.emit('keyword', this.kws.get(cmd), cmd, '');
      return true;
    } else {
      var m = cmd.match(/^([^\s]+)\s+(.*)$/);
      if (m !== null && this.kws.has(m[1])) {
        this.emit('keyword', this.kws.get(m[1]), m[1], m[2]);
        return true;
      } else {
        return this.matches.some(function(handler){
          var match = cmd.match(handler.pattern);
          if (match) {
            this.emit('match', handler.action, match[0], match.slice(1));
            return true;
          }
        }, this);
      }
    }
    return false;
  }
]);


var api = {
  toggle: function toggle(obj, prop){
    return function(){
      if (typeof prop === 'undefined') {
        var result = (this[obj] ^= true);
      } else {
        var result = (this[obj][prop] ^= true);
      }
      result = result ? '++' : '--';
      this.refresh();
      this.timedPrompt(result + (prop || obj), styling.prompt[result]);
    }
  },
  keywords: function keywords(x){
    return { type: 'keywords', trigger: x }
  },
  command: function command(x){
    return { type: 'command', trigger: x }
  },
  keybind: function keybind(x){
    return { type: 'keybind', trigger: x }
  },
  match: function match(x){
    return { type: 'match', trigger: x }
  },
  SETTINGS: explorePath(path.resolve(__dirname, '..', 'workspace'))
};
