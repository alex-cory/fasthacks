"use strict";

var Module       = require('module'),
    path         = require('path'),
    fs           = require('fs'),
    chunk        = require('../lib/utility/string-utils').chunk,
    EventEmitter = process.EventEmitter,
    npm,
    log = new EventEmitter;

if (process.platform === 'win32') {
  var globalPath = process.arch === 'ia32' ? 'C:\\Program Files (x86)\\nodejs' : 'C:\\Program Files\\nodejs';
  globalPath = Module._nodeModulePaths(globalPath).filter(fs.existsSync)[0];
  var npmPath = path.resolve(globalPath, 'npm');
} else {
  var npmPath = path.resolve(path.dirname(process.execPath), '..', 'lib', 'node_modules', 'npm');
}


function command(repl, params, cb){
  cb = cb || function(x){ return x };
  params = params.split(' ');
  repl.displayPrompt();
  try {
    npm[params.shift()](params.join(' '), function(e, data){
      repl.writer(cb.call(repl, data));
    });
  } catch (e) { return e }
}

module.exports = {
  init: function(){
    require(npmPath).load(function(e,NPM){
      NPM.on('output', function(){
        log.emit('message', NPM.output.message);
        NPM.output = null;
      });
      npm = NPM;
    });
  },
  commands: [{
    name: 'npm command',
    help: 'Execute an npm command.',
    defaultTrigger: api.command('.npm'),
    action: function(cmd, params){
      command(this, params);
    }
  },
  { name: 'npm search',
    help: 'Shortcut to search npm.',
    defaultTrigger: api.command('.search'),
    action: function(cmd, params){
      command(this, 'search '+params, function(json){
        return format(json, this.width, params);
      });
    }
  }]
}

var _header      = rainbow('#f03').bg('#000'),
    _count       = rainbow('#800').under(),
    _name        = rainbow('#06a').fg('#cfc'),
    _maintainers = rainbow('#970'),
    _keywords    = rainbow('#3a3'),
    _date        = rainbow('#0fa').gradient('#042', 13);



function format(json, width, search){
  var keys = Object.keys(json);
  var count = keys.length+'';
  var header = (count+' npm search results for "'+search+'"').pad(width+2);
  header = ' '+_count(header.slice(0, count.length)) + _header(header.slice(count.length));
  var now = Date.now();
  keys.forEach(function(key){
    json[key].time = Date.parse(json[key].time);
    if (!isFinite(+json[key].time)) json[key].time = new Date('1/1/10');
  });
  keys = keys.sort(function(a,b){
    return +json[b].time-+json[a].time;
  });
  return header + '\n' + keys.map(function(name,i){
    var o = json[name];
    var out = [
      _name(((i+1)+'. '+name).pad(width+1)),
      ' '+timeago(o.time),
      _maintainers(' '+o.maintainers.join(', ')),
    ];
    if (o.description) {
      out.push(chunk(' ', width-3, 1, o.description));
    }
    if (o.keywords && o.keywords.length) {
      out.push(_keywords(' ['+chunk(', ', width-3, 1, o.keywords).slice(0,-2)+' ]'));
    }
    return out.join('\n');
  }).join('\n\n');
}


var timeago = function(){
  var min   = 60,
      hour  = min*60,
      day   = hour*24,
      week  = day*7,
      month = week*4,
      year  = month*12;

  function format(time, col, label){
    time = time + 0.5 | 0;
    if (time !== 1) label += 's';
    return _date[col](time + ' ' + label + ' ago');
  }

  return function timeago(time){
    var diff = (Date.now() - time) / 1000;
    var col = 0;
    if (diff < min)   return _date[0]('moments ago');
    if (diff < hour)  return format(diff / min,  col, 'minute');
    if (diff < day)   return format(diff / hour, col, 'hour');
    if (diff < week)  return format(diff / day,  col, 'day');
    col = 1;
    if (diff < month) return format(diff / week, col, 'week');
    col = Math.min(diff / month * 2 | 0, 12);
    if (diff < year)  return format(diff / month,col, 'month');
    col = 12;
                      return format(diff / year, col, 'year');
  };
}();
