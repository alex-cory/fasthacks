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



describe( "Tree's path on objects" , function() {
	
	it( "path.get() on object structure" , function() {
		
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
	} ) ;
	
	it( "path.delete() on object structure" , function() {
		
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
	} ) ;
	
	it( "path.set() on object structure" , function() {
		
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
	} ) ;
	
	it( "path.define() on object structure" , function() {
		
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
	} ) ;
	
	it( "path.inc() and path.dec() on object structure" , function() {
		
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
	} ) ;
	
	it( "all method should return the targeted item, like path.get() does" ) ;
	
} ) ;



describe( "Tree's path on arrays" , function() {
	
	it( "path.get() on a simple array" , function() {
		
		var a = [ 'a' , 'b' , 'c' ] ;
		
		expect( tree.path.get( a , '0' ) ).to.be( 'a' ) ;
		expect( tree.path.get( a , '1' ) ).to.be( 'b' ) ;
		expect( tree.path.get( a , '2' ) ).to.be( 'c' ) ;
		expect( tree.path.get( a , '3' ) ).to.be( undefined ) ;
		expect( tree.path.get( a , '#0' ) ).to.be( 'a' ) ;
		expect( tree.path.get( a , '#1' ) ).to.be( 'b' ) ;
		expect( tree.path.get( a , '#2' ) ).to.be( 'c' ) ;
		expect( tree.path.get( a , '#3' ) ).to.be( undefined ) ;
		expect( tree.path.get( a , '[0]' ) ).to.be( 'a' ) ;
		expect( tree.path.get( a , '[1]' ) ).to.be( 'b' ) ;
		expect( tree.path.get( a , '[2]' ) ).to.be( 'c' ) ;
		expect( tree.path.get( a , '[3]' ) ).to.be( undefined ) ;
		expect( tree.path.get( a , 'length' ) ).to.be( 3 ) ;
		expect( tree.path.get( a , '#length' ) ).to.be( 3 ) ;
		expect( tree.path.get( a , 'first' ) ).to.be( undefined ) ;
		expect( tree.path.get( a , '#first' ) ).to.be( 'a' ) ;
		expect( tree.path.get( a , 'last' ) ).to.be( undefined ) ;
		expect( tree.path.get( a , '#last' ) ).to.be( 'c' ) ;
		expect( tree.path.get( a , 'next' ) ).to.be( undefined ) ;
		expect( tree.path.get( a , '#next' ) ).to.be( undefined ) ;
	} ) ;
	
	it( "path.get() on nested arrays" , function() {
		
		var a = [ 'a' , [ [ 'b' , 'c' ] , 'd' , [ 'e' , 'f' ] ] ] ;
		
		expect( tree.path.get( a , '#0' ) ).to.be( 'a' ) ;
		expect( tree.path.get( a , '#1' ) ).to.eql( [ [ 'b' , 'c' ] , 'd' , [ 'e' , 'f' ] ] ) ;
		expect( tree.path.get( a , '#2' ) ).to.be( undefined ) ;
		expect( tree.path.get( a , '[0]' ) ).to.be( 'a' ) ;
		expect( tree.path.get( a , '[1]' ) ).to.eql( [ [ 'b' , 'c' ] , 'd' , [ 'e' , 'f' ] ] ) ;
		expect( tree.path.get( a , '[2]' ) ).to.be( undefined ) ;
		expect( tree.path.get( a , '#length' ) ).to.be( 2 ) ;
		expect( tree.path.get( a , '#first' ) ).to.be( 'a' ) ;
		expect( tree.path.get( a , '#last' ) ).to.eql( [ [ 'b' , 'c' ] , 'd' , [ 'e' , 'f' ] ] ) ;
		expect( tree.path.get( a , '#next' ) ).to.be( undefined ) ;
		
		expect( tree.path.get( a , '1#0' ) ).to.eql( [ 'b' , 'c' ] ) ;
		expect( tree.path.get( a , '1#1' ) ).to.eql( 'd' ) ;
		expect( tree.path.get( a , '1#2' ) ).to.eql( [ 'e' , 'f' ] ) ;
		expect( tree.path.get( a , '1#3' ) ).to.be( undefined ) ;
		expect( tree.path.get( a , '[1][0]' ) ).to.eql( [ 'b' , 'c' ] ) ;
		expect( tree.path.get( a , '[1][1]' ) ).to.eql( 'd' ) ;
		expect( tree.path.get( a , '[1][2]' ) ).to.eql( [ 'e' , 'f' ] ) ;
		expect( tree.path.get( a , '[1][3]' ) ).to.be( undefined ) ;
		expect( tree.path.get( a , '1#length' ) ).to.be( 3 ) ;
		expect( tree.path.get( a , '1#first' ) ).to.eql( [ 'b' , 'c' ] ) ;
		expect( tree.path.get( a , '1#last' ) ).to.eql( [ 'e' , 'f' ] ) ;
		expect( tree.path.get( a , '1#next' ) ).to.be( undefined ) ;
		
		expect( tree.path.get( a , '1#2#last' ) ).to.eql( 'f' ) ;
	} ) ;
	
	it( "path.set() on a simple array" , function() {
		
		var a ;
		
		a = [ 'a' , 'b' , 'c' ] ;
		
		tree.path.set( a , '1' , 'B' ) ;
		tree.path.set( a , '#last' , 3 ) ;
		tree.path.set( a , '#next' , 'D' ) ;
		tree.path.set( a , '#first' , 1 ) ;
		
		expect( a ).to.eql( [ 1 , 'B' , 3 , 'D' ] ) ;
		expect( tree.path.get( a , '#length' ) ).to.be( 4 ) ;
		
		a = [ 'a' , 'b' , 'c' ] ;
		
		tree.path.set( a , '[1]' , 'BBB' ) ;
		tree.path.set( a , '#last' , 3 ) ;
		tree.path.set( a , '#next' , 'D' ) ;
		tree.path.set( a , '#first' , 1 ) ;
		
		expect( a ).to.eql( [ 1 , 'BBB' , 3 , 'D' ] ) ;
		expect( tree.path.get( a , '#length' ) ).to.be( 4 ) ;
	} ) ;
	
	it( "path.set() using multiple #next and #insert" , function() {
		
		var a = [ 'a' , 'b' , 'c' ] ;
		
		tree.path.set( a , '#next' , 'D' ) ;
		tree.path.set( a , '#next.f#next' , 'g' ) ;
		tree.path.set( a , '#next#next#next' , 'E' ) ;
		tree.path.set( a , '#insert' , '@' ) ;
		tree.path.set( a , '#last#insert' , '@' ) ;
		
		expect( a ).to.eql( [ '@' , 'a' , 'b' , 'c' , 'D' ,  { f: [ 'g' ] } , [ '@' , [ 'E' ] ] ] ) ;
		expect( tree.path.get( a , '#length' ) ).to.be( 7 ) ;
	} ) ;
	
	it( "path.delete() on a simple array" , function() {
		
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
		tree.path.delete( a , '[1]' ) ;
		expect( a ).to.eql( [ 'a' , 'c' ] ) ;
		expect( tree.path.get( a , '#length' ) ).to.be( 2 ) ;
		
		a = [ 'a' , 'b' , 'c' ] ;
		tree.path.delete( a , '#2' ) ;
		expect( a ).to.eql( [ 'a' , 'b' ] ) ;
		expect( tree.path.get( a , '#length' ) ).to.be( 2 ) ;
		
		a = [ 'a' , 'b' , 'c' ] ;
		tree.path.delete( a , '[2]' ) ;
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
	} ) ;
	
	it( "path.set() on structure mixing arrays and objects" ) ;
	
} ) ;



