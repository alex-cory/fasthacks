var path = require('path'),
    fs   = require('fs');

var slice      = Function.prototype.call.bind(Array.prototype.slice),
    isWin      = process.platform === 'win32';

var cache = [{},{}],
    existCache = {};

module.exports = function explorePath(path, lazy){
  return new Path(path || process.cwd(), lazy);
};

function Path(request, lazy){
  this.path = Array.isArray(request) ? path.resolve.apply(null, request) : path.resolve(request);

  if (this.path in cache[+!lazy]) return cache[+!lazy][this.path];
  cache[+!lazy][this.path] = this;

  this.define('lazy', !!lazy, true);
  if (!lazy) {
    this.getExtname();
    this.getDirname();
    this.getBasename();
    this.getSplit();
  }
}

Path.separator = isWin ? [/[\/\\]/, '\\'] : [/\//, '/'];

Path.prototype = {
  constructor: Path,

  getExtname: function getExtname(){
    return this.define('extname', path.extname(this.path));
  },
  get extname(){ return this.getExtname() },

  getDirname: function getDirname(){
    return this.define('dirname', path.dirname(this.path));
  },
  get dirname(){ return this.getDirname() },

  getBasename: function getBasename(){
    return this.define('basename', path.basename(this.path));
  },
  get basename(){ return this.getBasename() },

  getStats: function getStats(){
    return this.define('stats', fs.statSync(this.path));
  },
  get stats(){ return this.getStats() },


  getSplit: function getSplit(){
    this.define('split', this.path.split(Path.separator[0]));
    if (isWin) {
      this.define('drive', this.split.shift());
    }
    return this.split;
  },
  get split(){ return this.getSplit() },

  getType: function getType(){
    if (!this.exists()) return null;
    var stats = fs.statSync(this.path);
    return this.define('type', stats.isFile() ? 'file' : stats.isDirectory() ? 'directory' : null);
  },
  get type(){ return this.getType() },

  getParent: function getParent(){
    if (this.root) return
    this.define('parent', new Path(path.resolve(this.path, '..'), this.lazy));
    if (this.parent === this) {
      this.define('root', true);
    }
    this.parent.define('type', 'directory');
    return this.parent;
  },
  get parent(){ return this.getParent() },

  resolve: function resolve(){
    return new Path(path.resolve.apply(null, [this.path].concat(slice(arguments))), this.lazy);
  },

  get: function get(child){
    return new Path([this.path, child], this.lazy);
  },

  has: function has(child){
    if (this.type === 'directory') {
      return this.get(child).exists();
    } else {
      return false;
    }
  },

  removeExt: function removeExt(){
    return this.basename.slice(0, -this.extname.length);
  },

  relative: function relative(to){
    return path.relative(this.path, to);
  },

  toUnix: function toUnix(){
    return '/'+this.split.join('/');
  },

  toWin: function toWin(){
    return [this.drive ? this.drive : 'C:'].concat(this.split).join('\\');
  },

  toIdentifier: function toIdentifier(){
    return this.basename.slice(0,-this.extname.length).replace(/[^\w]+(.)?/g, function(m,c){
      return c ? c.toUpperCase() : '';
    });
  },

  toString: function toString(){
    return this.path;
  },

  exists: function exists(){
    if (existCache[this.path]) return existCache[this.path][0];
    existCache[this.path] = [
      fs.existsSync(this.path),
      setTimeout(function(){ delete existCache[this.path] }.bind(this), 10000)
    ];
    return existCache[this.path][0];
  },

  getIsDir: function getIsDir(){
    return this.type === 'directory';
  },
  get isDir(){ return this.getIsDir() },


  getIsFile: function getIsFile(){
    return this.type === 'file';
  },
  get isFile(){ return this.getIsFile() },


  read: function read(cb, encoding){
    if (typeof cb === 'string') {
      encoding = cb;
      cb = null;
    }
    switch (this.type) {

      case 'directory':
        return fs.readdirSync(this.path).map(function(file){
          file = new Path(this.path + Path.separator[1] + file, this.lazy);
          return cb ? cb(file) : file;
        }, this);

      case 'file':
        var file = fs.readFileSync(this.path, encoding);
        return cb ? cb(file) : file;

      default:
        return cb ? cb(null) : null;
    }
  },

  write: function write(v){
    if (this.isDir) throw new TypeError("Directories can't be written to");
    var parent = this.parent;
    var create = [];
    while (!parent.exists()) {
      create.push(parent.path);
      parent = parent.parent;
    }
    while (create.length) fs.mkdirSync(create.pop());
    return fs.writeFileSync(this.path, v);
  },

  define: function define(name, value, hidden, readonly){
    if (arguments.length === 2) {
      hidden = this.constructor.prototype === this;
    }
    Object.defineProperty(this, name, {
      value: value,
      enumerable: !hidden,
      writable: !readonly,
      configurable: true
    });
    return value;
  }
};


function hide(o,p){
  p = p || Object.keys(o);
  return Array.isArray(p) ? p.map(hide.bind(null, o)) : Object.defineProperty(o, p, { enumerable: false });
}


hide(Path.prototype);
