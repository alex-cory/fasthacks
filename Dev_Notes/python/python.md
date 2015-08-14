# Python Notes

### Exit Terminal REPL
  - quit()
  - ctrl + D


###Q:
What is Python? State some programming language features of Python.

###A:
- interpreted
- modules
- threads
- exceptions
- automatic memory management


###Q:
Explain how Python is interpreted.

###A:
Python runs source code written by the programmer into an intermediate language which is
again translated into native/machine language that is executed.

###Q:
What are the rules for local and global variables in Python?

###A:
If a variable is defined outside of a function, it is inherently global. Inside the function
means it's local. If we want to make it global we need to explicitly define it as global.

Ex:
```
#!/usr/bin/python
# Filename: variable_localglobal.py
def fun1(a):
            print 'a:', a
            a= 33;
            print 'local a: ', a
a = 100
fun1(a)
print 'a outside fun1:', a
def fun2():
           global b
           print 'b: ', b
           b = 33
           print 'global b:', b
b =100
fun2()
print 'b outside fun2', b

-------------------------------------------------------

Output
$ python variable_localglobal.py
a: 100
local a: 33
a outside fun1: 100
b :100
global b: 33
b outside fun2: 33
```


###Q:
Explain the dictionary in Python.

###A:
- Python's built-in data type is dictionary, which defines a one-to-one relationship between keys and values
- Consist of pairs of keys and values
- Indexed by keys
- Similar to associative array or hash table in other languages

Ex:
```
❯ dict = {'India': 'Bharat', 'Angel': ‘Mother Teresa’, 'Cartoon': 'Mickey'}
❯ print dict[India]
Bharat
❯ print dict[Angel]
Mother Teresa
```


###Q:
How do we share global variables accross modules in Python?

###A:
- Create a config file and import it into each module.

Ex:
```
config.py :
a=0
b=0
c=0

module1.py:
import config
config.a = 1
config.b =2
config.c=3
print “ a, b & resp. are : “ , config.a, config.b, config.c
------------------------------------------------------------------------
output of module1.py will be
1 2 3
```

###Q:
How can we pass optional or keyword parameters from one function to another in Python?

###A:
Gather the arguments using the * and ** specifiers in the function's parameter list. This
gives us positional arguments as a tuple and the keyword arguments as a dictionary. Then
we can pass these arguments while calling another function by using * and **.

Ex:
```
def fun1(a, *tup, **keywordArg):
...
keywordArg['width']='23.3c'
...
Fun2(a, *tup, **keywordArg)
```

###Q:
Explain indexing and slicing operations in sequences.

###A:
- Different types of sequences in Python are strings, Unicode strings, lists, tuples, buffers,
  and xrange objects.
- **Slicing and Indexing Operations** are salient features of a sequence.
- Indexing operations allows us to access a particular item in the sequence directly (similar
  to the array/list indexing)
- **Slicing** allows you to retrieve a part of the sequence
- The slicing operation is used by specifying the name of the sequence followed by an optional
  pair of numbers separated by a colon with square brackets.  Ex: `S[startno:stopno]`
- The `startno` in the slicing operations indicates the position from where the slice starts
  and the `stopno` indicates where the slice will stop at.
- If the `startno` is ommited, Python will start at the beginning of the sequence.  If `stopno`
  is ommitted, Python will stop at the end of the sequence.

Ex:
```
❯ cosmeticList =[‘lipsstick’,’facepowder’,eyeliner’,’blusher’,kajal’]
❯ print “Slicing operation :”,cosmeticList[2:]
Slicing operation :[‘eyeliner’,’blusher’,kajal’]
❯ print “Indexing operation :”,cosmeticList[0]
“Indexing operation :lipsstick
```


###Q:
What is Lambda form? Explain about assert statement.

###A:
####Lambda form:
- Using lambda keyword tiny anonymous functions can be created.
- It is a very powerful feature of Python which declares a one-line unknown small function on
  the fly.  The Lambda is used to create new function objects and then return them at runtime.
- The general format for Lambda is:
  lambda parameters(s): expression using the parameter(s)

Ex: (k is lambda function)
```
❯ k=lambda y:y+y
❯ k(30)
60

❯ k(40)
80
```

####The assert statement:
- The built-in assert statement of python introduced in v1.5 is used to assert that something is true.
- Programmers often place assertions at the beginning of a function to check for valid input, and
  after function to call to check for valid output. Assert statement can be removed after testing of
  a program is over.
- If assert evaluates to be false, an `AssertionError` exception is raised. `AssertionError` exceptions
  can be handled with the try except statement.
The general syntax for an assert statement is:
```
assert Exception[, Arguments]
```

###Q:
Explain the role of the repr function.

###A:
- Python can convert any value to a string by making use of two functions `repr()` and `str()`
- The `str()` function returs representatios of values which are human-readable, while `repr()`
  generates representations which can be read by the interpreter.
