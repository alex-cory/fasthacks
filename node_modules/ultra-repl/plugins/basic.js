var Results = require('../lib/Results'),
    fs = require('fs'),
    path = require('path');

var dir = rainbow(255, 180, 30),
    file = rainbow(255, 255, 200);

module.exports = {
  init: function(){},
  commands: [
    { name: 'Command List',
      help: 'Shows this list.',
      defaultTrigger: api.keybind('f1'),
      action: call('showHelp')
    },
    { name: 'Load Plugin',
      help: 'Dynamically load an UltraREPL plugin.',
      defaultTrigger: api.command('.plugin'),
      action: function(cmd, name){
        this.showHelp(this.commands.loadPlugin(name));
      }
    },
    { name: 'Auto-Includer',
      help: 'Type "/<lib>" to include built-in <lib> on the current context.',
      defaultTrigger: api.keywords(builtins.libs.map(function(lib){ return '/'+lib })),
      action: function(lib){
        lib = lib.slice(1);
        var result = this.context.ctx[lib] = require(lib);
        return new Results.Success(this.context.current, null, result, null, 'Built-in Lib "'+lib+'"');
      }
    },
    { name: 'Inspect Context',
      help: 'Shortcut for writing `this` to inspect the current context.',
      defaultTrigger: api.keybind('ctrl+z'),
      action: function(){
        return this.context.view();
      }
    },
    { name: 'Clear Input',
      help: 'Clear the the input line if it has text or clears the screen if not.',
      defaultTrigger: api.keybind('esc'),
      action: function(){
        this.rli.line.trim().length ? this.resetInput() : this.resetScreen();
      }
    },
    { name: 'Clear Screen',
      help: 'Clear the screen.',
      defaultTrigger: api.keybind('esc esc'),
      action: call('resetScreen')
    },
    { name: 'Exit',
      help: 'Exit the REPL.',
      defaultTrigger: api.keybind('ctrl+d'),
      action: function(){
        console.log('');
        this.rli.close();
        process.exit();
      }
    },
    { name: 'Tab Completion',
      help: 'Context aware tab completion.',
      defaultTrigger: api.keybind('tab'),
      action: function(){
        var cursor = this.rli.cursor,
            height = this.height - 4,
            line = this.rli.takeLine(),
            cols = [],
            widths = [],
            items = [],
            title = '',
            tallest = 0;

        if (line[0] === '.' || ~line.indexOf(/[\/\\]/)) {
          var parts = line.split(/[\/\\]+/),
              last = parts.pop(),
              main = parts.join('/');

          if (fs.existsSync(main)) {
            if (fs.existsSync(line) && fs.statSync(line).isDirectory()) {
              main = line;
              last = '';
            } else {
              line = main + '/';
            }
            var files = [],
                regex = new RegExp('^'+last),
                first = '';

            title = 'Directory listing for ' + path.resolve(main);

            fs.readdirSync(main).forEach(function(name){
              if (!first && regex.test(name)) {
                first = name;
              }
              widest = Math.max(name.length, widest)
              var stat = fs.statSync(main+'/'+name);
              if (stat.isDirectory()) {
                items.push({
                  name: name,
                  type: 'directory',
                  size: ''+fs.readdirSync(main+'/'+name).length,
                  modified: stat.mtime,
                  accessed: stat.atime
                });
              } else if (stat.isFile()) {
                stat.name = name;
                files.push(stat);
              }
            });
            items.sort(function(a, b){
              return a.name === b.name ? 0 : a.name < b.name ? -1 : 1;
            });
            files.sort(function(a, b){
              return a.name === b.name ? 0 : a.name < b.name ? -1 : 1;
            });
            files.forEach(function(stat){
              items.push({
                name: stat.name,
                type: 'file',
                size: filesize(stat.size),
                modified: stat.mtime,
                accessed: stat.atime
              });
            });
            first = { name: first };
          }

        } else {
          var parts = line.split('.'),
              prop = parts.pop(),
              regex = new RegExp('^'+prop);
          if (parts.length) {
            line = parts.join('.');
            title = 'Auto-completions for "'+line+'.'+prop+'"';
            try {
              var obj = this.context.ctx.eval(line);
            } catch (e) {
              return e;
            }
            line += '.';
          } else {
            line = '';
            title = 'Auto-completions';
            var obj = this.context.global;
          }


          var introspect = this.context.introspect;
          obj = introspect(obj);

          items = obj.describe().filter(function(desc){
            return regex.test(desc.name);
          }).toArray().sort(function(a, b){
            return a.name === b.name ? 0 : a.name > b.name ? -1 : 1;
          });
          var first = items.pop();
        }


        if (items.length > height) {

          while (items.length > 0) {
            var col = items.slice(-height);
            tallest = Math.max(tallest, col.length);
            cols.push(col);
            widths.push(columnWidth(col));
            if (items.length > height) {
              items.length -= height;
            } else {
              items.length = 0;
            }
          }

          cols = cols.map(function(col, i){
            return formatColumn(introspect, col, widths[i]);
          });

          var out = crossColumns(cols, tallest).join('\n');
        } else {
          var out = formatColumn(introspect, items, columnWidth(items));
          out = new Array(height + 1 - out.length).join('\n') + out.join('\n');
        }


        this.resetScreen();

        this.writer(new Results.Success(this.context.current, null, out, null, title));
        this.rli.line = line + (first ? first.name : '');
        var len = this.rli.line.alength;
        cursor = Math.min(len, cursor);
        this.rli.cursor = cursor;
        this.rli.selectionStart = cursor;
        this.rli.selectionEnd = this.rli.line.alength;
        this.rli.refreshLine();
      }
    }
  ]
};

function crossColumns(cols, height){
  var out = [];
  for (var i=0; i < height; i++) {
    var row = [];
    for (var j=0; j < cols.length; j++) {
      if (i in cols[j]) {
        row.push(cols[j][i]);
      }
    }
    out.push(row.join(''));
  }
  return out;
}

function columnWidth(col){
  return col.reduce(function(longest, item){
    return Math.max(longest, item.name.length);
  }, 0) + 1;
}

function formatColumn(introspect, col, width){
  return col.map(function(desc){
    if (desc.type === 'value') {
      var introspected = introspect(desc.value),
          color = styling.inspector[introspected.isConstructor() ? 'Constructor' : introspected.brand()];

      if (color) {
        return '   '+color(desc.name.pad(width));
      }
    } else if (desc.type === 'file') {
      return '  '+file(desc.name.pad(width)) + desc.size.pad(-8);
    } else if (desc.type === 'directory') {
      return '  '+dir(desc.name.pad(width)) + desc.size.pad(-8);
    }

    return '   '+styling.inspector.Name(desc.name.pad(width));
  });
}

function call(section, prop, args){
  if (typeof args === 'undefined') {
    args = [];
  } else if (!Array.isArray(args)) {
    args = [args];
  }
  return function(){
    if (prop) {
      return this[section][prop].apply(this[section], args)
    } else {
      return this[section].apply(this, args);
    }
  }
}

function widest(arr, field){
  return arr.reduce(function(a, b){
    if (typeof b !== 'string') return a;
    b = b[field].length;
    return a > b ? a : b;
  }, 0);
}

function filesize(s){
  if (isNaN(s) || s <= 0) return '0b';
  for (var b=0; s >= 1024; b++) s >>= 10;
  s |= 0;
  return (b ? s+' '+' kmgt'[b] : s+'  ')+'b';
}
