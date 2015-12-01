var hidden = require('../lib/utility/object-utils').lazyProperty;

module.exports = {
  init: function(){},
  commands: [
    { name: 'Current Directory',
      help: 'List the files in the current working directory',
      defaultTrigger: api.command('.dir'),
      action: function(cmd, dir){
        dir = readStats(path.resolve(dir.trim() || process.cwd()));
        this.context.ctx.dir = dir;
        return dir.display()+'';
      }
    }
  ]
};

function Entity(){}
Entity.prototype = {
  __proto__: Array.prototype,
  constructor: Entity,
  parent: function(){
    if (this.split.length > 1) {
      var name = this.split.slice(0, this.split.length - 1).join('/');
    } else if (this.split.length) {
      var name = this.split[0]
    } else return false;
    return readStats(path.resolve(name));
  }
};
hidden(Entity.prototype, 'split');
var cache = {};


function Directory(){}
Directory.prototype = {
  __proto__: Entity.prototype,
  constructor: Directory,
  index: 0x4000,
  read: function(){
    return fs.readdirSync(this.abspath).map(function(s){
      return readStats(this.abspath + '/' + s, this);
    }, this);
  },
  display: function display(){
    var children = this.read();
    var grid = new Grid(children, 2, [
      'Type',
      'Name',
      'Modified',
      'Accessed',
      'Size>'
    ]);
    return grid;
  }
}

function File(){}
File.prototype = {
  __proto__: Entity.prototype,
  constructor: File,
  index: 0x8000,
};

function CharDev(){}
CharDev.prototype = {
  __proto__: Entity.prototype,
  constructor: CharDev,
  index: 0x2000,
};


function filesize(a){
  for (var b=0; a>=1024; b++) a /= 1024;
  return (b ? a.toFixed(2)+' '+' kmgt'[b] : a+' ')+'b';
}

function filedate(a){
  return a.toISOString().slice(0,10);
}


function readStats(loc, parent){
  var abspath = path.resolve(loc);
  var stat = fs.statSync(abspath);
  var type = types[stat.type];
  var item = [];

  item.__proto__ = type.prototype;
  item.abspath = abspath;
  item.split = abspath.split(/\\|\//);
  if (parent) {
    item.parent = function(){ return parent }
  }


  item.push(
     type.name,
     path.basename(abspath),
     filedate(stat.mtime),
     filedate(stat.atime),
     type === File ? filesize(stat.size) : ''
  );

  return item;
}

var types = { 0x8000: File, 0x4000: Directory, 0x2000: CharDev };

Object.defineProperty(fs.Stats.prototype, 'type', {
  get: function(){
    return !this.isFile() ? !this.isDirectory() ? !this.isBlockDevice() ? null : 0x2000 : 0x4000 : 0x8000;
  },
  enumerable: true,
  configurable: true
});
