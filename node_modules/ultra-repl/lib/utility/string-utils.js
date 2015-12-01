var __ = require('./objects').descriptor;

function chunk(split, bounds, indent, source){
  if (Array.isArray(source)) {
    source = source.join(split);
  } else if (typeof this === 'string') {
    source = this;
  }

  source += split;
  bounds = Array.isArray(bounds) ? bounds : [bounds - 10, bounds]

  var regex = new RegExp('.{'+bounds+'}'+split, 'g');
  var result = [];
  var match;
  var total=0;

  while (match = regex.exec(source)) {
    result.push(match[0].slice(split.length));
    total += result[result.length-1].length-split.length;
    regex.lastIndex -= split.length;
  }
  if (result.length === 0) {
    result = [source];
  } else {
    result[0] = source.slice(0, split.length) + result[0];
    if (result.length > 1){
      result.push(result.pop().slice(0, -split.length));
      total += split.length;
    }
    var remainder = source.length-total;
    if (remainder > 0) {
      result.push(source.slice(total+(split.length*2)));
    }
  }
  if (indent > 0) {
    indent = space(indent);
    return result.map(function(s){ return indent + s }).join('\n');
  }
  return result;
}


function ansilength(str){
  return str.replace(ansimatch, '').length;
}

function widest(arr, field){
  return arr.reduce(function(a, b){
    if (field) b = b[field];
    if (typeof b !== 'string') return a;
    b = b.alength;
    return a > b ? a : b;
  }, 0);
}


var attachCached = [];

module.exports = {
  ansilength: ansilength,
  chunk: chunk,
  widest: widest,
  attachTo: function attachTo(obj){
    if (~attachCached.indexOf(obj)) return;
    attachCached.push(obj);
    methods.forEach(function(method){
      Object.defineProperty(obj, method.name, { value: method, writable: true, configurable: true });
    });
    Object.defineProperty(obj, 'alength', {
      configurable: true,
      get: function(){ return this.replace(ansimatch, '').length }
    });
  }
};


var methods = [
  function stripAnsi(){
    return this.replace(ansimatch, '');
  },
  function pad(x){
    var out = space(Math.abs(x) - this.alength);
    return x < 0 ? out + this : this + out;
  },
  function repeat(x){
    return Array(++x > 0 ? x : 0).join(this);
  },
  function indent(x){
    x = space(x);
    return this.split('\n').map(function(s){ return x + s }).join('\n');
  },
  function align(breakAt, indent){
    if (this.alength < breakAt) return this;
    return this.chunk(' ', breakAt, indent).trim();
  },
  function toIdentifier(){
    return (this+'').replace(/\.js$/, '').replace(/[^\w]+(.)?/g, function(m,c){
      return c ? c.toUpperCase() : '';
    });
  },
  chunk
];


var slice = Array.prototype.slice;

var ansimatch = /\033\[(?:\d+;)*\d+m/g



function alength(s){ return s.replace(ansimatch, '').length }
function noansi(s){ return s.replace(ansimatch, '') }
function dense(n){ return n > 0 ? new Array(n).join(0).split(0) : [] }
function space(n){ return repeat(' ', n) }
function repeat(s,n){ return ++n > 0 ? new Array(n).join(s+'') : '' }
function fill(n,cb){ var a=[]; while (n--) a[n]=cb(n); return a; }
function widest(a){ return a.reduce(function(r,x){ return Math.max(alength(x+''), r) }, 0) }
function truncate(s,l){
  var r = new RegExp('^.{'+[0,l]+'}\\b','mg'), m, last=0;
  while ((m = r.exec(s)) && r.lastIndex < l) last = r.lastIndex;
  return s.slice(0, last)+'â€¦';
}
function indent(s,n){
  n = n > 0 ? space(n) : n+'';
  return s.split('\n').map(function(x){ return s + x }).join('\n');
}


function columns(array){
  fill(array[0].length, function(i){ return array[i].map(widest) })
  if (typeof array[0] === 'string') array = [array];
  return array.reduce(f, dense(array[0].length));
}

