/*
	The Cedric's Swiss Knife (CSK) - CSK object tree toolbox test suite

	Copyright (c) 2014, 2015 Cédric Ronvel 
	
	The MIT License (MIT)

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/

/* jshint unused:false */
/* global describe, it, before, after */


var tree = require( '../lib/tree.js' ) ;
var expect = require( 'expect.js' ) ;





			/* Tests */



describe( "clone()" , function() {
	
	it( "basic incomplete test" , function() {
		
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
	} ) ;
	
	it( "circular references test" , function() {
		
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
	} ) ;
	
	it( "better test suit for clone()" ) ;
} ) ;



