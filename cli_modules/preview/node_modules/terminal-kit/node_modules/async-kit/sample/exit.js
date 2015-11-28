

async = require( '../lib/async.js' ) ;


//*
process.on( 'asyncExit' , function( code , timeout , callback ) {
	
	console.log( 'asyncExit event received - starting a short task' ) ;
	
	setTimeout( function() {
		console.log( 'Short task finished' ) ;
		callback() ;
	} , 100 ) ;
} ) ;
//*/

/*
process.on( 'asyncExit' , function( code , timeout , callback ) {
	
	console.log( 'asyncExit event received - starting a too long task' ) ;
	
	setTimeout( function() {
		console.log( 'Long task finished (should not happen)' ) ;
		callback() ;
	} , 1000 ) ;
} ) ;
//*/

//*
process.on( 'asyncExit' , function( code , timeout ) {
	
	console.log( 'asyncExit event received - non-critical task' ) ;
	
	setTimeout( function() {
		console.log( 'Critical task finished' ) ;
	} , 200 ) ;
} ) ;
//*/

async.exit( 5 , 500 ) ;



