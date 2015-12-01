"use strict";

var names = [
  'Black', 'DarkRed', 'Green', 'DarkYellow', 'Blue', 'Purple', 'DarkCyan', 'Smoke', 'Gray', 'Red',
  'Bright Green', 'Yellow','Blue', 'Fuschia', 'Cyan', 'White',
  'Grey0', 'NavyBlue', 'DarkBlue', 'Blue3', 'Blue3', 'Blue1', 'DarkGreen', 'DeepSkyBlue4', 'DeepSkyBlue4',
  'DeepSkyBlue4', 'DodgerBlue3', 'DodgerBlue2', 'Green4', 'SpringGreen4', 'Turquoise4', 'DeepSkyBlue3',
  'DeepSkyBlue3', 'DodgerBlue1', 'Green3', 'SpringGreen3', 'DarkCyan', 'LightSeaGreen', 'DeepSkyBlue2',
  'DeepSkyBlue1', 'Green3', 'SpringGreen3', 'SpringGreen2', 'Cyan3', 'DarkTurquoise', 'Turquoise2',
  'Green1', 'SpringGreen2', 'SpringGreen1', 'MediumSpringGreen', 'Cyan2', 'Cyan1', 'DarkRed', 'DeepPink4',
  'Purple4', 'Purple4', 'Purple3', 'BlueViolet', 'Orange4', 'Grey37', 'MediumPurple4', 'SlateBlue3',
  'SlateBlue3', 'RoyalBlue1', 'Chartreuse4', 'DarkSeaGreen4', 'PaleTurquoise4', 'SteelBlue', 'SteelBlue3',
  'CornflowerBlue', 'Chartreuse3', 'DarkSeaGreen4', 'CadetBlue', 'CadetBlue', 'SkyBlue3', 'SteelBlue1',
  'Chartreuse3', 'PaleGreen3', 'SeaGreen3', 'Aquamarine3', 'MediumTurquoise', 'SteelBlue1', 'Chartreuse2',
  'SeaGreen2', 'SeaGreen1', 'SeaGreen1', 'Aquamarine1', 'DarkSlateGray2', 'DarkRed', 'DeepPink4', 'DarkMagenta',
  'DarkMagenta', 'DarkViolet', 'Purple', 'Orange4', 'LightPink4', 'Plum4', 'MediumPurple3', 'MediumPurple3',
  'SlateBlue1', 'Yellow4', 'Wheat4', 'Grey53', 'LightSlateGrey', 'MediumPurple', 'LightSlateBlue', 'Yellow4',
  'DarkOliveGreen3', 'DarkSeaGreen', 'LightSkyBlue3', 'LightSkyBlue3', 'SkyBlue2', 'Chartreuse2', 'DarkOliveGreen3',
  'PaleGreen3', 'DarkSeaGreen3', 'DarkSlateGray3', 'SkyBlue1', 'Chartreuse1', 'LightGreen', 'LightGreen',
  'PaleGreen1', 'Aquamarine1', 'DarkSlateGray1', 'Red3', 'DeepPink4', 'MediumVioletRed', 'Magenta3', 'DarkViolet',
  'Purple', 'DarkOrange3', 'IndianRed', 'HotPink3', 'MediumOrchid3', 'MediumOrchid', 'MediumPurple2', 'DarkGoldenrod',
  'LightSalmon3', 'RosyBrown', 'Grey63', 'MediumPurple2', 'MediumPurple1', 'Gold3', 'DarkKhaki', 'NavajoWhite3',
  'Grey69', 'LightSteelBlue3', 'LightSteelBlue', 'Yellow3', 'DarkOliveGreen3', 'DarkSeaGreen3', 'DarkSeaGreen2',
  'LightCyan3', 'LightSkyBlue1', 'GreenYellow', 'DarkOliveGreen2', 'PaleGreen1', 'DarkSeaGreen2', 'DarkSeaGreen1',
  'PaleTurquoise1', 'Red3', 'DeepPink3', 'DeepPink3', 'Magenta3', 'Magenta3', 'Magenta2', 'DarkOrange3', 'IndianRed',
  'HotPink3', 'HotPink2', 'Orchid', 'MediumOrchid1', 'Orange3', 'LightSalmon3', 'LightPink3', 'Pink3', 'Plum3',
  'Violet', 'Gold3', 'LightGoldenrod3', 'Tan', 'MistyRose3', 'Thistle3', 'Plum2', 'Yellow3', 'Khaki3', 'LightGoldenrod2',
  'LightYellow3', 'Grey84', 'LightSteelBlue1', 'Yellow2', 'DarkOliveGreen1', 'DarkOliveGreen1', 'DarkSeaGreen1',
  'Honeydew2', 'LightCyan1', 'Red1', 'DeepPink2', 'DeepPink1', 'DeepPink1', 'Magenta2', 'Magenta1', 'OrangeRed1',
  'IndianRed1', 'IndianRed1', 'HotPink', 'HotPink', 'MediumOrchid1', 'DarkOrange', 'Salmon1', 'LightCoral',
  'PaleVioletRed1', 'Orchid2', 'Orchid1', 'Orange1', 'SandyBrown', 'LightSalmon1', 'LightPink1', 'Pink1', 'Plum1',
  'Gold1', 'LightGoldenrod2', 'LightGoldenrod2', 'NavajoWhite1', 'MistyRose1', 'Thistle1', 'Yellow1', 'LightGoldenrod1',
  'Khaki1', 'Wheat1', 'Cornsilk1', 'Grey100', 'Grey3', 'Grey7', 'Grey11', 'Grey15', 'Grey19', 'Grey23', 'Grey27',
  'Grey30', 'Grey35', 'Grey39', 'Grey42', 'Grey46', 'Grey50', 'Grey54', 'Grey58', 'Grey62', 'Grey66', 'Grey70',
  'Grey74', 'Grey78', 'Grey82', 'Grey85', 'Grey89', 'Grey93'
];

