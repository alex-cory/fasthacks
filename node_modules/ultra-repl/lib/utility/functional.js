function curry(fn) {
  var args = slice(arguments, 1);
  return function () {
    return fn.apply(this, args.concat(slice(arguments)));
  };
}


Object.getOwnPropertyNames.call.bind(null)

var bind = function(bind){return{ 
  bind: bind.bind(bind),
  call: bind.bind(bind.call),
  apply: bind.bind(bind.apply)
}}(Function.prototype.bind)

var flatten =  bind.apply([].concat);
var pushall = bind.apply([].push);
bind.apply(Function)


function recurry(f,n) {
  n = n || f.length;
  return function () {
    var a = arguments;
    var l = n - a.length;
    if (l < 1) return f.apply(this, a);
    a = [f].concat(slice(a));
    var r = curry.apply(this, a);
    return l > 0 ? recurry(r, l) : r;
  };
}

function accumulate(f){
  var A = slice(arguments, 1);
  return A.concat(f.apply(this, A));
}

function partial(f){
  var A = slice(arguments, 1);
  return A.length < 1 ? f : function () {
    var a = slice(arguments);
    var c = A.slice();
    for (var i = 0; i < c.length; i++) {
      if (c[i] === ___) {
        c[i] = a.shift();
      }
    }
    return f.apply(this, c.concat(a));
  }
}

function compose() {
  var fns = slice(arguments)
  var n = fns.length;
  return function () {
    var ret = fns[n-1].apply(this, arguments);
    for (i = n-2; i > -1; i--) {
      ret = fns[i](ret);
    }
    return ret;
  };
}

var ___ = Object.create(null);

var callbind = Function.prototype.bind.bind(Function.prototype.call);
var vapplybind = Function.prototype.bind.bind(Function.prototype.apply);
var bindbind = Function.prototype.bind.bind(Function.prototype.bind);


var slice = callbind(Array.prototype.slice);
var oToString = callbind(Object.prototype.toString);
var map = callbind(Array.prototype.map);
var reduce = callbind(Array.prototype.reduce);

var names = Object.getOwnPropertyNames;
var keys = Object.keys;
var descriptor = Object.getOwnPropertyDescriptor;
var define = Object.defineProperty;


var ansi = /\033\[(?:\d+;)*\d+m/g;
var char = String.fromCharCode;



function noop(){}
function empty(){ return '' }
function id(n){ return n }
function constant(n){ return function(){ return n } }
function pair(o,k){ return [k, o[k]] }
function get(o,k){ return o[k] }
function set(o,k,v){ o[k] = v }
function has(o,k){ k in o }
function istypeof(s,o,p){ return typeof o[p] === s };
function hasOwn(o,k){ Object.prototype.hasOwnProperty.call(o,k) }
function repeatstr(s,n){ return ++n > 0 ? new Array(n).join(s+'') : '' }
function eat(s,c){ return s && s.length ? c+s : '' }
function letter(n,u){ return char(n + (u ? 65 : 97)) }
function wrap(a,s){ return a[0]+s+a[1] }
function alength(s){ return s.replace(ansi, '').length }
function stripansi(s){ return s.replace(ansi, '') }
function bracket(n){ return function(i){ return n+'['+i+']' } }
function fill(n,cb){ var a=[]; while (n--) a[n]=cb(n); return a; }
function dense(n){ return ++n > 0 ? new Array(n).join(0).split(0) : [] }
function quote(s) {
  (s+='').replace(/\\/g, '\\\\');
  var use = +(s.match(quote.q[1][0]) === null);
  return quote.q[0][use] + s.replace(quote.q[1][1-use], '\\$1') + quote.q[0][use];
}
quote.q=[ ['"', "'"], [/(')/g, /(")/g] ];
function args(n,m){ return function(){ return slice(arguments,n,m) } }
function invoke(o,n){
  return o[n].apply(this, slice(arguments, 2));
}
var repeat = recurry(function(n,o){
  return fill(map, constant(o));
})

function widest(a){
  if (typeof a[0] === 'string') a = [a];
  if (Array.isArray(a[0][0])) {
  return a.reduce(function(cols, rows){
    return cols.map(function(r, i){
    return Math.max(alength(r, rows[i]));
    });
  }, dense(a[0].length));
  } else {
  return a.reduce(function(r,i){ return Math.max(alength(x), i) }, 0);
  }
}
function truncate(s,l){
  var r = new RegExp('^.{'+[0,l]+'}\\b','mg'), m, last=0;
  while ((m = r.exec(s)) && r.lastIndex < l) last = r.lastIndex;
  return s.slice(0, last)+'…';
}
function indent(s,n){
  n = n > 0 ? space(n) : n+'';
  return s.split('\n').map(function(x){ return s + x }).join('\n');
}
function pad(s,x){
  var o = space(Math.abs(x) - s.alength);
  return x < 0 ? o + s : s + o;
}
function zeropad(a,b){ return (1e15+a+"").slice(-b) }
function columns(array){
  fill(array[0].length, function(i){ return array[i].map(widest) })
  if (typeof array[0] === 'string') array = [array];
  return array.reduce(f, dense(array[0].length));
}
function isBrand(c){
  c = typeof c === 'string' ? '[object ' + c + ']' : oToString(c);
  return c in isBrand ? isBrand[c] : (isBrand[c] = function(o){
    return oToString(o) === c;
  });
}


var pluck = recurry(get);
var pairs = recurry(pair);
var space = partial(repeatstr, ' ');
var dumbquote = partial(wrap, '""');
var qletter = compose(dumbquote, letter);
var uletter = partial(letter, ___, true);
var acum = recurry(accumulate);
var istypeof = recurry(istypeof);



function upgrade(f){
  var upgraded = recurry(f);
  upgraded.bindbind = bindable(f);
  upgraded.applybind = applayable(f);
  upgraded.callbind = callable(f);
}


