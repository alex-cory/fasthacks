module.exports = Dict;

var inherit = require('../utility/objects').inherit,
    define = require('../utility/objects').define,
    isObject = require('../utility/objects').isObject;

var create = Object.create;



function Dict(values) {
  define(this, {
    size: 0,
    hash: create(null),
    keys: [],
    values: []
  });

  if (values) {
    Object.keys(values).forEach(function(key){
      this.set(key, values[key]);
    }, this);
  }
}

define(Dict.prototype, [
  function set(key, value) {
    if (key in this.hash) {
      this.values[this.hash[key]] = value;
    } else {
      var index = this.hash[key] = this.keys.length;
      this.keys[index] = key;
      this.values[index] = value;
      this.size++;
    }
    return value;
  },
  function get(key) {
    if (key in this.hash) {
      return this.values[this.hash[key]];
    }
  },
  function getDefault(key, fallback) {
    if (key in this.hash) {
      return this.values[this.hash[key]];
    } else {
      return this.set(key, fallback());
    }
  },
  function has(key) {
    return key in this.hash;
  },
  function remove(key) {
    if (key in this.hash) {
      var index = this.hash[key];
      this.keys.splice(index, 1);
      this.values.splice(index, 1);
      delete this.hash[key];
      this.count--;
      return true;
    }
    return false;
  },
  function forEach(callback, context) {
    context || (context = this);
    for (var i=0; i < this.size; i++) {
      callback.call(context, this.values[i], this.keys[i], this);
    }
  },
  function clone() {
    var out = new Dict;
    this.forEach(function(value, key){
      out.set(key, value);
    });
    return out;
  },
  function join(keySeparator, valueSeparator) {
    keySeparator = keySeparator === undefined ? ':' : keySeparator + '';
    valueSeparator = valueSeparator === undefined ? ',' : valueSeparator + '';
    var out = '';
    for (var i=0; i < this.size; i++) {
      out += (i ? valueSeparator : '') + this.keys[i] + keySeparator + this.values[i];
    }
    return out;
  },
  function toArray() {
    var out = [];
    for (var i=0; i < this.size; i++) {
      out[i] = [this.keys[i], this.values[i]];
    }
    return out;
  },
  function toString() {
    return '{' + this.join() + '}';
  },
  function toSource() {
    return 'new Dict(' + this + ')';
  }
]);