module.exports = rainbow;

// ###############
// ### rainbow ###
// ###############

function rainbow(a,b,c,d){
  if (a instanceof Color) {
    return a;
  }
  var hsl, rgb, ansi;
  if (Array.isArray(a)) {
    c = a[2]; b = a[1]; a = a[0];
  }
  if (typeof a === 'string') {
    a = a.toLowerCase();
    if (Array.isArray(b)) {
      d = b[2]; c = b[1]; b = b[0];
    }
    if (a === 'hsl') return Color(new HSL(b, c, d).toAnsi());
    if (a === 'rgb') return Color(new RGB(b, c, d).toAnsi());
    if (a === 'ansi') return Color(b);
    if (a[0] === '#') return Color(new RGB(a).toAnsi());
    var name = names.indexOf(a);
    if (~name) return Color(names[name]);
  }
  if (isFinite(a) && isFinite(b) && isFinite(c)) {
    return Color(new RGB(a,b,c).toAnsi());
  }
  if (a.toAnsi) {
    return Color(a.toAnsi());
  }
  if (a.ansi) {
    return Color(a.ansi());
  }
  if (isDecimal(b) || isDecimal(c) || between(256, 360, a)) {
    return Color(new HSL(a, b, c).toAnsi());
  }
  if (inRGB(a) && inRGB(b) && inRGB(c)) {
    return Color(new RGB(a, b, c).toAnsi());
  }
  if (isFinite(a)) {
    return Color(new RGB(a >> 16, a >> 8 & 255, a & 255).toAnsi());
  }
  if (ansi) return Color(ansi);
  throw new Error('No idea what you gave to me');
}

function rng(max){ return (Math.random() * max + 0.5) | 0 }

rainbow.random = function random(txt){
  return rainbow('ansi', rng(239))(txt || '■■■');
};

rainbow.gradient = function gradient(colors, lengthPer){
  return ColorSet(colors.map(function(color,i){
    return rainbow(color).gradient(colors[ (i+1) % colors.length ], lengthPer || 15);
  }));
};

rainbow.spectrum = function spectrum(){
  return rainbow.gradient([ '#f00', '#ff0', '#0f0', '#0ff', '#00f', '#f0f' ]);
};



// ################
// ### ColorSet ###
// ################

function ColorSet(a){
  a.__proto__ = ColorSet.prototype;
  return a;
}

ColorSet.prototype = {
  __proto__: Array.prototype,
  constructor: ColorSet,
  hsl: function hsl(){ return this.map(function(c){ return c.hsl() }) },
  rgb: function rgb(){ return this.map(function(c){ return c.rgb() }) },
  ansi: function ansi(){ return this.map(function(c){ return c.ansi() }) },
  filter: function filter(p, cmpr, v){
    var fn;
    var type = (p === 'h' || p ==='s' || p === 'l') ? 'hsl' : 'rgb';
    switch (cmpr) {
     case  '>': fn = function(c){ return c[p]  > v }; break;
     case  '<': fn = function(c){ return c[p]  < v }; break;
     case '==': fn = function(c){ return c[p] == v }; break;
     case '!=': fn = function(c){ return c[p] != v }; break;
    }
    return new ColorSet([].filter.call(this[type](), fn)).ansi();
  },
  unique: function unique(){
    var seenThisTime = {};
    return new ColorSet([].filter.call(this, function(c){
     if (!(c.code in seenThisTime)) {
       return seenThisTime[c.code] = true;
     }
    }));
  },
  chunk: function chunk(size){
    var chunks = this.length / size;
    if (chunks | 0 !== chunks) chunks = chunks | 0 + 1;
    var out = [], arr=this.slice();
    while (chunks--) {
      out.push(this.slice(chunks*size, size*(chunks+1)));
    }
    return out;
  },
  flatten: function flatten(){
    return this.concat.apply([], this);
  },
  toString: function toString(){
    return this.join('');
  }
};


