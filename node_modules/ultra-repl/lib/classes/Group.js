module.exports = Group;

function Group(){
  var group = [];
  group.push.apply(group, arguments);
  group.__proto__ = Group.prototype;
  group.index = 0;
  return group;
}

Group.prototype = {
  constructor: Group,
  get current(){
    return this[this.index];
  },
  next: function next(){
    if (this.length) {
      if (++this.index === this.length) this.index = 0;
      return this[this.index];
    }
  },
  prev: function prev(){
    if (this.length) {
      if (--this.index === -1) this.index = this.length - 1;
      return this[this.index];
    }
  },
  first: function first(){
    return this[this.index = 0];
  },
  last: function last(){
    if (this.length) {
      return this[this.index = this.length - 1];
    }
  },
  remove: function remove(){
    if (this.length) {
      var removed = Array.prototype.splice.call(this, this.index, 1)[0];
      if (this.length && this.index === this.length) this.index--;
      return removed;
    }
  },
  append: function append(item){
    Array.prototype.push.apply(this, arguments);
    return item;
  },
}