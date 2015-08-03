/* ----------------------------------------------------------------------------------------
    INCREASING SPEED    */

//  When you set a built in function to a variable it no longer has to traverse the DOM
//  which is critical for large scale projects


//  EX:
$( document ).ready( function()
{
    $department = $( "select[name='dep']" );
    $cname = $( "select[name='cname']" );

});

/* From now on, whether we’ll use $(“select[name='dep']“) or $department, it will mean the same thing, difference is though, jQuery will no longer traverse the document again with $department, it will just know where that element is. This is very important for larger scripts that may slow down a web page. */




// FROM THE WEBSITE: http://devingredients.com/2011/05/populate-a-select-dropdown-list-with-jquery/
/* ----------------------------------------------------------------------------------------
    BETTER PERFORMANCE   */

// it's better to select elements this way


// EX: good
$( document ).ready( function()
{
    $( '#flower-items' ).find( 'a' ).colorbox();

});


// EX: bad
$( document ).ready( function()
{
    $( '#flower-items a' ).colorbox();

});




// FROM THE WEBSITE:
/* ----------------------------------------------------------------------------------------
    NEXT TOPIC   */

// FROM THE WEBSITE:

/* ----------------------------------------------------------------------------------------
    NEXT TOPIC   */

// FROM THE WEBSITE:

/* ----------------------------------------------------------------------------------------
    NEXT TOPIC   */

// FROM THE WEBSITE:


