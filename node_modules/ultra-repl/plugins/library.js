var highlight = require('../lib/Highlighter');
var explorePath = require('../lib/utility/explorePath');


module.exports = {
  init: function(){
    var repl = this;
    var histories = {};

    function save(name, value){
      api.SETTINGS.get(name+'.history.json').write(JSON.stringify(value, null, '  '));
    }
    function load(name){
      var history = api.SETTINGS.get(name+'.history.json');
      return history.exists() ? JSON.parse(history.read()) : [];
    }
    function change(next, last){
      if (next.name in histories) {
        repl.rli.history = histories[next.name];
      } else {
        histories[next.name] = repl.rli.history = load(next.name);
      }
    }

    repl.on('endsession', function(){
      for (var k in histories) {
        save(k, histories[k])
      }
    });

    repl.context.on('change', change);
    repl.context.on('create', change);
    repl.context.on('remove', change);

    histories.global = repl.rli.history = load(repl.context.name);
  },
  commands: [{
    name: 'Save Code',
    help: 'Format and output REPL code from this context',
    defaultTrigger: api.command('.save'),
    action: function(cmd, params){
      if (!params) params = this.context.current.locals.__filename;
      var file = explorePath(params);

      var code = this.context.current.getExecutedCode();
      file.write(code);

      this.emit('save', code);
      return highlight(code);
    }
  },
  { name: 'Load Code',
    help: 'Format and output REPL code from this context',
    defaultTrigger: api.command('.load'),
    action: function(cmd, params){
      if (!params) params = this.context.current.locals.__filename;

      var file = explorePath(params);
      if (!file.exists()) {
        file = explorePath(this.context.current.locals.__dirname).resolve(params);
        if (!file.exists()) {
          file = explorePath(process.execPath).resolve(params);
          if (!file.exists()) {
            return new Error('File not found');
          }
        }
      }
      if (file.isDir) {
        var files = file.read();
        var code = files.map(function(file){
          return file.read();
        }).join('\n\n');
      } else {
        var code = file.read('utf8');
      }

      if (code) {
        var result = this.context.current.setupModule(file.path);
        this.context.current.run(code);
        result.code = code;
        result.label = 'Result';
        this.emit('load', result)
        return result;
      } else {
        return '';
      }
    }
  }]
};
