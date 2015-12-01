var EventEmitter = require('events').EventEmitter;

stringUtils.attachTo(String.prototype);

var Commander = require('./Commander'),
    UltraRLI  = require('./UltraRLI'),
    Evaluator = require('./Evaluator'),
    Results   = require('./Results'),
    highlight = require('./Highlighter'),
    builtins  = require('../data/builtins'),
    text      = require('../data/text'),
    R         = rainbow;

module.exports = UltraREPL;

global.require = require;

function UltraREPL(options){
  var self = this;
  options = options || {};
  options.__proto__ = {
    width: process.stdout.columns || 100,
    height: process.stdout.rows || 40,
    colors: true,
    prompt: '',
    input: process.stdin,
    output: process.stdout,
  };

  if (process.platform === 'win32' && options.output === process.stdout && process.stdout._handle.constructor.name === 'TTY') {
    var proto = Object.getPrototypeOf(R(0,0,0)).setMode('win32');
  }

  var input = options.input;
  var output = options.output;
  var complete = function(){};
  var rli = this.rli = new UltraRLI(input, output, complete);
  rli.setWindowSize(options.width, options.height);

  Object.defineProperties(this, {
    keydisplay: hidden(false),
    input:      hidden(options.input),
    output:     hidden(options.output),
    lines:      hidden({ level: [] }),
    buffered:   hidden([]),
    prompt:     hidden(options.prompt),
    settings:   hidden({
      get columns(){ return self.width || 100 },
      colors: options.colors,
      format: require('util').format,
      log: this.writer.bind(this)
    }),
    pages: {
      configurable: true,
      get: function( ){ return pages },
      set: function(v){ pages = v.bisect(this.height - 2) }
    },
  });
  var context = this.context = new Evaluator(this.settings);
  var pages = new Results.Rendered;

  rli.on('close', function(){
    self.emit('endsession');
    input.destroy();
  });
  rli.on('end', function(){
    self.emit('endsession');
  });
  rli.on('resize', function(){ self.refresh() });
  rli.on('keybind', function(key){
    if (self.keydisplay) {
      rli.timedWrite('topright', key.bind, styling.info.keydisplay);
      if (output !== process.stdout) {
        console.log(key);
      }
    }
  });

  process.on('uncaughtException', function(e){
    self.writer(e);
  });

  rli.on('line', function(cmd){
    if (!self.buffered.length && !cmd || self.commands.keyword(cmd.trim())) return;

    self.buffered.push(cmd);
    self.rli.clearInput();
    clearTimeout(run.timeout);
    run.timeout = setTimeout(run, 20);

    function run(){
      clearTimeout(run.timeout);
      if (!self.buffered.length) return self.updatePrompt();
      context.run(self.buffered.join('\n'), finalize);
      self.buffered = [];
    }

    function finalize(result){
      clearTimeout(run.timeout);
      self.writer(result);
      self.resetInput();
    }
  });

  var handler = function(action, cmd, params){
    var context = self.context.current;
    context.snapshot();
    var outcome = action.call(self, cmd, params);
    var globals = context.snapshot();
    if (typeof outcome !== 'undefined' || globals && Object.keys(globals).length) {
      if (outcome && outcome.isResult) {
        result = outcome;
      } else if (outcome && outcome.error) {
        var result = new Results.Fail(context, null, outcome.error);
      } else {
        var result = new Results.Success(context, null, outcome, globals);
      }
      self.writer(result);
      self.resetInput();
      return result;
    }
    context.refresh();
  }

  this.commands = new Commander(rli);
  this.commands.on('keybind', handler);
  this.commands.on('keyword', handler);
  this.commands.on('match', handler);
  this.commands.on('initplugin', function(callback){ callback.call(self) });
  this.commands.autoload();


  this.loadScreen();
  this.header();
  this.updatePrompt();
}