function wrapMethod(method){
  return function(){
    return new ColorSet(method.apply(this, arguments));
  };
}

['map', 'sort', 'concat', 'slice'].forEach(function(n){
  ColorSet.prototype[n] = wrapMethod(Array.prototype[n]);
});

['fg', 'bg', 'ital', 'inv', 'under', 'bold', 'pad'].forEach(function(n){
  ColorSet.prototype[n] = function(v){
    return this.map(function(item){
      if (ColorSet.prototype.isPrototypeOf(item)) {
        return item.map(function(subitem){
          return subitem[n](v);
        });
      }
      return item[n](v)
    });
  };
});


function DataColor(ctor){
  ctor.prototype.__proto__ = DataColor.prototype;
  ctor.name.toLowerCase().split('').forEach(function(n,i){
    Object.defineProperty(ctor.prototype, n, {
      enumerable: true, configurable: true,
      get: function(){ return this.data[i] },
      set: function(v){ this.data[i] = v },
    });
  });
  return ctor;
}

DataColor.prototype = {
  get 0(){ return this.data[0] },
  get 1(){ return this.data[1] },
  get 2(){ return this.data[2] },
  set 0(v){ this.data[0] = v },
  set 1(v){ this.data[1] = v },
  set 2(v){ this.data[2] = v },
  toArray: function toArray(){ return [this[0],this[1],this[2]] },
  escape: function escape(t){ return Color(this.toAnsi())(t) },
  length: 3
};

var MIN = Math.min;
var MAX = Math.max;
function ROUND(n){ return n + .5 | 0 }
function FIX(n){ return +n.toFixed(2) }
function T100(n){ return n * 100 + .5 | 0 }
function T255(n){ return n * 255 + .5 | 0 }
function F100(n){ return FIX(n / (100 + .5 | 0)) }
function F255(n){ return FIX(n / (255 + .5 | 0)) }
function T51(x){ return FIX(x / 51 + 0.5 | 0) }
function hex2rgb(hex){
  hex = '0x' + hex.slice(1).replace(hex.length > 4 ? hex : /./g,'$&$&') | 0;
  return [hex >> 16, hex >> 8 & 255,  hex & 255];
}


function RGB(d){
  if (typeof d === 'string' && d[0] === '#') {
    d = hex2rgb(d);
  } else if (!Array.isArray(d)) {
    d = [].slice.call(arguments, 0, 3);
  }
  d[0] = ROUND(d[0]);
  d[1] = ROUND(d[1]);
  d[2] = ROUND(d[2]);
  Object.defineProperty(this, 'data', { value: new Uint8Array(d) });
}

RGB.prototype = {
  type: 'rgb',
  toHSL: function toHSL(){
    var r=this.data[0]/255, g=this.data[1]/255, b=this.data[2]/255;
    if (r === g === b) return new HSL([0, 0, FIX(r)]);
    var max=MAX(r,g,b), min=MIN(r,g,b), diff=max-min;
    var h = r == max ? (g-b)/diff+(g<b?6:0) : g == max ? (b-r)/diff+2 : (r-g)/diff+4;
    var l = (max+min)/2;
    var s = diff/(l>.5 ? 2-max-min : max+min);
    return new HSL([h*60+.5|0, s, l]);
  },
  toAnsi: function toAnsi(){
    return T51(this.data[0]) * 36 + T51(this.data[1]) * 6 + T51(this.data[2]) + 16;
  },
  toHex: function toHex(){
    return '#' + ((256 + this.data[0] << 8 | this.data[1]) << 8 | this.data[2]).toString(16).slice(1);
  },
  toXYZ: function toXYZ(){
    function d(s){ return (s/=255) < 0.04046 ? s / 12.92 : Math.pow((s+0.055)/1.055, 2.4) }
    var a=d(this[0]), b=d(this[1]), c=d(this[2]);
    return [0.4124*a+0.3576*b+0.1805*c, 0.2126*a+0.7152*b+0.0722*c, 0.0193*a+0.1192*b+0.9505*c].map(F100);
  },
  inspect: function inspect(){
    return this.escape('[ R: '+this.data[0]+' G: '+this.data[1]+' B: '+this.data[2]+' ]');
  }
};

