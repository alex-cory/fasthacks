var Results = require('../lib/Results'),
    Script = require('../lib/Script');



module.exports = {
  init: function(){},
  commands: [
    { name: 'Inject REPL',
      help: 'Adds a reference to the live repl object to the current context local scope.',
      defaultTrigger: api.keybind('f12'),
      action: function(){
        return this.context.current.locals.repl = this;
      }
    },
    { name: 'Key Display',
      help: 'Toggle displaying what keys are pressed.',
      defaultTrigger: api.keybind('f11'),
      action: api.toggle('keydisplay')
    },
    { name: 'Inspect Real Global',
      help: 'Show the real global, which should be isolated from anything running in the repl.',
      defaultTrigger: api.keybind('f8'),
      action: function(){ return real.context.call(this) }
    },
  ]
};
var real = { context: realinit };

function realinit(){
  var globalContext = this.context.current.constructor.inspector.wrap.runInThisContext()(
    this.context.current.settings,
    this.settings,
    builtins,
    styling.inspector
  );
  real.context = function(){
    var globals  = globalContext.globals();
    delete globals.process;
    delete globals.Buffer;
    return globalContext.inspector(globals);
  }
  return real.context();
}
