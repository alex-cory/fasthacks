var path       = require('path'),
    exporePath = require('./utility/explorePath');

module.exports = {
  toggle: toggle,
  keywords: keywords,
  command: command,
  keybind: keybind,
  match: match,
  SETTINGS: explorePath(path.resolve(__dirname, '..', 'workspace'))
};

function toggle(obj, prop){
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
}


function keywords(x){ return { type: 'keywords', trigger: x } }
function command(x){ return { type: 'command', trigger: x } }
function keybind(x){ return { type: 'keybind', trigger: x } }
function match(x){ return { type: 'match', trigger: x } }
