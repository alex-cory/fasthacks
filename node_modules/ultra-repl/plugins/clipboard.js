// windows bindings for now, need to add others to clipboard module
if (process.platform !== 'win32') return module.exports = [];

try { var clipboard = require('clipboard'); } catch (e) { return module.exports = []; }
var Results = require('../lib/Results').Success


module.exports = {
  init: function(){
    var self = this;
    clipboard.setFormatter('ascii', function(item){
      if (typeof item === 'string') return item;
      var colors = self.settings.colors;
      self.settings.colors = false;
      var output = self.format(item);
      self.settings.colors = colors;
      return output;
    });
  },
  commands: [{
    name: 'Copy',
    help: 'Copy current line or current results to clipboard',
    defaultTrigger: api.keybind('ctrl+c'),
    action: function(){
      if (this.rli.line.trim().length) {

        clipboard.write(this.rli.line);
        var message = 'Copied line to clipboard';

      } else if (this.context.lastResult) {

        clipboard.write(this.context.lastResult);
        var message = 'Copied last result to clipboard';

      }
      message && this.rli.timedWrite('topright', message, 'bgbblack');
    }
  },
  { name: 'Paste',
    help: 'Paste the clipboard text or JS Object. (You can paste objects between contexts)',
    defaultTrigger: api.keybind('ctrl+v'),
    action: function(){
      var items = clipboard.readAll();
      if ('jsobject' in items) {

        var obj = items.jsobject.value;
        if (obj.isResult) {
          obj = obj.completion || obj.globals || obj.error;
        }
        this.context.current.locals.clipboard = obj;
        return new Results(this.context.current, null, obj, null, 'Pasted object to local variables as "clipboard"');

      } else if ('json' in items) {

        return JSON.parse(items.json.value);

      } else if ('ascii' in items) {

        var result = this.context.current.run(items.ascii.value);
        result.label = 'Executed code from clipboard';
        this.writer(result);
        //return result;
      }
    }
  }]
}