function HSL(d){
  d = Array.isArray(d) ? d : [].slice.call(arguments, 0, 3);
  d[0] = ROUND(d[0]);
  d[1] = d[1] > 1 ? ROUND(d[1]) : T100(d[1]);
  d[2] = d[2] > 1 ? ROUND(d[2]) : T100(d[2]);
  Object.defineProperty(this, 'data', { value: new Uint8Array(d) });
}

HSL.prototype = {
  type: 'hsl',
  toRGB: function toRGB(){
    var a = this.data[0]/60, b=F100(this.data[1]), c=F100(this.data[2]);
    b=[c+=b*=c<.5 ? c : 1-c, c-a%1*b*2, c-=b*=2, c, c+a%1*b, c+b];
    return new RGB([T255(b[~~a%6]), T255(b[(a|16)%6]), T255(b[(a|8)%6])]);
  },
  toAnsi: function toAnsi(){
    return this.toRGB().toAnsi();
  },
  toHex: function toHex(){
    return this.toRGB().toHex();
  },
  toXYZ: function toXYZ(){
    return this.toRGB().toXYZ();
  },
  inspect: function inspect(){
    return this.escape('[ H: '+this.data[0]+' S: '+this.data[1]+'% L: '+this.data[2]+'% ]');
  },
};

DataColor(RGB);
DataColor(HSL);


// #############
// ### Color ###
// #############

function Color(code){
  if (!isFinite(code)) {
    if (!code.toAnsi) return rainbow(code);
    code = code.toAnsi();
  }
  function Ansi(str){
    if (this instanceof Ansi) {
      var child = function AnsiChild(str){
        return AnsiChild.escape(str);
      };
      child.__proto__ = Ansi;
      child.code = code;
      return child;
    }
    return Ansi.escape(str);
  }
  Ansi.__proto__ = Color.prototype;
  Ansi.code = code;
  Ansi.cname = names[code];
  return Ansi;
}


var sets = function(sets){
  sets.rgb = [
    [   0,   0,   0 ], [ 205, 0,   0 ], [ 0, 205,   0 ], [ 205, 205,   0 ],
    [   0,   0, 238 ], [ 205, 0, 205 ], [ 0, 205, 205 ], [ 229, 229, 229 ],
    [ 127, 127, 127 ], [ 255, 0,   0 ], [ 0, 255,   0 ], [ 255, 255,   0 ],
    [  92,  92, 255 ], [ 255, 0, 255 ], [ 0, 255, 255 ], [ 255, 255, 255 ],
  ];

  var r = [ 0, 95, 135, 175, 215, 255 ];

  for (var i=0; i < 217; i++) {
    sets.rgb.push([r[(i / 36 % 6) | 0], r[(i / 6 % 6) | 0], r[i % 6]]);
  }

  for (i=0; i < 22; i++){
    r = 8 + i * 10;
    sets.rgb.push([r, r, r]);
  }

  function distance(a,b){
    return sqr(a[0]-b[0]) + sqr(a[1]-b[1]) + sqr(a[2]-b[2]);
  }

  sets.hsl = [];
  sets.xyz = [];

  sets.rgb.map(function(c,i){
    sets.rgb[i] = new RGB(c);
    sets.hsl[i] = sets.rgb[i].toHSL();
    sets.xyz[i] = sets.rgb[i].toXYZ();
  });

  sets.basic = sets.rgb.slice(0,16);

  sets.closest = function(val, set){
    set = set || 'hsl';
    return sets[set].reduce(function(n,v,i){
      var d = distance(val, v);
      return d < n[0] ? [d, v, i] : n;
    }, [Infinity]);
  }

  sets.distances = function(val, set){
    set = set || 'hsl';
    val = val[set]();
    return sets[set].slice(16).map(function(c){
      return [c, distance(c, val)];
    }).sort(function(a,b){
      return a[1]-b[1];
    });
  }
  return sets;
}({});

var cache = [];



