
module.exports = {
  Rendered: Rendered,
  Page: Page,
  Success: Success,
  Fail: Fail
};

function Rendered(contents){
  if (typeof contents === 'string') {
    contents = contents.split(/\r\n|\n|\r/);
  }
  this.contents = contents || [];
}

Rendered.prototype = {
  bisect: function bisect(divisor){
    var pages = new Group;

    if (this.contents.length === 0) {
      var page = new Page([]);
      page.padEnd(divisor);
      pages.append(page);
      return pages;
    }

    var chunks = this.contents.length / divisor + 1 | 0;
    for (var i = 0; i < chunks; i++) {
      var lines = this.contents.slice(i * divisor, (i + 1) * divisor);
      var page = new Page(lines);
      if (page.length < divisor) {
        page.padEnd(divisor - page.length);
      }
      pages.append(page);
    }
    return pages;
  }
};


function Page(contents){
  if (typeof contents === 'string') {
    contents = contents.split(/\r\n|\n|\r/);
  }
  var page = [];
  page.__proto__ = Page.prototype;
  page.pushall(contents);
  return page;
}

Page.prototype = {
  constructor: Page,
  __proto__: Array.prototype,
  toString: function toString(){ return this.join('\n') },
  pushall: function pushall(arr){ this.push.apply(this, arr) },
  padEnd: function padEnd(count){ while (count--) this.push(''); }
}







function Result(status, inspector, completion, label){
  if (!(this instanceof Result)) return new Result(status, inspector, completion);
  this.status = status;
  this.inspector = inspector;
  this.completion = completion;
  this.label = label;
}

Result.prototype = {
  completion: null,
  globals: null,
  error: null,
  status: null,
  script: null,
  inspector: null,
  label: null,
  isResult: true,
  get _completion(){
    return this.inspector && this.inspector(this.completion);
  },
  get _globals(){
    return this.inspector && this.inspector(this.globals);
  }
};


function Success(context, script, completion, globals, label){
  if (!(this instanceof Success)) return new Success(context, script, completion, globals);
  globals = globals || {};
  this.status = 'Success';
  this.completion = completion;
  this.globals = Object(globals) === globals && Object.keys(globals).length ? globals : null;
  this.script = script;
  this.inspector = context.inspector;
  this.label = label;
}

Success.prototype = Object.create(Result.prototype);


function Fail(context, script, error){
  if (!(this instanceof Fail)) return new Fail(context, script, error);
  this.status = error.name;
  this.error = error;
  this.script = script;
}

Fail.prototype = Object.create(Result.prototype);