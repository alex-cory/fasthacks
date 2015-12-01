General Notes
============

#### Server
  - In the context of Internet Protocol (IP) networking, a server is a program that operates as a socket listener.

#### Network Socket  
  - A network socket is an endpoint of an inter-process
    communication across a computer network.
    
#### ASCII: [American Standard Code for Information Interchange](http://bit.ly/1Kd9XhD)
  
#### CAS: [Central Authentication Service](http://bit.ly/1GtDzcH)
  - a single sign-on protocol for the web. Its purpose
    is to permit a user to access multiple applications
    while providing their credentials (such as userid and
    password) only once. It also allows web applications
    to authenticate users without gaining access to a user's
    security credentials, such as a password. The name CAS
    also refers to a software package that implements this
    protocol.
  
#### AMD: [Asynchronous Module Definition](http://bit.ly/1FKUu6R)
  - AMD specifies a standard for modular JavaScript such that modules
    can load their dependencies asynchronously, solving the problems
    associated with synchronous loading.
  
#### [CommonJS](http://bit.ly/1e52J6R)
  - a project with the goal of specifying an ecosystem for JavaScript
    outside the browser (for example, on the server or for native desktop
    applications).

#### Module Bundler  
  -

#### Browserfy  
  -

#### [Webpack](http://bit.ly/1e52XuQ)
  - a module bundler. Takes modules with dependencies and generates static
    assets representing those modules.

#### Web Syndication  
  - refers to the websites providing information and the websites displaying it.

#### IRC: [Internet Relay Chat](http://bit.ly/1I3A2yD)
  - is an application layer protocol that facilitates the transfer of messages
    in the form of text. The chat process works on a client/server networking
    model. IRC clients are computer programs that a user can install on their
    system. These clients communicate with chat servers to transfer messages
    to other clients. IRC is mainly designed for group communication in discussion
    forums, called channels, but also allows one-on-one communication via private
    messages as well as chat and data transfer, including file sharing.

#### FOSS: [Free and open-source software](http://bit.ly/1GAjqDF)
  - is computer software that can be classified as both free software and
    open-source software. That is, anyone is freely licensed to use, copy,
    study, and change the software in any way, and the source code is openly
    shared so that people are encouraged to voluntarily improve the design
    of the software. This is in contrast to proprietary software, where the
    software is under restrictive copyright and the source code is usually
    hidden from the users.

#### [Freenode](https://freenode.net/)
  - an IRC network providing discussion facilities for the Free and Open
    Source Software communities, not-for-profit organizations, and related
    communities.

#### cURL: [Client URL Request Library](http://bit.ly/1GaEA4S)
  - Think of it as a "copy for URLs" -- it can copy to or from a given URL in
    any nine different protocols

#### grep: [Global Regular Expression Print](https://kb.iu.edu/d/abnd)
  - a Unix command used to search files for the occurrence of a string of characters that matches a specified pattern.

#### [SuperAgent](http://bit.ly/1LjeEf1)
  - Super Agent is light-weight progressive ajax API crafted for flexibility,
    readability, and a low learning curve after being frustrated with many of
    the existing request APIs.
  - It's basically a nice simple way to make http requests to apis.

#### Data-Flow Programming/Flow Based Programming  
  - where data flows through the application in a single direction — there are
    no two-way bindings.


Internet Associations  
--------------------

#### IANA: [Internet Assigned Numbers Association](http://bit.ly/1G1moOa)
  - is responsible for the global coordination of the DNS Root, IP addressing, and other
    Internet protocol resources.
  - Website: http://www.iana.org/

#### WC3: [World Wide Web Consortium](http://bit.ly/1JtVNx2)
  - The main international standards organization for the World Wide Web.
  - Developing protocols and guidelines that ensure long-term growth for the Web.
  - Website: http://www.w3.org/

#### ICANN: [Internet Corporation for Assigned Names and Numbers](http://bit.ly/1G1mkhg)
  - a nonprofit organization that is responsible for the coordination
    of maintenance and methodology of several databases of unique
    identifiers related to the namespaces of the Internet, and
    ensuring the network's stable and secure operation

#### IETF: [The Internet Engineering Task Force](http://bit.ly/1G1nWb5)
  - develops and promotes voluntary Internet standards, in
    particular the standards that comprise the Internet protocol
    suite (TCP/IP). It is an open standards organization, with
    no formal membership or membership requirements. All participants
    and managers are volunteers, though their work is usually
    funded by their employers or sponsors.
  - Website: https://www.ietf.org/

#### ECMA: [European Computer Manufacturers Association](http://bit.ly/1IrkGt8)
  - an international private (membership-based) non-profit
    standards organization for information and communication
    systems.
  - Website: http://www.ecma-international.org/
  

Cool Programs for Terminal
--------------------------

  ### fswatch  
    - This is a small program that monitors a specified directory for file changes
      and executes a shell command if some file in selected directory is updated


### Difference Between Compiled Language & Interpreted Language  

  - The difference is __not__ in the language; it is in the implementation.
  - In a compiled implementation, the original program is translated into native
    machine instructions, which are executed directly by the hardware.
  - In an interpreted implementation, the original program is translated into
    something else.  Another program, called "the interpreter", then examines
    "something else" and performs whatever actions are called for.  Depending on
    the language and its implementation, there are a variety of forms of "something
    else." From more popular to less popular, "something else" might be
      - Binary instructions for a virtual machine, often called __bytecode__, as is
        done so in Lua, Python, Ruby, Smalltalk, and many other systems.
      - tree-like representation of the original program, such as an abstract-syntax,
        as is done for many prototype or educational interpreters.
      - A tokenized representation of the source program, similar to Tcl(tool command 
        language: http://bit.ly/1U5VzyK).
      - The characters of the source program, as was done in MINT and TRAC
  - One thing that complicates the issue is that __it is possible to translate (compile)
    bytecode into native machine instructions.  Thus, a successful interpreted implementation
    might eventually acquire a compiler.  If the compiler runs dynamically, behind the scenes,
    it is often called a just-in-time compiler or JIT compiler.  JITs have been developed
    for Java, JavaScript, Lua, and many other languages.  At that point you can have a
    hybrid implementation in which some code is interpreted and some code is compiled.
  - StackOverflow: http://bit.ly/1MtB6BD

Software Architectures
----------------------

#### MVC (Model View Controller)  
  - models
  - views
  - controllers
  - Ex: Zend (PHP framework)
  
#### MTV (Model Template View)  
  - models
  - templates
  - views
  - Ex: Django (python framework) uses this
  
#### Flux  
  - dispatcher
  - actions
  - stores
  - Ex: React.js uses this
