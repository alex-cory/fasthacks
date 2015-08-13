
public class Post
{
	// Parameters
	public String title, author;
	public int id = NULL;


	// When creating a class, it's much more easy to remember one method instead of many.
	public Post getPostByTitle(String ttl)
	{
	       // code...
	}
	public Post getPostByID(int idNum)
	{
		id = idNum;
		return id;
	}
	public Post getPostByAuthor(String author)
	{
	       // code...
	}

	// Above there are 3 different methods created.  Instead you could do one method.
	public Post getPost(String title)
	{
	       // code...
	}
	public Post getPost(int idNum)
	{
	        // code...
	}
	public Post getPost(String author)
	{
	       // code...
	}
	// This way the same method can be used by passing in different arguments(aka variables).
}







// Another Example

public class Rectangle
{
	double width, length;

	// Constructor: so the JRE can allocate the right amount of ______ .
	Rectangle()
	{
		length = 0.0;
		width = 0.0;
	}

	// Overloading Constructor 1
	Rectangle(double len)
	{
		length = len;
		width = 0.0;
	}

	// Overloading Constructor 2
	Rectangle(double wid, double len)
	{
		length = len;
		width = wid;
	}
}