describe( "Tree's path on mixed object and arrays" , function() {
	
	it( "path.get() on a simple array" , function() {
		
		var a = {
			method: 'get' ,
			populate: [ 'parents', 'godfather' ]
		} ;
		
		expect( tree.path.get( a , 'method' ) ).to.be( 'get' ) ;
		expect( tree.path.get( a , 'populate' ) ).to.eql( [ 'parents', 'godfather' ] ) ;
		expect( tree.path.get( a , 'populate[0]' ) ).to.be( 'parents' ) ;
		expect( tree.path.get( a , 'populate[1]' ) ).to.be( 'godfather' ) ;
		expect( tree.path.get( a , 'populate[2]' ) ).to.be( undefined ) ;
	} ) ;
	
	it( "path.set() on a simple array" , function() {
		
		var a = {
			method: 'get' ,
			populate: [ 'parent', 'godfather' ]
		} ;
		
		tree.path.set( a , 'method' , 'post' ) ;
		tree.path.set( a , 'populate[0]' , 'friends' ) ;
		expect( a ).to.eql( {
			method: 'post' ,
			populate: [ 'friends', 'godfather' ]
		} ) ;
	} ) ;
} ) ;
	


describe( "Inheritance, using Object.create( tree.path.prototype )" , function() {
	
	it( ".get()" , function() {
		
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
	} ) ;
	
	it( ".delete()" , function() {
		
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
		
	} ) ;
	
	it( ".set()" , function() {
		
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
		
	} ) ;
	
	it( ".define()" , function() {
		
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
	} ) ;
	
	it( ".inc() and .dec()" , function() {
		
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
		
	} ) ;
} ) ;



describe( "Tree's array path on objects" , function() {
	
	it( "path.get() on object structure" , function() {
		
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
	} ) ;
	
	it( "path.delete() on object structure" , function() {
		
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
		
	} ) ;
	
	it( "path.set() on object structure" , function() {
		
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
		
	} ) ;
	
	it( "path.define() on object structure" , function() {
		
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
	} ) ;
	
	it( "path.inc() and path.dec() on object structure" , function() {
		
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
		
	} ) ;
} ) ;

