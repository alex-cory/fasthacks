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



describe( "Diff" , function() {
	
	it( "should return an array of differences for two objects without nested object" , function() {
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
	} ) ;
	
	it( "should return an array of differences for two objects with nested objects" , function() {
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
	} ) ;
} ) ;



