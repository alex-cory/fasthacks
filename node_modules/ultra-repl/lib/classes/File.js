var path = require('path');
var fs = require('fs');

Object.defineProperty(Function.prototype, 'constructed', {
  configurable: true,
  writable: true,
  value: function constructed(o){ return this.prototype.isPrototypeOf(o) }
});

function File(name){
  if (File.constructed(name)) return name;
  if (!File.constructed(this)) return new File(name);
  this.path = path.resolve(name);
}

File.prototype = {
  constructor: File,
  encoding: 'utf8',
  chunkSize: 2 << 15,
  exists: function exists(){
    return fs.existsSync(this.path);
  },
  read: function read(){
    return fs.readFileSync(this.path, this.encoding);
  },
  write: function write(content){
    fs.writeFileSync(this.path, content);
  },
  open: function open(flag){
    this.fd && this.close();
    return this.fd = fs.openSync(this.path, flag);
  },
  close: function close(){
    this.fd && fs.closeSync(this.fd);
    delete this.fd;
  },
  copy: function copy(to){
    var buffer = new Buffer(this.chunkSize);
    var dest = new File(to);
    var read = 1, offset = 0;

    this.open('r');
    dest.open('w');
    while (read > 0) {
      read = fs.readSync(this.fd, buffer, 0, this.chunkSize, offset);
      fs.writeSync(dest.fd, buffer, 0, read);
      offset += read;
    }
    this.close();
    dest.close();
  }
};
