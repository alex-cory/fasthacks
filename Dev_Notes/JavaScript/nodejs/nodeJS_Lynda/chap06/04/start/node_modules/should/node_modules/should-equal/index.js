var toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

var isPromiseExist = typeof Promise !== 'undefined';
var isBufferExist = typeof Buffer !== 'undefined';

var NUMBER = 'number';
var UNDEFINED = 'undefined';
var STRING = 'string';
var BOOLEAN = 'boolean';
var OBJECT = 'object';
var FUNCTION = 'function';
var NULL = 'null';
var ARRAY = 'array';
var REGEXP = 'regexp';
var DATE = 'date';
var ERROR = 'error';
var ARGUMENTS = 'arguments';
var SYMBOL = 'symbol';
var ARRAY_BUFFER = 'array-buffer';
var TYPED_ARRAY = 'typed-array';
var DATA_VIEW = 'data-view';
var MAP = 'map';
var SET = 'set';
var WEAK_SET = 'weak-set';
var WEAK_MAP = 'weak-map';
var PROMISE = 'promise';

// node buffer
var BUFFER = 'buffer';

// dom html element
var HTML_ELEMENT = 'html-element';
var DOCUMENT = 'document';
var WINDOW = 'window';
var FILE = 'file';
var FILE_LIST = 'file-list';
var BLOB = 'blob';

function getType(instance) {
    var type = typeof instance;

    switch (type) {
        case NUMBER:
            return NUMBER;
        case UNDEFINED:
            return UNDEFINED;
        case STRING:
            return STRING;
        case BOOLEAN:
            return BOOLEAN;
        case FUNCTION:
            return FUNCTION;
        case SYMBOL:
            return SYMBOL;
        case OBJECT:
            if (instance === null) return NULL;

            var clazz = toString.call(instance);

            switch (clazz) {
                case '[object String]':
                    return STRING;
                case '[object Boolean]':
                    return BOOLEAN;
                case '[object Number]':
                    return NUMBER;
                case '[object Array]':
                    return ARRAY;
                case '[object RegExp]':
                    return REGEXP;
                case '[object Error]':
                    return ERROR;
                case '[object Date]':
                    return DATE;
                case '[object Arguments]':
                    return ARGUMENTS;
                case '[object Math]':
                    return OBJECT;
                case '[object JSON]':
                    return OBJECT;
                case '[object ArrayBuffer]':
                    return ARRAY_BUFFER;
                case '[object Int8Array]':
                    return TYPED_ARRAY;
                case '[object Uint8Array]':
                    return TYPED_ARRAY;
                case '[object Uint8ClampedArray]':
                    return TYPED_ARRAY;
                case '[object Int16Array]':
                    return TYPED_ARRAY;
                case '[object Uint16Array]':
                    return TYPED_ARRAY;
                case '[object Int32Array]':
                    return TYPED_ARRAY;
                case '[object Uint32Array]':
                    return TYPED_ARRAY;
                case '[object Float32Array]':
                    return TYPED_ARRAY;
                case '[object Float64Array]':
                    return TYPED_ARRAY;
                case '[object DataView]':
                    return DATA_VIEW;
                case '[object Map]':
                    return MAP;
                case '[object WeakMap]':
                    return WEAK_MAP;
                case '[object Set]':
                    return SET;
                case '[object WeakSet]':
                    return WEAK_SET;
                case '[object Promise]':
                    return PROMISE;
                case '[object Window]':
                    return WINDOW;
                case '[object HTMLDocument]':
                    return DOCUMENT;
                case '[object Blob]':
                    return BLOB;
                case '[object File]':
                    return FILE;
                case '[object FileList]':
                    return FILE_LIST;
                default:
                    if (isPromiseExist && instance instanceof Promise) return PROMISE;

                    if (isBufferExist && instance instanceof Buffer) return BUFFER;

                    if (/^\[object HTML\w+Element\]$/.test(clazz)) return HTML_ELEMENT;

                    if (clazz === '[object Object]') return OBJECT;
            }
    }
}

function eq(a, b, stackA, stackB) {
    // equal a and b exit early
    if (a === b) {
        // check for +0 !== -0;
        return a !== 0 || (1 / a == 1 / b);
    }

    var typeA = getType(a),
        typeB = getType(b);

    // if objects has different types they are not equals
    if (typeA !== typeB) return false;

    switch (typeA) {
        case NUMBER:
            return (a !== a) ? b !== b
                // but treat `+0` vs. `-0` as not equal
                : (a === 0 ? (1 / a === 1 / b) : a === b);

        case REGEXP:
            return String(a) === String(b);

        case BOOLEAN:
        case STRING:
            return a === b;

        case DATE:
            return +a === +b;

        case BUFFER:
            if(a.length !== b.length) return false;

            var l = a.length;
            while(l--) if(a[l] !== b[l]) return false;

            return true;

        case ERROR:
            //only check not enumerable properties, and check arrays later
            if(a.name !== b.name || a.message !== b.message) return false;

            break;

        case ARRAY_BUFFER:
            if(a.byteLength !== b.byteLength) return false;

            if(typeof Int8Array !== 'undefined') {
                var viewA = new Int8Array(a);
                var viewB = new Int8Array(b);

                var l = a.byteLength;
                while(l--) if(a[l] !== b[l]) return false;

                return true;
            } else {
                return false;
            }

    }

    // compare deep objects and arrays
    stackA || (stackA = []);
    stackB || (stackB = []);

    var length = stackA.length;
    while (length--) {
        if (stackA[length] == a) {
            return stackB[length] == b;
        }
    }

    // add `a` and `b` to the stack of traversed objects
    stackA.push(a);
    stackB.push(b);

    var size = 0,
        result = true,
        key;

    if (typeA === ARRAY || typeA === ARGUMENTS) {
        if (a.length !== b.length) return false;
    }

    if (typeB === FUNCTION) {
        if (a.toString() !== b.toString()) return false;
    }

    for (key in b) {
        if (hasOwnProperty.call(b, key)) {
            size++;

            result = result && hasOwnProperty.call(a, key) && eq(a[key], b[key], stackA, stackB);
            if(!result) return result;
        }
    }

    // ensure both objects have the same number of properties
    for (key in a) {
        if (hasOwnProperty.call(a, key)) {
            result = result && (--size > -1);
            if(!result) return result;
        }
    }

    stackA.pop();
    stackB.pop();

    if(typeB === FUNCTION) {
        result = result && eq(a.prototype, b.prototype);
    }

    return result;
}


module.exports = eq;
