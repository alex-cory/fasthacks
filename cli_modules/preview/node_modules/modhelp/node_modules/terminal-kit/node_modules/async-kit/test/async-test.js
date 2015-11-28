/*
	The Cedric's Swiss Knife (CSK) - CSK Async lib test suite
	
	The MIT License (MIT)
	
	Copyright (c) 2009-2014 Cédric Ronvel 
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/

/* jshint unused:false */
/* global describe, it, before, after */

/*
	TODO:
	
	Async.EventEmitter
	Async.Plan:
		.clone()
		.export()
		.while( condition , true )
		.race()
		.waterfall()
		.iterator() & .usingIterator() -- should be mostly covered by foreach
		.aggregator()
	Exec:
		.execArgs()
*/



var async = require( '../lib/async.js' ) ;
var expect = require( 'expect.js' ) ;





			/* Helper functions */



function createStats( n )
{
	var i ;
	var stats = {
		startCounter: [] ,
		endCounter: [] ,
		order: [] ,
		plan: {
			then: 0 ,
			'else': 0 ,
			'catch': 0 ,
			'finally': 0
		} ,
		exec: {
			then: 0 ,
			'else': 0 ,
			'catch': 0 ,
			'finally': 0
		}
	} ;
	
	for ( i = 0 ; i < n ; i ++ ) { stats.startCounter[ i ] = stats.endCounter[ i ] = 0 ; }
	
	return stats ;
}



function asyncJob( stats , id , delay , options , result , callback )
{
	var jobContext = this , realResult = result.slice() ;
	
	stats.startCounter[ id ] ++ ;
	
	setTimeout( function() {
		stats.endCounter[ id ] ++ ;
		stats.order.push( id ) ;
		
		if ( typeof options.failCount === 'number' && options.failCount >= stats.endCounter[ id ] && ! ( result[ 0 ] instanceof Error ) )
		{
			realResult[ 0 ] = new Error( "Planned failure" ) ;
		}
		
		if ( options.abort ) { jobContext.abort.apply( jobContext , realResult ) ; }
		else { callback.apply( undefined , realResult ) ; }
		
	} , delay ) ;
}



function syncJob( stats , id , options , result , callback )
{
	var realResult = result.slice() ;
	
	stats.startCounter[ id ] ++ ;
	stats.endCounter[ id ] ++ ;
	stats.order.push( id ) ;
	
	if ( typeof options.failCount === 'number' && options.failCount >= stats.endCounter[ id ] && ! ( result[ 0 ] instanceof Error ) )
	{
		realResult[ 0 ] = new Error( "Planned failure" ) ;
	}
	
	if ( options.abort ) { this.abort.apply( this , realResult ) ; }
	else { callback.apply( undefined , realResult ) ; }
}



function asyncEventTest( nice , finish )
{
	var order = [] ;
	var emitter = new async.EventEmitter( nice ) ;
	
	emitter.on( 'event' , function() {
		order.push( 'listener' ) ;
	} ) ;
	
	emitter.asyncEmit( 'event' ) ;
	
	process.nextTick( function() { order.push( 'nextTick' ) ; } ) ;
	setImmediate( function() { order.push( 'setImmediate' ) ; } ) ;
	setTimeout( function() { order.push( 'setTimeout5' ) ; } , 5 ) ;
	setTimeout( function() { order.push( 'setTimeout20' ) ; } , 20 ) ;
	
	// Finish
	setTimeout( function() {
		finish( order ) ;
	} , 40 ) ;
	
	order.push( 'flow' ) ;
}





			/* Tests */