- `repr()` returns machine-readable representations of values, suitable for an exec command.

Ex:
```
def fun():
y=2333.3
x=str(y)
z=repr(y)
print " y :",y
print "str(y) :",x
print "repr(y):",z
fun()
-------------
output
y : 2333.3
str(y) : 2333.3
repr(y) : 2333.3000000000002
```

###Q:
Explain pickling and unpickling.

###A:
Pickling is a standard module which serializes & de-serializes a python object structure.

Pickle module accepts any python object, converts it into a string representation, and
dumps it into a file (by using dump() function) which can be used later. This process
is called `pickling`. Whereas `unpickling` is the process of retrieving the original python
object from the stored string representation for use.


###Q:
What is LIST comprehensions features of Python used for?

###A:
- LIST comprehensions features were introduced in Python v2.0
- It creates a new list based on an existing list.
- It maps a list into another list by applying a function to each of the elements of the
  existing list.
- List comprehensions create lists without using `map()`, `filter()`, or `lambda form`


###Q:
How is memory managed in Python?

###A:
- Memory management in python involves a private heap containing all python objects and
  data structures. The interpreter takes care of the python heap and the programmer has
  no access to it.
- The allocation of heap space for python objects is done by the `python memory manager`.
  The core API of python provides some tools for the programmer to code reliably and build
  more robust programs.
- Python also has a built-in garbage collector which recycles all the unused memory. When
  an object is no longer referenced by the program, the heap space it occupies can be freed.
  The garbage collector determines objects which are no longer referenced by the program
  and frees the occupied memory and makes it available to the heap space.

Ex: (the `gc` module defines functions to enable/disable the garbage collecor)
`gc.enable()`  - Enables automatic garbage collection.
`gc.disable()` - Disables automatic garbage collection.


###Q:
How do you make a higher order function in python?

###A:
- A higher order function accepts one or more functions as input and returns a new function.
  Sometimes it is required to use function as data.
- To make a higher order function, we need to import `functools` module
- The `functools.partial()` is used often for higher order functions.

###Q:
Explain how to copy an object in python.

###A:
- There are two ways in which objects can be copied in python.
  1. Shallow Copy
  2. Deep Copy
- Shallow copies duplicate minute as possible whereas Deep copies duplicate everything.

Ex: (if `a` is an object to be copied then)
`copy.copy(a)`     - returns a shallow copy of a.
`copy.deepcopy(a)` - returns a deep copy of a.

###Q:
How can I find the methods or attributes of an object in python?

###A:
- Built-in `dir()` function of python, on an instance shows the instance variables as well as
  the methods and class attributes defined by the instance's class and all it's base classes
  alphabetically. So by any object as an argument to `dir()` we can find all the methods and
  attributes of the object's class.

Ex:
```
class Employee:
def __init__(self,name,empCode,pay):
  self.name=name
  self.empCode=empCode
  self.pay=pay

print("dir() listing all the Methods & attributes of class Employee")
print dir(e)
-----------------------------------------------------
Output
dir() listing all the Methods & attributes of class Employee
[ '__init__', 'empCode', 'name', 'pay']
```


###Q:
How to convert a string to a number?

###A:
- The `int()` function takes a string and converts it to a number.
- The `float()` function converts strings into float numbers.

Ex: `int()`
```
❯ s = "1234" # s is string
❯ i = int(s) # string converted to int
❯ print i+2
-------------------------
1236
```

Ex: `float()`
```
❯ s = "1234.22" # s is string
❯ i = float(s) # string converted to float
❯ print i
-------------------------
1234.22
```

###Q:
What is a negative index in python?

###A:
- Python arrays & list items can be accessed with positive or negative numbers (also known as index).
- A negative index accesses elements from the end of the list counting backwards.

Ex:
```
❯ import array
❯ a= [1, 2, 3]
❯ print a[-3]
1
❯ print a[-2]
2
❯ print a[-1]
3
```

###Q:
How do you make an array in Python?

###A:
- The array module contains methods for creating arrays of fixed types with homogenous data types.
  `Arrays` are slower than `lists`.
- Arrays of characters, integers, floating point numbers can be created using the `array` module.

Ex:
```
array(typecode[, intializer])
```
- This returns a new array whose items are constrained by typecode, and initialized from the optional
  initialized value. Where the typecode can be for instance ‘c’ for character value, ‘d’ for double,
  ‘f’ for float.


###Q:
Explain how to create a multidimensional list.


###A:
- There are two ways to create multidimensional lists:
1. By direct initializing the `list` as shown below to create `multidimlist` below.
2. Create a list of the desired length first, then fill in each element with the newly created lists.
   (see below)

Ex: 1
```
❯ multidimlist = [
                  [227, 122, 223],
                  [222, 321, 192],
                  [21, 122, 444]
]
❯ print multidimlist[0]
❯ print multidimlist[1][2]
__________________________
Output
[227, 122, 223]
192
```

