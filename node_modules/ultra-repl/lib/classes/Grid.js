
module.exports = Grid;


var RIGHT = -1;
var LEFT = 1;



function Grid(array, gutter, columns){
  var grid = [];
  grid.__proto__ = Grid.prototype;
  array.forEach(function(row){
    grid.push(new Row(row, grid));
  });
  if (gutter > 0) gutter = ' '.repeat(gutter);
  grid.gutter = gutter || '  ';
  grid.columns = !columns ? [] : columns.map(function(col){
    if (Object(col) !== col) {
      col = { align: 1, title: ''+col, width: 0 };
    }
    if (col.title.slice(-1) === '>') {
      col.title = col.title.slice(0, RIGHT);
      col.align = -1;
    }
    return col;
  });
  return grid;
}


Grid.prototype = {
  __proto__: Array.prototype,

  toString: function toString(){
    var startlength = this.columns.length;
    this.columns.map(widest().forEach(function(width, i){
      if (i < startlength) {
        this.columns[i].width = width;
      } else if (i >= startlength) {
        this.columns.push({ title: '', width: width, align: -1 });
      }
    }, this));
    var title = new Row(this.columns.map(pluck('title')), this);
    return title + '\n' + this.join('\n');
  },

  push: function push(){
    for (var k in arguments) {
      Array.prototype.push.call(this, new Row(arguments[k], this));
    }
  }
};

hidden(Grid.prototype, 'gutter');




function Row(array, parent){
  var row = array.slice();
  row.__proto__ = Row.prototype;
  if (parent) row.parent = parent;
  return row;
}

Row.prototype = {
  __proto__: Array.prototype,

  toString: function toString(){
    self = this;
    if (this.parent && this.parent.columns) {
      var array = this.map(function(item, i){
        return (''+item).pad(this.parent.columns[i].width * this.parent.columns[i].align);
      }, this);
    }
    return (array || this).join(this.parent.gutter);
  }
};

hidden(Row.prototype, 'parent');





function hidden(obj, name){
  if (Array.isArray(name)) {
    name.forEach(function(prop){ lazyProperty(obj, prop) });
    return obj;
  }
  var visible = name[0] === '$';
  name = visible ? name.slice(1) : name;
  Object.defineProperty(obj, name, {
    configurable: true,
    enumerable: visible,
    get: function(){},
    set: function(v){ Object.defineProperty(this, name, { value: v, writable: true }) }
  });
}




