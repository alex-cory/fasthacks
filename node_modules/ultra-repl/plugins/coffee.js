var coffee = require('coffee-script');

var heritable = require('../lib/utility/object-utils').heritable;
var isError = require('../lib/utility/object-utils').is('Error');
var Context = require('../lib/Context');

var CoffeeContext = heritable({
  constructor: function CoffeeContext(){
    this.coffee = true;
  },
  super: Context,
  //runCode: function runCode(code, filename){
  //  return Context.prototype.runCode.call(this, coffee.compile(code), filename);
  //},
  syntaxCheck: function syntaxCheck(src){
    try {
      return coffee.compile(src, { bare: true });
    } catch (e) {
      return e;
    }
  }
});

module.exports = {
  init: function(){},
  commands: [{
    name: 'Create Coffee Context',
    help: 'Create a new context that evaluates input as CoffeeScript',
    defaultTrigger: api.keybind('alt+c'),
    action: function(){
      var result = this.context.add(new CoffeeContext);
      if (isError(result)) {
        result = result.message.color(style.error);
      } else {
        result = 'created CoffeeContext '.color(style.context.create) + result.name;
      }
      this.rli.timedWrite('topright', result, 'bgbblack');
      this.refresh();
    }
  }]
};