Color.prototype = {
  constructor: Color,
  mode: 256,
  ansi: function ansi(){
    return this;
  },
  rgb: function rgb(){
    return sets.rgb[this.code];
  },
  hsl: function hsl(){
    return sets.hsl[this.code];
  },
  xyz: function xyz(){
    return sets.xyz[this.code];
  },
  hex: function hex(){
    return sets.rgb[this.code].toHex();
  },
  basic: function basic(bg){
    if (this.code in cache) return cache[this.code];
    var result = sets.closest(sets.rgb[this.code], 'basic')[2];
    return cache[this.code] = result + (result > 7 ? 82 : 30) + (bg ? 10 : 0);
  },
  closest: function closest(n, t){
    var maps = sets.distances(this).slice(0, isFinite(n) ? n : 239);
    return new ColorSet(maps.map(rainbow));
  },
  gradient: function gradient(c, n){
    var a = this.hsl();
    if (typeof c === 'string') c = rainbow(c);
    n = (+n || 10)+1;
    c = c.hsl();
    var diff = [ (a[0]-c[0]) / n, (a[1]-c[1]) / n, (a[2]-c[2]) / n ];
    var out = [this];
    while (--n) {
      out[n] = rainbow('hsl', a[0]-diff[0]*n, a[1]-diff[1]*n, a[2]-diff[2]*n);
    }
    return new ColorSet(out);
  },
  escape16: function escape16(text){
    var start = [];
    var end = [];
    var type = this.foreground ? '4' : '3';
    start.push(this.basic());
    end.push(type+'9');
    if (type !== '4' && this.background) {
      start.push(this.background.basic());
      end.push('49');
    }
    if (type !== '3' && this.foreground) {
      start.push(this.foreground.basic());
      end.push('39');
    }
    return esc(start) + space(this.padding) + text + space(this.padding) + esc(end);
  },
  escape: function escape(text){
    var start = [];
    var end = [];
    var type = this.foreground ? '4' : '3';
    start.push(type+'8;5;'+this.code);
    end.push(type+'9');
    if (type !== '4' && this.background) {
      start.push('48;5;'+this.background.code);
      end.push('49');
    }
    if (type !== '3' && this.foreground) {
      start.push('38;5;'+this.foreground.code);
      end.push('39');
    }
    if (this.bolded)    start.push('1'), end.push('22');
    if (this.italic)    start.push('3'), end.push('23');
    if (this.underline) start.push('4'), end.push('24');
    if (this.inverse)   start.push('7'), end.push('27');
    return esc(start) + space(this.padding) + text + space(this.padding) + esc(end);
  },
  style: function style(styles){
    var out = Object.create(this);
    styles.forEach(function(style){
      out[style] = true;
    });
  },
  child: function child(){
    function AnsiChild(str){ return AnsiChild.escape(str) }
    AnsiChild.__proto__ = this;
    return AnsiChild;
  },
  fg: function foreground(v){ this.foreground = (v instanceof Color ? v : rainbow(v)); return this },
  bg: function background(v){ this.background = (v instanceof Color ? v : rainbow(v)); return this },
  ital: function italic(v){ def(this, 'italic', v || !this.italic); return this },
  inv: function inverse(v){ def(this, 'inverse', v || !this.inverse); return this },
  bold: function bolded(v){ def(this, 'bolded', v || !this.bolded); return this },
  under: function underline(v){ def(this, 'underline',  v || !this.underline); return this },
  pad: function padding(pad){ this.padding = pad != null ? pad : (num(this.padding)+1)%4; return this; },
  inspect: function inspect(){ return this.toString() },
  toString: function toString(){ return this.escape(('   '+this.code).slice(-3)) },
};


Color.prototype.setMode = function(C){
  function none(s){ return s }
  var modes = {
    0: none,
    none: none,
    off : none,
    16: C.escape16,
    win32: C.escape16,
    xterm: C.escape16,
    256: C.escape,
    xterm256: C.escape,
    normal: C.escape,
    linux: C.escape,
    darwin: C.escape,
  };
  return function setMode(mode){
    if (mode in modes) {
      this.escape = modes[mode];
    } else {
      throw new Error('Unknown mode "'+mode+'"');
    }
  }
}(Color.prototype);

function def(o,n,v){ Object.defineProperty(o,n, { configurable: true, writable: true, value: v })  }
function esc(a){ return String.fromCharCode(27)+'['+ a.join(';')+'m' }
function space(n){ return n > 0 ? Array(n+1).join(' ') : '' }
function between(min,max,n){ return n >= min && n <= max }
function inRGB(n){ return between(0,255,n) }
function sqr(n){ return n*n }
function isPercent(n){ return n >= 0 && n <= 0 }
function isDecimal(n){ return n | 0 !== n}
function num(o){ return +o || 0 }




function Colors(colorset){
  function Colorer(colorset){
    if (this instanceof Colorer) {
      var child = function ColorerChild(vector){
        return ColorerChild.escape(vector);
      };
      child.__proto__ = Colorer;
      return child;
    } else {
      return Colorer.escape(colorset);
    }
  }
  Colorer.__proto__ = Colors.prototype;
  return Colorer;
}



Colors.prototype = {

};

