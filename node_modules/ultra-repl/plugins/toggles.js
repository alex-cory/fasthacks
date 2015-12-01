var C = Object.getPrototypeOf(rainbow(0,0,0));
var modes = [256,16,0];


module.exports = {
  init: function(){},
  commands: [
    { name: 'Hiddens',
      help: 'Toggle whether hidden properties are shown.',
      defaultTrigger: api.keybind('f2'),
      action: api.toggle('currentSettings', 'hiddens')
    },
    { name: 'Builtins',
      help: 'Toggle whether default built-in objects are shown.',
      defaultTrigger: api.keybind('f3'),
      action: api.toggle('currentSettings', 'builtins')
    },
    { name: '[[proto]]',
      help: 'Toggle whether [[prototype]] trees are displayed.',
      defaultTrigger: api.keybind('f4'),
      action: api.toggle('currentSettings', 'protos')
    },
    { name: 'Dense Format',
      help: 'Toggle showing multiple properties/array items per line.',
      defaultTrigger: api.keybind('f5'),
      action: api.toggle('currentSettings', 'multiItemLines')
    },
    { name: 'Ignore Custom Inspect',
      help: 'Toggles whether custom inspection functions are used.',
      defaultTrigger: api.keybind('alt+4'),
      action: api.toggle('currentSettings', 'ignoreInspect')
    },
    { name: 'Alphabetical Sorting',
      help: 'Toggle showing multiple properties/array items per line.',
      defaultTrigger: api.keybind('alt+q'),
      action: api.toggle('currentSettings', 'alphabeticalSorting')
    },
    { name: 'Global/Local',
      help: 'Switch between running code in a private local scope or globally (both in current context',
      defaultTrigger: api.keybind('f6'),
      action: api.toggle('currentSettings', 'globalExec')
    },
    { name: 'Colors',
      help: 'Toggle whether output is colored.',
      defaultTrigger: api.keybind('f9'),
      action: function(){
        modes.push(modes.shift());
        C.setMode(modes[0]);
        this.refresh();
      }
    },
    { name: 'Depth--',
      help: 'Decrease inspector recurse depth',
      defaultTrigger: api.keybind('alt+1'),
      action: function(){
        var settings = this.context.current.settings;
        if (settings.depth > 1) {
          settings.depth--;
          this.refresh();
          this.timedPrompt('depth ' + settings.depth, styling.prompt['--']);
        }
      }
    },
    { name: 'Depth++',
      help: 'Increase inspector recurse depth',
      defaultTrigger: api.keybind('alt+2'),
      action: function(){
        var settings = this.context.current.settings;
        settings.depth++;
        this.refresh();
        this.timedPrompt('depth ' + settings.depth, styling.prompt['++']);
      }
    },
    { name: 'Set Depth',
      help: 'Set inspector recurse depth\n',
      defaultTrigger: api.command('.depth'),
      action: function(cmd, depth){
        var settings = this.context.current.settings;
        depth = parseInt(depth, 10);
        if (depth === settings.depth || !(depth > 0)) {
          this.timedPrompt('depth ' + settings.depth, styling.prompt['--']);
          this.rli.clearInput();
        } else {
          depth = depth > 1 ? depth : 1;
          this.timedPrompt('depth ' + depth, styling.prompt[settings.depth > depth ? '--' : '++']);
          settings.depth = depth;
          this.refresh();
        }
      }
    }
  ]
};
