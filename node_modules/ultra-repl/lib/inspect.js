// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.


// This is composed primarily of my improved version of inspect and supporting functions
// currently waiting for acceptance as a pull request https://github.com/joyent/node/pull/2360
// It has to be run separately in each context anyway due to peculiarities with V8's contexts.

(function(global){


var rainbow;
var builtins = {};
var styles = {};
var ansi;

function inspect(obj, options, globalSettings) {
  rainbow || (rainbow = require('rainbow'));
  options = options || {};
  var settings = {
    showHidden: !!options.hiddens,
    showProtos: options.protos,
    showBuiltins: options.builtins,
    multiItemLines: options.multiItemLines,
    maxWidth: globalSettings.columns ? globalSettings.columns - 10 : 60,
    alphabeticalSorting: options.alphabeticalSorting,
    colors: !!globalSettings.colors,
    style: color,//globalSettings.colors ? color : noColor,
    depth: options.depth,
    ignoreInspect: options.ignoreInspect,
    seen: []
  };

  // cache formatted brackets
  settings.square = [
    settings.style('[', 'Square'),
    settings.style(']', 'Square')
  ];
  settings.curly =  [
    settings.style('{',  'Curly'),
    settings.style('}',  'Curly')
  ];

  try {
    return formatValue(obj, '', options.depth || 2, settings);
  } catch (e) {
    return formatValue(e, '', options.depth || 2, settings) + '\n' + e.stack;
  }
}


// formatter for functions shared with constructor formatter
function functionLabel(fn, type) {
  return '[' + (isNative(fn) ? 'Native ' : '') + type + (fn.name ? ': ' + fn.name : '') + ']';
}
var noop = function(){};


function isObject(o){
  if (o == null) return o !== null && o !== undefined;
  return typeof o === 'object' || typeof o === 'function';
}


var formatters = {
  Boolean: String,
  Date: function(d){
    try { return '[' + Date.prototype.toISOString.call(d).slice(0, 10) + ']' }
    catch (e) { return d+'' }
  },
  Constructor: function(f){
    var nativeLabel = isNative(f) ? 'Native ' : '';
    var name = f.name.length ? ': ' + f.name: '';
    return '[' + nativeLabel + 'Constructor' + name + ']';
  },
  Error: function(e){
    return '[' + Error.prototype.toString.call(e) + ']';
  },
  Function: function(f){
    var nativeLabel = isNative(f) ? 'Native ' : '';
    var name = f.name.length ? ': ' + f.name: '';
    return '[' + nativeLabel + 'Function' + name + ']';
  },
  Null: String,
  Number: String,
  RegExp: function(r){
    return RegExp.prototype.toString.call(r);
  },
  String: quotes,
  Undefined: String,
  Proto : function(f){
    var name;
    if (isObject(f) && 'constructor' in f && f.constructor.name.length) {
      name = ': ' + f.constructor.name;
    } else {
      name = '';
    }
    return '‹Proto' + name + '›';
  }
};

// wrap a string with ansi escapes for coloring
function color(str, style, special) {
  var out = special ? '\xab' + str + '\xbb' : str;

  if (!styles[style]) return out;
  style = styles[style];

  if (Array.isArray(style) && style.length === 3) {
    style = rainbow('rgb', style[0], style[1], style[2]);
  }

  if (typeof style === 'function') {
    return style(out);
  }

  if (style.slice(0,2) === 'bg' && style !== 'bgreen') {
    style = style.slice(0,2);
    var bg = true;
  }

  return rainbow(style)(str);
}

// test for html nodes like when using AppJS
function isNode(o){
  if (isObject(o) && 'nodeType' in o && 'parentNode' in o) {
    while (o = Object.getPrototypeOf(o)) {
      if (o.constructor && o.constructor.name === 'Node') {
        return true;
      }
    }
  }
  return false;
}

function formatNode(o){
  if (o.nodeType === 1) {
    var label = o.tagName;
    if (o.id)
      label += '#'+o.id;
    if (o.className)
      label += '.'+o.className;
  } else {
    var label = nodeTypes[o.nodeType];
  }
  return domFormat(o.constructor.name, label);
}

function domFormat(name, label){
  return color('‹'+name+': '+label+'›', 'Node');
}

var nodeTypes = [
  'Unknown',
  'Element',
  'Attribute',
  'Text',
  'CDATASection',
  'EntityReference',
  'Entity',
  'ProcessingInstruction',
  'Comment',
  'Document',
  'DocumentType',
  'DocumentFragment',
  'Notation',
];

function isDOM(o){
  if (o && o.constructor && o.constructor.name in DOM)
    return true;
  if (o && Object.prototype.toString.call(o).slice(8, -1))
    return true;
  return false;
}
//DOMStringList›
var DOM = {
  CSSStyleRule: function(o){ return domFormat(o.constructor.name, o.cssText) },
  HTMLCollection: function(o){ return domFormat(o.constructor.name, o.length) },
  DOMImplementation: function(o){ return domFormat(o.constructor.name, 'DOMImplemenntation') }
};

function formatDOM(o){
  if (o && o.constructor && o.constructor.name in DOM)
    if (typeof DOM[o.constructor.name] === 'function')
      return DOM[o.constructor.name](o);
  if (o && Object.prototype.toString.call(o))
    if (typeof DOM[getClass(o)] === 'function')
      return DOM[getClass(o)](o);
}



// return without ansi colors
function noColor(str, style, special) {
  return special ? '\xab' + str + '\xbb' : str;
}

var objProto = Object.getOwnPropertyNames(Object.prototype).join();
var numeric = /^\d+$/;

// quote string preferably so it has the least escapes
function quotes(string) {
  string = (''+string).replace(/\\/g, '\\\\').replace(/\n/g, '\\n');
  var singles = 0,
      doubles = 0,
      i = string.length;

  while (i--) {
    if (string[i] === '"')
      doubles++;
    else if (string[i] === "'")
      singles++;
  }

  if (singles > doubles)
    return '"' + string.replace(/"/g, '\\"') + '"';
  else
    return "'" + string.replace(/'/g, "\\'") + "'";
}

var fn = Object.getOwnPropertyNames(Function).reduce(function(r,s){ r[s] = Function[s]; return r; }, Object.create(null));

function formatValue(value, key, depth, settings) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (!settings.ignoreInspect && value && typeof value.inspect === 'function' &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    return value.inspect(function(obj){
      return formatValue(obj, '', depth, settings);
    });
  }

  var base = '';
  var type = isConstructor(value) ? 'Constructor' : getClass(value);

  if (type in formatters) {
    // types can be formatted by matching their internal class
    base = settings.style(formatters[type](value), type);
  }

  var maxwidth = settings.maxWidth - (settings.depth - depth) * 2 - key.alength;

  // prevent deeper inspection for primitives and regexps
  if (!isObject(value) || !settings.showHidden && (type === 'RegExp' || type === 'Error')) {
    if (type === 'String') {
      if (base.alength > maxwidth - 10) {
        base = base.stripAnsi();
        base = settings.style(base.slice(0, maxwidth - 10) + '...' + base[0], 'String');
      }
    }
    return base;
  }

  if (settings.showHidden) {
    var properties = Object.getOwnPropertyNames(value);
  } else {
    var properties = Object.keys(value);
  }


  if (!settings.showBuiltins && value === global) {
    properties = properties.filter(function(key){
      return !~builtins.globals.indexOf(key);
    });
  }

  settings.alphabeticalSorting && properties.sort();

  if (typeof value === 'function') {
    properties = properties.filter(function(key) {
      // hide useless properties every function has
      return !(key in fn);
    });
  }

  // show prototype last for constructors
  if (type === 'Constructor') {
    var desc = Object.getOwnPropertyDescriptor(value, 'prototype');
    if (desc && (settings.showHidden || desc.enumerable)) {
      properties.push('prototype');
    }
  }

  if (settings.showProtos && value !== global) {
    var proto = value.__proto__;
    var ctor = proto && proto.constructor && proto.constructor.name;
    // don't list protos for built-ins
    if (!~builtins.classes.indexOf(ctor) || ctor === 'Object' && !Object.prototype.hasOwnProperty.call(proto, 'hasOwnProperty')) {
      properties.push('__proto__');
    }
  }

  var array = isArray(value);
  var arrayish = array || isArrayish(value);
  var braces = array ? settings.square : settings.curly;

  if (properties.length === 0) {
    if (base) return base;
    if (!array || value.length === 0) return braces.join('');
  }
  if (depth < 0) {
    return (base ? base+' ' : '') + settings.style('More', 'More', true);
  }


  try {
    if (Object.isFrozen(value)) {
      output.push(color('Frozen', 'Frozen', true));
    } else if (Object.isSealed(value)) {
      output.push(color('Sealed', 'Sealed', true));
    } else if (!Object.isExtensible(value)) {
      output.push(color('Non-Extensible', 'NonExtensible', true));
    }
  } catch (e) {}


  settings.seen.push(value);
  var output = [];

  var primitive = true;
  // iterate array indexes first
  if (arrayish && value.length) {
    var item, maxlength = 0, total = 0, length;
    for (var i = 0, len = value.length; i < len; i++) {
      if (typeof value[i] === 'undefined') {
        output.push('');
      } else {
        item = formatProperty(value, i, depth, settings, arrayish);
        output.push(item);
        if (primitive) {
          primitive = primitive && !isObject(value[i]);
          length = item.alength;
          maxlength = Math.max(length, maxlength);
          total += length;
        }
      }
    }
    if (primitive) {
      if (settings.multiItemLines) {
        if (maxlength < maxwidth / 2 && total > maxwidth / 2) {
          output = [chunk(', ', [maxwidth - 30, maxwidth], 0, output)];
        }
      } else if (total < maxwidth) {
        output = [output.join(', ')];
      }
    }
  }

  // properties on objects and named array properties
  properties.forEach(function(key) {
    if (!arrayish || !numeric.test(key)) {
      //primitive = primitive && isPrimitive(value[key]);
      var prop = formatProperty(value, key, depth, settings, arrayish);
      prop.length && output.push(prop);
    }
  });

  return combine(output, base, braces, maxwidth, settings.multiItemLines);
}

function formatProperty(value, key, depth, settings, array) {
  // str starts as an array, val is a property descriptor
  var str = [];
  if (typeof process !== 'undefined' && value === process.env) {
    var val = { enumerable: false,
                configurable: true,
                writable: true,
                value: value[key] };
  } else if (key === '__proto__') {
    var val = { enumerable: true,
                configurable: true,
                writable: true,
                value: value.__proto__ };
  } else {
    var val = Object.getOwnPropertyDescriptor(value, key);
  }


  // V8 c++ accessors like process.env that don't correctly
  // work with Object.getOwnPropertyDescriptor
  if (val === undefined) {
    val = value[key];
    if (val === undefined) {
      return '';
    }
  }
  if (val == null) {
    val = { value: val,
            enumerable: true,
            writable: true,
            configurable: true };
  }
  var name = key;
  var nameFormat;

  if (array && numeric.test(key)) {
    name = '';
  } else {

    if (/^[a-zA-Z_\$][a-zA-Z0-9_\$]*$/.test(key)) {
      // valid JavaScript name not requiring quotes

      if (val.value && !val.writable) {
        // color non-writable differently
        nameFormat = 'Constant';
      } else {
        // regular name
        nameFormat = 'Name';
      }
    } else {
      // name requires quoting
      nameFormat = 'String';
      name = quotes(name);
    }

    if (!val.enumerable) {
      if (settings.style.name !== 'color') {
        // add brackets if colors are disabled
        name = '[' + name + ']';
      } else {
        // use different coloring otherwise
        nameFormat = 'H' + nameFormat;
      }
    }

    if (!val.configurable) {
      if (settings.style.name === 'color') {
        nameFormat = 'F' + nameFormat;
      }
    }

    if (key === '__proto__') {
      name = formatters.Proto(val.value);
      nameFormat = 'Proto';
    }

    array = false;
    name = settings.style(name, nameFormat) + ': ';
  }

  // check for accessors
  val.get && str.push('Getter');
  val.set && str.push('Setter');

  // combine Getter/Setter, or evaluate to empty for data descriptors
  str = str.join('/');
  if (str) {
    // accessor descriptor
    str = settings.style(str, 'Accessor', true);

  } else if (isNode(val.value)) {

    str = formatNode(val.value);

  } else {
    // data descriptor
    if (~settings.seen.indexOf(val.value)) {
      // already seen
      if (key !== 'constructor') {
        str = settings.style('Circular', 'Circular', true);
      } else {
        // hide redundent constructor reference
        return '';
      }

    } else {
      // recurse to subproperties
      depth = depth === null ? null : depth - 1;
      str = formatValue(val.value, key, depth, settings);

      // prepend indentation for multiple lines
      if (~str.indexOf('\n')) {
        str = indent(str);
        // trim the edges
        str = array ? str.substring(2) : '\n' + str;
      }
    }
  }

  return name + str;
}

function indent(str){
  return str.split('\n')
            .map(function(line){ return '  ' + line })
            .join('\n');
}

function combine(output, base, braces, maxWidth, multiItemLines) {
  var lines = 0;
  // last line's length
  var length = output.reduce(function(prev, cur) {
    // number of lines
    lines += ~cur.indexOf('\n') ? cur.match(/\n/).length : +!multiItemLines;
    return prev + cur.alength + 1;
  }, 0);

  if (base.length) {
    // if given base make it so that it's not too long
    length += base.alength;
    if (length > maxWidth || lines > 1) {
      base = ' ' + base;
      output.unshift(lines > 1 ? '' : ' ');
    } else {
      base = ' ' + base + ' ';
    }
  } else {
    base = ' ';
  }
  // combine lines with commas and pad as needed
  var separator = (lines > 1 || length > maxWidth) ? '\n  ' : ' ';
  base += output.join(',' + separator) + ' ';

  // wrap in appropriate braces
  return braces[0] + base + braces[1];
}


function isArrayish(o){
  if (typeof o === 'function') return false;

  if (Array.isArray(o) || o instanceof Array || o instanceof String) return true;

  if (typeof Buffer !== 'undefined') {
    if (Buffer.isBuffer(o) || o instanceof Buffer) return true;
  }

  if (o && o.length && o.length-1 in o) return true;

  if (typeof ArrayBuffer !== 'undefined') {
    if (o instanceof ArrayBuffer) return true;
    if (o && (o = o.__proto__) && o.constructor && o.constructor.name === 'ArrayBuffer') return true;
  }

  return false;
}

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar) ||
         (typeof ar === 'object' && objectToString(ar) === '[object Array]');
}

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

// slice '[object Class]' to 'Class' for use in dict lookups
function getClass(o) {
  return objectToString(o).slice(8, -1);
}


// returns true for strings, numbers, booleans, null, undefined, NaN
function isPrimitive(o) {
  return !isObject(o);
}


// returns true if a function has properties besides `constructor` in its prototype
// and gracefully handles any input including undefined and undefined prototypes
function isConstructor(o){
  return typeof o === 'function' && o.prototype &&
         Object.getOwnPropertyNames(o.prototype).length >
         ('constructor' in o.prototype);
}

function isNative(o){
  return typeof o === 'function' && (o+'').slice(-17) === '{ [native code] }';
}




function widest(arr, field){
  return arr.reduce(function(a, b){
    if (field) b = b[field];
    if (typeof b !== 'string') return a;
    b = b.alength;
    return a > b ? a : b;
  }, 0);
}



function _introspect(o){
  _introspect = require('introspect');
  return _introspect(o);
}


function desc(val){ return { enumerable: false, configurable: true, writable: true, value: val } }

var ansimatch = /\033\[(?:\d+;)*\d+m/g;

Object.defineProperties(String.prototype, {
  alength: { get: function getter(){
    return this.replace(ansimatch, '').length;
  }, enumerable: false },
  stripAnsi: desc(function stripAnsi(){
    return this.replace(ansimatch, '');
  }),
  pad: desc(function pad(w){
    return this + ' '.repeat(w - this.alength);
  }),
  repeat: desc(function repeat(w){
    return Array(++w > 0 ? w : 0).join(this);
  }),
  indent: desc(function indent(w){
    w = ' '.repeat(w);
    return this.split('\n').map(function(s){ return w + s }).join('\n');
  }),
  align: desc(function align(breakAt, indent){
    if (this.alength < breakAt) return this;
    return this.chunk(' ', breakAt, indent).trim();
  }),
  chunk: desc(chunk)
})


function chunk(split, bounds, indent, source){
  if (Array.isArray(source)) {
    var orig = source;
    source = source.join(split);
  } else if (typeof this === 'string') {
    source = this;
  } else {
    source = '';
  }
  source = source.stripAnsi() + split;

  bounds = Array.isArray(bounds) ? bounds : [bounds - 10, bounds]

  var result = [], match, regex = RegExp('.{'+bounds+'}'+split, 'g'), lastEnd=0;

  while (match = regex.exec(source)) {
    result.push(match[0].slice(split.length));
    lastEnd += match[0].length;
    regex.lastIndex -= split.length;
  }
  if (lastEnd < source.length - 1) {
    result.push(source.slice(lastEnd - split.length));
  }
  result[0] = source.slice(0, split.length) + result[0];
  //result.push(result.pop());
  if (indent > 0) {
    indent = ' '.repeat(indent);
    return result.map(function(s){ return indent + s }).join('\n');
  } else if (orig) {
    var offset = 0;
    return result.map(function(s, i){
      s = s.slice(0,-split.length).split(split);
      var length = s.length;
      s = orig.slice(offset, offset + length);
      offset += length;
      return s.join(split);
    }).join(split + '\n  ');
  }
  return result;
}


function clone(obj){
  return Object.create(obj.__proto__, Object.getOwnPropertyNames(obj).reduce(function(r,s){
    r[s] = Object.getOwnPropertyDescriptor(obj, s);
    return r;
  }, {}));
}


function compare(before, after){
  var beforeProps = Object.getOwnPropertyNames(before);

  var changed = beforeProps.reduce(function(r, s){
    var desc = compareDesc(before, after, s);
    if (desc[0] === 'deleted' || desc.length === 1 && typeof desc[0] !== 'string') {
      r[s] = desc[0];
    } else if (desc.length) {
      r[s] = desc.join(' | ');
    }
    return r;
  }, {});

  return Object.getOwnPropertyNames(after).reduce(function(r, s){
    if (!~beforeProps.indexOf(s)) {
      var desc = Object.getOwnPropertyDescriptor(after, s);
      Object.defineProperty(r, s, desc);
    }
    return r;
  }, changed);
}

var descFields = ['get', 'set', 'value', 'enumerable', 'configurable', 'writeable'];

function compareDesc(before, after, property){
  before = Object.getOwnPropertyDescriptor(before, property) || {};
  after = Object.getOwnPropertyDescriptor(after, property) || {};
  return descFields.reduce(function(out, field){
    if (!egal(before[field], after[field])) {
      var val;
      if (field === 'value') {
        val = typeof after.value === 'undefined' ? 'deleted' : after.value;
      } else {
        if (/^[gs]et$/.test(field)) {
          val = before[field] ? after[field] ? after[field] : '--'+field : '++'+field;
        } else {
          val = (after[field] ? '++' : '--') + field;
        }
      }
      out.push(val);
    }
    return out;
  }, [])
}

function egal(a, b){
  return a === b ? a !== 0 || 1 / a === 1 / b : a !== a && b !== b;
}

if ('Proxy' in global) {
  Object.defineProperty(global, 'Proxy', { enumerable: false });
}

Object.defineProperty(global.__proto__, 'console', {
  configurable: true,
  writable: true,
  value: {}
});


return function(options, globalSettings, builtinList, styleList){
  builtins = builtinList;
  styles = styleList;
  console.log = function log(){
    return arguments.length === 1 ? arguments[0] : [].slice.call(arguments);
  };
  var snapshots = {};
  return {
    snapshot: function snapshot(name){
      if (!name) name = '_last';

      if (name in snapshots) {
        var diff = compare(snapshots[name], global);
        delete snapshots[name];
        return diff;
      } else {
        snapshots[name] = clone(global);
      }
    },
    globals: function globals(){
      return clone(global);
    },
    inspector: function inspector(obj){
      return typeof obj === 'string' ? obj : inspect(obj, options, globalSettings);
    },
    define: function define(name, desc){
      name && desc && Object.defineProperty(global.__proto__, name, desc);
    },
    introspect: function introspect(o){
      return _introspect(o);
    }
  }
};

})(this);
