var path = require('path');
var ScopedModule = require('./lib/ScopedModule');
var UltraREPL = ScopedModule._load(__dirname + '/lib/UltraREPL.js', null, true);

module.exports = createREPL

function createREPL(options){
  return new UltraREPL(options);
}

createREPL.createREPL = createREPL;
createREPL.UltraREPL = UltraREPL;
