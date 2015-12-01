var EventEmitter = process.EventEmitter,
    readline     = require('readline'),
    tty          = require('tty');


var selected = styling.prompt.selection;
module.exports = UltraRLI;

function UltraRLI(input, output, completer){
  var self = this;

  this.output = output;
  this.input = input;
  if (readline.emitKeypressEvents) {
    readline.emitKeypressEvents(this.input);
  }
  input.setRawMode = input.setRawMode || function(){}

  completer = completer || function(){ return [] };
  this.completer = completer.length === 2 ? completer : function(v, callback){
    callback(null, completer(v));
  };

  this.line = '';
  this.cursor = 0;
  this.history = [];
  this.historyIndex = -1;
  this.selectionStart = 0;
  this.selectionLength = 0;
  this._promptLength = 0;
  this._prompt = '';
  this.resize.last = [];
  this.input.on('keypress', function(s, key){
    self._ttyWrite(s, key);
  });
  this.input.on('close', function(){
    self.closed = true;
    self.emit('close');
  });
  this.input.on('SIGWINCH', function(){
    self.resize();
  });
  this.input.on('end',function(){
    self.closed = true;
    self.write = function(){ throw new Error('Tried to write '+arguments[0]) };
    self.emit('end');
  });
  this.resume();
}




UltraRLI.prototype = {
  __proto__: EventEmitter.prototype,
  constructor: UltraRLI,

  resize: function resize(size){
    try { size = size || this.output.getWindowSize(); } catch (e) { size = [80,30] }
    if (size[0] === resize.last[0] && size[1] === resize.last[1]) return;
    resize.last = size;
    this.width = size[0];
    this.height = size[1];
    if (this.height > resize.maxseen) {
      this.fill();
      resize.maxseen = this.height;
    }
    this.emit('resize');
  },

  end: function end(){
    this.closed = true;
    this.write = function(){ throw new Error('Tried to write '+arguments[0]) };
    if (this.input.type() === 'TTY') {
      this.input.end();
    }
    this.emit('end');
  },

  close: function close(d) {
    this.closed = true;
    this.emit('close');
    if (this.input.type() === 'TTY') {
      this.input.setRawMode(false);
      this.input.close();
    } else {
      this.input.destroy();
    }
  },

  pause: function pause() {
    this.input.pause();
    this.paused = true;
    this.emit('pause');
  },

  resume: function resume() {
    this.input.resume();
    this.input.setRawMode(true);
    this.paused = false;
    this.emit('resume');
  },
  _addHistory: function _addHistory() {
    if (this.line.length === 0) return '';

    this.history.unshift(this.line);
    this.historyIndex = -1;
    if (this.history.length > 100) this.history.pop();

      this.selectionStart = 0;
      this.selectionEnd = 0;
    this.clearLine();
    return this.history[0];
  },

  _historyNext: function _historyNext() {
    if (this.historyIndex > 0) {
      this.line = this.history[--this.historyIndex];
      this.cursor = this.line.length;
      this.selectionStart = 0;
      this.selectionEnd = 0;
      this.refreshLine();

    } else if (this.historyIndex === 0) {
      this.historyIndex = -1;
      this.clearInput();
    }
  },

  _historyPrev: function _historyPrev() {
    if (this.historyIndex + 1 < this.history.length) {
      this.historyIndex++;
      this.line = this.history[this.historyIndex];
      this.cursor = this.line.length;
      this.selectionStart = 0;
      this.selectionEnd = 0;
      this.refreshLine();
    }
  },

  _line: function _line(){
    var line = this._addHistory();
    //if (process.platform === 'win32') this.resize();
    this.emit('line', line);
  },

  fill: function fill(minus){
    this.cursorTo(0, 0);
    this.print('\n'.repeat(this.height - minus));
    this.toCursor();
  },

  eraseInput: function eraseInput(){
    this.cursorTo(0, this.height);
    this.___clearLine();
    this.moveCursor(-this.width);
  },

  clearLine: function clearLine(){
    this.cursor = 0;
    this.selectionStart = 0;
    this.selectionEnd = 0;
    this.cursor = 0;
    this.line = '';
    this.eraseInput();
  },

  takeLine: function takeLine(){
    if (this.line.length === 0) return '';
    var line = this.line;
    this.clearLine();
    return line;
  },

  clearInput: function clearInput(){
    this.cursor = 0;
    this.selectionStart = 0;
    this.selectionEnd = 0;
    this.line = '';
    this.refreshLine();
  },

  refreshLine: function refreshLine(){
    this.eraseInput();
    this.print(this._prompt +
               this.line.slice(0, this.selectionStart) +
      selected(this.line.slice(this.selectionStart, this.selectionEnd)) +
               this.line.slice(this.selectionEnd));
    this.toCursor();
  },

  toCursor: function toCursor(){
    this.cursorTo(this._promptLength + this.cursor, this.height);
  },

  home: function home(){
    this.cursor = 0;
    this.cursorTo(this._promptLength, this.height);
  },

  setPrompt: function setPrompt(prompt){
    this._prompt = prompt;
    this._promptLength = prompt.alength;
    this.refreshLine();
  },

  clearLines: function clearLines(from, to){
    from = from > to ? [to, to = from][0] : from;
    from = from > 1 ? from : 1;
    to = to < this.height ? to : this.height;
    for (; from < to; from++) {
      this.cursorTo(0, from);
      this.___clearLine();
    }
    this.toCursor();
  },

  writeFrom: function writeFrom(output, left, top){
    output = typeof output === 'string' ? output.split(CRLF) : output;
    top = top > 0 ? top : 0;
    left = left || 0;
    this.cursorTo(left, top + 1);
    for (var i = 0, len = output.length; i + top < this.height - 1 && i < output.length; i++) {
      this.moveCursor(0, 1);
      this.print(output[i] );
      this.cursorTo(left);
    }
    this.toCursor();
  },

  writePage: function writePage(lines){
    for (var i = 0; i < this.height - 2 && i < lines.length; i++) {
      this.cursorTo(0, i + 1);
      this.print(lines[i]);
      this.___clearLine(1);
    };
    this.toCursor();
  },

  scaleX: function scaleX(x){
    if (x === 'center')  return this.width / 2 | 0;
    if (x === 'right')   return this.width;
    if (x === 'left')    return 0;

    if (x > 0 && x < 1)  return x * this.width | 0;
    if (x <= 0)          return 0;
    if (x >= this.width) return this.width;
  },

  scaleY: function scaleY(y){
    if (y === 'center')   return this.height / 2 | 0;
    if (y === 'bottom')   return this.height - 1;
    if (y === 'top')      return 0;

    if (y > 0 && y < 1)   return y * this.height | 0;
    if (y <= 0)           return 0;
    if (y >= this.height) return this.height;
  },

  eraseMount: function eraseMount(mount){
    if (typeof mount === 'string') mount = mounts[mount];
    if (!mount.contents) return;
    this.cursorTo(mount.left, mount.top);
    this.print(mount.bg(' '.repeat(mount.width)));
    mount.width = 0;
    mount.contents = '';
    mount.left = null;
    mount.top = null;
  },

  writeMount: function writeMount(mount, message, bg){
    if (typeof mount === 'string') mount = mounts[mount];
    mount.width = message.alength;
    mount.contents = message;
    mount.left = this.scaleX(mount.x);
    mount.top = this.scaleY(mount.y);
    if (mount.align === 'right') {
      mount.left -= mount.width;
    } else if (mount.align === 'center') {
      mount.left -= mount.width / 2 | 0;
    }
    this.cursorTo(mount.left, mount.top);
    bg = bg || mount.bg;
    this.print(bg(message));
    this.toCursor();
  },

  timedWrite: function timedWrite(mount, message, bg, time){
    if (typeof mount === 'string') mount = mounts[mount];
    if (mount.timer) {
      var expires = mount.timer.expires;
      var contents = mount.contents;
      clearTimeout(mount.timer);
    }
    this.eraseMount(mount);
    this.writeMount(mount, message, bg);

    mount.timer = setTimeout(function remove(){
      this.eraseMount(mount);
      if (expires && expires > Date.now()) {
        this.writeMount(mount, contents, bg);
        mount.timer = setTimeout(remove.bind(this), expires - Date.now());
        mount.timer.expires = expires;
      } else {
        delete mount.timer;
        this.toCursor();
      }
    }.bind(this), time || 5000);

    mount.timer.expires = Date.now() + (time || 5000);
  },

  get selectionLength(){
    return this.selectionEnd - this.selectionStart;
  },
  get selection(){
    return this.line.slice(this.selectionStart, this.selectionEnd);
  },
  deleteSelection: function deleteSelection(){
    if (this.selectionLength) {
      this.line = this.line.slice(0, this.selectionStart) + this.line.slice(this.selectionEnd);
      this.cursor = this.selectionStart;
      this.selectionStart = this.selectionEnd = 0;
      this.refreshLine();
      return true;
    }
    return false;
  },

  clearSelection: function clearSelection(direction){
    if (this.selectionLength) {
      if (direction < 0) {
        this.cursor = this.selectionStart;
      } else if (direction > 0) {
        this.cursor = this.selectionEnd;
      }
      this.selectionStart = this.selectionEnd = 0;
      this.refreshLine();
      return true;
    }
    this.cursor += direction;
    return false;
  },
  _insertString: function _insertString(c){
    if (this.cursor < this.line.length) {
      if (this.selectionLength) {
        if (this.selection.indexOf(c) === 0) {
          this.selectionStart += c.length
          this.cursor += c.length;
          return this.refreshLine();
        } else {
          this.deleteSelection();
        }
      }
      this.line = this.line.slice(0, this.cursor) + c + this.line.slice(this.cursor, this.line.length);
      this.cursor += c.length;
      this.refreshLine();
    } else {
      this.line += c;
      this.cursor += c.length;
      this.print(c);
    }
  },

  _selectLine: function _selectLine(){
    this.selectionStart = 0;
    this.selectionEnd = this.line.length;
    this.cursor = this.line.length;
    this.toCursor();
    this.refreshLine();
  },
  _selectLeft: function _selectLeft(){
    if (this.cursor) {
      if (!this.selectionLength) {
        this.selectionEnd = this.cursor;
      }
      this.cursor--;
      this.selectionStart = this.cursor;
      this.toCursor();
      this.refreshLine();
    }
  },
  _selectRight: function _selectRight(){
    if (this.cursor !== this.line.length) {
      if (!this.selectionLength) {
        this.selectionStart = this.cursor;
      }
      this.cursor++;
      this.selectionEnd = this.cursor;
      this.toCursor();
      this.refreshLine();
    }
  },
  _selectWordLeft: function _selectWordLeft(){
    if (this.cursor && this.line.length) {
      var leading = this.line.slice(0, this.cursor);
      var match = leading.match(wordLeft);
      if (match) {
        if (!this.selectionLength) {
          this.selectionEnd = this.cursor;
        }
        this.cursor -= match[0].length;
        this.selectionStart = this.cursor;
        this.toCursor();
        this.refreshLine();
      }
    }
  },
  _selectWordRight: function _selectWordRight(){
    if (this.cursor < this.line.length) {
      if (!this.selectionLength) {
        this.selectionStart = this.cursor;
      }
      var trailing = this.line.slice(this.cursor);
      var match = trailing.match(wordRight);
      if (match) {
        this.cursor += match[0].length;
        this.selectionEnd = this.cursor;
        this.toCursor();
        this.refreshLine();
      }
    }
  },
  _selectLineLeft: function _selectLineLeft(){
    if (!this.selectionLength) {
      this.selectionEnd = this.cursor;
    }
    this._lineLeft();
    this.selectionStart = this.cursor;
    this.refreshLine();
  },
  _selectLineRight: function _selectLineRight(){
    if (!this.selectionLength) {
      this.selectionStart = this.cursor;
    }
    this._lineRight();
    this.selectionEnd = this.cursor;
    this.refreshLine();
  },
  _moveLeft: function _moveLeft(){
    if (this.cursor) {
      this.clearSelection(-1);
    }
    this.toCursor();
  },

  _moveRight: function _moveRight(){
    if (this.cursor !== this.line.length) {
      this.clearSelection(1);
    }
    this.toCursor();
  },

  _lineLeft: function _lineLeft(){
    this.clearSelection(-1);
    this.cursor = 0;
    this.toCursor();
  },

  _lineRight: function _lineRight(){
    this.clearSelection(1);
    this.cursor = this.line.length;
    this.toCursor();
  },


  _deleteLeft: function _deleteLeft() {
    if (!this.deleteSelection() && this.cursor && this.line.length) {
      this.line = this.line.slice(0, this.cursor - 1) + this.line.slice(this.cursor);
      this.cursor--;
      this.refreshLine();
    }
  },

  _deleteRight: function _deleteRight() {
    if (!this.deleteSelection() && this.cursor < this.line.length) {
      this.line = this.line.slice(0, this.cursor) + this.line.slice(this.cursor + 1);
      this.refreshLine();
    }
  },

  _deleteWordLeft: function _deleteWordLeft() {
    if (!this.deleteSelection() && this.cursor) {
      var leading = this.line.slice(0, this.cursor);
      var match = leading.match(wordLeft);
      leading = leading.slice(0, leading.length - match[0].length);
      this.line = leading + this.line.slice(this.cursor, this.line.length);
      this.cursor = leading.length;
      this.refreshLine();
    }
  },

  _deleteWordRight: function _deleteWordRight() {
    if (!this.deleteSelection() && this.cursor < this.line.length) {
      var trailing = this.line.slice(this.cursor);
      var match = trailing.match(wordRight);
      this.line = this.line.slice(0, this.cursor) + trailing.slice(match[0].length);
      this.refreshLine();
    }
  },

  _deleteLineLeft: function _deleteLineLeft() {
    this.line = this.line.slice(this.cursor);
    this.cursor = 0;
    this.selectionStart = 0;
    this.selectionEnd = 0;
    this.refreshLine();
  },

  _deleteLineRight: function _deleteLineRight() {
    this.line = this.line.slice(0, this.cursor);
    this.selectionStart = 0;
    this.selectionEnd = 0;
    this.refreshLine();
  },

  _wordLeft: function _wordLeft() {
    if (this.cursor && this.line.length) {
      this.clearSelection(-1);
      var leading = this.line.slice(0, this.cursor);
      var match = leading.match(wordLeft);
      if (match) {
        this.cursor -= match[0].length;
        this.toCursor();
      }
    }
  },

  _wordRight: function _wordRight() {
    if (this.cursor < this.line.length) {
      this.clearSelection(1);
      var trailing = this.line.slice(this.cursor);
      var match = trailing.match(wordRight);
      if (match) {
        this.cursor += match[0].length;
        this.toCursor();
      }
    }
  },

  cursorTo: function cursorTo(x, y) {
    if (typeof x !== 'number' && typeof y !== 'number')
      return;

    if (typeof x !== 'number')
      throw new Error("Can't set cursor row without also setting it's column");

    if (typeof y !== 'number') {
      this.print('\x1b[' + (x + 1) + 'G');
    } else {
      this.print('\x1b[' + (y + 1) + ';' + (x + 1) + 'H');
    }
  },


  moveCursor: function moveCursor(dx, dy) {
    if (dx < 0) {
      this.print('\x1b[' + (-dx) + 'D');
    } else if (dx > 0) {
      this.print('\x1b[' + dx + 'C');
    }

    if (dy < 0) {
      this.print('\x1b[' + (-dy) + 'A');
    } else if (dy > 0) {
      this.print('\x1b[' + dy + 'B');
    }
  },

  ___clearLine: function clearLine(dir) {
    if (dir < 0) {
      // to the beginning
      this.print('\x1b[1K');
    } else if (dir > 0) {
      // to the end
      this.print('\x1b[0K');
    } else {
      // entire line
      this.print('\x1b[2K');
    }
  },

  toggleMouse: function toggleMouse(){
    if (this.mouse) {
      this.print('\x1b[?1000h');
    } else {
      this.print('\x1b[?1005h');
      this.print('\x1b[?1003h');
    }
    return this.mouse = !this.mouse;
  },

  loadCursor: function loadCursor(){
    this.print('\x1b[1u');
  },
  saveCursor: function saveCursor(){
    this.print('\x1b[1s');
  },
  clearScreen: function clearScreen(){
    this.print('\x1b[1J');
  },
  setWindowSize: function setWindowSize(width, height){
    this.print('\x1b[8'+width+';'+height+'t');
    this.width = width;
    this.height = height;
    this.emit('resize');
  },


  translate: function translate(val, key){
    if (!val && key) val = key.sequence || '';
    if (/^\u001b\[M/.test(val)) {
      return new MouseEvent(val);
    } else {
      return new KeyEvent(val, key);
    }
  },

  print: function print(v){
    this.emit('print', v);
    this.output.write(v);
  },

  write: function write(d, key) {
    this._ttyWrite(d, key);
  },
  _ttyWrite: function _ttyWrite(s, key){
    key = this.translate(s, key);

    if (key.type === 'keyboard') {
      this.emit('keybind', key, s);
      if (key.used || key.ctrl || key.meta) return;
    } else if (key.type === 'mouse') {
      return this.emit(key.name, key);
    }

    if (Buffer.isBuffer(s)) {
      s = s.toString('utf8');
    }
    if (s) {
      var lines = s.split(CRLF);
      for (var i = 0, len = lines.length; i < len; i++) {
        i && this._line();
        this._insertString(lines[i]);
      }
    }
  }
};

UltraRLI.prototype._refreshLine = UltraRLI.prototype.refreshLine;


var mods =
[ '',
  'ctrl+',
  'alt+',
  'ctrl+alt+',
  'shift+',
  'ctrl+shift+',
  'alt+shift+',
  'ctrl+alt+shift+' ]

var InputEvent = function(mods){
  function InputEvent(){}

  InputEvent.prototype = {
    used: false,
  };

  return InputEvent;
}();

var KeyEvent = function(namemap){
  function KeyEvent(s, key){
    key = key || {};
    this.type = 'keyboard';
    this.name = namemap[key.name] || key.name || '';
    this.shift = !!key.shift;
    this.ctrl = !!key.ctrl;
    this.meta = !!key.meta;
    this.bind = mods[this.ctrl | this.meta << 1 | this.shift << 2] + this.name;
    this.data = Buffer(s);
  }

  Function.inherit(InputEvent, KeyEvent, {
    type: 'keyboard',
    key: ''
  });

  return KeyEvent;
}({ backspace: 'bksp',
    escape:    'esc',
    delete:    'del',
    pagedown:  'pgdn',
    pageup:    'pgup',
    insert:    'ins' });


var MouseEvent = function(namemap){
  var button;
  function MouseEvent(s, k){
    var data = Buffer(s);
    this.name = 'mouse';
    if (data.length === 6) {
      this.x = data[4] - 32;
      this.y = data[5] - 32;
    } else if (data.length == 8) {
      this.x = data.readUInt16BE(4) - 32;
      this.y = data.readUInt16BE(6) - 32;
    }
    data = data[3];
    if ((data & 96) === 96) {
      this.name += 'scroll';
      this.button = data & 1 ? 'down' : 'up';
    } else if (data & 64) {
      this.name += 'move';
    } else {
      this.name += data === 35 ? 'up' : 'down';
      this.button = namemap[3] = namemap[data - 32];
    }
    this.shift = !!(data & 4);
    this.meta = !!(data & 8);
    this.ctrl = !!(data & 16);
    this.bind = mods[this.ctrl | this.meta << 1 | this.shift << 2] + this.name;
    this.data = Buffer(s);
  }

  Function.inherit(InputEvent, MouseEvent, {
    type: 'mouse',
  });

  return MouseEvent;
}([ 'left', 'middle', 'right', 'none' ]);




var deepSkyBlue = rainbow(0,180,255).fg(255,255,255);
var mounts = {
  topright: {
    x: 'right',
    y: 'top',
    align: 'right',
    bg: deepSkyBlue
  },
  topcenter: {
    x: 'center',
    y: 'top',
    align: 'center',
    bg: deepSkyBlue
  },
  topleft: {
    x: 'left',
    y: 'top',
    align: 'left',
    bg: deepSkyBlue
  }
};


var wordLeft = /([^\w\s]+|\w+|)\s*$/;
var wordRight = /^(\s+|\W+|\w+)\s*/;
var CRLF = /\r\n|\n|\r/;

require('net').Socket.prototype.type = function type(){
  try { return this._handle.constructor.name }
  catch (e) { return null }
}
