var isError = require('../lib/utility/objects').is('Error');


function contextCommand(action){
  return function(){
    var result = this.context[action]();
    if (isError(result)) {
      result = styling.error(result.message);
    } else {
      result = styling.context[action](action) + ' ' + result.displayName;
    }
    this.writer(this.context.view());
    if (action in styling.context) {
      this.rli.timedWrite('topright', result);
    }
    this.updatePrompt();
  }
}

module.exports = {
  init: function(){},
  commands: [
    { name: 'Node Builtins',
      help: 'Add the default Node global variables to the current context. This includes process, console, '+
            'Buffer, and the various ArrayBuffer functions.',
      defaultTrigger: api.keybind('alt+a'),
      action: function(){
        this.context.current.setGlobal();
        if (this.context.current.installPresets('node')) {
          this.updatePrompt();
        }
      }
    },
    { name: 'Create Context',
      help: 'Create, initialize, and switch into a new V8 context.',
      defaultTrigger: api.keybind('ctrl+shift+up'),
      action: contextCommand('create')
    },
    { name: 'Delete Context',
      help: 'Delete the current V8 context and all objects unreferences externally.',
      defaultTrigger: api.keybind('ctrl+shift+down'),
      action: contextCommand('remove')
    },
    { name: 'Reset Context',
      help: 'Reset current context.',
      defaultTrigger: api.command('.r'),
      action: contextCommand( 'reset')
    },
    { name: 'Next Context',
      help: 'Switch to the Next context.',
      defaultTrigger: api.keybind('ctrl+up'),
      action: contextCommand( 'next')
    },
    { name: 'Previous Context',
      help: 'Switch to the previous context.',
      defaultTrigger: api.keybind('ctrl+down'),
      action: contextCommand( 'prev')
    },
    { name: 'Label Context',
      help: 'Change the label of the current context.\n',
      defaultTrigger: api.command('.label'),
      action: function(cmd, name){
        this.context.name = name;
        this.updatePrompt();
      }
    }
  ]
};