Ex: 2
```
❯ list=[0]*3
❯ for i in range(3):
❯   list[i]=[0]*2
❯ for i in range (3):
❯   for j in range(2):
❯   list[i][j] = i+j
❯ print list
__________________________
Output
[[0, 1], [1, 2], [2, 3]]
```

###Q:
Explain how to overload constructors (or methods) in python.

###A:
- `__init__()` is the first method defined in a class. When an instance of a class is created,
  python calls `__init__()` to initialize the attribute of the object.

Ex:
```
class Employee:

  def __init__(self, name, empCode, pay):
    self.name = name
    self.empCode = empCode
    self.pay = pay

e1 = Employee("Sarah", 99, 30000.00)

e2 = Employee("Asrar", 100, 60000.00)
print("Employee Details:")

print(" Name:",e1.name,"Code:", e1.empCode,"Pay:", e1.pay)
print(" Name:",e2.name,"Code:", e2.empCode,"Pay:", e2.pay)
---------------------------------------------------------------
Output

Employee Details:
(' Name:', 'Sarah', 'Code:', 99, 'Pay:', 30000.0)
(' Name:', 'Asrar', 'Code:', 100, 'Pay:', 60000.0)
```


###Q:
Describe how to send mail from a python script.

###A:
- The `smtplib` module defines an SMTP client session object that can be used to send mail to
  any Internet machine.
-

Ex:
```
import smtplib

SERVER = smtplib.SMTP(‘smtp.server.domain’)
FROM = sender@mail.com
TO = ["user@mail.com"] # must be a list
SUBJECT = "Hello!"
TEXT = "This message was sent with Python's smtplib."

# Main message
message = """
From: Alex Cory < sender@mail.com >
To: HackingEDU user@mail.com
Subject: SMTP email msg
This is a test email. Acknowledge the email by responding.
""" % (FROM, ", ".join(TO), SUBJECT, TEXT)
server = smtplib.SMTP(SERVER)
server.sendmail(FROM, TO, message)
server.quit()
```


###Q:
Describe how to generate random numbers in python.

###A:
- The standard module `random` implements a random number generator.
- There are also many other in this module, such as:
  - `uniform(a, b)` - returns a floating point number in the range [a, b].
  - `randint(a, b)` - returns a random integer number in the range [a, b].
  - `random()`      - returns a floating point number in the range [0, 1].

Ex:
```
import random

i = random.randint(1,99) # i randomly initialized by integer between range 1 & 99
j= random.uniform(1,999) # j randomly initialized by float between range 1 & 999
k= random.random()# k randomly initialized by float between range 0 & 1
print("i :" ,i)
print("j :" ,j)
print("k :" ,k)
__________
Output -
('i :', 64)
('j :', 701.85008797642115)
('k :', 0.18173593240301023)

Output-
('i :', 83)
('j :', 56.817584548210945)
('k :', 0.9946957743038618)
```


###Q:
How do we make python scripts executable?

###A:
- In terminal or in an IDE
- IDE: open file and click the run button
- Terminal: example below

Ex:
```
❯ python pythonFile.py
```


###Q:
Explain how to make forms in python.

###A:
- We need to import `cgi` module to access form fields using the `FieldStorage` class.
- Every instance of class FieldStorage (for 'form') has the following attributes:
  - **form.name:**                The name of the field, if specified.
  - **form.filename:**            If an FTP transaction, the client-side filename.
  - **form.value:**               The value of the field as a string.
  - **form.file:**                file object from which data can be read.
  - **form.type:**                The content type, if applicable.
  - **form.type_options:**        The options of the 'content-type' line of the HTTP request, returned as a dictionary.
  - **form.disposition:**         The field 'content-disposition'; None if unspecified.
  - **form.disposition_options:** The options for 'content-disposition'.
  - **form.headers:**             All of the HTTP headers returned as a dictionary.

Ex:
```
import cgi

form = cgi.FieldStorage()
if not (form.has_key("name") and form.has_key("age")):
print "<H1>Name & Age not Entered</H1>"
print "Fill the Name & Age accurately."
return
print "<p>name:", form["name"].value
print "<p>Age:", form["age"].value
```


###Q:
Describe how to implement Cookies for Web python.

###A:
- A cookie is an arbitray string of characters that uniquely identifies a session.
- Each cookie is specific to one website and one user.
- The `Cookie` module defines classes for abstracting the concepts of cookies. It contains the following methods to
  create cookies:
  - `Cookie.SimpleCookie([input])`
  - `Cookie.SerialCookie([input])`
  - `Cookie.SmartCookie([input])`

Ex: (this creates a cookie)
```
import Cookie

ck = Cookie.SimpleCookie(x)
```


###Q:


###A:
-
-

Ex:
```

```


###Q:


###A:
-
-

Ex:
```

```
