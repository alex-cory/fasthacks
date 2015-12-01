var bindbind  = Function.prototype.bind.bind(Function.prototype.bind),
    callbind  = bindbind(Function.prototype.call),
    applybind = bindbind(Function.prototype.apply),
    slice     = callbind(Array.prototype.slice),
    hasOwn    = callbind(Object.prototype.hasOwnProperty),
    toString  = callbind(Object.prototype.toString);

module.exports = {
  heritable: heritable,
  descriptor: descriptor,
  callbind: callbind,
  applybind: applybind,
  lazyProperty: lazyProperty,
  define: define,
  inherit: inherit,
  is: is
};

var ownProperties    = Object.getOwnPropertyNames,
    defineProperty   = Object.defineProperty,
    describeProperty = Object.getOwnPropertyDescriptor,
    getPrototypeOf   = Object.getPrototypeOf,
    create           = Object.create,
    ownKeys          = Object.keys;


var hidden = { configurable: true,
               enumerable: false,
               writable: true };

function is(compare){
  compare = typeof compare === 'string' ? '[object ' + compare + ']' : toString(compare);
  return compare in is ? is[compare] : (is[compare] = function(o){
    return toString(o) === compare;
  });
}

function clone(o){
  var descriptors = create(null);
  o = Object(o);
  ownProperties(o).forEach(function(name){
    descriptors[names[i]] = describeProperty(name);
  });
  return create(getPrototypeOf(o), descriptors);
}

function descriptor(val, h, r){
  var desc = { enumerable: !h, configurable: true };
  if (Array.isArray(val) && val.length === 2 &&
       typeof val[0] === 'function' &&
       typeof val[1] === 'function') {
    desc.get = val[0];
    desc.set = val[1];
  } else if (typeof val === 'function' && /^[gs]etter$/.test(val.name)) {
    desc[val.name[0]+'et'] = val;
  } else {
    desc.value = val;
    desc.writable = !r;
  }
  return desc;
}

function heritable(definition){
  var ctor = definition.constructor;
  defineProperty(ctor, 'super', {
    value: definition.super,
    configurable: true,
    writable: true
  });
  ctor.prototype = create(ctor.super.prototype);
  delete definition.super;

  ownKeys(definition).forEach(function(prop){
    var desc = describeProperty(definition, prop);
    desc.enumerable = false;
    defineProperty(ctor.prototype, prop, desc);
  });

  function construct(){
    var obj = new (ctor.bind.apply(ctor, [null].concat(slice(arguments))));
    ctor.super.call(obj);
    return obj;
  }

  construct.prototype = ctor.prototype;

  return construct;
}


function lazyProperty(obj, name){
  if (Array.isArray(name)) {
    name.forEach(function(prop){ lazyProperty(obj, prop) });
    return obj;
  }
  var visible = name[0] === '$';
  name = visible ? name.slice(1) : name;
  defineProperty(obj, name, {
    configurable: true,
    enumerable: visible,
    get: function(){},
    set: function(v){
      defineProperty(this, name, { value: v, writable: true })
    }
  });
}

function defineHidden(o, n, v){
  hidden.value = v;
  defineProperty(o, n, v);
  hidden.value = null;
}


function extend(to, from){
  ownProperties(Object(from)).forEach(function(key){
    if (!hasOwn(to, key)) {
      defineProperty(to, key, describeProperty(from, key));
    }
  });
  return to;
}
Object.extend = extend;


Object.inherit = function inherit(from, ownProperties){
  return extend(create(from), ownProperties);
};


Function.inherit = inherit;

function inherit(Ctor, Super, properties, methods){
  define(Ctor, 'inherits', Super);
  Ctor.prototype = create(Super.prototype);
  define(Ctor.prototype, 'constructor', Ctor);
  properties && define(Ctor.prototype, properties);
  methods    && define(Ctor.prototype, methods);
  return Ctor;
}



function isObject(o){
  return typeof o === 'object' ? o !== null : typeof o === 'function';
}


function define(o, p, v){
  switch (typeof p) {
    case 'function':
      v = p;
      p = v.name;
    case 'string':
      hidden.value = v;
      defineProperty(o, p, hidden);
      break;
    case 'object':
      if (p instanceof Array) {
        for (var i=0; i < p.length; i++) {
          var f = p[i];
          if (typeof f === 'function') {
            var name = f.name;
          } else if (typeof f === 'string' && typeof p[i+1] !== 'function' || !p[i+1].name) {
            var name = f;
            f = p[i+1];
          }
          if (name) {
            hidden.value = f;
            defineProperty(o, name, hidden);
          }
        }
      } else if (p) {
        var keys = ownKeys(p);

        for (var i=0; i < keys.length; i++) {
          var desc = describeProperty(p, keys[i]);
          if (desc) {
            desc.enumerable = 'get' in desc;
            defineProperty(o, keys[i], desc);
          }
        }
      }
  }

  hidden.value = undefined;
  return o;
}

