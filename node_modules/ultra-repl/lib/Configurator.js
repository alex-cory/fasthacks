var explore = explorePath;

function Configurator(name, root, options){
  this.name = name;
  this.root = explore(root);
  options = Object.keys(options || {}).reduce(function(r,s){
    r[s] = options[s];
    return r;
  }, {
    pristine: this.root.resolve('pristine')
  });

  Object.keys(options).forEach(function(s){ this[s] = options[s] }, this);
}


Configurator.prototype = {
  __proto__: process.EventEmitter.prototype,
  constructor: Configurator,
  init: function init(){
    var self = this;
    if (this.root.exists()) {
      if (this.pristine.exists()) {
        this.pristine.forEach(function(file){
          if (!self.root.has(file.basename)) {
            self.emit('newfile', file.copy(self.root));
          }
        });
      } else {
        this.emit('create.directory', this.pristine.create());
      }
    } else {
      this.emit('newdir', this.root.create());
    }
    this.emit('init', this.root);
  },
  reset: function reset(){
    if (this.root.exists() && this.pristine.exists()) {
      this.pristine.forEach(function(file){
        file = self.root.resolve(file.basename);
        if (file.exists()) {
          self.emit('deletefile', file);
          file.delete();
        }
      });
    }
  }
};
