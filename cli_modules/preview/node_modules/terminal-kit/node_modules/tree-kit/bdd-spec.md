# TOC
   - [clone()](#clone)
   - [Diff](#diff)
   - [extend()](#extend)
   - [defineLazyProperty()](#definelazyproperty)
   - [Masks](#masks)
   - [Inverse masks](#inverse-masks)
   - [Tree's path on objects](#trees-path-on-objects)
   - [Tree's path on arrays](#trees-path-on-arrays)
   - [Inheritance, using Object.create( tree.path.prototype )](#inheritance-using-objectcreate-treepathprototype-)
   - [Tree's array path on objects](#trees-array-path-on-objects)
<a name=""></a>
 
<a name="clone"></a>
# clone()
basic incomplete test.

```js
var proto = {
	proto1: 'proto1' ,
	proto2: 'proto2' ,
	hello: function() { console.log( "Hello!" ) ; }
} ;

var o = Object.create( proto ) ;

o.own1 = 'own1' ;
o.own2 = 'own2' ;
o.nested = { a: 1 , b: 2 } ;

var getter = function() { return 5 ; } ;
var setter = function( value ) {} ;

Object.defineProperties( o , {
	nonEnum1: { value: 'nonEnum1' } ,
	nonEnum2: { value: 'nonEnum2' , writable: true } ,
	nonEnum3: { value: 'nonEnum3' , configurable: true } ,
	nonEnumNested: { value: { c: 3 , d: 4 } } ,
	getter: { get: getter } ,
	getterAndSetter: { get: getter , set: setter }
} ) ;

var i , r ;


// Basic tests with and without circular checks
for ( i = 0 ; i <= 1 ; i ++ )
{
	if ( i === 0 ) { r = tree.clone( o ) ;}
	else { r = tree.clone( o , true ) ; }
	
	expect( Object.getOwnPropertyNames( r ) ).to.eql( [ 'own1' , 'own2' , 'nested' , 'nonEnum1' , 'nonEnum2' , 'nonEnum3' , 'nonEnumNested' , 'getter' , 'getterAndSetter' ] ) ;
	expect( Object.getOwnPropertyDescriptor( r , 'own1' ) ).to.eql( { value: 'own1' , enumerable: true , writable: true , configurable: true } ) ;
	expect( Object.getOwnPropertyDescriptor( r , 'own2' ) ).to.eql( { value: 'own2' , enumerable: true , writable: true , configurable: true } ) ;
	expect( r.nested ).not.to.be( o.nested ) ;
	expect( r.nested ).to.eql( o.nested ) ;
	expect( Object.getOwnPropertyDescriptor( r , 'nested' ) ).to.eql( { value: o.nested , enumerable: true , writable: true , configurable: true } ) ;
	expect( Object.getOwnPropertyDescriptor( r , 'nonEnum1' ) ).to.eql( { value: 'nonEnum1' , enumerable: false , writable: false , configurable: false } ) ;
	expect( Object.getOwnPropertyDescriptor( r , 'nonEnum2' ) ).to.eql( { value: 'nonEnum2' , enumerable: false , writable: true , configurable: false } ) ;
	expect( Object.getOwnPropertyDescriptor( r , 'nonEnum3' ) ).to.eql( { value: 'nonEnum3' , enumerable: false , writable: false , configurable: true } ) ;
	expect( r.nonEnumNested ).not.to.be( o.nonEnumNested ) ;
	expect( r.nonEnumNested ).to.eql( o.nonEnumNested ) ;
	expect( Object.getOwnPropertyDescriptor( r , 'nonEnumNested' ) ).to.eql( { value: o.nonEnumNested , enumerable: false , writable: false , configurable: false } ) ;
	expect( Object.getOwnPropertyDescriptor( r , 'getter' ) ).to.eql( { get: getter , set: undefined , enumerable: false , configurable: false } ) ;
	expect( Object.getOwnPropertyDescriptor( r , 'getterAndSetter' ) ).to.eql( { get: getter , set: setter , enumerable: false , configurable: false } ) ;
	
	expect( r.__proto__ ).to.equal( proto ) ;	// jshint ignore:line
	expect( r.proto1 ).to.be( 'proto1' ) ;
	expect( r.proto2 ).to.be( 'proto2' ) ;
	expect( typeof r.hello ).to.equal( 'function' ) ;
}
```

circular references test.

```js
var c , o = {
	a: 'a',
	sub: {
		b: 'b'
	},
	sub2: {
		c: 'c'
	}
} ;

o.loop = o ;
o.sub.loop = o ;
o.subcopy = o.sub ;
o.sub.link = o.sub2 ;
o.sub2.link = o.sub ;


c = tree.clone( o , true ) ;

expect( c.loop ).to.be( c ) ;
expect( c.sub ).to.be( c.subcopy ) ;
expect( c.sub.loop ).to.be( c ) ;
expect( c.subcopy.loop ).to.be( c ) ;
expect( c.sub.link ).to.be( c.sub2 ) ;
expect( c.sub2.link ).to.be( c.sub ) ;
```

<a name="diff"></a>
# Diff
should return an array of differences for two objects without nested object.

```js
var a = {
	a: 'a',
	b: 2,
	c: 'three'
} ;

var b = {
	b: 2,
	c: 3,
	d: 'dee'
} ;

var diff = tree.diff( a , b ) ;

//console.log( diff ) ;
expect( diff ).not.to.be( null ) ;
expect( diff ).to.only.have.keys( '.a', '.c', '.d' ) ;
```

should return an array of differences for two objects with nested objects.

```js
var a = {
	a: 'a',
	b: 2,
	c: 'three',
	sub: {
		e: 5,
		f: 'six',
		subsub: {
			g: 'gee',
			h: 'h'
		}
	},
	suba: {
		j: 'djay'
	}
} ;

var b = {
	b: 2,
	c: 3,
	d: 'dee',
	sub: {
		e: 5,
		f: 6,
		subsub: {
			g: 'gee',
			i: 'I'
		}
	},
	subb: {
		k: 'k'
	}
} ;

var diff = tree.diff( a , b ) ;

//console.log( diff ) ;
expect( diff ).not.to.be( null ) ;
expect( diff ).to.only.have.keys( '.a', '.c', '.d', '.sub.f', '.sub.subsub.h', '.sub.subsub.i', '.suba', '.subb' ) ;
```

<a name="extend"></a>
# extend()
should extend correctly an empty Object with a flat Object without depth (with or without the 'deep' option).

```js
var copy ;

var expected = {
	d : 4 ,
	e : undefined ,
	f : 3.14 ,
	g : 6 ,
	h : [] ,
	i : 'iii'
} ;

copy = tree.extend( { deep: true } , {} , input.subtree.subtree ) ;
expect( tree.extend( null , copy , input.subtree.subtree2 ) ).to.eql( expected ) ;

copy = tree.extend( { deep: true } , {} , input.subtree.subtree ) ;
expect( tree.extend( { deep: true } , copy , input.subtree.subtree2 ) ).to.eql( expected ) ;
```

should extend an empty Object with a deep Object performing a SHALLOW copy, the result should be equal to the deep Object, nested object MUST be equal AND identical.

```js
var copy = tree.extend( null , {} , input.subtree ) ;
expect( copy ).to.eql( input.subtree ) ;
expect( copy ).not.to.equal( input.subtree ) ;
expect( copy.subtree2 ).to.equal( input.subtree.subtree2 ) ;
```

with the 'deep' option should extend an empty Object with a deep Object performing a DEEP copy, the result should be equal to the deep Object, nested object MUST be equal BUT NOT identical.

```js
var copy = tree.extend( { deep: true } , {} , input.subtree ) ;
expect( copy ).to.eql( input.subtree ) ;
expect( copy ).not.to.equal( input.subtree ) ;
expect( copy.subtree2 ).not.to.equal( input.subtree.subtree2 ) ;
```

with the 'deep' option, sources functions are still simply copied/referenced into target.

```js
var copy = tree.extend( { deep: true } , {} , input.subtreeWithFunction ) ;
//console.log( copy ) ;
expect( copy ).to.eql( input.subtreeWithFunction ) ;
expect( copy ).not.to.equal( input.subtreeWithFunction ) ;
expect( copy.Func.prototype ).to.equal( input.subtreeWithFunction.Func.prototype ) ;
```

with the 'deep' & 'deepFunc' options, sources functions are treated like regular objects, creating an object rather than a function in the target location, and performing a deep copy of them.

```js
var copy = tree.extend( { deep: true, deepFunc: true } , {} , input.subtreeWithFunction ) ;
expect( copy ).not.to.eql( input.subtreeWithFunction ) ;
expect( copy ).to.eql( { z: 'Zee' , Func: { prop: 'property' } } ) ;
```

should extend (by default) properties of the prototype chain.

```js
var proto = {
	proto1: 'proto1' ,
	proto2: 'proto2' ,
} ;

var o = Object.create( proto ) ;

o.own1 = 'own1' ;
o.own2 = 'own2' ;

expect( tree.extend( null , {} , o ) ).to.eql( {
	proto1: 'proto1' ,
	proto2: 'proto2' ,
	own1: 'own1' ,
	own2: 'own2'
} ) ;

expect( tree.extend( { deep: true } , {} , o ) ).to.eql( {
	proto1: 'proto1' ,
	proto2: 'proto2' ,
	own1: 'own1' ,
	own2: 'own2'
} ) ;
```

with the 'own' option, it should ONLY extend OWNED properties, non-enumerable properties and properties of the prototype chain are SKIPPED.

```js
var proto = {
	proto1: 'proto1' ,
	proto2: 'proto2' ,
} ;

var o = Object.create( proto ) ;

o.own1 = 'own1' ;
o.own2 = 'own2' ;

Object.defineProperties( o , {
	nonEnum1: { value: 'nonEnum1' } ,
	nonEnum2: { value: 'nonEnum2' }
} ) ;

expect( tree.extend( { own: true } , {} , o ) ).to.eql( {
	own1: 'own1' ,
	own2: 'own2'
} ) ;

expect( tree.extend( { deep: true, own: true } , {} , o ) ).to.eql( {
	own1: 'own1' ,
	own2: 'own2'
} ) ;
```

with the 'own' & 'nonEnum' option, it should ONLY extend OWNED properties, enumerable or not, but properties of the prototype chain are SKIPPED.

```js
var proto = {
	proto1: 'proto1' ,
	proto2: 'proto2' ,
} ;

var o = Object.create( proto ) ;

o.own1 = 'own1' ;
o.own2 = 'own2' ;

Object.defineProperties( o , {
	nonEnum1: { value: 'nonEnum1' } ,
	nonEnum2: { value: 'nonEnum2' }
} ) ;

expect( tree.extend( { own: true , nonEnum: true } , {} , o ) ).to.eql( {
	own1: 'own1' ,
	own2: 'own2' ,
	nonEnum1: 'nonEnum1' ,
	nonEnum2: 'nonEnum2'
} ) ;

expect( tree.extend( { deep: true, own: true , nonEnum: true } , {} , o ) ).to.eql( {
	own1: 'own1' ,
	own2: 'own2' ,
	nonEnum1: 'nonEnum1' ,
	nonEnum2: 'nonEnum2'
} ) ;
```

with the 'descriptor' option, it should preserve descriptor as well.

```js
var r ;

var proto = {
	proto1: 'proto1' ,
	proto2: 'proto2' ,
} ;

var o = Object.create( proto ) ;

o.own1 = 'own1' ;
o.own2 = 'own2' ;
o.nested = { a: 1 , b: 2 } ;

var getter = function() { return 5 ; } ;
var setter = function( value ) {} ;

Object.defineProperties( o , {
	nonEnum1: { value: 'nonEnum1' } ,
	nonEnum2: { value: 'nonEnum2' , writable: true } ,
	nonEnum3: { value: 'nonEnum3' , configurable: true } ,
	nonEnumNested: { value: { c: 3 , d: 4 } } ,
	getter: { get: getter } ,
	getterAndSetter: { get: getter , set: setter }
} ) ;

r = tree.extend( { own: true , nonEnum: true , descriptor: true } , {} , o ) ;

expect( Object.getOwnPropertyNames( r ) ).to.eql( [ 'own1' , 'own2' , 'nested' , 'nonEnum1' , 'nonEnum2' , 'nonEnum3' , 'nonEnumNested' , 'getter' , 'getterAndSetter' ] ) ;
expect( Object.getOwnPropertyDescriptor( r , 'own1' ) ).to.eql( { value: 'own1' , enumerable: true , writable: true , configurable: true } ) ;
expect( Object.getOwnPropertyDescriptor( r , 'own2' ) ).to.eql( { value: 'own2' , enumerable: true , writable: true , configurable: true } ) ;
expect( r.nested ).to.be( o.nested ) ;
expect( Object.getOwnPropertyDescriptor( r , 'nested' ) ).to.eql( { value: o.nested , enumerable: true , writable: true , configurable: true } ) ;
expect( Object.getOwnPropertyDescriptor( r , 'nonEnum1' ) ).to.eql( { value: 'nonEnum1' , enumerable: false , writable: false , configurable: false } ) ;
expect( Object.getOwnPropertyDescriptor( r , 'nonEnum2' ) ).to.eql( { value: 'nonEnum2' , enumerable: false , writable: true , configurable: false } ) ;
expect( Object.getOwnPropertyDescriptor( r , 'nonEnum3' ) ).to.eql( { value: 'nonEnum3' , enumerable: false , writable: false , configurable: true } ) ;
expect( r.nonEnumNested ).to.be( o.nonEnumNested ) ;
expect( Object.getOwnPropertyDescriptor( r , 'nonEnumNested' ) ).to.eql( { value: o.nonEnumNested , enumerable: false , writable: false , configurable: false } ) ;
expect( Object.getOwnPropertyDescriptor( r , 'getter' ) ).to.eql( { get: getter , set: undefined , enumerable: false , configurable: false } ) ;
expect( Object.getOwnPropertyDescriptor( r , 'getterAndSetter' ) ).to.eql( { get: getter , set: setter , enumerable: false , configurable: false } ) ;

r = tree.extend( { deep: true , own: true , nonEnum: true , descriptor: true } , {} , o ) ;

expect( Object.getOwnPropertyNames( r ) ).to.eql( [ 'own1' , 'own2' , 'nested' , 'nonEnum1' , 'nonEnum2' , 'nonEnum3' , 'nonEnumNested' , 'getter' , 'getterAndSetter' ] ) ;
expect( Object.getOwnPropertyDescriptor( r , 'own1' ) ).to.eql( { value: 'own1' , enumerable: true , writable: true , configurable: true } ) ;
expect( Object.getOwnPropertyDescriptor( r , 'own2' ) ).to.eql( { value: 'own2' , enumerable: true , writable: true , configurable: true } ) ;
expect( r.nested ).not.to.be( o.nested ) ;
expect( r.nested ).to.eql( o.nested ) ;
expect( Object.getOwnPropertyDescriptor( r , 'nested' ) ).to.eql( { value: o.nested , enumerable: true , writable: true , configurable: true } ) ;
expect( Object.getOwnPropertyDescriptor( r , 'nonEnum1' ) ).to.eql( { value: 'nonEnum1' , enumerable: false , writable: false , configurable: false } ) ;
expect( Object.getOwnPropertyDescriptor( r , 'nonEnum2' ) ).to.eql( { value: 'nonEnum2' , enumerable: false , writable: true , configurable: false } ) ;
expect( Object.getOwnPropertyDescriptor( r , 'nonEnum3' ) ).to.eql( { value: 'nonEnum3' , enumerable: false , writable: false , configurable: true } ) ;
expect( r.nonEnumNested ).not.to.be( o.nonEnumNested ) ;
expect( r.nonEnumNested ).to.eql( o.nonEnumNested ) ;
expect( Object.getOwnPropertyDescriptor( r , 'nonEnumNested' ) ).to.eql( { value: o.nonEnumNested , enumerable: false , writable: false , configurable: false } ) ;
expect( Object.getOwnPropertyDescriptor( r , 'getter' ) ).to.eql( { get: getter , set: undefined , enumerable: false , configurable: false } ) ;
expect( Object.getOwnPropertyDescriptor( r , 'getterAndSetter' ) ).to.eql( { get: getter , set: setter , enumerable: false , configurable: false } ) ;
```

with the 'deep' option should extend a deep Object into another deep Object correctly.

```js
var copy ;

copy = tree.extend( { deep: true } , {} , input.subtree ) ;
expect( tree.extend( null , copy , input.anotherSubtree ) ).to.eql( {
	a : 'A' ,
	b : 2 ,
	subtree: {
		l : '1one' ,
		m : false ,
		n : 'nay'
	} ,
	c : 'plusplus' ,
	subtree2: {
		p : true ,
		q : [4,5,6] ,
		r : '2'
	} ,
	j : 'Djay' ,
	k : 'ok' ,
	o : 'mg'
} ) ;

copy = tree.extend( { deep: true } , {} , input.subtree ) ;
expect( tree.extend( { deep: true } , copy , input.anotherSubtree ) ).to.eql( {
	a : 'A' ,
	b : 2 ,
	subtree: {
		d : 4 ,
		e : undefined ,
		f : 3.14 ,
		l : '1one' ,
		m : false ,
		n : 'nay'
	} ,
	c : 'plusplus' ,
	subtree2: {
		g : 6 ,
		h : [] ,
		i : 'iii',
		p : true ,
		q : [4,5,6] ,
		r : '2'
	} ,
	j : 'Djay' ,
	k : 'ok' ,
	o : 'mg'
} ) ;
```

with the 'proto' option and a null (or falsy) target, it should create and return a new Object with the prototype of the source Object.

```js
var e , o , proto ;

proto = {
	proto1: 'proto1' ,
	proto2: 'proto2' ,
	hello: function() { console.log( "Hello!" ) ; }
} ;

o = Object.create( proto ) ;
o.own1 = 'own1' ;
o.own2 = 'own2' ;

e = tree.extend( { proto: true } , null , o ) ;

expect( e ).not.to.be( o ) ;
expect( e.__proto__ ).to.equal( proto ) ;	// jshint ignore:line
expect( e ).to.eql( { own1: 'own1' , own2: 'own2' } ) ;
expect( e.proto1 ).to.be( 'proto1' ) ;
expect( e.proto2 ).to.be( 'proto2' ) ;
expect( typeof e.hello ).to.equal( 'function' ) ;
```

with the 'proto' option should change the prototype of each target properties for the prototype of the related source properties, if 'deep' is enabled it does so recursively.

```js
var e , o , proto1 , proto2 ;

proto1 = {
	proto1: 'proto1' ,
	hello: function() { console.log( "Hello!" ) ; }
} ;

proto2 = {
	proto2: 'proto2' ,
	world: function() { console.log( "World!" ) ; }
} ;

o = {
	own1: 'own1' ,
	own2: 'own2' ,
	embed1: Object.create( proto1 , { a: { value: 'a' , enumerable: true } } ) ,
	embed2: Object.create( proto2 , { b: { value: 'b' , enumerable: true } } )
} ;

e = tree.extend( { proto: true } , {} , o ) ;

expect( e ).not.to.be( o ) ;
expect( e ).to.eql( {
	own1: 'own1' ,
	own2: 'own2' ,
	embed1: { a: 'a' } ,
	embed2: { b: 'b' }
} ) ;
expect( e.embed1 ).to.be( o.embed1 ) ;
expect( e.embed2 ).to.be( o.embed2 ) ;
expect( e.embed1.proto1 ).to.be( 'proto1' ) ;
expect( e.embed2.proto2 ).to.be( 'proto2' ) ;
expect( typeof e.embed1.hello ).to.equal( 'function' ) ;
expect( typeof e.embed2.world ).to.equal( 'function' ) ;


e = tree.extend( { proto: true, deep: true } , {} , o ) ;

expect( e ).not.to.be( o ) ;
expect( e ).to.eql( {
	own1: 'own1' ,
	own2: 'own2' ,
	embed1: { a: 'a' } ,
	embed2: { b: 'b' }
} ) ;
expect( e.embed1 ).not.to.be( o.embed1 ) ;
expect( e.embed2 ).not.to.be( o.embed2 ) ;
expect( e.embed1.proto1 ).to.be( 'proto1' ) ;
expect( e.embed2.proto2 ).to.be( 'proto2' ) ;
expect( typeof e.embed1.hello ).to.equal( 'function' ) ;
expect( typeof e.embed2.world ).to.equal( 'function' ) ;
```

with 'nofunc' option should skip function.

```js
var e , o , proto ;

proto = {
	proto1: 'proto1' ,
	proto2: 'proto2' ,
	hello: function() { console.log( "Hello..." ) ; }
} ;

o = Object.create( proto ) ;
o.own1 = 'own1' ;
o.world = function() { console.log( "world!!!" ) ; } ;
o.own2 = 'own2' ;

// default behaviour
e = tree.extend( { nofunc: true } , null , o ) ;
expect( e ).not.to.be( o ) ;
expect( e ).to.eql( { own1: 'own1' , own2: 'own2' , proto1: 'proto1' , proto2: 'proto2' } ) ;

// with 'own'
e = tree.extend( { nofunc: true , own: true } , null , o ) ;
expect( e ).not.to.be( o ) ;
expect( e ).to.eql( { own1: 'own1' , own2: 'own2' } ) ;

// with 'proto', function exists if there are in the prototype
e = tree.extend( { nofunc: true , proto: true } , null , o ) ;
expect( e ).not.to.be( o ) ;
expect( e.__proto__ ).to.equal( proto ) ;	// jshint ignore:line
expect( e ).to.eql( { own1: 'own1' , own2: 'own2' } ) ;
expect( e.proto1 ).to.be( 'proto1' ) ;
expect( e.proto2 ).to.be( 'proto2' ) ;
expect( typeof e.hello ).to.equal( 'function' ) ;
```

with 'preserve' option should not overwrite existing properties in the target.

```js
var e , o ;

e = {
	one: '1' ,
	two: 2 ,
	three: 'THREE'
} ;

o = {
	three: 3 ,
	four: '4'
} ;

tree.extend( { preserve: true } , e , o ) ;
expect( e ).to.eql( { one: '1' , two: 2 , three: 'THREE' , four: '4' } ) ;
expect( o ).to.eql( { three: 3 , four: '4' } ) ;
```

with 'move' option should move source properties to target properties, i.e. delete them form the source.

```js
var e , o ;

e = {
	one: '1' ,
	two: 2 ,
	three: 'THREE'
} ;

o = {
	three: 3 ,
	four: '4'
} ;

tree.extend( { move: true } , e , o ) ;
expect( e ).to.eql( { one: '1' , two: 2 , three: 3 , four: '4' } ) ;
expect( o ).to.eql( {} ) ;
```

with 'preserve' and 'move' option should not overwrite existing properties in the target, so it should not move/delete them from the source object.

```js
var e , o ;

e = {
	one: '1' ,
	two: 2 ,
	three: 'THREE'
} ;

o = {
	three: 3 ,
	four: '4'
} ;

tree.extend( { preserve: true , move: true } , e , o ) ;
expect( e ).to.eql( { one: '1' , two: 2 , three: 'THREE' , four: '4' } ) ;
expect( o ).to.eql( { three: 3 } ) ;
```

with 'inherit' option should inherit rather than extend: each source property create a new Object or mutate existing Object into the related target property, using itself as the prototype.

```js
var e , o ;

o = {
	three: 3 ,
	four: '4' ,
	subtree: {
		five: 'FIVE' ,
		six: 6
	}
} ;

e = {} ;

tree.extend( { inherit: true } , e , o ) ;

expect( e.__proto__ ).to.equal( o ) ;	// jshint ignore:line
expect( e ).to.eql( {} ) ;
expect( e.three ).to.be( 3 ) ;
expect( e.four ).to.be( '4' ) ;
expect( e.subtree ).to.equal( o.subtree ) ;


e = {
	one: '1' ,
	two: 2 ,
	three: 'THREE' ,
} ;

tree.extend( { inherit: true } , e , o ) ;

expect( e.__proto__ ).to.equal( o ) ;	// jshint ignore:line
expect( e ).to.eql( { one: '1' , two: 2 , three: 'THREE' } ) ;
expect( e.three ).to.be( 'THREE' ) ;
expect( e.four ).to.be( '4' ) ;
expect( e.subtree ).to.equal( o.subtree ) ;	// jshint ignore:line
expect( e.subtree ).to.eql( { five: 'FIVE' , six: 6 } ) ;


e = {
	one: '1' ,
	two: 2 ,
	three: 'THREE' ,
	subtree: {
		six: 'SIX' ,
		seven: 7
	}
} ;

tree.extend( { inherit: true } , e , o ) ;

expect( e.__proto__ ).to.equal( o ) ;	// jshint ignore:line
expect( e ).to.eql( { one: '1' , two: 2 , three: 'THREE' , subtree: { six: 'SIX' , seven: 7 } } ) ;
expect( e.three ).to.be( 'THREE' ) ;
expect( e.four ).to.be( '4' ) ;
expect( e.subtree ).to.eql( { six: 'SIX' , seven: 7 } ) ;
expect( e.subtree.five ).to.equal( undefined ) ;
```

with 'inherit' and 'deep' option should inherit recursively.

```js
var e , o ;

o = {
	three: 3 ,
	four: '4' ,
	subtree: {
		five: 'FIVE' ,
		six: 6
	}
} ;

e = {} ;

tree.extend( { inherit: true , deep: true } , e , o ) ;

expect( e.__proto__ ).to.equal( o ) ;	// jshint ignore:line
expect( e ).to.eql( { subtree: {} } ) ;
expect( e.three ).to.be( 3 ) ;
expect( e.four ).to.be( '4' ) ;
expect( e.subtree.__proto__ ).to.equal( o.subtree ) ;	// jshint ignore:line
expect( e.subtree.five ).to.equal( 'FIVE' ) ;
expect( e.subtree.six ).to.equal( 6 ) ;


e = {
	one: '1' ,
	two: 2 ,
	three: 'THREE' ,
} ;

tree.extend( { inherit: true , deep: true } , e , o ) ;

expect( e.__proto__ ).to.equal( o ) ;	// jshint ignore:line
expect( e ).to.eql( { one: '1' , two: 2 , three: 'THREE' , subtree: {} } ) ;
expect( e.three ).to.be( 'THREE' ) ;
expect( e.four ).to.be( '4' ) ;
expect( e.subtree.__proto__ ).to.equal( o.subtree ) ;	// jshint ignore:line
expect( e.subtree ).to.eql( {} ) ;
expect( e.subtree.five ).to.equal( 'FIVE' ) ;
expect( e.subtree.six ).to.equal( 6 ) ;


e = {
	one: '1' ,
	two: 2 ,
	three: 'THREE' ,
	subtree: {
		six: 'SIX' ,
		seven: 7
	}
} ;

tree.extend( { inherit: true , deep: true } , e , o ) ;

expect( e.__proto__ ).to.equal( o ) ;	// jshint ignore:line
expect( e ).to.eql( { one: '1' , two: 2 , three: 'THREE' , subtree: { six: 'SIX' , seven: 7 } } ) ;
expect( e.three ).to.be( 'THREE' ) ;
expect( e.four ).to.be( '4' ) ;
expect( e.subtree.__proto__ ).to.equal( o.subtree ) ;	// jshint ignore:line
expect( e.subtree ).to.eql( { six: 'SIX' , seven: 7 } ) ;
expect( e.subtree.five ).to.equal( 'FIVE' ) ;
```

with 'flat' option.

```js
var e , o ;

o = {
	three: 3 ,
	four: '4' ,
	subtree: {
		five: 'FIVE' ,
		six: 6 ,
		subsubtree: {
			subsubsubtree: { one: 'ONE' } ,
			seven: 'seven'
		} ,
		emptysubtree: {}
	} ,
	eight: 8 ,
	anothersubtree: {
		nine: '9'
	}
} ;

e = tree.extend( { flat: true } , {} , o ) ;
expect( e ).to.eql( {
	three: 3 ,
	four: '4' ,
	'subtree.five': 'FIVE' ,
	'subtree.six': 6 ,
	'subtree.subsubtree.seven': 'seven' ,
	'subtree.subsubtree.subsubsubtree.one': 'ONE' ,
	eight: 8 ,
	'anothersubtree.nine': '9'
} ) ;

e = tree.extend( { flat: '/' } , {} , o ) ;
expect( e ).to.eql( {
	three: 3 ,
	four: '4' ,
	'subtree/five': 'FIVE' ,
	'subtree/six': 6 ,
	'subtree/subsubtree/seven': 'seven' ,
	'subtree/subsubtree/subsubsubtree/one': 'ONE' ,
	eight: 8 ,
	'anothersubtree/nine': '9'
} ) ;
```

with 'unflat' option.

```js
var e , o ;

o = {
	three: 3 ,
	four: '4' ,
	'subtree.five': 'FIVE' ,
	'subtree.six': 6 ,
	'subtree.subsubtree.seven': 'seven' ,
	'subtree.subsubtree.subsubsubtree.one': 'ONE' ,
	eight: 8 ,
	'anothersubtree.nine': '9'
} ;

e = tree.extend( { unflat: true } , {} , o ) ;
expect( e ).to.eql( {
	three: 3 ,
	four: '4' ,
	subtree: {
		five: 'FIVE' ,
		six: 6 ,
		subsubtree: {
			subsubsubtree: { one: 'ONE' } ,
			seven: 'seven'
		}
	} ,
	eight: 8 ,
	anothersubtree: {
		nine: '9'
	}
} ) ;

o = {
	three: 3 ,
	four: '4' ,
	'subtree/five': 'FIVE' ,
	'subtree/six': 6 ,
	'subtree/subsubtree/seven': 'seven' ,
	'subtree/subsubtree/subsubsubtree/one': 'ONE' ,
	eight: 8 ,
	'anothersubtree/nine': '9'
} ;

e = tree.extend( { unflat: '/' } , {} , o ) ;
expect( e ).to.eql( {
	three: 3 ,
	four: '4' ,
	subtree: {
		five: 'FIVE' ,
		six: 6 ,
		subsubtree: {
			subsubsubtree: { one: 'ONE' } ,
			seven: 'seven'
		}
	} ,
	eight: 8 ,
	anothersubtree: {
		nine: '9'
	}
} ) ;
```

with 'deepFilter' option, using blacklist.

```js
var buf = new Buffer( "My buffer" ) ;

var o = {
	one: '1' ,
	buf: buf ,
	subtree: {
		two: 2 ,
		three: 'THREE'
	}
} ;

var e = tree.extend( { deep: true, deepFilter: { blacklist: [ Buffer.prototype ] } } , {} , o ) ;

o.subtree.three = 3 ;
buf[ 0 ] = 'm'.charCodeAt() ;

expect( e.buf ).to.be.a( Buffer ) ;
expect( e.buf.toString() ).to.be( "my buffer" ) ;
expect( e.buf ).to.be( buf ) ;

expect( e ).to.eql( {
	one: '1' ,
	buf: buf ,
	subtree: {
		two: 2 ,
		three: 'THREE'
	}
} ) ;
```

with 'deepFilter' option, using whitelist.

```js
var buf = new Buffer( "My buffer" ) ;

var o = {
	one: '1' ,
	buf: buf ,
	subtree: {
		two: 2 ,
		three: 'THREE'
	}
} ;

var e = tree.extend( { deep: true, deepFilter: { whitelist: [ Object.prototype ] } } , {} , o ) ;

o.subtree.three = 3 ;
buf[ 0 ] = 'm'.charCodeAt() ;

expect( e.buf ).to.be.a( Buffer ) ;
expect( e.buf.toString() ).to.be( "my buffer" ) ;
expect( e.buf ).to.be( buf ) ;

expect( e ).to.eql( {
	one: '1' ,
	buf: buf ,
	subtree: {
		two: 2 ,
		three: 'THREE'
	}
} ) ;
```

circular references test.

```js
var c , o = {
	a: 'a',
	sub: {
		b: 'b'
	},
	sub2: {
		c: 'c'
	}
} ;

o.loop = o ;
o.sub.loop = o ;
o.subcopy = o.sub ;
o.sub.link = o.sub2 ;
o.sub2.link = o.sub ;


try {
	c = tree.extend( { deep: true } , null , o ) ;
	throw new Error( 'Should throw an error: max depth reached' ) ;
}
catch ( error ) {
}

c = tree.extend( { deep: true , circular: true } , null , o ) ;

expect( c.loop ).to.be( c ) ;
expect( c.sub ).to.be( c.subcopy ) ;
expect( c.sub.loop ).to.be( c ) ;
expect( c.subcopy.loop ).to.be( c ) ;
expect( c.sub.link ).to.be( c.sub2 ) ;
expect( c.sub2.link ).to.be( c.sub ) ;
```

<a name="definelazyproperty"></a>
# defineLazyProperty()
should define property using a getter that after its first execution is reconfigured as its return-value and is not writable.

```js
var object = {} ;
var counter = 0 ;

tree.defineLazyProperty( object , 'myprop' , function() {
	counter ++ ;
	return counter ;
} ) ;

expect( object.myprop ).to.be( 1 ) ;
expect( object.myprop ).to.be( 1 ) ;
expect( object.myprop ).to.be( 1 ) ;
expect( counter ).to.be( 1 ) ;
object.myprop ++ ;
expect( object.myprop ).to.be( 1 ) ;
```

<a name="masks"></a>
# Masks
should apply a simple mask tree to the input tree.

```js
var mask = tree.createMask( {
	int: true,
	float: true,
	attachement: {
		filename: true,
		unexistant: true
	},
	unexistant: true,
	subtree: {
		subtree: true
	}
} ) ;

var output = mask.applyTo( input ) ;

expect( output ).to.eql( {
	int: 12,
	float: 2.47,
	attachement: {
		filename: 'preview.png'
	},
	subtree: {
		subtree: {
			d: 4,
			e: undefined,
			f: 3.14
		}
	}
} ) ;
```

should apply a mask tree with wildcard '*' to the input tree.

```js
var mask = tree.createMask( {
	'files': {
		'*': {
			size: true,
			unexistant: true
		}
	}
} ) ;

var output = mask.applyTo( input ) ;

expect( output.files ).to.be.an( Object ) ;
expect( output ).to.eql( {
	files: {
		'background.png' : {
			size : '97856'
		} ,
		'header.png' : {
			size : '44193'
		} ,
		'footer.png' : {
			size : '36411'
		}
	}
} ) ;
```

should apply a mask tree with wildcard '*' to match array in the input tree.

```js
var mask = tree.createMask( {
	'filesArray': {
		'*': {
			name: true,
			size: true,
			unexistant: true
		}
	}
} ) ;

var output = mask.applyTo( input ) ;

expect( output.filesArray ).to.be.an( Array ) ;
expect( output ).to.eql( {
	filesArray: [
		{
			name : 'background.png' ,
			size : '97856'
		} ,
		{
			name : 'header.png' ,
			size : '44193'
		} ,
		{
			name : 'footer.png' ,
			size : '36411'
		}
	]
} ) ;

//console.log( "\n\n\n\n" , output , "\n\n\n\n" ) ;
```

should apply a mask with a mask's leaf callback to the input tree.

```js
var leaf = function leaf( input , key , argument , path ) {
	//console.log( 'LEAF: ' , input , key , argument , path ) ;
	
	if ( ! input.hasOwnProperty( key ) ) { return new Error( 'not_found' ) ; }
	if ( typeof input[ key ] === 'number' ) { return input[ key ] + argument ; }
	return input[ key ] ;
} ;

var mask = tree.createMask(
	{
		int: 87 ,
		float: 14 ,
		subtree: {
			subtree: {
				f: 0.0016
			}
		} ,
		unexistant: 45
	} ,
	{ leaf: leaf }
) ;

var output = mask.applyTo( input ) ;

expect( output ).to.eql( {
	int: 99,
	float: 16.47,
	subtree: {
		subtree: {
			f: 3.1416
		}
	}
} ) ;
```

should apply a mask containing other masks to the input tree.

```js
var mask = tree.createMask( {
	int: true,
	float: true,
	attachement: tree.createMask( {
		filename: true,
		unexistant: true
	} ),
	unexistant: true,
	subtree: tree.createMask( {
		subtree: true
	} )
} ) ;

var output = mask.applyTo( input ) ;

expect( output ).to.eql( {
	int: 12,
	float: 2.47,
	attachement: {
		filename: 'preview.png'
	},
	subtree: {
		subtree: {
			d: 4,
			e: undefined,
			f: 3.14
		}
	}
} ) ;
```

<a name="inverse-masks"></a>
# Inverse masks
should apply a simple mask tree to the input tree.

```js
var mask = tree.createInverseMask( {
	a: true,
	subtree: {
		d: true
	},
	subtree2: true
} ) ;

var output = mask.applyTo( input.subtree ) ;

//console.log( output ) ;

expect( output ).to.eql( {
	b: 2,
	subtree: {
		e: undefined,
		f: 3.14
	},
	c: 'plusplus'
} ) ;
```

<a name="trees-path-on-objects"></a>
# Tree's path on objects
path.get() on object structure.

```js
var o = {
	a: 5 ,
	sub: {
		b: "toto" ,
		sub: {
			c: true
		}
	} ,
	d: null
} ;

expect( tree.path.get( o , 'a' ) ).to.be( 5 ) ;
expect( tree.path.get( o , 'sub' ) ).to.eql( {
	b: "toto" ,
	sub: {
		c: true
	}
} ) ;
expect( tree.path.get( o , 'sub.b' ) ).to.be( "toto" ) ;
expect( tree.path.get( o , 'sub.sub' ) ).to.eql( { c: true } ) ;
expect( tree.path.get( o , 'sub.sub.c' ) ).to.be( true ) ;
expect( tree.path.get( o , 'd' ) ).to.be( null ) ;
expect( tree.path.get( o , 'nothing' ) ).to.be( undefined ) ;
expect( tree.path.get( o , 'sub.nothing' ) ).to.be( undefined ) ;
expect( tree.path.get( o , 'nothing.nothing' ) ).to.be( undefined ) ;
```

path.delete() on object structure.

```js
var o = {
	a: 5 ,
	sub: {
		b: "toto" ,
		sub: {
			c: true ,
			sub: {
				f: ''
			}
		}
	} ,
	d: null
} ;

tree.path.delete( o , 'a' ) ;
tree.path.delete( o , 'sub.sub' ) ;
tree.path.delete( o , 'non.existant.path' ) ;

expect( o ).to.eql( {
	sub: {
		b: "toto" ,
	} ,
	d: null
} ) ;
```

path.set() on object structure.

```js
var o = {
	a: 5 ,
	sub: {
		b: "toto" ,
		sub: {
			c: true
		}
	} ,
	d: null
} ;

tree.path.set( o , 'a' , "8" ) ;
tree.path.set( o , 'sub.b' , false ) ;
tree.path.set( o , 'sub.sub' , { x: 18 , y: 27 } ) ;
tree.path.set( o , 'non.existant.path' , 'new' ) ;

expect( o ).to.eql( {
	a: "8" ,
	sub: {
		b: false ,
		sub: {
			x: 18 ,
			y: 27
		}
	} ,
	d: null ,
	non: {
		existant: {
			path: 'new'
		}
	}
} ) ;
```

path.define() on object structure.

```js
var o = {
	a: 5 ,
	sub: {
		b: "toto" ,
		sub: {
			c: true
		}
	} ,
	d: null
} ;

tree.path.define( o , 'a' , "8" ) ;
tree.path.define( o , 'sub.b' , false ) ;
tree.path.define( o , 'unexistant' , '!' ) ;
tree.path.define( o , 'sub.sub' , { x: 18 , y: 27 } ) ;
tree.path.define( o , 'non.existant.path' , 'new' ) ;

expect( o ).to.eql( {
	a: 5 ,
	unexistant: '!' ,
	sub: {
		b: "toto" ,
		sub: {
			c: true
		}
	} ,
	d: null ,
	non: {
		existant: {
			path: 'new'
		}
	}
} ) ;
```

path.inc() and path.dec() on object structure.

```js
var o = {
	a: 5 ,
	sub: {
		b: 10 ,
		sub: {
			c: true
		}
	} ,
	d: null
} ;

tree.path.inc( o , 'a' ) ;
tree.path.dec( o , 'sub.b' ) ;
tree.path.inc( o , 'sub' ) ;
tree.path.dec( o , 'sub.sub' ) ;
tree.path.inc( o , 'non.existant.path' ) ;
tree.path.dec( o , 'another.non.existant.path' ) ;

expect( o ).to.eql( {
	a: 6 ,
	sub: {
		b: 9 ,
		sub: {
			c: true
		}
	} ,
	d: null ,
	non: {
		existant: {
			path: 1
		}
	} ,
	another: {
		non: {
			existant: {
				path: -1
			}
		}
	}
} ) ;
```

<a name="trees-path-on-arrays"></a>
# Tree's path on arrays
path.get() on a simple array.

```js
var a = [ 'a' , 'b' , 'c' ] ;

expect( tree.path.get( a , '0' ) ).to.be( 'a' ) ;
expect( tree.path.get( a , '1' ) ).to.be( 'b' ) ;
expect( tree.path.get( a , '2' ) ).to.be( 'c' ) ;
expect( tree.path.get( a , '3' ) ).to.be( undefined ) ;
expect( tree.path.get( a , '#0' ) ).to.be( 'a' ) ;
expect( tree.path.get( a , '#1' ) ).to.be( 'b' ) ;
expect( tree.path.get( a , '#2' ) ).to.be( 'c' ) ;
expect( tree.path.get( a , '#3' ) ).to.be( undefined ) ;
expect( tree.path.get( a , 'length' ) ).to.be( 3 ) ;
expect( tree.path.get( a , '#length' ) ).to.be( 3 ) ;
expect( tree.path.get( a , 'first' ) ).to.be( undefined ) ;
expect( tree.path.get( a , '#first' ) ).to.be( 'a' ) ;
expect( tree.path.get( a , 'last' ) ).to.be( undefined ) ;
expect( tree.path.get( a , '#last' ) ).to.be( 'c' ) ;
expect( tree.path.get( a , 'next' ) ).to.be( undefined ) ;
expect( tree.path.get( a , '#next' ) ).to.be( undefined ) ;
```

path.get() on nested arrays.

```js
var a = [ 'a' , [ [ 'b' , 'c' ] , 'd' , [ 'e' , 'f' ] ] ] ;

expect( tree.path.get( a , '#0' ) ).to.be( 'a' ) ;
expect( tree.path.get( a , '#1' ) ).to.eql( [ [ 'b' , 'c' ] , 'd' , [ 'e' , 'f' ] ] ) ;
expect( tree.path.get( a , '#2' ) ).to.be( undefined ) ;
expect( tree.path.get( a , '#length' ) ).to.be( 2 ) ;
expect( tree.path.get( a , '#first' ) ).to.be( 'a' ) ;
expect( tree.path.get( a , '#last' ) ).to.eql( [ [ 'b' , 'c' ] , 'd' , [ 'e' , 'f' ] ] ) ;
expect( tree.path.get( a , '#next' ) ).to.be( undefined ) ;

expect( tree.path.get( a , '1#0' ) ).to.eql( [ 'b' , 'c' ] ) ;
expect( tree.path.get( a , '1#1' ) ).to.eql( 'd' ) ;
expect( tree.path.get( a , '1#2' ) ).to.eql( [ 'e' , 'f' ] ) ;
expect( tree.path.get( a , '1#3' ) ).to.be( undefined ) ;
expect( tree.path.get( a , '1#length' ) ).to.be( 3 ) ;
expect( tree.path.get( a , '1#first' ) ).to.eql( [ 'b' , 'c' ] ) ;
expect( tree.path.get( a , '1#last' ) ).to.eql( [ 'e' , 'f' ] ) ;
expect( tree.path.get( a , '1#next' ) ).to.be( undefined ) ;

expect( tree.path.get( a , '1#2#last' ) ).to.eql( 'f' ) ;
```

path.set() on a simple array.

```js
var a = [ 'a' , 'b' , 'c' ] ;

tree.path.set( a , '1' , 'B' ) ;
tree.path.set( a , '#last' , 3 ) ;
tree.path.set( a , '#next' , 'D' ) ;
tree.path.set( a , '#first' , 1 ) ;

expect( a ).to.eql( [ 1 , 'B' , 3 , 'D' ] ) ;
expect( tree.path.get( a , '#length' ) ).to.be( 4 ) ;
```

path.set() using multiple #next and #insert.

```js
var a = [ 'a' , 'b' , 'c' ] ;

tree.path.set( a , '#next' , 'D' ) ;
tree.path.set( a , '#next.f#next' , 'g' ) ;
tree.path.set( a , '#next#next#next' , 'E' ) ;
tree.path.set( a , '#insert' , '@' ) ;
tree.path.set( a , '#last#insert' , '@' ) ;

expect( a ).to.eql( [ '@' , 'a' , 'b' , 'c' , 'D' ,  { f: [ 'g' ] } , [ '@' , [ 'E' ] ] ] ) ;
expect( tree.path.get( a , '#length' ) ).to.be( 7 ) ;
```

path.delete() on a simple array.

```js
var a ;

a = [ 'a' , 'b' , 'c' ] ;
tree.path.delete( a , '1' ) ;
//expect( a ).to.eql( [ 'a' , undefined , 'c' ] ) ;	// expect() bug here...
expect( tree.path.get( a , '#length' ) ).to.be( 3 ) ;

a = [ 'a' , 'b' , 'c' ] ;
tree.path.delete( a , '#1' ) ;
expect( a ).to.eql( [ 'a' , 'c' ] ) ;
expect( tree.path.get( a , '#length' ) ).to.be( 2 ) ;

a = [ 'a' , 'b' , 'c' ] ;
tree.path.delete( a , '#2' ) ;
expect( a ).to.eql( [ 'a' , 'b' ] ) ;
expect( tree.path.get( a , '#length' ) ).to.be( 2 ) ;

a = [ 'a' , 'b' , 'c' ] ;
tree.path.delete( a , '#last' ) ;
expect( a ).to.eql( [ 'a' , 'b' ] ) ;
expect( tree.path.get( a , '#length' ) ).to.be( 2 ) ;
tree.path.delete( a , '#last' ) ;
expect( a ).to.eql( [ 'a' ] ) ;
expect( tree.path.get( a , '#length' ) ).to.be( 1 ) ;
tree.path.delete( a , '#last' ) ;
expect( a ).to.eql( [] ) ;
expect( tree.path.get( a , '#length' ) ).to.be( 0 ) ;

a = [ 'a' , 'b' , 'c' ] ;
tree.path.delete( a , '#first' ) ;
expect( a ).to.eql( [ 'b' , 'c' ] ) ;
expect( tree.path.get( a , '#length' ) ).to.be( 2 ) ;
tree.path.delete( a , '#first' ) ;
expect( a ).to.eql( [ 'c' ] ) ;
expect( tree.path.get( a , '#length' ) ).to.be( 1 ) ;
tree.path.delete( a , '#first' ) ;
expect( a ).to.eql( [] ) ;
expect( tree.path.get( a , '#length' ) ).to.be( 0 ) ;
```

<a name="inheritance-using-objectcreate-treepathprototype-"></a>
# Inheritance, using Object.create( tree.path.prototype )
.get().

```js
var o = Object.create( tree.path.prototype ) ;

o.a = 5 ;
o.sub = {
	b: "toto" ,
	sub: {
		c: true
	}
} ;
o.d = null ;

expect( o.get( 'a' ) ).to.be( 5 ) ;
expect( o.get( 'sub' ) ).to.eql( {
	b: "toto" ,
	sub: {
		c: true
	}
} ) ;
expect( o.get( 'sub.b' ) ).to.be( "toto" ) ;
expect( o.get( 'sub.sub' ) ).to.eql( { c: true } ) ;
expect( o.get( 'sub.sub.c' ) ).to.be( true ) ;
expect( o.get( 'd' ) ).to.be( null ) ;
expect( o.get( 'nothing' ) ).to.be( undefined ) ;
expect( o.get( 'sub.nothing' ) ).to.be( undefined ) ;
expect( o.get( 'nothing.nothing' ) ).to.be( undefined ) ;
```

.delete().

```js
var o = Object.create( tree.path.prototype ) ;

o.a = 5 ;
o.sub = {
	b: "toto" ,
	sub: {
		c: true ,
		sub: {
			f: ''
		}
	}
} ;
o.d = null ;

o.delete( 'a' ) ;
o.delete( 'sub.sub' ) ;
o.delete( 'non.existant.path' ) ;

expect( o ).to.eql( {
	sub: {
		b: "toto" ,
	} ,
	d: null
} ) ;
```

.set().

```js
var o = Object.create( tree.path.prototype ) ;

o.a = 5 ;
o.sub = {
	b: "toto" ,
	sub: {
		c: true
	}
} ;
o.d = null ;

o.set( 'a' , "8" ) ;
o.set( 'sub.b' , false ) ;
o.set( 'sub.sub' , { x: 18 , y: 27 } ) ;
o.set( 'non.existant.path' , 'new' ) ;

expect( o ).to.eql( {
	a: "8" ,
	sub: {
		b: false ,
		sub: {
			x: 18 ,
			y: 27
		}
	} ,
	d: null ,
	non: {
		existant: {
			path: 'new'
		}
	}
} ) ;
```

.define().

```js
var o = Object.create( tree.path.prototype ) ;

o.a = 5 ;
o.sub = {
	b: "toto" ,
	sub: {
		c: true
	}
} ;
o.d = null ;

o.define( 'a' , "8" ) ;
o.define( 'sub.b' , false ) ;
o.define( 'unexistant' , '!' ) ;
o.define( 'sub.sub' , { x: 18 , y: 27 } ) ;
o.define( 'non.existant.path' , 'new' ) ;

expect( o ).to.eql( {
	a: 5 ,
	unexistant: '!' ,
	sub: {
		b: "toto" ,
		sub: {
			c: true
		}
	} ,
	d: null ,
	non: {
		existant: {
			path: 'new'
		}
	}
} ) ;
```

.inc() and .dec().

```js
var o = Object.create( tree.path.prototype ) ;

o.a = 5 ;
o.sub = {
	b: 10 ,
	sub: {
		c: true
	}
} ;
o.d = null ;

o.inc( 'a' ) ;
o.dec( 'sub.b' ) ;
o.inc( 'sub' ) ;
o.dec( 'sub.sub' ) ;
o.inc( 'non.existant.path' ) ;
o.dec( 'another.non.existant.path' ) ;

expect( o ).to.eql( {
	a: 6 ,
	sub: {
		b: 9 ,
		sub: {
			c: true
		}
	} ,
	d: null ,
	non: {
		existant: {
			path: 1
		}
	} ,
	another: {
		non: {
			existant: {
				path: -1
			}
		}
	}
} ) ;
```

<a name="trees-array-path-on-objects"></a>
# Tree's array path on objects
path.get() on object structure.

```js
var o = {
	a: 5 ,
	sub: {
		b: "toto" ,
		sub: {
			c: true
		}
	} ,
	d: null
} ;

expect( tree.path.get( o , [ 'a' ] ) ).to.be( 5 ) ;
expect( tree.path.get( o , [ 'sub' ] ) ).to.eql( {
	b: "toto" ,
	sub: {
		c: true
	}
} ) ;

expect( tree.path.get( o , [ 'sub' , 'b' ] ) ).to.be( "toto" ) ;
expect( tree.path.get( o , [ 'sub' , 'sub' ] ) ).to.eql( { c: true } ) ;
expect( tree.path.get( o , [ 'sub' , 'sub' , 'c' ] ) ).to.be( true ) ;
expect( tree.path.get( o , [ 'd' ] ) ).to.be( null ) ;
expect( tree.path.get( o , [ 'nothing' ] ) ).to.be( undefined ) ;
expect( tree.path.get( o , [ 'sub' , 'nothing' ] ) ).to.be( undefined ) ;
expect( tree.path.get( o , [ 'nothing' , 'nothing' ] ) ).to.be( undefined ) ;
```

path.delete() on object structure.

```js
var o = {
	a: 5 ,
	sub: {
		b: "toto" ,
		sub: {
			c: true ,
			sub: {
				f: ''
			}
		}
	} ,
	d: null
} ;

tree.path.delete( o , [ 'a' ] ) ;
tree.path.delete( o , [ 'sub' , 'sub' ] ) ;
tree.path.delete( o , [ 'non' , 'existant' , 'path' ] ) ;

expect( o ).to.eql( {
	sub: {
		b: "toto" ,
	} ,
	d: null
} ) ;
```

path.set() on object structure.

```js
var o = {
	a: 5 ,
	sub: {
		b: "toto" ,
		sub: {
			c: true
		}
	} ,
	d: null
} ;

tree.path.set( o , [ 'a' ] , "8" ) ;
tree.path.set( o , [ 'sub' , 'b' ] , false ) ;
tree.path.set( o , [ 'sub' , 'sub' ] , { x: 18 , y: 27 } ) ;
tree.path.set( o , [ 'non' , 'existant' , 'path' ] , 'new' ) ;

expect( o ).to.eql( {
	a: "8" ,
	sub: {
		b: false ,
		sub: {
			x: 18 ,
			y: 27
		}
	} ,
	d: null ,
	non: {
		existant: {
			path: 'new'
		}
	}
} ) ;
```

path.define() on object structure.

```js
var o = {
	a: 5 ,
	sub: {
		b: "toto" ,
		sub: {
			c: true
		}
	} ,
	d: null
} ;

tree.path.define( o , [ 'a' ] , "8" ) ;
tree.path.define( o , [ 'sub' , 'b' ] , false ) ;
tree.path.define( o , [ 'unexistant' ] , '!' ) ;
tree.path.define( o , [ 'sub' , 'sub' ] , { x: 18 , y: 27 } ) ;
tree.path.define( o , [ 'non' , 'existant' , 'path' ] , 'new' ) ;

expect( o ).to.eql( {
	a: 5 ,
	unexistant: '!' ,
	sub: {
		b: "toto" ,
		sub: {
			c: true
		}
	} ,
	d: null ,
	non: {
		existant: {
			path: 'new'
		}
	}
} ) ;
```

path.inc() and path.dec() on object structure.

```js
var o = {
	a: 5 ,
	sub: {
		b: 10 ,
		sub: {
			c: true
		}
	} ,
	d: null
} ;

tree.path.inc( o , [ 'a' ] ) ;
tree.path.dec( o , [ 'sub' , 'b' ] ) ;
tree.path.inc( o , [ 'sub' ] ) ;
tree.path.dec( o , [ 'sub' , 'sub' ] ) ;
tree.path.inc( o , [ 'non' , 'existant' , 'path' ] ) ;
tree.path.dec( o , [ 'another' , 'non' , 'existant' , 'path' ] ) ;

expect( o ).to.eql( {
	a: 6 ,
	sub: {
		b: 9 ,
		sub: {
			c: true
		}
	} ,
	d: null ,
	non: {
		existant: {
			path: 1
		}
	} ,
	another: {
		non: {
			existant: {
				path: -1
			}
		}
	}
} ) ;
```

