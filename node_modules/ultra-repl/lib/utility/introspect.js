var ownKeys          = Object.keys,
    ownNames         = Object.getOwnPropertyNames,
    getOwnDescriptor = Object.getOwnPropertyDescriptor,
    getPrototype     = Object.getPrototypeOf,
    defineProperty   = Object.defineProperty,
    isArray          = Array.isArray,

    nativeCode = new RegExp(escapeRegex(Object.toString().split('Object')[1]) + '$');

var _apply   = Function.prototype.apply,
    _call    = Function.prototype.call,
    _bind    = Function.prototype.bind,
    _slice   = [].slice,
    _concat  = [].concat,
    _push    = [].push,
    _hasOwn  = {}.hasOwnProperty,
    _toBrand = {}.toString;

var pushAll = _apply.bind(_push);



function escapeRegex(s){
  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function isObject(o){
  return o != null && typeof o === 'object' || typeof o === 'function';
}

function isIndexed(o){
  return isArray(o) || isObject(o) && 'length' in o && (o.length - 1) in o;
}

function slice(a,o,p){
  switch (a.length) {
    case 0: return [];
    case 1: return o ? [] : [a[0]];
    case 2: a = [a[0],a[1]];
  }
  return _slice.call(a,o,p);
}

function enumerate(o){
  var k = 0, props = [];
  for (props[k++] in o);
  return props;
}

function getBrandOf(o){
  if (o === null) {
    return 'Null';
  } else if (o === undefined) {
    return 'Undefined';
  } else {
    return _toBrand.call(o).slice(8, -1);
  }
}

function getPropertyNames(o){
  var props = [];
  do {
    pushAll(props, ownNames(o));
  } while (o = getPrototype(o))
  return unique(props);
}

function getPropertyDescriptor(o, key){
  var desc;
  while (o) {
    try {
      if (desc = getOwnDescriptor(o, key))
        return desc;
      o = getPrototype(o);
    } catch (e) {
      return { value: o[key],
               writable: true,
               enumerable: true,
               configurable: true };
    }
  }
  return desc;
}

function getPropertyDescriptors(o){
  var seen = Object.create(null);
  var descs = {};
  var distance = 0;
  while (o) {
    ownNames(o).forEach(function(key){
      if (!(key in seen)) {
        descs[key] = getOwnDescriptor(o, key);
        descs[key].distance = distance;
        seen[key] = true;
      }
    });
    distance++;
    o = getPrototype(o);
  }
  return descs;
}

function getOwnPropertyDescriptors(o){
  var out = {};
  ownNames(o).forEach(function(key){
    out[key] = getOwnDescriptor(o, key);
  });
  return out;
}

if (typeof Set !== 'undefined') {
  var unique = function unique(a){
    var result = [],
        seen = new Set,
        i = a.length;

    while (i--)
      if (!seen.has(a[i]))
        seen.add(result[result.length] = a[i]);

    return result;
  };
} else {
  var unique = function unique(a){
    var result = [],
        brand = Math.random().toString(36).slice(2),
        branded = [],
        strings = Object.create(null),
        numbers = Object.create(null),
        others = Object.create(null),
        i = a.length;

    while (i--) {
      if (isObject(a[i])) {
        if (!_hasOwn.call(a[i], brand)) {
          define(a[i], brand, true);
          branded.push(a[i]);
          result[result.length] = a[i];
        }
      } else {
        var type = typeof a[i];
        if (type === 'string') {
          if (!(a[i] in strings)) {
            strings[a[i]] = true;
            result.push(a[i]);
          }
        } else if (type === 'number') {
          if (a[i] === 0 && 1 / a[i] === -Infinity) {
            if (!(a[i] in others)) {
              others[a[i]] = true;
              result.push(a[i]);
            }
          } else {
            if (!(a[i] in numbers)) {
              numbers[a[i]] = true;
              result.push(a[i]);
            }
          }
        } else {
          if (!(a[i] in others)) {
            others[a[i]] = true;
            result.push(a[i]);
          }
        }
      }
    }

    for (var i=0; i < branded.length; i++) {
      delete branded[i][brand];
    }

    return result;
  };
}

function define(o, p, v){
  o = Object(o);
  if (p instanceof Array) {
    p.forEach(function(f, i){
      if (typeof f === 'function' && f.name) {
        var name = f.name;
      } else if (typeof f === 'string' && p[i+1] && typeof p[i+1] !== 'function' || !p[i+1].name) {
        var name = f;
        f = p[i+1];
      }
      if (name) {
        defineProperty(o, name, {
          configurable: true,
          writable: true,
          value: f
        });
      }
    });
  } else if (isObject(p)) {
    ownKeys(p).forEach(function(k){
      var desc = getOwnDescriptor(p, k);
      if (desc) {
        desc.enumerable = 'get' in desc;
        defineProperty(o, k, desc);
      }
    });
  } else if (typeof p === 'string') {
    defineProperty(o, p, { configurable: true, writable: true, value: v });
  }
}


function invoker(name){
  var args = arguments.length > 1 ? slice(arguments, 1) : [];
  return function(o){
    return _apply.call(o[name], o, args.concat(slice(arguments, 1)));
  };
}



// ##################
// ### Descriptor ###
// ##################

function Descriptor(type, valueOrGet, readonlyOrSet, hidden, frozen, name, own){
  if (isObject(type)) {
    if ('get' in type || 'set' in type) {
      this.type = 'accessor';
      this.get = type.get;
      this.set = type.set;
    } else if ('value' in type) {
      this.value = type.value;
      this.writable = !!type.writable;
    }
    this.enumerable = !!type.enumerable;
    this.configurable = !!type.configurable;
    if (type.distance)
      this.distance = type.distance;

    if (typeof valueOrGet === 'string')
      this.name = valueOrGet;
    if (typeof readonlyOrSet === 'boolean')
      this.own = readonlyOrSet;
  } else {
    if (type === 'accessor') {
      this.get = valueOrGet;
      this.set = readonlyOrSet;
    } else {
      this.value = valueOrGet;
      this.writable = !readonlyOrSet;
    }
    this.enumerable = !hidden;
    this.configurable = !frozen;
    if (typeof name === 'string')
      this.name = name;
    if (typeof own === 'boolean')
      this.own = own;
  }
}

define(Descriptor, [
  function type(desc){
    if (desc instanceof Descriptor)
      return desc.type;
    else if (isObject(desc)) {
      var hasGet = 'get' in desc,
          hasSet = 'set' in desc,
          hasValue = 'value' in desc;
      if (hasValue) {
        if (hasGet || hasSet)
          return 'invalid';
        else
          return 'value';
      } else if (hasGet || hasSet)
        return 'accessor';
    }
    return 'none';
  }
]);

define(Descriptor.prototype, {
  configurable: true,
  enumerable: true,
  type: 'value',
  name: null
});

define(Descriptor.prototype, [
  function freeze(){
    this.configurable = false;
    if (this.writable)
      this.writable = false;
    return this;
  },
  function unfreeze(){
    this.configurable = true;
    if (this.type === 'value')
      this.writable = true;
    return this;
  },
  function protect(){
    this.configurable = false;
    return this;
  },
  function unprotect(){
    this.configurable = true;
    return this;
  },
  function hide(){
    this.enumerable = false;
    return this;
  },
  function show(){
    this.enumerable = true;
    return this;
  },
  function lock(){
    if (this.set) {
      this.setter = this.set;
      this.set = undefined;
    }  else if (this.writable)
      this.writable = false;
    return this;
  },
  function unlock(){
    if (this.setter)
      this.set = this.setter;
    else if (this.type === 'value')
      this.writable = true;
    return this;
  },
  function resolve(o, key){
    if (this.type === 'value' || 'value' in this)
      return this;
    else {
      try {
        var readonly = typeof this.set !== 'function',
            hidden = !this.enumerable,
            frozen = !this.configurable,
            value = this.get ? _call.call(this.get, o) : { inspect: function(){ return 'NO GETTER' } };

        return new Descriptor('value', value, readonly, hidden, frozen, key || this.name, this.own);
      } catch (e) {
        console.log(e);
        return this;
      }
    }
  },
  function applyTo(o, key){
    if (key || this.name)
      defineProperty(o, key || this.name, this);
    else
      throw new Error('Must provide a key to define an unnamed descriptor');
  },
  function toString(){
    return [
      recase(this.type) + ' ',
      this.name || '',
      '(',
      this.enumerable ? 'E' : '_',
      this.set || this.writable ? 'W' : '_',
      this.configurable ? 'C' : '_',
      ')'
    ].join('');
  }
]);


// ###################
// ### Descriptors ###
// ###################

function Descriptors(){
  this.length = 0;
  for (var k in arguments) {
    var item = arguments[k];
    if (getPrototype(item) === Object.prototype) {
      ownKeys(item).forEach(function(key){
        this.add(item[key], key);
      }, this);
    }
  }
}

define(Descriptors.prototype, [
  function create(proto){
    proto = proto === undefined ? this.proto || Object.prototype : proto;
    return Object.create(proto, this.toObject());
  },
  function forEach(callback, context){
    context = context || this;
    for (var i=0; i < this.length; i++)
      callback.call(context, this[i], i, this);
    return this;
  },
  function map(callback, context){
    var out = [];
    context = context || this;
    for (var i=0; i < this.length; i++) {
      out[i] = callback.call(context, this[i], i, this);
    }
    return out;
  },
  function filter(callback){
    var out = new Descriptors({});
    for (var i=0; i < this.length; i++)
      if (callback.call(this, this[i], i, this))
        out.add(this[i]);
    return out;
  },
  function add(desc, name){
    if (!(desc instanceof Descriptor))
      desc = new Descriptor(desc, name);
    _push.call(this, desc);
  },
  function applyTo(o){
    this.forEach(function(desc){
      desc.applyTo(o);
    });
    return o;
  },
  function toArray(){
    return slice(this);
  },
  function toObject(){
    var out = {};
    this.forEach(function(desc){
      out[desc.name] = desc;
    });
    return out;
  },
  function freeze(){
    return this.forEach(invoker('freeze'));
  },
  function protect(){
    return this.forEach(invoker('protect'));
  },
  function hide(){
    return this.forEach(invoker('hide'));
  },
  function lock(){
    return this.forEach(invoker('lock'));
  },
  function unfreeze(){
    return this.forEach(invoker('unfreeze'));
  },
  function unprotect(){
    return this.forEach(invoker('unprotect'));
  },
  function show(){
    return this.forEach(invoker('show'));
  },
  function unlock(){
    return this.forEach(invoker('unlock'));
  },
  function accessors(){
    return this.filter(function(desc){
      return desc.type === 'accessor';
    });
  },
  function inherited(){
    return this.filter(function(desc){
      return desc.distance;
    });
  }
]);



function isMundaneName(o, key){
  if (typeof o === 'function') {
    if (key === 'length')
      return !o.length;
    else if (key === 'prototype')
      return !Introspect.isConstructor(o);
    else if (key === 'name')
      return !o.name;
    else
      return /^(arguments|caller|callee)$/.test(key);
  }
}






// ####################
// ### Introspector ###
// ####################


function Introspector(o){
  define(this, { subject: o });
}

define(Introspector.prototype, [
  function brand(){
    return getBrandOf(this.subject);
  },
  function describe(key, own){
    return introspect.describe(this.subject, key, own);
  },
  function resolve(key){
    return introspect.resolve(this.subject, key);
  },
  function isObject(){
    return introspect.isObject(this.subject);
  },
  function isIndexed(){
    return introspect.isIndexed(this.subject);
  },
  function isConstructor(){
    return introspect.isConstructor(this.subject);
  },
  function isNative(){
    return introspect.isNative(this.subject);
  },
  function isDOMInterface(){
    return introspect.isDOMInterface(this.subject);
  },
  function keys(own){
    return (own ? ownKeys : enumerate)(this.subject);
  },
  function names(own){
    return (own ? ownNames : getPropertyNames)(this.subject);
  },
  function resolvedNames(filtered){
    return introspect.resolvedNames(this.subject, filtered !== false);
  },
  function filteredNames(own){
    return introspect.filteredNames(this.subject, own);
  },
  function hiddenNames(own){
    return introspect.hiddenNames(this.subject, own);
  }
]);




function introspect(o){
  return new Introspector(o);
}

module.exports = introspect;

define(introspect, [
  isObject,
  isIndexed,
  function isConstructor(f){
    return typeof f === 'function'
        && _hasOwn.call(f, 'prototype')
        && ownNames(f.prototype).length > _hasOwn.call(f.prototype, 'constructor');
  },
  function isNative(f){
    return typeof f === 'function' && nativeCode.test(Function.prototype.toString.call(f));
  },
  function isDOMInterface(o){
    return typeof o === 'function' && getPrototype(o) === Object.prototype && o !== Function.prototype;
  },
  function isBuiltinPrototype(o){
    return builtinProtos.indexOf(o) > -1;
  },
  function params(f){
    if (typeof f === 'function') {
      if (f.parameters)
        return f.parameters;
      var src = Function.prototype.toString.call(f)
      define(f,  {
        parameters: src.slice(src.indexOf('(') + 1, src.indexOf(')')).split(/\s*,\s*/).filter(Boolean)
      });
      return f.parameters;
    }
  },
  function describe(o, key, own){
    o = Object(o);
    if (typeof key === 'boolean') {
      own = key;
      key = undefined;
    }
    if (key === undefined) {
      var descs = new Descriptors(own ? getOwnPropertyDescriptors(o) : getPropertyDescriptors(o));
      descs.proto = getPrototype(o);
      return descs;
    }

    var desc, isOwn = true;
    while (o && !(desc = getOwnDescriptor(o, key))) {
      if (own) break;
      isOwn = false;
      o = getPrototype(o);
    }
    if (desc)
      return new Descriptor(desc, key, isOwn);
  },
  function getBrand(o){
    return getBrandOf(o);
  },
  function resolvedNames(o, filtered){
    var out = [];
    var indexed = isIndexed(o);
    var length = o.length;
    introspect.describe(o).show().forEach(function(desc){
      if (_hasOwn.call(o, desc.name) || desc.type === 'accessor')
        if (!indexed || isNaN(desc.name) ||  desc.name < length)
          if (!(filtered && isMundaneName(o, desc.name)))
            out.push(desc.name);
    });
    return out.sort();
  },
  function resolve(o, key){
    var desc = introspect.describe(o, key);
    if (desc)
      return desc.resolve(o, key);
  },
  function filteredNames(o, own){
    var names = [];
    do {
      ownNames(o).forEach(function(s){
        if (!isMundaneName(o, s))
          names.push(s);
      });
      if (own)
        return names;
    } while ((o = getPrototype(o)) && !introspect.isBuiltinPrototype(o))
    return unique(names).sort();
  },
  function hiddenNames(o, own){
    var keys = (own ? ownKeys : enumerate)(o);
    return (own ? ownNames : getPropertyNames)(o).filter(function(key){
      return !~keys.indexOf(key);
    });
  }
]);