UltraREPL.prototype = {
  __proto__: EventEmitter.prototype,
  constructor: UltraREPL,

  get height(){ return this.rli.height },
  get width(){ return this.rli.width },
  get currentSettings(){ return this.context.current.settings },

  loadScreen: function loadScreen(){
    this.rli.clearScreen();

    var intro = text.intro.map(function(s){
      return styling.intro[0](s[0]) + ' ' + styling.intro[1](s[1]);
    });

    var seehelp = [ styling.help.intro('press'),
                    styling.help[this.commands.help[0].type](this.commands.help[0].trigger),
                    styling.help.intro('to see command list') ].join(' ');

    seehelp = ' '.repeat((intro[0].alength - seehelp.alength) / 2 | 0) + seehelp;
    intro.push('', seehelp);

    this.rli.writeFrom(intro, (this.width - intro[0].alength) / 2 | 0, (this.height - 2 - intro.length) / 2 | 0);
  },

  resetInput: function resetInput(){
    this.buffered = [];
    this.rli.clearInput();
  },

  resetScreen: function resetScreen(){
    this.rli.clearScreen();
    this.header();
    this.rli.refreshLine();
  },

  displayPrompt: function displayPrompt(){
    this.rli.clearInput();
  },

  showHelp: function showHelp(info){
    this.resetScreen();
    this.writer(this.generateHelp(info || this.commands.help, this.width));
  },

  updatePrompt: function updatePrompt(){
    var prompt = [this.prompt];
    if (this.context.count) {
      prompt.push(styling.prompt.number(this.context.index + 1 + ''));

    }
    if (this.messages) {
      prompt.push(this.messages);
      this.messages = null;
    }
    if (this.buffered.length) {
      prompt.push(styling.error(this.buffered.length + ' buffered'));
    }
    prompt = prompt.join(styling.prompt.separator[1](styling.prompt.separator[0]));
    prompt += styling.prompt.end[1](styling.prompt.end[0]);
    this.rli.setPrompt(prompt);
  },

  clear: function clear(){
    this.pages = new Results.Rendered;
    this.rli.writePage(this.pages[0]);
  },

  format: function format(result){
    var output = [];
    var width = this.width || 60;
    function header(text, color){
      return color((' ' + text).pad(width+1));
    }

    if (result.error) {
      output.push(header(result.error.message, styling.errorbg));
      if (result.status === 'SyntaxError') {
        output.push(result.script.code);
      } else if (typeof result.error.stack === 'string' && result.script && result.script.code) {
        var stack = result.error.stack.split('\n');
        var where = stack[1].split(':');
        var line = where[where.length - 2] - 2;
        var column = where[where.length - 1] - 1;
        output.push(' '+result.script.code.split('\n')[line]+'\n '+' '.repeat(column) + '^');
      } else {
        result.script && output.push(result.script.code);
        result.error && output.push(result.error.stack);
      }
    }

    if (result.globals) {
      output.push(header('Globals', styling.inspector.header));
      output.push(result._globals);
    }

    if (result.completion) {
      if (result.label) {
        output.push(header(result.label, styling.inspector.header));
      }
      if (result.globals) output.push(header('Result', styling.inspector.header));
      output.push(result._completion);
      if (!result.code && typeof result.completion === 'function') {
        var code = result.completion+'';
        if (code.slice(-17) !== '{ [native code] }') {
          output.push(header('Function Sourcecode', styling.inspector.header));
          output.push(highlight(code));
        }
      }
    }

    if (result.code) {
      output.push(header('Sourcecode', styling.inspector.header));
      output.push(highlight(result.code));
    }

    if (!output.length) {
      output.push(result._completion);
    }

    return output.join('\n\n');
  },

  refresh: function refresh(){
    this.context.current.refresh();
    this.writer(this.context.lastResult);
    this.updatePrompt();
  },

  writer: function writer(output){
    if (output instanceof Results.Rendered) {
      this.pages = output;
    } else {
      if (output && typeof output === 'object') {
        if (output.isResult) {
          output = this.format(output);
        } else {
          output = this.context.inspector(output);
        }
      }
      this.pages = new Results.Rendered(output);
    }

    this.rli.writePage(this.pages[0]);
    this.header();
    this.updatePrompt();
    this.emit('render');
  },

  pageLabel: function pageLabel(){
    var page = this.pages.length;
    page = page > 1 ? (this.pages.index + 1) + '/' + page : '';
    this.rli.writeMount('topcenter',  styling.info.header(styling.info.page(page)));
    this.rli.writeMount('topleft', styling.info.header(styling.info.context(this.context.displayName)));
  },

  header: function header(){
    this.rli.cursorTo(0, 0);
    this.rli.print(styling.info.header(' '.repeat(this.width+1)));
    this.pageLabel();
    this.rli.toCursor();
  },

  timedPrompt: function timedPrompt(message, color, time){
    this.messages = color(message);
    this.updatePrompt();
    clearTimeout(timedPrompt.timer);
    timedPrompt.timer = setTimeout(this.updatePrompt.bind(this), time || 5000);
  },

  generateHelp: function generateHelp(help, screenW){
    var self = this;
    var nameW = stringUtils.widest(help, 'name') + 2;
    var triggerW = stringUtils.widest(help, 'trigger') + 2;
    var helpL = nameW + triggerW + 2;
    var helpR = screenW - nameW - triggerW - 8;
    var last = 0;
    return new Results.Rendered(help.filter(function(cmd){ return cmd.help }).reduce(function(lines, cmd){
      var out = {
        help: cmd.help,
        type: cmd.type,
        trigger: cmd.trigger || '',
        name: ' ' + cmd.name
      };

      if (out.type === 'keywords') {
        out.help += '\n' + styling.help.keywords(stringUtils.chunk(', ', helpR, helpL + 2, out.trigger));
        out.trigger = '';
      } else {
        out.help = out.help.align(helpR, helpL);
      }
      if (Object(out.trigger) === out.trigger && Object.getPrototypeOf(out.trigger) === RegExp.prototype) {
        out.help += '\n' + ' '.repeat(helpL + 2) + styling.inspector.RegExp(''+out.trigger);
        out.trigger = '';
      }
      out = styling.help.names(out.name.pad(nameW)) +
            styling.help[out.type](out.trigger.pad(triggerW)) +
            out.help;

      lines.push.apply(lines, out.split('\n'));
      return lines;
    }, []));
  }
};



function hidden(v){ return { value: v, configurable: true, writable: true, enumerable: false } };
