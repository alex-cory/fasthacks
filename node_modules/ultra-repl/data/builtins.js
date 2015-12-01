var b = module.exports = {
  methods:  [ 'eval', 'parseInt', 'parseFloat', 'isNaN', 'isFinite', 'decodeURI',
              'decodeURIComponent', 'encodeURI', 'encodeURIComponent' ],

  classes:  [ 'Object', 'Function', 'Array', 'String', 'Boolean', 'Number', 'Date',
              'RegExp', 'Proxy', 'Map', 'Set', 'WeakMap', 'Error', 'EvalError',
              'RangeError', 'ReferenceError', 'SyntaxError',  'TypeError',
              'URIError', 'Null', 'Context' ],

  keywords: [ 'break', 'case', 'catch', 'const', 'continue', 'debugger', 'default',
              'delete', 'do', 'else', 'export', 'false', 'finally', 'for', 'function',
              'if', 'import', 'in', 'instanceof', 'let', 'new', 'null', 'return',
              'switch', 'this', 'throw', 'true', 'try', 'typeof', 'undefined', 'var',
              'void', 'while', 'with', 'yield' ],

  node:     [ 'ArrayBuffer', 'Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array','Uint16Array',
              'Int32Array', 'Uint32Array', 'Float32Array', 'Float64Array', 'DataView',
              'process', 'Buffer', 'setInterval', 'clearInterval', 'setTimeout', 'setImmediate', 'clearImmediate',
              'clearTimeout',  'escape', 'unescape' ],//,  'console' ],

  misc:     [ 'global', 'GLOBAL', 'root', '_', '__dirname', '__filename', 'module',
              'require', 'exports', 'NaN', 'Infinity', 'undefined', 'Math', 'JSON' ],

  libs: Object.keys(process.binding('natives'))
};

b.globals = b.methods.concat(b.classes, b.node, b.misc);