describe( "async.series()" , function() {
	
	it( "should run the series of job which do not have errors, in the good order, and trigger the callback with the correct result" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.series( [
			[ asyncJob , stats , 0 , 50 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 100 , {} , [ undefined , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 0 , {} , [ undefined , 'result' ] ]
		] )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1, 2 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "when a job has error, it should start running a series of job, be interrupted by that error and return it" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.series( [
			[ asyncJob , stats , 0 , 50 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 100 , {} , [ new Error() , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 0 , {} , [ undefined , 'result' ] ]
		] )
		.exec( function( error , results ) {
			expect( error ).to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ new Error() , 'wonderful' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 0 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "when a function is given instead of an array of job, it should format the result using the returnLastResultOnly mode" , function( done ) {
		
		var stats = createStats( 1 ) ;
		
		async.series( function ( callback ) {
			asyncJob( stats , 0 , 50 , {} , [ undefined , 'my wonderful result' ] , callback ) ;
		} )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.equal( 'my wonderful result' ) ;
			expect( stats.endCounter ).to.eql( [ 1 ] ) ;
			expect( stats.order ).to.eql( [ 0 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "when a function is given instead of an array of job that transmit error, it should be directly transmited as the global error" , function( done ) {
		
		var stats = createStats( 1 ) ;
		
		async.do( function ( callback ) {
			asyncJob( stats , 0 , 50 , {} , [ new Error() , 'my wonderful result' ] , callback ) ;
		} )
		.exec( function( error , results ) {
			expect( error ).to.be.an( Error ) ;
			expect( results ).to.equal( 'my wonderful result' ) ;
			expect( stats.endCounter ).to.eql( [ 1 ] ) ;
			expect( stats.order ).to.eql( [ 0 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
} ) ;



describe( "async.parallel()" , function() {
	
	it( "should run jobs which do not have errors in parallel, and trigger the callback with the correct result" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.parallel( [
			[ asyncJob , stats , 0 , 50 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 100 , {} , [ undefined , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 0 , {} , [ undefined , 'result' ] ]
		] )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 2, 0, 1 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "when a job has error, it should start running jobs in parallel, be interrupted by that error and trigger callback with it before other pending jobs can complete" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.parallel( [
			[ asyncJob , stats , 0 , 50 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 100 , {} , [ undefined , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 0 , {} , [ new Error() , 'result' ] ]
		] )
		.exec( function( error , results ) {
			expect( error ).to.be.an( Error ) ;
			expect( results ).to.eql( [ undefined , undefined , [ new Error() , 'result' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 0, 0, 1 ] ) ;
			expect( stats.order ).to.eql( [ 2 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "when the slower job has error, it should start running jobs in parallel, all other job complete and it trigger callback with the error" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.parallel( [
			[ asyncJob , stats , 0 , 50 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 100 , {} , [ new Error() , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 0 , {} , [ undefined , 'result' ] ]
		] )
		.exec( function( error , results ) {
			expect( error ).to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ new Error() , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 2, 0, 1 ] ) ;
			done() ;
		} ) ;
	} ) ;
} ) ;
	


describe( "Jobs" , function() {
	
	it( "can be an array of async function accepting a completion callback" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.series( [
			function( callback ) {
				var id = 0 ;
				stats.startCounter[ id ] ++ ;
				setTimeout( function() {
					stats.endCounter[ id ] ++ ;
					stats.order.push( id ) ;
					callback( undefined , 'my' ) ;
				} , 0 ) ;
			} ,
			function( callback ) {
				var id = 1 ;
				stats.startCounter[ id ] ++ ;
				setTimeout( function() {
					stats.endCounter[ id ] ++ ;
					stats.order.push( id ) ;
					callback( undefined , 'wonderful' ) ;
				} , 0 ) ;
			} ,
			function( callback ) {
				var id = 2 ;
				stats.startCounter[ id ] ++ ;
				setTimeout( function() {
					stats.endCounter[ id ] ++ ;
					stats.order.push( id ) ;
					callback( undefined , 'result' ) ;
				} , 0 ) ;
			}
		] )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1, 2 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "can be an array of synchronous function, if it still accept and use the completion callback" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.series( [
			function( callback ) {
				var id = 0 ;
				stats.startCounter[ id ] ++ ;
				stats.endCounter[ id ] ++ ;
				stats.order.push( id ) ;
				callback( undefined , 'my' ) ;
			} ,
			function( callback ) {
				var id = 1 ;
				stats.startCounter[ id ] ++ ;
				stats.endCounter[ id ] ++ ;
				stats.order.push( id ) ;
				callback( undefined , 'wonderful' ) ;
			} ,
			function( callback ) {
				var id = 2 ;
				stats.startCounter[ id ] ++ ;
				stats.endCounter[ id ] ++ ;
				stats.order.push( id ) ;
				callback( undefined , 'result' ) ;
			}
		] )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1, 2 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "can be an array of array, each of them having a async function as the first element and then a list of argument to pass to this function, it should accept one more argument: the callback for completion being added by the async lib" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.do( [
			[ asyncJob , stats , 0 , 0 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 0 , {} , [ undefined , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 0 , {} , [ undefined , 'result' ] ]
		] )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1, 2 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "can be an array of array, each of them having a synchronous function as the first element and then a list of argument to pass to this function, if those functions still accept and use the completion callback" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.do( [
			[ syncJob , stats , 0 , {} , [ undefined , 'my' ] ] ,
			[ syncJob , stats , 1 , {} , [ undefined , 'wonderful' ] ] ,
			[ syncJob , stats , 2 , {} , [ undefined , 'result' ] ]
		] )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1, 2 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "can be an array of async.Plan, each of them will be used by calling their .exec() method" , function( done ) {
		
		var stats = createStats( 6 ) ;
		
		async.parallel( [
			async.series( [
				[ asyncJob , stats , 0 , 10 , {} , [ undefined , 'a' ] ] ,
				[ asyncJob , stats , 1 , 10 , {} , [ undefined , 'nice' ] ] ,
				[ asyncJob , stats , 2 , 10 , {} , [ undefined , 'output' ] ]
			] ) ,
			async.series( [
				[ asyncJob , stats , 3 , 10 , {} , [ undefined , 'my' ] ] ,
				[ asyncJob , stats , 4 , 10 , {} , [ undefined , 'wonderful' ] ] ,
				[ asyncJob , stats , 5 , 10 , {} , [ undefined , 'result' ] ]
			] )
		] )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results[ 0 ][ 0 ] ).not.to.be.an( Error ) ;
			expect( results[ 1 ][ 0 ] ).not.to.be.an( Error ) ;
			expect( results[ 0 ][ 1 ] ).to.eql( [ [ undefined , 'a' ], [ undefined , 'nice' ], [ undefined , 'output' ] ] ) ;
			expect( results[ 1 ][ 1 ] ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1, 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 0, 3, 1, 4, 2, 5 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "can be an array that mix all those type of jobs" , function( done ) {
		
		var stats = createStats( 7 ) ;
		
		async.parallel( [
			function( callback ) {
				var id = 0 ;
				stats.startCounter[ id ] ++ ;
				setTimeout( function() {
					stats.endCounter[ id ] ++ ;
					stats.order.push( id ) ;
					callback( undefined , "I'm an async anonymous function" ) ;
				} , 0 ) ;
			} ,
			function( callback ) {
				var id = 1 ;
				stats.startCounter[ id ] ++ ;
				stats.endCounter[ id ] ++ ;
				stats.order.push( id ) ;
				callback( undefined , "I'm a synchronous anonymous function" ) ;
			} ,
			async.series( [
				[ asyncJob , stats , 2 , 20 , {} , [ undefined , 'nested' ] ] ,
				[ asyncJob , stats , 3 , 20 , {} , [ undefined , 'async.Plan' ] ] ,
				[ asyncJob , stats , 4 , 20 , {} , [ undefined , 'results' ] ]
			] ) ,
			[ syncJob , stats , 5 , {} , [ undefined , "I'm a synchronous array of function and arguments" ] ] ,
			[ asyncJob , stats , 6 , 10 , {} , [ undefined , "I'm an async array of function and arguments" ] ] ,
		] )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [
				[ undefined , "I'm an async anonymous function" ] ,
				[ undefined , "I'm a synchronous anonymous function" ] ,
				[ undefined , [ [ undefined , "nested" ] , [ undefined , "async.Plan" ] , [ undefined , "results" ] ] ] ,
				[ undefined , "I'm a synchronous array of function and arguments" ] ,
				[ undefined , "I'm an async array of function and arguments" ]
			] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1, 1, 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 1, 5, 0, 6, 2, 3, 4 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "objects can be used instead of array as the top container, the results should be an objects with the same properties mapping, properties' order should be preserved (*IF* they do not start with a digit - because of V8 behaviours with objects)" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.parallel( {
			one: [ asyncJob , stats , 0 , 40 , {} , [ undefined , 'my' ] ] ,
			two: [ asyncJob , stats , 1 , 20 , {} , [ undefined , 'wonderful' ] ] ,
			three: [ asyncJob , stats , 2 , 0 , {} , [ undefined , 'result' ] ]
		} )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( { one: [ undefined , 'my' ], two: [ undefined , 'wonderful' ], three: [ undefined , 'result' ] } ) ;
			expect( Object.keys( results ) ).to.eql( [ 'one' , 'two' , 'three' ] ) ;	// Check the keys order
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 2, 1, 0 ] ) ;
			done() ;
		} ) ;
	} ) ;
} ) ;



describe( "Jobs & async.Plan.prototype.using()" , function() {
	
	describe( "passing a function to .using()" , function() {
		
		it( "should take each job as an array of arguments to pass to the .using()'s function" , function( done ) {
			
			var stats = createStats( 3 ) ;
			
			async.do( [
				[ stats , 0 , 0 , {} , [ undefined , 'my' ] ] ,
				[ stats , 1 , 0 , {} , [ undefined , 'wonderful' ] ] ,
				[ stats , 2 , 0 , {} , [ undefined , 'result' ] ]
			] )
			.using( asyncJob )
			.exec( function( error , results ) {
				expect( error ).not.to.be.an( Error ) ;
				expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
				expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
				expect( stats.order ).to.eql( [ 0, 1, 2 ] ) ;
				done() ;
			} ) ;
		} ) ;
		
		it( "when the job is not an array, it should take each job as the first argument to pass to the .using()'s function" , function( done ) {
			
			var id = 0 , stats = createStats( 3 ) ;
			
			async.do( [ 'my' , 'wonderful' , 'result' ] )
			.using( function( data , callback ) {
				stats.startCounter[ id ] ++ ;
				setTimeout( function() {
					stats.endCounter[ id ] ++ ;
					stats.order.push( id ) ;
					id ++ ;
					callback( undefined , data ) ;
				} , 0 ) ;
			} )
			.exec( function( error , results ) {
				expect( error ).not.to.be.an( Error ) ;
				expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
				expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
				expect( stats.order ).to.eql( [ 0, 1, 2 ] ) ;
				done() ;
			} ) ;
		} ) ;
	} ) ;
	
	describe( "passing an array to .using()" , function() {
		
		it( "when a job is a function, it should take the .using()'s array as argument" , function( done ) {
			
			var stats = createStats( 3 ) ;
			
			async.parallel( [
				function( data , callback ) {
					var id = 0 ;
					stats.startCounter[ id ] ++ ;
					setTimeout( function() {
						stats.endCounter[ id ] ++ ;
						stats.order.push( id ) ;
						callback( undefined , "DESCRIPTION: " + data.describe ) ;
					} , 20 ) ;
				} ,
				function( data , callback ) {
					var id = 1 ;
					stats.startCounter[ id ] ++ ;
					setTimeout( function() {
						stats.endCounter[ id ] ++ ;
						stats.order.push( id ) ;
						callback( undefined , "LENGTH: " + data.body.length ) ;
					} , 10 ) ;
				} ,
				function( data , callback ) {
					var id = 2 ;
					stats.startCounter[ id ] ++ ;
					setTimeout( function() {
						stats.endCounter[ id ] ++ ;
						stats.order.push( id ) ;
						callback( undefined , "BODY: " + data.body ) ;
					} , 0 ) ;
				}
			] )
			.using( [ { describe: 'some data' , body: 'blahblihblah' } ] )
			.exec( function( error , results ) {
				expect( error ).not.to.be.an( Error ) ;
				expect( results ).to.eql( [
					[ undefined , 'DESCRIPTION: some data' ] ,
					[ undefined , 'LENGTH: 12' ] ,
					[ undefined , 'BODY: blahblihblah' ]
				] ) ;
				expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
				expect( stats.order ).to.eql( [ 2, 1, 0 ] ) ;
				done() ;
			} ) ;
		} ) ;
	} ) ;
} ) ;



describe( "Jobs scheduling with async.prototype.nice()" , function() {
	
	it( "using .nice( -3 ), it should run the series of job with synchonous scheduling" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.series( [
			[ asyncJob , stats , 0 , 50 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 100 , {} , [ undefined , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 0 , {} , [ undefined , 'result' ] ]
		] )
		.nice( -3 )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1, 2 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "using .nice( -2 ), it should run the series of job with an async scheduling (nextTick)" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.series( [
			[ asyncJob , stats , 0 , 50 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 100 , {} , [ undefined , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 0 , {} , [ undefined , 'result' ] ]
		] )
		.nice( -2 )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1, 2 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "using .nice( -1 ), it should run the series of job with an async scheduling (setImmediate)" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.series( [
			[ asyncJob , stats , 0 , 50 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 100 , {} , [ undefined , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 0 , {} , [ undefined , 'result' ] ]
		] )
		.nice( -1 )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1, 2 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "using .nice( 10 ), it should run the series of job with an async scheduling (setTimeout 100ms)" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.series( [
			[ asyncJob , stats , 0 , 50 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 100 , {} , [ undefined , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 0 , {} , [ undefined , 'result' ] ]
		] )
		.nice( 10 )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1, 2 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "using .nice( -3 ), it should run the jobs in parallel with synchonous scheduling" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.parallel( [
			[ asyncJob , stats , 0 , 50 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 100 , {} , [ undefined , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 0 , {} , [ undefined , 'result' ] ]
		] )
		.nice( -3 )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 2, 0, 1 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "using .nice( -2 ), it should run the jobs in parallel with an async scheduling (nextTick)" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.parallel( [
			[ asyncJob , stats , 0 , 50 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 100 , {} , [ undefined , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 0 , {} , [ undefined , 'result' ] ]
		] )
		.nice( -2 )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 2, 0, 1 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "using .nice( -1 ), it should run the jobs in parallel with an async scheduling (setImmediate)" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.parallel( [
			[ asyncJob , stats , 0 , 50 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 100 , {} , [ undefined , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 0 , {} , [ undefined , 'result' ] ]
		] )
		.nice( -1 )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 2, 0, 1 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "using .nice( 10 ), it should run the jobs in parallel with an async scheduling (setTimeout 100ms)" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.parallel( [
			[ asyncJob , stats , 0 , 50 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 100 , {} , [ undefined , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 0 , {} , [ undefined , 'result' ] ]
		] )
		.nice( 10 )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 2, 0, 1 ] ) ;
			done() ;
		} ) ;
	} ) ;
} ) ;



describe( "Jobs & async.Plan.prototype.execMapping(), adding input arguments to .exec()" , function() {
	
	it( "using default exec()'s arguments mapping, called with no argument, it should not throw error" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.series( [
			[ asyncJob , stats , 0 , 50 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 100 , {} , [ undefined , 'wonderful' ] ] ,
			function( callback ) {
				var id = 2 ;
				stats.startCounter[ id ] ++ ;
				setTimeout( function() {
					stats.endCounter[ id ] ++ ;
					stats.order.push( id ) ;
					callback( undefined , "result" ) ;
					expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
					expect( stats.order ).to.eql( [ 0, 1, 2 ] ) ;
					done() ;
				} , 0 ) ;
			}
		] )
		.exec() ;
	} ) ;
	
	it( "using default exec()'s arguments mapping, when a job is a function, it should take the input arguments passed to .exec()" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.parallel( [
			function( describe , body , callback ) {
				var id = 0 ;
				stats.startCounter[ id ] ++ ;
				setTimeout( function() {
					stats.endCounter[ id ] ++ ;
					stats.order.push( id ) ;
					callback( undefined , "DESCRIPTION: " + describe ) ;
				} , 20 ) ;
			} ,
			function( describe , body , callback ) {
				var id = 1 ;
				stats.startCounter[ id ] ++ ;
				setTimeout( function() {
					stats.endCounter[ id ] ++ ;
					stats.order.push( id ) ;
					callback( undefined , "LENGTH: " + body.length ) ;
				} , 10 ) ;
			} ,
			function( describe , body , callback ) {
				var id = 2 ;
				stats.startCounter[ id ] ++ ;
				setTimeout( function() {
					stats.endCounter[ id ] ++ ;
					stats.order.push( id ) ;
					callback( undefined , "BODY: " + body ) ;
				} , 0 ) ;
			}
		] )
		.exec( 'some data' , 'blahblihblah' , function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [
				[ undefined , 'DESCRIPTION: some data' ] ,
				[ undefined , 'LENGTH: 12' ] ,
				[ undefined , 'BODY: blahblihblah' ]
			] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 2, 1, 0 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "when a job is a function, it should take the input arguments passed to .exec()" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.parallel( [
			function( describe , body , callback ) {
				var id = 0 ;
				stats.startCounter[ id ] ++ ;
				setTimeout( function() {
					stats.endCounter[ id ] ++ ;
					stats.order.push( id ) ;
					callback( undefined , "DESCRIPTION: " + describe ) ;
				} , 20 ) ;
			} ,
			function( describe , body , callback ) {
				var id = 1 ;
				stats.startCounter[ id ] ++ ;
				setTimeout( function() {
					stats.endCounter[ id ] ++ ;
					stats.order.push( id ) ;
					callback( undefined , "LENGTH: " + body.length ) ;
				} , 10 ) ;
			} ,
			function( describe , body , callback ) {
				var id = 2 ;
				stats.startCounter[ id ] ++ ;
				setTimeout( function() {
					stats.endCounter[ id ] ++ ;
					stats.order.push( id ) ;
					callback( undefined , "BODY: " + body ) ;
				} , 0 ) ;
			}
		] )
		.execMapping( { callbacks: [ 'finally' ] , minInputs: 2 , maxInputs: 2 , inputsName: [ 'describe' , 'body' ] } )
		.exec( 'some data' , 'blahblihblah' , function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [
				[ undefined , 'DESCRIPTION: some data' ] ,
				[ undefined , 'LENGTH: 12' ] ,
				[ undefined , 'BODY: blahblihblah' ]
			] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 2, 1, 0 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "when mixing arguments passed to .exec() and .using(), .exec()'s arguments overlapping .using()'s arguments should overwrite" , function( done ) {
		
		var stats ;
		
		var asyncPlan = async.parallel( [
			function( describe , body , callback ) {
				var id = 0 ;
				stats.startCounter[ id ] ++ ;
				setTimeout( function() {
					stats.endCounter[ id ] ++ ;
					stats.order.push( id ) ;
					callback( undefined , "DESCRIPTION: " + describe ) ;
				} , 20 ) ;
			} ,
			function( describe , body , callback ) {
				var id = 1 ;
				stats.startCounter[ id ] ++ ;
				setTimeout( function() {
					stats.endCounter[ id ] ++ ;
					stats.order.push( id ) ;
					callback( undefined , "LENGTH: " + body.length ) ;
				} , 10 ) ;
			} ,
			function( describe , body , callback ) {
				var id = 2 ;
				stats.startCounter[ id ] ++ ;
				setTimeout( function() {
					stats.endCounter[ id ] ++ ;
					stats.order.push( id ) ;
					callback( undefined , "BODY: " + body ) ;
				} , 0 ) ;
			}
		] )
		.using( [ "<insert .using()'s description here>" , "<insert .using()'s body here>" ] )
		.execMapping( { callbacks: [ 'finally' ] , minInputs: 0 , maxInputs: 2 , inputsName: [ 'describe' , 'body' ] } ) ;
		
		stats = createStats( 3 ) ;
		
		asyncPlan.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [
				[ undefined , "DESCRIPTION: <insert .using()'s description here>" ] ,
				[ undefined , 'LENGTH: 29' ] ,
				[ undefined , "BODY: <insert .using()'s body here>" ]
			] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 2, 1, 0 ] ) ;
			
			stats = createStats( 3 ) ;
			
			asyncPlan.exec( "<insert .exec()'s description here>" , function( error , results ) {
				expect( error ).not.to.be.an( Error ) ;
				expect( results ).to.eql( [
					[ undefined , "DESCRIPTION: <insert .exec()'s description here>" ] ,
					[ undefined , 'LENGTH: 29' ] ,
					[ undefined , "BODY: <insert .using()'s body here>" ]
				] ) ;
				expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
				expect( stats.order ).to.eql( [ 2, 1, 0 ] ) ;
				
				stats = createStats( 3 ) ;
				
				asyncPlan.exec( "<insert .exec()'s description here>" , "<insert .exec()'s body here>" , function( error , results ) {
					expect( error ).not.to.be.an( Error ) ;
					expect( results ).to.eql( [
						[ undefined , "DESCRIPTION: <insert .exec()'s description here>" ] ,
						[ undefined , 'LENGTH: 28' ] ,
						[ undefined , "BODY: <insert .exec()'s body here>" ]
					] ) ;
					expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
					expect( stats.order ).to.eql( [ 2, 1, 0 ] ) ;
					done() ;
				} ) ;
			} ) ;
		} ) ;
	} ) ;
} ) ;



describe( "*this*" , function() {
	
	it( "each job function should have *this* set to the current jobContext, jobCallback.jobContext should be an alternate way to access it" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.series( [
			function( callback ) {
				var id = 0 ;
				expect( this ).to.be.an( async.JobContext ) ;
				expect( callback.jobContext ).to.be( this ) ;
				expect( this.execContext ).to.be.an( async.ExecContext ) ;
				expect( this.execContext.results ).to.eql( [ undefined ] ) ;
				stats.startCounter[ id ] ++ ;
				setTimeout( function() {
					stats.endCounter[ id ] ++ ;
					stats.order.push( id ) ;
					callback( undefined , 'my' ) ;
				} , 0 ) ;
			} ,
			function( callback ) {
				var id = 1 ;
				expect( this ).to.be.an( async.JobContext ) ;
				expect( callback.jobContext ).to.be( this ) ;
				expect( this.execContext ).to.be.an( async.ExecContext ) ;
				expect( this.execContext.results ).to.eql( [ [ undefined , 'my' ] , undefined ] ) ;
				stats.startCounter[ id ] ++ ;
				setTimeout( function() {
					stats.endCounter[ id ] ++ ;
					stats.order.push( id ) ;
					callback( undefined , 'wonderful' ) ;
				} , 0 ) ;
			} ,
			function( callback ) {
				var id = 2 ;
				expect( this ).to.be.an( async.JobContext ) ;
				expect( callback.jobContext ).to.be( this ) ;
				expect( this.execContext ).to.be.an( async.ExecContext ) ;
				expect( this.execContext.results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], undefined ] ) ;
				stats.startCounter[ id ] ++ ;
				setTimeout( function() {
					stats.endCounter[ id ] ++ ;
					stats.order.push( id ) ;
					callback( undefined , 'result' ) ;
				} , 0 ) ;
			}
		] )
		.exec( done ) ;
	} ) ;
	
	it( "using()'s function should have *this* set to the current jobContext" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.series( [
			[ 0 , 'my' , [ undefined ] ] ,
			[ 1 , 'wonderful' , [ [ undefined , 'my' ] , undefined ] ] ,
			[ 2 , 'result' , [ [ undefined , 'my' ], [ undefined , 'wonderful' ], undefined ] ]
		] )
		.using( function( id , result , expectedThisResults , callback ) {
			expect( this ).to.be.an( async.JobContext ) ;
			expect( callback.jobContext ).to.be( this ) ;
			expect( this.execContext ).to.be.an( async.ExecContext ) ;
			expect( this.execContext.results ).to.eql( expectedThisResults ) ;
			stats.startCounter[ id ] ++ ;
			setTimeout( function() {
				stats.endCounter[ id ] ++ ;
				stats.order.push( id ) ;
				callback( undefined , result ) ;
			} , 0 ) ;
		} )
		.exec( done ) ;
	} ) ;
	
	it( "every user provided callback should have *this* set to the current execContext" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.series( [
			[ asyncJob , stats , 0 , 0 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 0 , {} , [ undefined , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 0 , {} , [ undefined , 'result' ] ]
		] )
		.then( function( results ) {
			expect( this ).to.be.an( async.ExecContext ) ;
			expect( this.results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
		} )
		.finally( function( error , results ) {
			expect( this ).to.be.an( async.ExecContext ) ;
			expect( this.results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
		} )
		.execThenCatch(
			function( results ) {
				expect( this ).to.be.an( async.ExecContext ) ;
				expect( this.results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			} ,
			function( error ) {} ,
			function( error , results ) {
				expect( this ).to.be.an( async.ExecContext ) ;
				expect( this.results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
				done() ;
			}
		) ;
	} ) ;
	
	it( "a job can register to the 'timeout' event, that will be triggered when using .timeout() when the job exceed the time limit" , function( done ) {
		
		var stats = createStats( 3 ) ;
		var timeoutArray = [ false , false , false ] ;
		
		async.parallel( [
			function( callback ) {
				var id = 0 ;
				expect( this ).to.be.an( async.JobContext ) ;
				expect( callback.jobContext ).to.be( this ) ;
				expect( this.execContext ).to.be.an( async.ExecContext ) ;
				stats.startCounter[ id ] ++ ;
				
				this.on( 'timeout' , function() {
					timeoutArray[ id ] = true ;
				} ) ;
				
				setTimeout( function() {
					stats.endCounter[ id ] ++ ;
					stats.order.push( id ) ;
					callback( undefined , 'my' ) ;
				} , 20 ) ;
			} ,
			function( callback ) {
				var id = 1 ;
				expect( this ).to.be.an( async.JobContext ) ;
				expect( callback.jobContext ).to.be( this ) ;
				expect( this.execContext ).to.be.an( async.ExecContext ) ;
				stats.startCounter[ id ] ++ ;
				
				this.on( 'timeout' , function() {
					timeoutArray[ id ] = true ;
				} ) ;
				
				setTimeout( function() {
					stats.endCounter[ id ] ++ ;
					stats.order.push( id ) ;
					callback( undefined , 'wonderful' ) ;
				} , 60 ) ;
			} ,
			function( callback ) {
				var id = 2 ;
				expect( this ).to.be.an( async.JobContext ) ;
				expect( callback.jobContext ).to.be( this ) ;
				expect( this.execContext ).to.be.an( async.ExecContext ) ;
				stats.startCounter[ id ] ++ ;
				
				this.on( 'timeout' , function() {
					timeoutArray[ id ] = true ;
				} ) ;
				
				setTimeout( function() {
					stats.endCounter[ id ] ++ ;
					stats.order.push( id ) ;
					callback( undefined , 'result' ) ;
				} , 0 ) ;
			}
		] )
		.timeout( 40 )
		.exec( function( error , results ) {
			expect( error ).to.be.ok() ;
			expect( results ).to.eql( [ [ undefined, 'my' ] , [ new async.AsyncError( 'jobTimeout' ) ] , [ undefined, 'result' ] ] ) ;
			expect( timeoutArray ).to.be.eql( [ false , true , false ] ) ;
			done() ;
		} ) ;
	} ) ;
} ) ;



describe( "JobContext.abort()" , function() {
	
	it( "should start a series of sync job, one of them call this.abort(), so it should abort the whole job's queue" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.series( [
			[ syncJob , stats , 0 , {} , [ undefined , 'my' ] ] ,
			[ syncJob , stats , 1 , { abort: true } , [ undefined , 'wonderful' ] ] ,
			[ syncJob , stats , 2 , {} , [ undefined , 'result' ] ]
		] )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ] ] ) ;
			expect( stats.startCounter ).to.eql( [ 1, 1, 0 ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 0 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "should start a series of async job, one of them call this.abort(), so it should abort the whole job's queue" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.series( [
			[ asyncJob , stats , 0 , 20 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 50 , { abort: true } , [ undefined , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 0 , {} , [ undefined , 'result' ] ]
		] )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ] ] ) ;
			expect( stats.startCounter ).to.eql( [ 1, 1, 0 ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 0 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "a job within a while loop, calling this.abort(), cannot abort the whole loop" , function( done ) {
		
		var stats = createStats( 3 ) ;
		var count = -1 ;
		
		async.while( function( error , results , callback ) {
			count ++ ;
			callback( count < 3 ) ;
		} )
		.do( [
			function( callback ) {
				stats.startCounter[ count ] ++ ;
				stats.endCounter[ count ] ++ ;
				stats.order.push( count ) ;
				if ( count === 1 ) { this.abort( undefined , count ) ; }
				else { callback( undefined , count ) ; }
			}
		] )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined, 2 ] ] ) ;
			expect( stats.startCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1, 2 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "should run a job within a while loop, one of them call this.abortLoop(), so it should abort the whole loop" , function( done ) {
		
		var stats = createStats( 3 ) ;
		var count = -1 ;
		
		async.while( function( error , results , callback ) {
			count ++ ;
			callback( count < 3 ) ;
		} )
		.do( [
			function( callback ) {
				stats.startCounter[ count ] ++ ;
				stats.endCounter[ count ] ++ ;
				stats.order.push( count ) ;
				if ( count === 1 ) { this.abortLoop( undefined , count ) ; }
				else { callback( undefined , count ) ; }
			}
		] )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined, 1 ] ] ) ;
			expect( stats.startCounter ).to.eql( [ 1, 1, 0 ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 0 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1 ] ) ;
			done() ;
		} ) ;
	} ) ;
} ) ;



describe( "ExecContext.getJobsStatus()" , function() {

	it( "should return the real-time status of all jobs at any time (here in series mode)" , function( done ) {
		
		async.series( [
			function one( callback ) {
				var jobsStatus = this.execContext.getJobsStatus() ;
				
				expect( this ).to.be.an( async.JobContext ) ;
				expect( this.execContext ).to.be.an( async.ExecContext ) ;
				
				expect( jobsStatus[ 0 ].status ).to.be( 'pending' ) ;
				expect( jobsStatus[ 1 ].status ).to.be( 'waiting' ) ;
				expect( jobsStatus[ 2 ].status ).to.be( 'waiting' ) ;
				expect( jobsStatus[ 3 ].status ).to.be( 'waiting' ) ;
				expect( jobsStatus[ 4 ].status ).to.be( 'waiting' ) ;
				
				setTimeout( function() {
					callback( undefined , 'ok' ) ;
				} , 20 ) ;
			} ,
			function two( callback ) {
				var jobsStatus = this.execContext.getJobsStatus() ;
				
				expect( this ).to.be.an( async.JobContext ) ;
				expect( this.execContext ).to.be.an( async.ExecContext ) ;
				
				expect( jobsStatus[ 0 ].status ).to.be( 'ok' ) ;
				expect( jobsStatus[ 1 ].status ).to.be( 'pending' ) ;
				expect( jobsStatus[ 2 ].status ).to.be( 'waiting' ) ;
				expect( jobsStatus[ 3 ].status ).to.be( 'waiting' ) ;
				expect( jobsStatus[ 4 ].status ).to.be( 'waiting' ) ;
				
				setTimeout( function() {
					callback( new Error( 'somethingBadHappens' ) ) ;
				} , 20 ) ;
			} ,
			function three( callback ) {
				var jobsStatus = this.execContext.getJobsStatus() ;
				
				expect( this ).to.be.an( async.JobContext ) ;
				expect( this.execContext ).to.be.an( async.ExecContext ) ;
				
				expect( jobsStatus[ 0 ].status ).to.be( 'ok' ) ;
				expect( jobsStatus[ 1 ].status ).to.be( 'failed' ) ;
				expect( jobsStatus[ 2 ].status ).to.be( 'pending' ) ;
				expect( jobsStatus[ 3 ].status ).to.be( 'waiting' ) ;
				expect( jobsStatus[ 4 ].status ).to.be( 'waiting' ) ;
				
				setTimeout( function() {
					callback( undefined , 'should timeout!' ) ;
				} , 60 ) ;
			} ,
			function four( callback ) {
				var self = this , jobsStatus = this.execContext.getJobsStatus() ;
				
				expect( this ).to.be.an( async.JobContext ) ;
				expect( this.execContext ).to.be.an( async.ExecContext ) ;
				
				expect( jobsStatus[ 0 ].status ).to.be( 'ok' ) ;
				expect( jobsStatus[ 1 ].status ).to.be( 'failed' ) ;
				expect( jobsStatus[ 2 ].status ).to.be( 'timeout' ) ;
				expect( jobsStatus[ 3 ].status ).to.be( 'pending' ) ;
				expect( jobsStatus[ 4 ].status ).to.be( 'waiting' ) ;
				
				setTimeout( function() {
					self.abort() ;
				} , 0 ) ;
			} ,
			function five( callback ) {
				expect().fail( "This code should never be reached" ) ;
			}
		] )
		.timeout( 40 )
		.fatal( false )
		.exec( function( error , results ) {
			
			var jobsStatus = this.getJobsStatus() ;
			
			expect( error ).not.to.be.ok() ;
			
			expect( jobsStatus[ 0 ].status ).to.be( 'ok' ) ;
			expect( jobsStatus[ 1 ].status ).to.be( 'failed' ) ;
			expect( jobsStatus[ 2 ].status ).to.be( 'timeout' ) ;
			expect( jobsStatus[ 3 ].status ).to.be( 'aborted' ) ;
			expect( jobsStatus[ 4 ].status ).to.be( 'waiting' ) ;
			
			done() ;
		} ) ;
	} ) ;

	it( "should return the real-time status of all jobs at any time (here in parallel mode)" , function( done ) {
		
		async.parallel( [
			function one( callback ) {
				var jobsStatus = this.execContext.getJobsStatus() ;
				
				expect( this ).to.be.an( async.JobContext ) ;
				expect( this.execContext ).to.be.an( async.ExecContext ) ;
				
				expect( jobsStatus[ 0 ].status ).to.be( 'pending' ) ;
				expect( jobsStatus[ 1 ].status ).to.be( 'waiting' ) ;
				expect( jobsStatus[ 2 ].status ).to.be( 'waiting' ) ;
				expect( jobsStatus[ 3 ].status ).to.be( 'waiting' ) ;
				expect( jobsStatus[ 4 ].status ).to.be( 'waiting' ) ;
				
				setTimeout( function() {
					callback( undefined , 'ok' ) ;
				} , 20 ) ;
			} ,
			function two( callback ) {
				var jobsStatus = this.execContext.getJobsStatus() ;
				
				expect( this ).to.be.an( async.JobContext ) ;
				expect( this.execContext ).to.be.an( async.ExecContext ) ;
				
				expect( jobsStatus[ 0 ].status ).to.be( 'pending' ) ;
				expect( jobsStatus[ 1 ].status ).to.be( 'pending' ) ;
				expect( jobsStatus[ 2 ].status ).to.be( 'waiting' ) ;
				expect( jobsStatus[ 3 ].status ).to.be( 'waiting' ) ;
				expect( jobsStatus[ 4 ].status ).to.be( 'waiting' ) ;
				
				setTimeout( function() {
					callback( new Error( 'somethingBadHappens' ) ) ;
				} , 20 ) ;
			} ,
			function three( callback ) {
				var jobsStatus = this.execContext.getJobsStatus() ;
				
				expect( this ).to.be.an( async.JobContext ) ;
				expect( this.execContext ).to.be.an( async.ExecContext ) ;
				
				expect( jobsStatus[ 0 ].status ).to.be( 'pending' ) ;
				expect( jobsStatus[ 1 ].status ).to.be( 'pending' ) ;
				expect( jobsStatus[ 2 ].status ).to.be( 'pending' ) ;
				expect( jobsStatus[ 3 ].status ).to.be( 'waiting' ) ;
				expect( jobsStatus[ 4 ].status ).to.be( 'waiting' ) ;
				
				setTimeout( function() {
					callback( undefined , 'should timeout!' ) ;
				} , 60 ) ;
			} ,
			function four( callback ) {
				var self = this , jobsStatus = this.execContext.getJobsStatus() ;
				
				expect( this ).to.be.an( async.JobContext ) ;
				expect( this.execContext ).to.be.an( async.ExecContext ) ;
				
				expect( jobsStatus[ 0 ].status ).to.be( 'pending' ) ;
				expect( jobsStatus[ 1 ].status ).to.be( 'pending' ) ;
				expect( jobsStatus[ 2 ].status ).to.be( 'pending' ) ;
				expect( jobsStatus[ 3 ].status ).to.be( 'pending' ) ;
				expect( jobsStatus[ 4 ].status ).to.be( 'waiting' ) ;
				
				setTimeout( function() {
					self.abort() ;
				} , 30 ) ;
			} ,
			function five( callback ) {
				var jobsStatus = this.execContext.getJobsStatus() ;
				
				expect( this ).to.be.an( async.JobContext ) ;
				expect( this.execContext ).to.be.an( async.ExecContext ) ;
				
				expect( jobsStatus[ 0 ].status ).to.be( 'pending' ) ;
				expect( jobsStatus[ 1 ].status ).to.be( 'pending' ) ;
				expect( jobsStatus[ 2 ].status ).to.be( 'pending' ) ;
				expect( jobsStatus[ 3 ].status ).to.be( 'pending' ) ;
				expect( jobsStatus[ 4 ].status ).to.be( 'pending' ) ;
			}
		] )
		.timeout( 40 )
		.fatal( false )
		.exec( function( error , results ) {
			
			var jobsStatus = this.getJobsStatus() ;
			
			expect( error ).not.to.be.ok() ;
			
			expect( jobsStatus[ 0 ].status ).to.be( 'ok' ) ;
			
			expect( jobsStatus[ 1 ].status ).to.be( 'failed' ) ;
			
			// Sometime 'timeout' kick in before execThen(), but it should be considered as a normal behaviour
			//expect( jobsStatus[ 2 ].status ).to.be( 'pending' ) ;
			expect( [ 'pending' , 'timeout' ] ).to.contain( jobsStatus[ 2 ].status ) ;
			
			expect( jobsStatus[ 3 ].status ).to.be( 'aborted' ) ;
			
			// Same here
			//expect( jobsStatus[ 4 ].status ).to.be( 'pending' ) ;
			expect( [ 'pending' , 'timeout' ] ).to.contain( jobsStatus[ 4 ].status ) ;
			
			done() ;
		} ) ;
	} ) ;
	
	it( "should report the number of retry of a job, as well as the list of successives errors" , function( done ) {
		
		var jobOneTries = 1 , jobTwoTries = 1 ;
		
		async.parallel( [
			function one( callback ) {
				setTimeout( function() {
					if ( jobOneTries < 6 ) { callback( new Error( 'somethingBadHappens' + jobOneTries ) ) ; }
					else { callback( undefined , 'ok' ) ; }
					jobOneTries ++ ;
				} , 20 ) ;
			} ,
			function two( callback ) {
				setTimeout( function() {
					if ( jobTwoTries < 2 ) { callback( new Error( 'somethingBadHappens' + jobTwoTries ) ) ; }
					else { callback( undefined , 'ok' ) ; }
					jobTwoTries ++ ;
				} , 20 ) ;
			}
		] )
		.retry( 3 , 5 )
		.exec( function( error , results ) {
			
			var jobsStatus = this.getJobsStatus() ;
			//console.log( jobsStatus ) ;
			
			expect( error ).to.be.ok() ;
			
			expect( jobsStatus[ 0 ].status ).to.be( 'failed' ) ;
			expect( jobsStatus[ 0 ].tried ).to.be( 4 ) ;
			expect( jobsStatus[ 0 ].errors.length ).to.be( 4 ) ;
			expect( jobsStatus[ 0 ].errors[ 0 ].message ).to.be( 'somethingBadHappens1' ) ;
			expect( jobsStatus[ 0 ].errors[ 1 ].message ).to.be( 'somethingBadHappens2' ) ;
			expect( jobsStatus[ 0 ].errors[ 2 ].message ).to.be( 'somethingBadHappens3' ) ;
			expect( jobsStatus[ 0 ].errors[ 3 ].message ).to.be( 'somethingBadHappens4' ) ;
			expect( jobsStatus[ 0 ].result ).to.eql( [ new Error( 'somethingBadHappens4' ) ] ) ;
			
			expect( jobsStatus[ 1 ].status ).to.be( 'ok' ) ;
			expect( jobsStatus[ 1 ].tried ).to.be( 2 ) ;
			expect( jobsStatus[ 1 ].errors.length ).to.be( 1 ) ;
			expect( jobsStatus[ 1 ].errors[ 0 ].message ).to.be( 'somethingBadHappens1' ) ;
			expect( jobsStatus[ 1 ].result ).to.eql( [ undefined, 'ok' ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "should give insight when a job call its callback twice or more" , function( done ) {
	
		async.parallel( [
			function one( callback ) {
				setTimeout( function() {
					callback( undefined , 'ok' ) ;
					callback( undefined , 'callback used twice' ) ;
					callback( undefined , 'callback used three times' ) ;
				} , 20 ) ;
			} ,
			function two( callback ) {
				setTimeout( function() {
					callback( undefined , 'ok' ) ;
				} , 20 ) ;
			}
		] )
		.exec( function( error , results ) {
			
			var jobsStatus = this.getJobsStatus() ;
			//console.log( jobsStatus ) ;
			
			expect( error ).not.to.be.ok() ;
			
			expect( jobsStatus[ 0 ].status ).to.be( 'ok' ) ;
			expect( jobsStatus[ 0 ].tried ).to.be( 1 ) ;
			expect( jobsStatus[ 0 ].errors.length ).to.be( 2 ) ;
			expect( jobsStatus[ 0 ].errors[ 0 ].message ).to.be( 'This job has called its completion callback 2 times' ) ;
			expect( jobsStatus[ 0 ].errors[ 1 ].message ).to.be( 'This job has called its completion callback 3 times' ) ;
			expect( jobsStatus[ 0 ].result ).to.eql( [ undefined , 'ok' ] ) ;
			
			expect( jobsStatus[ 1 ].status ).to.be( 'ok' ) ;
			expect( jobsStatus[ 1 ].tried ).to.be( 1 ) ;
			expect( jobsStatus[ 1 ].errors.length ).to.be( 0 ) ;
			expect( jobsStatus[ 1 ].result ).to.eql( [ undefined, 'ok' ] ) ;
			done() ;
		} ) ;
	} ) ;
} ) ;



describe( "async.foreach()" , function() {
	
	it( "should take each job as an element to pass to the iterator function" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		var myArray = [
			{ id: 0 , timeout: 10 , result: [ undefined , 'my' ] } ,
			{ id: 1 , timeout: 0 , result: [ undefined , 'wonderful' ] } ,
			{ id: 2 , timeout: 0 , result: [ undefined , 'result' ] }
		] ;
		
		async.foreach( myArray , function( element , callback ) {
			
			stats.startCounter[ element.id ] ++ ;
			
			setTimeout( function() {
				stats.endCounter[ element.id ] ++ ;
				stats.order.push( element.id ) ;
				callback.apply( undefined , element.result ) ;
			} , element.delay ) ;
		} )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1, 2 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "when the *iterator* accepts three arguments, the current key (array's index) is passed to it as the second argument" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		var myArray = [
			{ id: 0 , timeout: 10 , result: [ undefined , 'my' ] } ,
			{ id: 1 , timeout: 0 , result: [ undefined , 'wonderful' ] } ,
			{ id: 2 , timeout: 0 , result: [ undefined , 'result' ] }
		] ;
		
		async.foreach( myArray , function( element , key , callback ) {
			
			stats.startCounter[ element.id ] ++ ;
			expect( key ).to.equal( element.id ) ;
			
			setTimeout( function() {
				stats.endCounter[ element.id ] ++ ;
				stats.order.push( element.id ) ;
				callback.apply( undefined , element.result ) ;
			} , element.delay ) ;
		} )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1, 2 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "if the container to iterate is an object, the current key (property name) is passed to it as the second argument" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		var myObject = {
			one: { id: 0 , name: 'one' , timeout: 10 , result: [ undefined , 'my' ] } ,
			two: { id: 1 , name: 'two' , timeout: 0 , result: [ undefined , 'wonderful' ] } ,
			three: { id: 2 , name: 'three' , timeout: 0 , result: [ undefined , 'result' ] }
		} ;
		
		async.foreach( myObject , function( element , key , callback ) {
			
			stats.startCounter[ element.id ] ++ ;
			expect( key ).to.equal( element.name ) ;
			
			setTimeout( function() {
				stats.endCounter[ element.id ] ++ ;
				stats.order.push( element.id ) ;
				callback.apply( undefined , element.result ) ;
			} , element.delay ) ;
		} )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( { one: [ undefined , 'my' ], two: [ undefined , 'wonderful' ], three: [ undefined , 'result' ] } ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1, 2 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "when the *iterator* accepts (at least) four arguments, the whole job's array or object is passed to it as the third argument" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		var myArray = [
			{ id: 0 , timeout: 10 , result: [ undefined , 'my' ] } ,
			{ id: 1 , timeout: 0 , result: [ undefined , 'wonderful' ] } ,
			{ id: 2 , timeout: 0 , result: [ undefined , 'result' ] }
		] ;
		
		async.foreach( myArray , function( element , key , array , callback ) {
			
			stats.startCounter[ element.id ] ++ ;
			expect( key ).to.equal( element.id ) ;
			expect( array ).to.eql( myArray ) ;
			
			setTimeout( function() {
				stats.endCounter[ element.id ] ++ ;
				stats.order.push( element.id ) ;
				callback.apply( undefined , element.result ) ;
			} , element.delay ) ;
		} )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1, 2 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "if a job fails, it should continue anyway processing others" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		var myArray = [
			{ id: 0 , timeout: 10 , result: [ undefined , 'my' ] } ,
			{ id: 1 , timeout: 0 , result: [ new Error() , 'wonderful' ] } ,
			{ id: 2 , timeout: 0 , result: [ undefined , 'result' ] }
		] ;
		
		async.foreach( myArray , function( element , callback ) {
			
			stats.startCounter[ element.id ] ++ ;
			
			setTimeout( function() {
				stats.endCounter[ element.id ] ++ ;
				stats.order.push( element.id ) ;
				callback.apply( undefined , element.result ) ;
			} , element.delay ) ;
		} )
		.exec( function( error , results ) {
			expect( error ).not.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ new Error() , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1, 2 ] ) ;
			done() ;
		} ) ;
	} ) ;
} ) ;



describe( "async.map()" , function() {
	
	it( "should take each job as an element to pass to the iterator function, and create a new array with computed values and 1:1 mapping" , function( done ) {
		
		var myArray = [ 'my' , 'wonderful' , 'result' ] ;
		
		async.map( myArray , function( element , callback ) {
			
			setTimeout( function() {
				callback( undefined , element.length ) ;
			} , 0 ) ;
		} )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ 2, 9, 6 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "should take each job of an object as an element to pass to the iterator function, and create a new object with computed values and 1:1 mapping" , function( done ) {
		
		var myObject = { one: 'my' , two: 'wonderful' , three: 'result' } ;
		
		async.map( myObject , function( element , callback ) {
			
			setTimeout( function() {
				callback( undefined , element.length ) ;
			} , 0 ) ;
		} )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( { one: 2, two: 9, three: 6 } ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "when the *iterator* accepts (at least) three arguments, the current key (array's index) is passed to it as the second argument" , function( done ) {
		
		var myArray = [ 'my' , 'wonderful' , 'result' ] ;
		var count = 0 ;
		
		async.map( myArray , function( element , key , callback ) {
			
			expect( key ).to.equal( count ) ;
			count ++ ;
			
			setTimeout( function() {
				callback( undefined , element.length ) ;
			} , 0 ) ;
		} )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ 2, 9, 6 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "if the container to iterate is an object, the current key (property name) is passed to it as the second argument" , function( done ) {
		
		var myObject = { my: 'my' , wonderful: 'wonderful' , result: 'result' } ;
		
		async.map( myObject , function( element , key , callback ) {
			
			expect( key ).to.equal( element ) ;
			
			setTimeout( function() {
				callback( undefined , element.length ) ;
			} , 0 ) ;
		} )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( { my: 2, wonderful: 9, result: 6 } ) ;
			done() ;
		} ) ;
	} ) ;
} ) ;



describe( "async.reduce()" , function() {
	
	it( "should take each job as an element to pass to the iterator function, and trigger callback with an aggregated value" , function( done ) {
		
		var myArray = [ 'my' , 'wonderful' , 'result' ] ;
		
		async.reduce( myArray , 5 , function( aggregate , element , callback ) {
			
			setTimeout( function() {
				callback( undefined , aggregate + element.length ) ;
			} , 0 ) ;
		} )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( 22 ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "if a default initial aggregate value is not supplied to async.reduce(), this initial value should be supplied as exec()'s first argument by default" , function( done ) {
		
		var myArray = [ 'my' , 'wonderful' , 'result' ] ;
		
		var plan = async.reduce( myArray , function( aggregate , element , callback ) {
			
			setTimeout( function() {
				callback( undefined , aggregate + element.length ) ;
			} , 0 ) ;
		} )
		.exec( 7 , function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( 24 ) ;
			done() ;
		} ) ;
	} ) ;
} ) ;



describe( "async.waterfall()" , function() {
	
	it( "should run the series of job in waterfall mode: each job received the result of the previous, the final result is the result of the last job, the first job receive arguments from exec(), if any" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.waterfall( [
			function( str , callback ) {
				setTimeout( function() {
					callback( undefined , str + ' my' ) ;
				} , 10 ) ;
			} ,
			function( str , callback ) {
				setTimeout( function() {
					callback( undefined , str + ' wonderful' ) ;
				} , 20 ) ;
			} ,
			function( str , callback ) {
				setTimeout( function() {
					callback( undefined , str + ' result' ) ;
				} , 0 ) ;
			}
		] )
		.exec( 'oh' , function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.equal( 'oh my wonderful result' ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "using async.Plan.prototype.transmitError(), each job received the full list of arguments transmited by the previous job, including the error argument taht is truncated by default" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.waterfall( [
			function( str , callback ) {
				setTimeout( function() {
					callback( undefined , str + ' my' ) ;
				} , 10 ) ;
			} ,
			function( error , str , callback ) {
				setTimeout( function() {
					callback( undefined , str + ' wonderful' ) ;
				} , 20 ) ;
			} ,
			function( error , str , callback ) {
				setTimeout( function() {
					callback( undefined , str + ' result' ) ;
				} , 0 ) ;
			}
		] )
		.transmitError()
		.exec( 'oh' , function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.equal( 'oh my wonderful result' ) ;
			done() ;
		} ) ;
	} ) ;
} ) ;



describe( "async.race()" , function() {
	
	it( "should run parallel racing jobs, and should trigger the callback after the fastest job complete, with the winning job's results only" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.race( [
			[ asyncJob , stats , 0 , 150 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 10 , {} , [ undefined , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 50 , {} , [ undefined , 'result' ] ]
		] )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.equal( 'wonderful' ) ;
			expect( stats.endCounter ).to.eql( [ 0, 1, 0 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "when some jobs have errors, it should return after the fastest successful job, other failed results are discarded" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.race( [
			[ asyncJob , stats , 0 , 150 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 10 , {} , [ new Error() , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 50 , {} , [ undefined , 'result' ] ]
		] )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.equal( 'result' ) ;
			expect( stats.endCounter ).to.eql( [ 0, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 1, 2 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "when all jobs have errors, it should return an error" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.race( [
			[ asyncJob , stats , 0 , 100 , {} , [ new Error() , 'my' ] ] ,
			[ asyncJob , stats , 1 , 10 , {} , [ new Error() , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 50 , {} , [ new Error() , 'result' ] ]
		] )
		.exec( function( error , results ) {
			expect( error ).to.be.an( Error ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 1, 2, 0 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "when using a parallel limit, no new jobs should be processed after a job complete without error" , function( done ) {
		
		var stats = createStats( 4 ) ;
		
		async.race( [
			[ asyncJob , stats , 0 , 150 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 10 , {} , [ undefined , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 50 , {} , [ undefined , 'result' ] ] ,
			[ asyncJob , stats , 1 , 10 , {} , [ undefined , 'again' ] ]
		] )
		.parallel( 3 )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.equal( 'wonderful' ) ;
			expect( stats.startCounter ).to.eql( [ 1, 1, 1, 0 ] ) ;
			expect( stats.endCounter ).to.eql( [ 0, 1, 0, 0 ] ) ;
			done() ;
		} ) ;
	} ) ;
} ) ;



describe( "async.while()" , function() {
	
	it( "while the while()'s callback's result is true, it should run jobs in series (by default), and do it again and again, the final result contains only the last iteration" , function( done ) {
		
		var stats = createStats( 3 ) ;
		var whileCount = 0 ;
		
		async.while( function( error , results , callback ) {
			whileCount ++ ;
			callback( whileCount <= 3 ) ;
		} )
		.do( [
			[ asyncJob , stats , 0 , 30 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 0 , {} , [ undefined , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 15 , {} , [ undefined , 'result' ] ]
		] )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( whileCount ).to.equal( 4 ) ;
			expect( stats.endCounter ).to.eql( [ 3, 3, 3 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1, 2, 0, 1, 2, 0, 1, 2 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "when the while()'s callback has an error, no more iteration are performed, the last iteration results are transmitted, but the error in the while is transmitted as well" , function( done ) {
		
		var stats = createStats( 3 ) ;
		var whileCount = 0 ;
		
		async.while( function( error , results , callback ) {
			whileCount ++ ;
			callback( whileCount <= 3 ? true : new Error() ) ;
		} )
		.do( [
			[ asyncJob , stats , 0 , 30 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 0 , {} , [ undefined , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 15 , {} , [ undefined , 'result' ] ]
		] )
		.exec( function( error , results ) {
			expect( error ).to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( whileCount ).to.equal( 4 ) ;
			expect( stats.endCounter ).to.eql( [ 3, 3, 3 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1, 2, 0, 1, 2, 0, 1, 2 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "when using async.Plan.prototype.parallel(), it should run jobs in parallel, and start a new iteration only when all jobs in the current iteration have been completed, other behaviour are the same like in series" , function( done ) {
		
		var stats = createStats( 3 ) ;
		var whileCount = 0 ;
		
		async.while( function( error , results , callback ) {
			whileCount ++ ;
			callback( whileCount <= 3 ) ;
		} )
		.do( [
			[ asyncJob , stats , 0 , 30 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 0 , {} , [ undefined , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 15 , {} , [ undefined , 'result' ] ]
		] )
		.parallel( Infinity )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( whileCount ).to.equal( 4 ) ;
			expect( stats.endCounter ).to.eql( [ 3, 3, 3 ] ) ;
			expect( stats.order ).to.eql( [ 1, 2, 0, 1, 2, 0, 1, 2, 0 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "when the first call to while()'s callback's result is false, no jobs are even started, and the final result is empty" , function( done ) {
		
		var stats = createStats( 3 ) ;
		var whileCount = 0 ;
		
		async.while( function( error , results , callback ) {
			whileCount ++ ;
			callback( false ) ;
		} )
		.do( [
			[ asyncJob , stats , 0 , 30 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 0 , {} , [ undefined , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 15 , {} , [ undefined , 'result' ] ]
		] )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [] ) ;
			expect( whileCount ).to.equal( 1 ) ;
			expect( stats.endCounter ).to.eql( [ 0, 0, 0 ] ) ;
			expect( stats.order ).to.eql( [] ) ;
			done() ;
		} ) ;
	} ) ;
} ) ;



describe( "async.do().while()" , function() {
	
	it( "should work the same way as async.while() except that the while()'s callback's is evaluated at the end of the loop" , function( done ) {
		
		var stats = createStats( 3 ) ;
		var whileCount = 0 ;
		
		async.do( [
			[ asyncJob , stats , 0 , 30 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 0 , {} , [ undefined , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 15 , {} , [ undefined , 'result' ] ]
		] )
		.while( function( error , results , callback ) {
			whileCount ++ ;
			callback( whileCount <= 3 ) ;
		} )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( whileCount ).to.equal( 4 ) ;
			expect( stats.endCounter ).to.eql( [ 4, 4, 4 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "so even if the first call to while()'s callback's result is false, the first iteration is already done" , function( done ) {
		
		var stats = createStats( 3 ) ;
		var whileCount = 0 ;
		
		async.do( [
			[ asyncJob , stats , 0 , 30 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 0 , {} , [ undefined , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 15 , {} , [ undefined , 'result' ] ]
		] )
		.while( function( error , results , callback ) {
			whileCount ++ ;
			callback( false ) ;
		} )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( whileCount ).to.equal( 1 ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1, 2 ] ) ;
			done() ;
		} ) ;
	} ) ;
} ) ;



describe( "async.do().repeat()" , function() {
	
	it( "should repeat the action the given time" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.do( [
			[ asyncJob , stats , 0 , 20 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 0 , {} , [ undefined , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 10 , {} , [ undefined , 'result' ] ]
		] )
		.repeat( 4 )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 4, 4, 4 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2 ] ) ;
			done() ;
		} ) ;
	} ) ;
} ) ;



describe( "Async conditional" , function() {
	
	describe( "async.if.and()" , function() {
		
		it( "should evaluate async truthy && truthy && truthy to true, and run all jobs" , function( done ) {
			
			var stats = createStats( 3 ) ;
			
			async.if.and( [
				[ asyncJob , stats , 0 , 0 , {} , [ true ] ] ,
				[ asyncJob , stats , 1 , 0 , {} , [ 7 ] ] ,
				[ asyncJob , stats , 2 , 0 , {} , [ 'wonderful' ] ]
			] )
			.exec( function( result ) {
				expect( result ).to.equal( true ) ;
				expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
				done() ;
			} ) ;
		} ) ;
		
		it( "should evaluate async truthy && falsy && truthy to false, and run just the first and second jobs" , function( done ) {
			
			var stats = createStats( 3 ) ;
			
			async.if.and( [
				[ asyncJob , stats , 0 , 0 , {} , [ true ] ] ,
				[ asyncJob , stats , 1 , 0 , {} , [ null ] ] ,
				[ asyncJob , stats , 2 , 0 , {} , [ 'wonderful' ] ]
			] )
			.exec( function( result ) {
				expect( result ).to.equal( false ) ;
				expect( stats.endCounter ).to.eql( [ 1, 1, 0 ] ) ;
				done() ;
			} ) ;
		} ) ;
		
		it( "should evaluate async falsy && falsy && falsy to false, and run just the first job" , function( done ) {
			
			var stats = createStats( 3 ) ;
			
			async.if.and( [
				[ asyncJob , stats , 0 , 0 , {} , [ undefined ] ] ,
				[ asyncJob , stats , 1 , 0 , {} , [ null ] ] ,
				[ asyncJob , stats , 2 , 0 , {} , [ false ] ]
			] )
			.exec( function( result ) {
				expect( result ).to.equal( false ) ;
				expect( stats.endCounter ).to.eql( [ 1, 0, 0 ] ) ;
				done() ;
			} ) ;
		} ) ;
	} ) ;
		
	describe( "async.if.or()" , function() {
		
		it( "should evaluate async truthy || truthy || truthy to true, and run only the first jobs" , function( done ) {
			
			var stats = createStats( 3 ) ;
			
			async.if.or( [
				[ asyncJob , stats , 0 , 0 , {} , [ true ] ] ,
				[ asyncJob , stats , 1 , 0 , {} , [ 7 ] ] ,
				[ asyncJob , stats , 2 , 0 , {} , [ 'wonderful' ] ]
			] )
			.exec( function( result ) {
				expect( result ).to.equal( true ) ;
				expect( stats.endCounter ).to.eql( [ 1, 0, 0 ] ) ;
				done() ;
			} ) ;
		} ) ;
		
		it( "should evaluate async falsy || truthy || falsy to true, and run just the first and second jobs" , function( done ) {
			
			var stats = createStats( 3 ) ;
			
			async.if.or( [
				[ asyncJob , stats , 0 , 0 , {} , [ undefined ] ] ,
				[ asyncJob , stats , 1 , 0 , {} , [ 7 ] ] ,
				[ asyncJob , stats , 2 , 0 , {} , [ false ] ]
			] )
			.exec( function( result ) {
				expect( result ).to.equal( true ) ;
				expect( stats.endCounter ).to.eql( [ 1, 1, 0 ] ) ;
				done() ;
			} ) ;
		} ) ;
		
		it( "should evaluate async falsy || falsy || falsy to false, and run all jobs" , function( done ) {
			
			var stats = createStats( 3 ) ;
			
			async.if.or( [
				[ asyncJob , stats , 0 , 0 , {} , [ undefined ] ] ,
				[ asyncJob , stats , 1 , 0 , {} , [ null ] ] ,
				[ asyncJob , stats , 2 , 0 , {} , [ false ] ]
			] )
			.exec( function( result ) {
				expect( result ).to.equal( false ) ;
				expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
				done() ;
			} ) ;
		} ) ;
	} ) ;
	
	describe( "async.and()" , function() {
		
		it( "should evaluate async true && 7 && 'wonderful' to 'wonderful', and run all jobs" , function( done ) {
			
			var stats = createStats( 3 ) ;
			
			async.and( [
				[ asyncJob , stats , 0 , 0 , {} , [ true ] ] ,
				[ asyncJob , stats , 1 , 0 , {} , [ 7 ] ] ,
				[ asyncJob , stats , 2 , 0 , {} , [ 'wonderful' ] ]
			] )
			.exec( function( result ) {
				expect( result ).to.equal( 'wonderful' ) ;
				expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
				done() ;
			} ) ;
		} ) ;
		
		it( "should evaluate async true && 0 && 'wonderful' to 0, and run just the first and second jobs" , function( done ) {
			
			var stats = createStats( 3 ) ;
			
			async.and( [
				[ asyncJob , stats , 0 , 0 , {} , [ true ] ] ,
				[ asyncJob , stats , 1 , 0 , {} , [ 0 ] ] ,
				[ asyncJob , stats , 2 , 0 , {} , [ 'wonderful' ] ]
			] )
			.exec( function( result ) {
				expect( result ).to.equal( 0 ) ;
				expect( stats.endCounter ).to.eql( [ 1, 1, 0 ] ) ;
				done() ;
			} ) ;
		} ) ;
		
		it( "should evaluate async undefined && null && false to undefined, and run just the first job" , function( done ) {
			
			var stats = createStats( 3 ) ;
			
			async.and( [
				[ asyncJob , stats , 0 , 0 , {} , [ undefined ] ] ,
				[ asyncJob , stats , 1 , 0 , {} , [ null ] ] ,
				[ asyncJob , stats , 2 , 0 , {} , [ false ] ]
			] )
			.exec( function( result ) {
				expect( result ).to.equal( undefined ) ;
				expect( stats.endCounter ).to.eql( [ 1, 0, 0 ] ) ;
				done() ;
			} ) ;
		} ) ;
	} ) ;
		
	describe( "async.or()" , function() {
		
		it( "should evaluate async 7 || true || 'wonderful' to 7, and run only the first jobs" , function( done ) {
			
			var stats = createStats( 3 ) ;
			
			async.or( [
				[ asyncJob , stats , 0 , 0 , {} , [ 7 ] ] ,
				[ asyncJob , stats , 1 , 0 , {} , [ true ] ] ,
				[ asyncJob , stats , 2 , 0 , {} , [ 'wonderful' ] ]
			] )
			.exec( function( result ) {
				expect( result ).to.equal( 7 ) ;
				expect( stats.endCounter ).to.eql( [ 1, 0, 0 ] ) ;
				done() ;
			} ) ;
		} ) ;
		
		it( "should evaluate async undefined || 7 || false to 7, and run just the first and second jobs" , function( done ) {
			
			var stats = createStats( 3 ) ;
			
			async.or( [
				[ asyncJob , stats , 0 , 0 , {} , [ undefined ] ] ,
				[ asyncJob , stats , 1 , 0 , {} , [ 7 ] ] ,
				[ asyncJob , stats , 2 , 0 , {} , [ false ] ]
			] )
			.exec( function( result ) {
				expect( result ).to.equal( 7 ) ;
				expect( stats.endCounter ).to.eql( [ 1, 1, 0 ] ) ;
				done() ;
			} ) ;
		} ) ;
		
		it( "should evaluate async undefined || null || '' to '', and run all jobs" , function( done ) {
			
			var stats = createStats( 3 ) ;
			
			async.or( [
				[ asyncJob , stats , 0 , 0 , {} , [ undefined ] ] ,
				[ asyncJob , stats , 1 , 0 , {} , [ null ] ] ,
				[ asyncJob , stats , 2 , 0 , {} , [ '' ] ]
			] )
			.exec( function( result ) {
				expect( result ).to.equal( '' ) ;
				expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
				done() ;
			} ) ;
		} ) ;
	} ) ;
		
	describe( "nested async.or() and async.and() in async.if()" , function() {
		
		it( "should evaluate async ( truthy || falsy ) && truthy to true, and run first and third jobs" , function( done ) {
			
			var stats = createStats( 3 ) ;
			
			async.if.and( [
				async.or( [
					[ asyncJob , stats , 0 , 0 , {} , [ 'wonderful' ] ] ,
					[ asyncJob , stats , 1 , 0 , {} , [ false ] ]
				] ) ,
				[ asyncJob , stats , 2 , 0 , {} , [ true ] ]
			] )
			.exec( function( result ) {
				expect( result ).to.equal( true ) ;
				expect( stats.endCounter ).to.eql( [ 1, 0, 1 ] ) ;
				done() ;
			} ) ;
		} ) ;
		
		it( "should evaluate async ( falsy || truthy ) && falsy to false, and run all jobs" , function( done ) {
			
			var stats = createStats( 3 ) ;
			
			async.if.and( [
				async.or( [
					[ asyncJob , stats , 0 , 0 , {} , [ undefined ] ] ,
					[ asyncJob , stats , 1 , 0 , {} , [ 7 ] ]
				] ) ,
				[ asyncJob , stats , 2 , 0 , {} , [ 0 ] ]
			] )
			.exec( function( result ) {
				expect( result ).to.equal( false ) ;
				expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
				done() ;
			} ) ;
		} ) ;
		
		it( "should evaluate async ( truthy && falsy ) || truthy to true, and run all jobs" , function( done ) {
			
			var stats = createStats( 3 ) ;
			
			async.if.or( [
				async.and( [
					[ asyncJob , stats , 0 , 0 , {} , [ 'wonderful' ] ] ,
					[ asyncJob , stats , 1 , 0 , {} , [ false ] ]
				] ) ,
				[ asyncJob , stats , 2 , 0 , {} , [ true ] ]
			] )
			.exec( function( result ) {
				expect( result ).to.equal( true ) ;
				expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
				done() ;
			} ) ;
		} ) ;
		
		it( "should evaluate async ( falsy && truthy ) || falsy to false, and run the first and third jobs" , function( done ) {
			
			var stats = createStats( 3 ) ;
			
			async.if.or( [
				async.and( [
					[ asyncJob , stats , 0 , 0 , {} , [ undefined ] ] ,
					[ asyncJob , stats , 1 , 0 , {} , [ 7 ] ]
				] ) ,
				[ asyncJob , stats , 2 , 0 , {} , [ 0 ] ]
			] )
			.exec( function( result ) {
				expect( result ).to.equal( false ) ;
				expect( stats.endCounter ).to.eql( [ 1, 0, 1 ] ) ;
				done() ;
			} ) ;
		} ) ;
	} ) ;
	
	describe( "async.Plan.prototype.boolean()" , function() {
		
		it( "should force async.and()'s result to be a boolean, so 'wonderful' && 7 should evaluate to true" , function( done ) {
			
			var stats = createStats( 2 ) ;
			
			async.and( [
				[ asyncJob , stats , 0 , 0 , {} , [ 'wonderful' ] ] ,
				[ asyncJob , stats , 1 , 0 , {} , [ 7 ] ]
			] )
			.boolean()
			.exec( function( result ) {
				expect( result ).to.equal( true ) ;
				expect( stats.endCounter ).to.eql( [ 1, 1 ] ) ;
				done() ;
			} ) ;
		} ) ;
		
		it( "using .boolean( false ), it should force async.if.and()'s result to preserve the last evaluated value (the javascript way), so 'wonderful' && 7 should evaluate to 7" , function( done ) {
			
			var stats = createStats( 2 ) ;
			
			async.if.and( [
				[ asyncJob , stats , 0 , 0 , {} , [ 'wonderful' ] ] ,
				[ asyncJob , stats , 1 , 0 , {} , [ 7 ] ]
			] )
			.boolean( false )
			.exec( function( result ) {
				expect( result ).to.equal( 7 ) ;
				expect( stats.endCounter ).to.eql( [ 1, 1 ] ) ;
				done() ;
			} ) ;
		} ) ;
	} ) ;
} ) ;



describe( "async.Plan.prototype.then(), .else(), .catch(), .finally(), .execThenCatch(), .execThenElse() and .execThenElseCatch()" , function() {
	
	it( "should run a series of successful jobs and trigger in-plan and in-exec then() and finally()" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.do( [
			[ asyncJob , stats , 0 , 50 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 100 , {} , [ undefined , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 0 , {} , [ undefined , 'result' ] ]
		] )
		.then( function( results ) {
			stats.plan.then ++ ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1, 2 ] ) ;
		} )
		.catch( function( error , results ) {
			stats.plan.catch ++ ;
			done( new Error( "Should not trigger catch()" ) ) ;
		} )
		.finally( function( error , results ) {
			stats.plan.finally ++ ;
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1, 2 ] ) ;
		} )
		.execThenCatch(
			function( results ) {
				stats.exec.then ++ ;
				expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
				expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
				expect( stats.order ).to.eql( [ 0, 1, 2 ] ) ;
			} ,
			function( error , results ) {
				stats.exec.catch ++ ;
				done( new Error( "Should not trigger catch()" ) ) ;
			} ,
			function( error , results ) {
				expect( error ).not.to.be.an( Error ) ;
				expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
				expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
				expect( stats.order ).to.eql( [ 0, 1, 2 ] ) ;
				expect( stats.plan.then ).to.equal( 1 ) ;
				expect( stats.plan.catch ).to.equal( 0 ) ;
				expect( stats.plan.finally ).to.equal( 1 ) ;
				expect( stats.exec.then ).to.equal( 1 ) ;
				expect( stats.exec.catch ).to.equal( 0 ) ;
				done() ;
			}
		) ;
	} ) ;
	
	it( "should run a series of jobs, interrupted by an error, and trigger in-plan and in-exec catch() and finally()" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.do( [
			[ asyncJob , stats , 0 , 50 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 100 , {} , [ new Error() , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 0 , {} , [ undefined , 'result' ] ]
		] )
		.then( function( results ) {
			stats.plan.then ++ ;
			done( new Error( "Should not trigger then()" ) ) ;
		} )
		.catch( function( error , results ) {
			stats.plan.catch ++ ;
			expect( error ).to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ new Error() , 'wonderful' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 0 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1 ] ) ;
		} )
		.finally( function( error , results ) {
			stats.plan.finally ++ ;
			expect( error ).to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ new Error() , 'wonderful' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 0 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1 ] ) ;
		} )
		.execThenCatch(
			function( results ) {
				stats.exec.then ++ ;
				done( new Error( "Should not trigger then()" ) ) ;
			} ,
			function( error , results ) {
				stats.exec.catch ++ ;
				expect( error ).to.be.an( Error ) ;
				expect( results ).to.eql( [ [ undefined , 'my' ], [ new Error() , 'wonderful' ] ] ) ;
				expect( stats.endCounter ).to.eql( [ 1, 1, 0 ] ) ;
				expect( stats.order ).to.eql( [ 0, 1 ] ) ;
			} ,
			function( error , results ) {
				expect( error ).to.be.an( Error ) ;
				expect( results ).to.eql( [ [ undefined , 'my' ], [ new Error() , 'wonderful' ] ] ) ;
				expect( stats.endCounter ).to.eql( [ 1, 1, 0 ] ) ;
				expect( stats.order ).to.eql( [ 0, 1 ] ) ;
				expect( stats.plan.then ).to.equal( 0 ) ;
				expect( stats.plan.catch ).to.equal( 1 ) ;
				expect( stats.plan.finally ).to.equal( 1 ) ;
				expect( stats.exec.then ).to.equal( 0 ) ;
				expect( stats.exec.catch ).to.equal( 1 ) ;
				done() ;
			}
		) ;
	} ) ;
	
	it( "should evaluate async truthy && truthy && truthy to true, and trigger in-plan and in-exec then() and finally()" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.if.and( [
			[ asyncJob , stats , 0 , 0 , {} , [ true ] ] ,
			[ asyncJob , stats , 1 , 0 , {} , [ 7 ] ] ,
			[ asyncJob , stats , 2 , 0 , {} , [ 'wonderful' ] ]
		] )
		.then( function( result ) {
			stats.plan.then ++ ;
			expect( result ).to.equal( true ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
		} )
		.else( function( result ) {
			stats.plan.else ++ ;
			done( new Error( "Should not trigger else()" ) ) ;
		} )
		.catch( function( error ) {
			stats.plan.catch ++ ;
			done( new Error( "Should not trigger catch()" ) ) ;
		} )
		.finally( function( result ) {
			stats.plan.finally ++ ;
			expect( result ).to.equal( true ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
		} )
		.execThenElseCatch(
			function( result ) {
				stats.exec.then ++ ;
				expect( result ).to.equal( true ) ;
				expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			} ,
			function( result ) {
				stats.exec.else ++ ;
				done( new Error( "Should not trigger else()" ) ) ;
			} ,
			function( error ) {
				stats.exec.catch ++ ;
				done( new Error( "Should not trigger catch()" ) ) ;
			} ,
			function( result ) {
				expect( result ).to.equal( true ) ;
				expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
				expect( stats.plan.then ).to.equal( 1 ) ;
				expect( stats.plan.else ).to.equal( 0 ) ;
				expect( stats.plan.catch ).to.equal( 0 ) ;
				expect( stats.plan.finally ).to.equal( 1 ) ;
				expect( stats.exec.then ).to.equal( 1 ) ;
				expect( stats.exec.else ).to.equal( 0 ) ;
				expect( stats.exec.catch ).to.equal( 0 ) ;
				done() ;
			}
		) ;
	} ) ;
	
	it( "should evaluate async truthy && falsy && truthy to false, and trigger in-plan and in-exec else() and finally()" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.if.and( [
			[ asyncJob , stats , 0 , 0 , {} , [ true ] ] ,
			[ asyncJob , stats , 1 , 0 , {} , [ 0 ] ] ,
			[ asyncJob , stats , 2 , 0 , {} , [ 'wonderful' ] ]
		] )
		.then( function( result ) {
			stats.plan.then ++ ;
			done( new Error( "Should not trigger then()" ) ) ;
		} )
		.else( function( result ) {
			stats.plan.else ++ ;
			expect( result ).to.equal( false ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 0 ] ) ;
		} )
		.catch( function( error ) {
			stats.plan.catch ++ ;
			done( new Error( "Should not trigger catch()" ) ) ;
		} )
		.finally( function( result ) {
			stats.plan.finally ++ ;
			expect( result ).to.equal( false ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 0 ] ) ;
		} )
		.execThenElseCatch(
			function( result ) {
				stats.exec.then ++ ;
				done( new Error( "Should not trigger then()" ) ) ;
			} ,
			function( result ) {
				stats.exec.else ++ ;
				expect( result ).to.equal( false ) ;
				expect( stats.endCounter ).to.eql( [ 1, 1, 0 ] ) ;
			} ,
			function( error ) {
				stats.exec.catch ++ ;
				done( new Error( "Should not trigger catch()" ) ) ;
			} ,
			function( result ) {
				expect( result ).to.equal( false ) ;
				expect( stats.endCounter ).to.eql( [ 1, 1, 0 ] ) ;
				expect( stats.plan.then ).to.equal( 0 ) ;
				expect( stats.plan.else ).to.equal( 1 ) ;
				expect( stats.plan.catch ).to.equal( 0 ) ;
				expect( stats.plan.finally ).to.equal( 1 ) ;
				expect( stats.exec.then ).to.equal( 0 ) ;
				expect( stats.exec.else ).to.equal( 1 ) ;
				expect( stats.exec.catch ).to.equal( 0 ) ;
				done() ;
			}
		) ;
	} ) ;
	
	it( "should evaluate async truthy && Error && truthy to Error, and trigger in-plan and in-exec catch() and finally()" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.if.and( [
			[ asyncJob , stats , 0 , 0 , {} , [ true ] ] ,
			[ asyncJob , stats , 1 , 0 , {} , [ new Error() ] ] ,
			[ asyncJob , stats , 2 , 0 , {} , [ 'wonderful' ] ]
		] )
		.then( function( result ) {
			stats.plan.then ++ ;
			done( new Error( "Should not trigger then()" ) ) ;
		} )
		.else( function( result ) {
			stats.plan.else ++ ;
			done( new Error( "Should not trigger else()" ) ) ;
		} )
		.catch( function( error ) {
			stats.plan.catch ++ ;
			expect( error ).to.be.an( Error ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 0 ] ) ;
		} )
		.finally( function( result ) {
			stats.plan.finally ++ ;
			expect( result ).to.be.an( Error ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 0 ] ) ;
		} )
		.execThenElseCatch(
			function( result ) {
				stats.exec.then ++ ;
				done( new Error( "Should not trigger then()" ) ) ;
			} ,
			function( result ) {
				stats.exec.else ++ ;
				done( new Error( "Should not trigger else()" ) ) ;
			} ,
			function( error ) {
				stats.exec.catch ++ ;
				expect( error ).to.be.an( Error ) ;
				expect( stats.endCounter ).to.eql( [ 1, 1, 0 ] ) ;
			} ,
			function( result ) {
				expect( result ).to.be.an( Error ) ;
				expect( stats.endCounter ).to.eql( [ 1, 1, 0 ] ) ;
				expect( stats.plan.then ).to.equal( 0 ) ;
				expect( stats.plan.else ).to.equal( 0 ) ;
				expect( stats.plan.catch ).to.equal( 1 ) ;
				expect( stats.plan.finally ).to.equal( 1 ) ;
				expect( stats.exec.then ).to.equal( 0 ) ;
				expect( stats.exec.else ).to.equal( 0 ) ;
				expect( stats.exec.catch ).to.equal( 1 ) ;
				done() ;
			}
		) ;
	} ) ;
	
	it( "when there isn't any catch() and a job has an error, it should trigger in-plan and in-exec else() and finally()" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.if.and( [
			[ asyncJob , stats , 0 , 0 , {} , [ true ] ] ,
			[ asyncJob , stats , 1 , 0 , {} , [ new Error() ] ] ,
			[ asyncJob , stats , 2 , 0 , {} , [ 'wonderful' ] ]
		] )
		.then( function( result ) {
			stats.plan.then ++ ;
			done( new Error( "Should not trigger then()" ) ) ;
		} )
		.else( function( result ) {
			stats.plan.else ++ ;
			expect( result ).to.be( false ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 0 ] ) ;
		} )
		.finally( function( result ) {
			stats.plan.finally ++ ;
			expect( result ).to.be( false ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 0 ] ) ;
		} )
		.execThenElse(
			function( result ) {
				stats.exec.then ++ ;
				done( new Error( "Should not trigger then()" ) ) ;
			} ,
			function( result ) {
				stats.exec.else ++ ;
				expect( result ).to.be( false ) ;
				expect( stats.endCounter ).to.eql( [ 1, 1, 0 ] ) ;
			} ,
			function( result ) {
				expect( result ).to.be( false ) ;
				expect( stats.endCounter ).to.eql( [ 1, 1, 0 ] ) ;
				expect( stats.plan.then ).to.equal( 0 ) ;
				expect( stats.plan.else ).to.equal( 1 ) ;
				expect( stats.plan.finally ).to.equal( 1 ) ;
				expect( stats.exec.then ).to.equal( 0 ) ;
				expect( stats.exec.else ).to.equal( 1 ) ;
				done() ;
			}
		) ;
	} ) ;
} ) ;



describe( "async.Plan.prototype.timeout()" , function() {
	
	it( "should abort job in a series that take too much time to complete, its result should be an error" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.series( [
			[ asyncJob , stats , 0 , 0 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 50 , {} , [ undefined , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 0 , {} , [ undefined , 'result' ] ]
		] )
		.timeout( 20 )
		.exec( function( error , results ) {
			expect( error ).to.be.an( async.AsyncError ) ;
			expect( error ).to.be.an( Error ) ;	// ensure that async.AsyncError is an instance of Error
			expect( results ).to.eql( [ [ undefined , 'my' ] , [ new async.AsyncError( 'jobTimeout' ) ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 0, 0 ] ) ;
			expect( stats.order ).to.eql( [ 0 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "should abort job in a parallel flow that take too much time to complete, its result should be an error" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.parallel( [
			[ asyncJob , stats , 0 , 0 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 50 , {} , [ undefined , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 0 , {} , [ undefined , 'result' ] ]
		] )
		.timeout( 20 )
		.exec( function( error , results ) {
			expect( error ).to.be.an( async.AsyncError ) ;
			expect( error ).to.be.an( Error ) ;	// ensure that async.AsyncError is an instance of Error
			expect( results ).to.eql( [ [ undefined , 'my' ] , [ new async.AsyncError( 'jobTimeout' ) ] , [ undefined , 'result' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 0, 1 ] ) ;
			expect( stats.order ).to.eql( [ 0, 2 ] ) ;
			done() ;
		} ) ;
	} ) ;
} ) ;



describe( "async.Plan.prototype.retry()" , function() {
	
	it( "should retry a series of job with failure the good amount of time, in the good order, then succeed and return the good results" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.do( [
			[ asyncJob , stats , 0 , 20 , { failCount: 3 } , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 10 , { failCount: 5 } , [ undefined , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 5 , { failCount: 2 } , [ undefined , 'result' ] ]
		] )
		.retry( 10 , 5 )
		.exec( function( error , results ) {
			//console.log( arguments ) ;
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ] , [ undefined , 'wonderful' ] , [ undefined , 'result' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 4, 6, 3 ] ) ;
			expect( stats.order ).to.eql( [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "should retry parallel jobs with failure the good amount of time, then succeed and return the good results" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.parallel( [
			[ asyncJob , stats , 0 , 20 , { failCount: 3 } , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 10 , { failCount: 5 } , [ undefined , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 5 , { failCount: 2 } , [ undefined , 'result' ] ]
		] )
		.retry( 10 , 5 )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ] , [ undefined , 'wonderful' ] , [ undefined , 'result' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 4, 6, 3 ] ) ;
			// stats.order is not relevant here
			done() ;
		} ) ;
	} ) ;
	
	it( "should retry many times, and evaluate async falsy || falsy || truthy to true" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.or( [
			[ asyncJob , stats , 0 , 20 , { failCount: 3 } , [ undefined , false ] ] ,
			[ asyncJob , stats , 1 , 10 , { failCount: 5 } , [ undefined , 0 ] ] ,
			[ asyncJob , stats , 2 , 5 , { failCount: 2 } , [ undefined , 'wonderful' ] ]
		] )
		.retry( 10 )
		.exec( function( result ) {
			expect( result ).to.equal( 'wonderful' ) ;
			expect( stats.endCounter ).to.eql( [ 4, 6, 3 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "should retry many times, and evaluate async truthy && truthy && truthy to true" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.and( [
			[ asyncJob , stats , 0 , 20 , { failCount: 3 } , [ undefined , true ] ] ,
			[ asyncJob , stats , 1 , 10 , { failCount: 5 } , [ undefined , 7 ] ] ,
			[ asyncJob , stats , 2 , 5 , { failCount: 2 } , [ undefined , 'wonderful' ] ]
		] )
		.retry( 10 )
		.exec( function( result ) {
			expect( result ).to.equal( 'wonderful' ) ;
			expect( stats.endCounter ).to.eql( [ 4, 6, 3 ] ) ;
			done() ;
		} ) ;
	} ) ;
} ) ;



describe( "Mixing async.Plan.prototype.retry() & async.Plan.prototype.timeout()" , function() {
	
	it( "when a job timeout and is still pending, it should be retried, if the second try complete before, it transmit its result" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.do( [
			[ asyncJob , stats , 0 , 5 , {} , [ undefined , 'my' ] ] ,
			function( callback ) {
				var timeout , result ;
				
				stats.startCounter[ 1 ] ++ ;
				timeout = 0 ;
				
				switch ( stats.startCounter[ 1 ] )
				{
					case 1 :
						result = '1st' ;
						timeout = 100 ;
						break ;
					case 2 :
						result = '2nd' ;
						break ;
					case 3 :
						result = '3rd' ;
						break ;
					default :
						result = '' + stats.startCounter[ 1 ] + 'th' ;
						break ;
				}
				
				setTimeout( function() {
					stats.endCounter[ 1 ] ++ ;
					stats.order.push( 1 ) ;
					callback( undefined , result ) ;
				} , timeout ) ;
			} ,
			[ asyncJob , stats , 2 , 5 , {} , [ undefined , 'result' ] ]
		] )
		.timeout( 20 )
		.retry( 5 )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ] , [ undefined , '2nd' ] , [ undefined , 'result' ] ] ) ;
			expect( stats.startCounter ).to.eql( [ 1, 2, 1 ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1, 2 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "be careful when mixing .timeout() and .retry(), if a job timeout and retry, the first try may finally complete before others tries, so it should return the result of the first try to complete without error" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.do( [
			[ asyncJob , stats , 0 , 5 , {} , [ undefined , 'my' ] ] ,
			function( callback ) {
				var timeout , result ;
				
				stats.startCounter[ 1 ] ++ ;
				timeout = 50 ;
				
				switch ( stats.startCounter[ 1 ] )
				{
					case 1 :
						result = '1st' ;
						break ;
					case 2 :
						result = '2nd' ;
						break ;
					case 3 :
						result = '3rd' ;
						break ;
					default :
						result = '' + stats.startCounter[ 1 ] + 'th' ;
						break ;
				}
				
				setTimeout( function() {
					stats.endCounter[ 1 ] ++ ;
					stats.order.push( 1 ) ;
					callback( undefined , result ) ;
				} , timeout ) ;
			} ,
			[ asyncJob , stats , 2 , 5 , {} , [ undefined , 'result' ] ]
		] )
		.timeout( 20 )
		.retry( 5 )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ] , [ undefined , '1st' ] , [ undefined , 'result' ] ] ) ;
			expect( stats.startCounter ).to.eql( [ 1, 3, 1 ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1, 2 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "when a job's first try timeout, a second try kick in, and then the first try finish with an error before the second try complete, the second try result is used" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.do( [
			[ asyncJob , stats , 0 , 5 , {} , [ undefined , 'my' ] ] ,
			function( callback ) {
				var timeout , error , result ;
				
				stats.startCounter[ 1 ] ++ ;
				timeout = 50 ;
				error = undefined ;
				
				switch ( stats.startCounter[ 1 ] )
				{
					case 1 :
						result = '1st' ;
						error = new Error( "Failed!" ) ;
						break ;
					//case 1 : result = '1st' ; break ;
					case 2 :
						result = '2nd' ;
						break ;
					case 3 :
						result = '3rd' ;
						break ;
					default :
						result = '' + stats.startCounter[ 1 ] + 'th' ;
						break ;
				}
				
				setTimeout( function() {
					stats.endCounter[ 1 ] ++ ;
					stats.order.push( 1 ) ;
					callback( error , result ) ;
				} , timeout ) ;
			} ,
			[ asyncJob , stats , 2 , 5 , {} , [ undefined , 'result' ] ]
		] )
		.timeout( 40 )
		.retry( 1 )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ] , [ undefined , '2nd' ] , [ undefined , 'result' ] ] ) ;
			expect( stats.startCounter ).to.eql( [ 1, 2, 1 ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 2, 1 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1, 1, 2 ] ) ;
			done() ;
		} ) ;
	} ) ;
} ) ;



describe( "async.Plan.prototype.parallel()" , function() {
	
	it( "should run parallel jobs, with a limit of jobs running at a time" , function( done ) {
		
		var stats = createStats( 6 ) ;
		
		async.parallel( [
			[ asyncJob , stats , 0 , 60 , {} , [ undefined , 'one' ] ] ,	// @60
			[ asyncJob , stats , 1 , 20 , {} , [ undefined , 'two' ] ] ,	// @20
			[ asyncJob , stats , 2 , 40 , {} , [ undefined , 'three' ] ] ,	// @40
			[ asyncJob , stats , 3 , 0 , {} , [ undefined , 'four' ] ] ,	// @20+
			[ asyncJob , stats , 4 , 30 , {} , [ undefined , 'five' ] ] ,	// @50+
			[ asyncJob , stats , 5 , 0 , {} , [ undefined , 'six' ] ]	// @40+
		] )
		.parallel( 3 )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined, 'one' ], [ undefined, 'two' ], [ undefined, 'three' ], [ undefined, 'four' ], [ undefined, 'five' ], [ undefined, 'six' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1, 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 1, 3, 2, 5, 4, 0 ] ) ;
			done() ;
		} ) ;
	} ) ;
} ) ;



describe( "async.Plan.prototype.fatal()" , function() {
	
	it( "should run the series of job and continue on error" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.do( [
			[ asyncJob , stats , 0 , 20 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 0 , {} , [ new Error() , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 10 , {} , [ undefined , 'result' ] ]
		] )
		.fatal( false )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ new Error() , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1, 2 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "should run parallel jobs and continue on error" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.parallel( [
			[ asyncJob , stats , 0 , 20 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 0 , {} , [ new Error() , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 10 , {} , [ undefined , 'result' ] ]
		] )
		.fatal( false )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ new Error() , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 1, 2, 0 ] ) ;
			done() ;
		} ) ;
	} ) ;
} ) ;



describe( "async.Plan.prototype.lastJobOnly()" , function() {
	
	it( "should run the series of job and pass only the results of the last job" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.series( [
			[ asyncJob , stats , 0 , 50 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 100 , {} , [ undefined , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 0 , {} , [ undefined , 'result' ] ]
		] )
		.lastJobOnly()
		.exec( function() {
			var args = Array.prototype.slice.call( arguments ) ;
			expect( args ).to.eql( [ undefined , 'result' ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1, 2 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "should run jobs in parallel and pass only the results of the last job - can produce random result with parallel mode!" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.parallel( [
			[ asyncJob , stats , 0 , 50 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 100 , {} , [ undefined , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 0 , {} , [ undefined , 'result' ] ]
		] )
		.lastJobOnly()
		.exec( function() {
			var args = Array.prototype.slice.call( arguments ) ;
			expect( args ).to.eql( [ undefined , 'wonderful' ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 2, 0, 1 ] ) ;
			done() ;
		} ) ;
	} ) ;
} ) ;



describe( "async.Plan.prototype.mapping1to1()" , function() {
	
	it( "the results should map one to one the job's list, any extra arguments passed to the job's callback should be ignored" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.parallel( [
			[ asyncJob , stats , 0 , 50 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 100 , {} , [ undefined , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 0 , {} , [ undefined , 'result' , 'extra argument that will be dropped' ] ]
		] )
		.mapping1to1()
		.exec( function( error , results ) {
			expect( results ).to.eql( [ 'my' , 'wonderful' , 'result' ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 2, 0, 1 ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "when using an object as the job's list, the result is an object mapping one to one the job's list" , function( done ) {
		
		var stats = createStats( 3 ) ;
		
		async.parallel( {
			one: [ asyncJob , stats , 0 , 50 , {} , [ undefined , 'my' ] ] ,
			two: [ asyncJob , stats , 1 , 100 , {} , [ undefined , 'wonderful' ] ] ,
			three: [ asyncJob , stats , 2 , 0 , {} , [ undefined , 'result' , 'extra argument that will be dropped' ] ]
		} )
		.mapping1to1()
		.exec( function( error , results ) {
			expect( results ).to.eql( { one: 'my' , two: 'wonderful' , three: 'result' } ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 2, 0, 1 ] ) ;
			done() ;
		} ) ;
	} ) ;
} ) ;



describe( "async.Plan.prototype.execKV()" , function() {
	
	it( "should pass an object with inputs arguments in 'inputs' property and 'then' & 'finally' callback in properties of the same name" , function( done ) {
		
		var stats = createStats( 3 ) ;
		var then ;
		
		async.parallel( [
			function( describe , body , callback ) {
				var id = 0 ;
				stats.startCounter[ id ] ++ ;
				setTimeout( function() {
					stats.endCounter[ id ] ++ ;
					stats.order.push( id ) ;
					callback( undefined , "DESCRIPTION: " + describe ) ;
				} , 20 ) ;
			} ,
			function( describe , body , callback ) {
				var id = 1 ;
				stats.startCounter[ id ] ++ ;
				setTimeout( function() {
					stats.endCounter[ id ] ++ ;
					stats.order.push( id ) ;
					callback( undefined , "LENGTH: " + body.length ) ;
				} , 10 ) ;
			} ,
			function( describe , body , callback ) {
				var id = 2 ;
				stats.startCounter[ id ] ++ ;
				setTimeout( function() {
					stats.endCounter[ id ] ++ ;
					stats.order.push( id ) ;
					callback( undefined , "BODY: " + body ) ;
				} , 0 ) ;
			}
		] )
		.execKV( {
			inputs: [ 'some data' , 'blahblihblah' ],
			then: function( results ) {
				then = true ;
				expect( results ).to.eql( [
					[ undefined , 'DESCRIPTION: some data' ] ,
					[ undefined , 'LENGTH: 12' ] ,
					[ undefined , 'BODY: blahblihblah' ]
				] ) ;
			} ,
			'finally': function( error , results ) {
				expect( error ).not.to.be.an( Error ) ;
				expect( then ).to.equal( true ) ;
				expect( results ).to.eql( [
					[ undefined , 'DESCRIPTION: some data' ] ,
					[ undefined , 'LENGTH: 12' ] ,
					[ undefined , 'BODY: blahblihblah' ]
				] ) ;
				expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
				expect( stats.order ).to.eql( [ 2, 1, 0 ] ) ;
				done() ;
			}
		} ) ;
	} ) ;
	
	it( "should accept 'catch' callback in the 'catch' property" , function( done ) {
		
		var stats = createStats( 3 ) ;
		var then , catch_ ;
		
		async.series( [
			[ asyncJob , stats , 0 , 50 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 100 , {} , [ new Error() , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 0 , {} , [ undefined , 'result' ] ]
		] )
		.execKV( {
			inputs: [ 'some data' , 'blahblihblah' ],
			then: function( results ) {
				then = true ;
			} ,
			'catch': function( results ) {
				catch_ = true ;
			} ,
			'finally': function( error , results ) {
				expect( error ).to.be.an( Error ) ;
				expect( stats.endCounter ).to.eql( [ 1, 1, 0 ] ) ;
				expect( stats.order ).to.eql( [ 0, 1 ] ) ;
				expect( then ).to.not.be.equal( true ) ;
				expect( catch_ ).to.equal( true ) ;
				expect( results ).to.eql( [ [ undefined , 'my' ], [ new Error() , 'wonderful' ] ] ) ;
				done() ;
			}
		} ) ;
	} ) ;
	
	it( "should accept the aggegate property as well" , function( done ) {
		
		var myArray = [ 'my' , 'wonderful' , 'result' ] ;
		var then ;
		
		async.reduce( myArray , 5 , function( aggregate , element , callback ) {
			
			setTimeout( function() {
				callback( undefined , aggregate + element.length ) ;
			} , 0 ) ;
		} )
		.execKV( {
			aggregate: 11,
			'then': function( results ) {
				then = true ;
				expect( results ).to.eql( 28 ) ;
			} ,
			'finally': function( error , results ) {
				expect( error ).not.to.be.an( Error ) ;
				expect( then ).to.equal( true ) ;
				expect( results ).to.eql( 28 ) ;
				done() ;
			}
		} ) ;
	} ) ;
} ) ;



describe( "Events" , function() {
	
	it( "should trigger a 'progress' event after each jobs of a series complete, the 'resolved' event triggers callbacks, the 'finish' event should be triggered after all callbacks and 'progress' event" , function( done ) {
		
		var stats = createStats( 3 ) ;
		var finallyTriggered = false ;
		var resolvedTriggered = false ;
		
		var context = async.series( [
			[ asyncJob , stats , 0 , 10 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 10 , {} , [ undefined , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 10 , {} , [ undefined , 'result' ] ]
		] )
		.nice( 0 )
		.exec( function( error , results ) {
			finallyTriggered = true ;
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1, 2 ] ) ;
		} ) ;
		
		expect( context ).to.be.an( async.ExecContext ) ;
		
		var progressCount = 0 ;
		
		context.on( 'progress' , function( progressStatus , error , results ) {
			
			progressCount ++ ;
			expect( error ).not.to.be.an( Error ) ;
			
			switch ( progressCount )
			{
				case 1 :
					expect( progressStatus ).to.eql( { loop: 0, resolved: 1, ok: 1, failed: 0, pending: 0, waiting: 2 } ) ;
					expect( results ).to.eql( [ [ undefined , 'my' ], undefined ] ) ;
					expect( stats.endCounter ).to.eql( [ 1, 0, 0 ] ) ;
					expect( stats.order ).to.eql( [ 0 ] ) ;
					break ;
				case 2 :
					expect( progressStatus ).to.eql( { loop: 0, resolved: 2, ok: 2, failed: 0, pending: 0, waiting: 1 } ) ;
					expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], undefined ] ) ;
					expect( stats.endCounter ).to.eql( [ 1, 1, 0 ] ) ;
					expect( stats.order ).to.eql( [ 0, 1 ] ) ;
					break ;
				case 3 :
					expect( progressStatus ).to.eql( { loop: 0, resolved: 3, ok: 3, failed: 0, pending: 0, waiting: 0 } ) ;
					expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
					expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
					expect( stats.order ).to.eql( [ 0, 1, 2 ] ) ;
					break ;
				default :
					throw new Error( 'progress event received too much time' ) ;
			}
		} ) ;
		
		context.on( 'resolved' , function( error , results ) {
			resolvedTriggered = true ;
			expect( progressCount ).to.be( 2 ) ; // resolved is triggered before the last 'progress' event
			expect( finallyTriggered ).to.be( true ) ;
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1, 2 ] ) ;
		} ) ;
		
		context.on( 'finish' , function( error , results ) {
			expect( progressCount ).to.be( 3 ) ;
			expect( finallyTriggered ).to.be( true ) ;
			expect( resolvedTriggered ).to.be( true ) ;
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 0, 1, 2 ] ) ;
			done() ;
		} ) ;
		
	} ) ;
	
	it( "should trigger a 'progress' event after each jobs of a parallel batch complete, the 'resolved' event triggers callbacks, the 'finish' event should be triggered after all callbacks and 'progress' event" , function( done ) {
		
		var stats = createStats( 3 ) ;
		var finallyTriggered = false ;
		var resolvedTriggered = false ;
		
		var context = async.parallel( [
			[ asyncJob , stats , 0 , 0 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 100 , {} , [ undefined , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 50 , {} , [ undefined , 'result' ] ]
		] )
		.nice( 0 )
		.exec( function( error , results ) {
			finallyTriggered = true ;
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 0, 2, 1 ] ) ;
		} ) ;
		
		expect( context ).to.be.an( async.ExecContext ) ;
		
		var progressCount = 0 ;
		
		context.on( 'progress' , function( progressStatus , error , results ) {
			
			progressCount ++ ;
			expect( error ).not.to.be.an( Error ) ;
			
			switch ( progressCount )
			{
				case 1 :
					expect( progressStatus ).to.eql( { loop: 0, resolved: 1, ok: 1, failed: 0, pending: 2, waiting: 0 } ) ;
					expect( results ).to.eql( [ [ undefined , 'my' ], undefined, undefined ] ) ;
					expect( stats.endCounter ).to.eql( [ 1, 0, 0 ] ) ;
					expect( stats.order ).to.eql( [ 0 ] ) ;
					break ;
				case 2 :
					expect( progressStatus ).to.eql( { loop: 0, resolved: 2, ok: 2, failed: 0, pending: 1, waiting: 0 } ) ;
					expect( results ).to.eql( [ [ undefined , 'my' ], undefined, [ undefined , 'result' ] ] ) ;
					expect( stats.endCounter ).to.eql( [ 1, 0, 1 ] ) ;
					expect( stats.order ).to.eql( [ 0, 2 ] ) ;
					break ;
				case 3 :
					expect( progressStatus ).to.eql( { loop: 0, resolved: 3, ok: 3, failed: 0, pending: 0, waiting: 0 } ) ;
					expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
					expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
					expect( stats.order ).to.eql( [ 0, 2, 1 ] ) ;
					break ;
				default :
					throw new Error( 'progress event received too much time' ) ;
			}
		} ) ;
		
		context.on( 'resolved' , function( error , results ) {
			resolvedTriggered = true ;
			expect( progressCount ).to.be( 2 ) ; // resolved is triggered before the last 'progress' event
			expect( finallyTriggered ).to.be( true ) ;
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 0, 2, 1 ] ) ;
		} ) ;
		
		context.on( 'finish' , function( error , results ) {
			expect( progressCount ).to.be( 3 ) ;
			expect( finallyTriggered ).to.be( true ) ;
			expect( resolvedTriggered ).to.be( true ) ;
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ undefined , 'result' ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 0, 2, 1 ] ) ;
			done() ;
		} ) ;
		
	} ) ;
	
	it( "in parallel mode, when an error occurs the 'resolved' event is triggered, however if another job is running, the 'finish' event is triggered only when it is done" , function( done ) {
		
		var stats = createStats( 3 ) ;
		var finallyTriggered = false ;
		var resolvedTriggered = false ;
		
		var context = async.parallel( [
			[ asyncJob , stats , 0 , 0 , {} , [ undefined , 'my' ] ] ,
			[ asyncJob , stats , 1 , 100 , {} , [ undefined , 'wonderful' ] ] ,
			[ asyncJob , stats , 2 , 50 , {} , [ new Error() ] ]
		] )
		.nice( 0 )
		.exec( function( error , results ) {
			finallyTriggered = true ;
			expect( error ).to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], undefined, [ new Error() ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 0, 1 ] ) ;
			expect( stats.order ).to.eql( [ 0, 2 ] ) ;
		} ) ;
		
		expect( context ).to.be.an( async.ExecContext ) ;
		
		var progressCount = 0 ;
		
		context.on( 'progress' , function( progressStatus , error , results ) {
			
			progressCount ++ ;
			
			switch ( progressCount )
			{
				case 1 :
					expect( error ).not.to.be.an( Error ) ;
					expect( progressStatus ).to.eql( { loop: 0, resolved: 1, ok: 1, failed: 0, pending: 2, waiting: 0 } ) ;
					expect( results ).to.eql( [ [ undefined , 'my' ], undefined, undefined ] ) ;
					expect( stats.endCounter ).to.eql( [ 1, 0, 0 ] ) ;
					expect( stats.order ).to.eql( [ 0 ] ) ;
					break ;
				case 2 :
					expect( error ).to.be.an( Error ) ;
					expect( progressStatus ).to.eql( { loop: 0, resolved: 2, ok: 1, failed: 1, pending: 1, waiting: 0 } ) ;
					expect( results ).to.eql( [ [ undefined , 'my' ], undefined, [ new Error() ] ] ) ;
					expect( stats.endCounter ).to.eql( [ 1, 0, 1 ] ) ;
					expect( stats.order ).to.eql( [ 0, 2 ] ) ;
					break ;
				case 3 :
					expect( error ).to.be.an( Error ) ;
					expect( progressStatus ).to.eql( { loop: 0, resolved: 3, ok: 2, failed: 1, pending: 0, waiting: 0 } ) ;
					expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ new Error() ] ] ) ;
					expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
					expect( stats.order ).to.eql( [ 0, 2, 1 ] ) ;
					break ;
				default :
					throw new Error( 'progress event received too much time' ) ;
			}
		} ) ;
		
		context.on( 'resolved' , function( error , results ) {
			resolvedTriggered = true ;
			expect( progressCount ).to.be( 1 ) ; // resolved is triggered before the last 'progress' event
			expect( finallyTriggered ).to.be( true ) ;
			expect( error ).to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], undefined, [ new Error() ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 0, 1 ] ) ;
			expect( stats.order ).to.eql( [ 0, 2 ] ) ;
		} ) ;
		
		context.on( 'finish' , function( error , results ) {
			expect( progressCount ).to.be( 3 ) ;
			expect( finallyTriggered ).to.be( true ) ;
			expect( resolvedTriggered ).to.be( true ) ;
			expect( error ).to.be.an( Error ) ;
			expect( results ).to.eql( [ [ undefined , 'my' ], [ undefined , 'wonderful' ], [ new Error() ] ] ) ;
			expect( stats.endCounter ).to.eql( [ 1, 1, 1 ] ) ;
			expect( stats.order ).to.eql( [ 0, 2, 1 ] ) ;
			done() ;
		} ) ;
		
	} ) ;
} ) ;



describe( "async.callTimeout()" , function() {
	
	it( "should perform a call with timeout which will succeed in time and another one which will timeout, argument and this context should be passed correctly" , function( done ) {
		
		var completionCallback1 = function( error , result ) {
			expect( error ).not.to.be.ok() ;
			expect( result ).to.be( 'ok: hello world' ) ;
		} ;
		
		var completionCallback2 = function( error , result ) {
			expect( error ).to.be.ok() ;
			expect( error ).to.be.an( Error ) ;
			expect( error.message ).to.be( 'jobTimeout' ) ;
			done() ;
		} ;
		
		var object = {
			prop: "property" ,
			fn: function( arg1 , arg2 , t , callback ) {
				expect( this ).to.be.an( Object ) ;
				expect( this.prop ).to.be( "property" ) ;
				
				setTimeout( function() { callback( undefined , 'ok: ' + arg1 + ' ' + arg2 ) ; } , t ) ;
			}
		} ;
		
		async.callTimeout( 20 , completionCallback1 , object.fn , object , 'hello' , 'world' , 10 ) ;
		async.callTimeout( 20 , completionCallback2 , object.fn , object , 'hello' , 'world' , 30 ) ;
	} ) ;
	
} ) ;



describe( "async.wrapper.timeout()" , function() {
	
	it( "should create a wrapper around an asynchronous function, that call automatically the callback with an error after a predefined time (and also ensure the callback is called only once)" , function( done ) {
		
		var object = {
			prop: "property" ,
			fn: function( arg1 , arg2 , t , callback ) {
				expect( this ).to.be.an( Object ) ;
				expect( this.prop ).to.be( "property" ) ;
				
				setTimeout( function() { callback( undefined , 'ok: ' + arg1 + ' ' + arg2 ) ; } , t ) ;
			}
		} ;
		
		object.fnWrapper = async.wrapper.timeout( object.fn , 20 ) ;
		
		object.fnWrapper( 'hello' , 'world' , 10 , function( error , result ) {
			expect( error ).not.to.be.ok() ;
			expect( result ).to.be( 'ok: hello world' ) ;
		} ) ;
		
		object.fnWrapper( 'hello' , 'world' , 30 , function( error , result ) {
			expect( error ).to.be.ok() ;
			expect( error ).to.be.an( Error ) ;
			expect( error.message ).to.be( 'Timeout' ) ;
			done() ;
		} ) ;
	} ) ;
	
} ) ;



describe( "Misc tests" , function() {
	
	it( "should trigger the callback even if no job is provided (empty array)" , function( done ) {
		
		async.series( [] )
		.exec( function( error , results ) {
			expect( error ).not.to.be.an( Error ) ;
			expect( results ).to.eql( [] ) ;
			done() ;
		} ) ;
	} ) ;
} ) ;



describe( "Async EventEmitter" , function() {
	
	it( "should emit synchronously, with a synchronous flow (nice=-3)" , function( done ) {
		asyncEventTest( -3 , function( order ) {
			expect( order ).to.eql( [ 'listener' , 'flow' , 'nextTick' , 'setImmediate' , 'setTimeout5' , 'setTimeout20' ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "should emit asynchronously, with an asynchronous flow, as fast as possible (nice=-2 -> nextTick)" , function( done ) {
		asyncEventTest( -2 , function( order ) {
			expect( order ).to.eql( [ 'flow' , 'listener' , 'nextTick' , 'setImmediate' , 'setTimeout5' , 'setTimeout20' ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "should emit asynchronously, with an asynchronous flow, almost as fast as possible (nice=-1 -> setImmediate)" , function( done ) {
		asyncEventTest( -1 , function( order ) {
			expect( order ).to.eql( [ 'flow' , 'nextTick' , 'listener' , 'setImmediate' , 'setTimeout5' , 'setTimeout20' ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "should emit asynchronously, with an asynchronous flow, with minimal delay (nice=0 -> setTimeout 0ms)" , function( done ) {
		asyncEventTest( 0 , function( order ) {
			try {
				expect( order ).to.eql( [ 'flow' , 'nextTick' , 'setImmediate' , 'listener' , 'setTimeout5' , 'setTimeout20' ] ) ;
			}
			catch( error ) {
				// Sometime setImmediate() is unpredictable and is slower than setTimeout(fn,0)
				// It is a bug of V8, not a bug of the async lib
				expect( order ).to.eql( [ 'flow' , 'nextTick' , 'listener' , 'setImmediate' , 'setTimeout5' , 'setTimeout20' ] ) ;
			}
			done() ;
		} ) ;
	} ) ;
	
	it( "should emit asynchronously, with an asynchronous flow, with a 10ms delay (nice=1 -> setTimeout 10ms)" , function( done ) {
		asyncEventTest( 1 , function( order ) {
			expect( order ).to.eql( [ 'flow' , 'nextTick' , 'setImmediate' , 'setTimeout5' , 'listener' , 'setTimeout20' ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "should emit asynchronously, with an asynchronous flow, with a 30ms delay (nice=3 -> setTimeout 30ms)" , function( done ) {
		asyncEventTest( 3 , function( order ) {
			expect( order ).to.eql( [ 'flow' , 'nextTick' , 'setImmediate' , 'setTimeout5' , 'setTimeout20' , 'listener' ] ) ;
			done() ;
		} ) ;
	} ) ;
} ) ;



