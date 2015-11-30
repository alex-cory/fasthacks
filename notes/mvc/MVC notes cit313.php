
// -----------------------------------------------------------------------

# Models 
These are the functions and classes that actually talk to the database.  Create all the functions inside the models to talk to the database.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
These are going to be grabbing stuff from the database or putting stuff to the database
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

# Controllers
Take data from the view

     Once submitted is going to send the data back to the controller.  The controller is then going to decide what to do with the data.  Maybe it's to add a new user.  If it was a new user, the Controller would then talk to the model and say ( put this information into the database )

     If the View was a list of blog posts, the view asks the Controller, then the Controller talks to the Model to grab the Data, then the Controller takes that Data and passes it back to the View.


!!! Any time we make a View file we need to make a Controller file that matches the view.

Ex:
		  .- Class & View
 		 /    .- Method    ( ex: blopost_save()  or  blopost_view() )
		/    /  .--.- Anything else is going to be Parameters passed to that method
	   /    /  /  /
	/alex/go/to/town
	/ClassOrView/Method/Paramater1/Parameter2

	
## ADDPOST
# This is the correct page to add a post
localhost/index.php/addpost/

# This is what happens after the post is created
localhost/index.php/addpost/add
// and it shows everything in the form that was added



## REGISTER
# This is the correct page to add a post
localhost/index.php/register/

# This is what happens after the post is created
localhost/index.php/register/add
// and it shows everything in the form that was added














