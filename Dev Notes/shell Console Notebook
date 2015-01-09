
/* ----------------------------------------------------------------------------------------
    Helpful Tips   */

The default group when creating a new user is a new group with the same name as the user.


ex:
  						            ..These two are the same!
treehouse ~ $ ls -l     /'  [
total 8 			         /     \
drwxrwxr-x  2  treehouse  treehouse 4096  Oct 10 13:55 documents
-rw-rw-r--  1  treehouse  treehouse  175  Oct 10 13:57 hello.txt
treehouse ~ $


-- Bash

The program that is actually interpreting our keystrokes and imputing them to the screen. It's the program
we're interacting with.




/* ---------------------------------------------------------------------------------------------------------------------
    Setting an Alias   */  (custom shortcuts)

This allows you to make custom shortcuts so you don't have to type out a file path every time.

nano .bash_profile

alias dp='~/Desktop/Code_Playground/Dev\ Notes/'
alias dev='cat ~/Desktop/Code_Playground/Dev\ Notes/Console/Console\ Essentials.txt'

(then hit cmd + o -> Enter -> cmd + x)

source ~/.bash_profile



/* ---------------------------------------------------------------------------------------------------------------------
    Productivity Tips   */


TAB COMPLETION: hit tab when typing a file name out

UP ARROW: this will show recent commands that were executed

MANUAL: by typing 'man' followed by a command will show how to use it or what it means



/* ----------------------------------------------------------------------------------------
    The Prompt   */			| DESCRIPTIONS:

The prompt can be different so don't get too used to how it looks.  This is just what I chose.
It's completely customizable and is different on different computers.

    prompt
|-------------|
 treehouse ~ $     		 	| this is called the prompt



  username
|---------|
 treehouse  ~ $     		| this is the username we are logged in as



   	current directory
           |-|
 treehouse  ~  $     		| this is the current directory,



 		      end of prompt
              |-|
 treehouse  ~  $			| this is usually a dollar sign and tells us where the prompt ends and the input
 							| it's not always a dollar sign but 99% of the time, it is



/* ----------------------------------------------------------------------------------------
    Basics   */					| DESCRIPTIONS:

    		      commands
                |--| 			| this is the list command
 treehouse  ~  $ ls  -l


    		           options
                    |--| 		| this specifies we want the long form of the list
 treehouse  ~  $ ls  -l


          					 arguments
         				    |---------|
 treehouse  ~  $ cd  documents	| these are what we want our command to operate on



/* ----------------------------------------------------------------------------------------
    Permissions   */														    | DESCRIPTIONS:


ex code:

treehouse ~ $ ls -l
total 8

drwxrwxr-x  2  treehouse  treehouse 4096  Oct 10 13:55 documents

-rw-rw-r--  1  treehouse  treehouse  175  Oct 10 13:57 hello.txt
treehouse ~ $


explanation:

 permissions
|-----------|
  drwxrwxr-x    	2  treehouse  treehouse 4096  Oct 10 13:55 documents     	|


 directory
|-|
 d rwxrwxr-x    	2  treehouse  treehouse 4096  Oct 10 13:55 documents     	|


  has 3 parts
 |---|---|---|
d rwx rwx r-x   	2  treehouse  treehouse 4096  Oct 10 13:55 documents     	| the permissions have 3 parties


 user 	  other
 |---|   |---|																	                            | Party Settings (I call them)
d rwx rwx r-x   	2  treehouse  treehouse 4096  Oct 10 13:55 documents     	| u: user
     |---|																		                              | g: group
     group 																		                              | o: other(meaning public)


 has 3 parts
  |-|-|-|
d  r w x  rwx r-x   2  treehouse  treehouse 4096  Oct 10 13:55 documents    | each user/group/public has 3 levels of
																				| access

read   execute
  |-| |-|
d  r w x  rwx r-x   2  treehouse  treehouse 4096  Oct 10 13:55 documents    | r: Read    - allows you to read
    |-|																			                                | w: Write   - update or delete
     write 																		                              | x: eXecute - tells OS it can be run
     																			                                  |     as well as who's allowed to run it


     					          user  		group  		    date created
                    |---------||---------|     |------------|
  drwxrwxr-x    	2  treehouse  treehouse 4096  Oct 10 13:55 documents     	| these are relative to who created the
  										                   |----|             |---------|		  | file
  										                    size                 name



Permissions are sually represented using numbers but in the Octal Notation.  This numerical representation uses digits 0 through 7.

-- Octal Notation

Basic Notation 						      |		Octal Notation             (the number 8 is represented by 10 in octal)
0  1  2  3  4  5  6  7  8  9 		|		0  1  2  3  4  5  6  7
10 11 12 13 14 15 16 17 18 19		|		10 11 12 13 14 15 16 17

-- Permission actions number values

	7 r  w  x 		3 -  w  x 													| each permission combination is
	6 r  w  - 		2 -  w  - 													| assigned a number 0 - 7
	5 r  -  x 		1 -  -  x
	4 r  -  - 		0 -  -  -

-- How we solve for the numbers:												       | r = 4
								 												                       | w = 2
	r   w   x 			  r   -   x		     -   -   x								 | x = 1
	4 + 2 + 1 = 7 		4 + 0 + 1 = 5 	 0 + 0 + 1 = 1						 | each party is then assigned a number
																				                       | based off the addition of the 3
-- How we use the numbers:
    u   g   o       															             | <- This '777' would leave a file
    7   7   7  									   								             | completely unprotected.


ex code:

treehouse ~ $ ls -l
total 8
drwxrwxr-x  2  treehouse  treehouse 4096  Oct 10 13:55 documents
-rw-rw-r--  1  treehouse  treehouse  175  Oct 10 13:57 hello.txt
treehouse ~ $ chmod 777 hello.txt											           <-	| adding 'all' the operators to 'all
treehouse ~ $ ls -l 															                  | parties' of the hello.txt file using
total 8 																		                        | chmod 777 fileName.txt
drwxrwxr-x  2  treehouse  treehouse 4096  Oct 10 13:55 documents
-rwxrwxrwx  1  treehouse  treehouse  175  Oct 10 13:57 hello.txt <-	| look here, 'all' the operators
treehouse ~ $																	                      | were added to 'all parties' for the
																				                            | hello.txt file

treehouse ~ $ chmod 640 hello.txt											           <-	| adding 'rw-' operators to 'user'
treehouse ~ $ ls -l 															                  | adding 'r--' operators to 'group'
total 8 																		                        | adding '---' operators to 'other'
drwxrwxr-x  2  treehouse  treehouse 4096  Oct 10 13:55 documents
-rw-r-----  1  treehouse  treehouse  175  Oct 10 13:57 hello.txt <-	| look here, the operators were changed
treehouse ~ $




/* ----------------------------------------------------------------------------------------
    Processes   */

Processes are instances of running programs on your computer. You can run multiple instances of a single program by creating multiple processes. Understanding how processes work is crucial for using the console effectively.


Commands:

-- Top  (show active processes)

A task manager that lets you view processes.  It's like the 'Activity Monitor' on iOS.

? : brings up help menu
q : exits the menu and hit again will exit the program


ex:
 								             .--- running this command will open up the 'top' program as shown below
treehouse ~ $ top 				<-'
Processes:  195 total, 2 running, 2 stuck, 191 sleeping, 1258 threads  												22:01:44
Load Avg:   1.55, 1.58, 1.56  CPU usage: 9.43% user, 5.61% sys, 84.94% idle  SharedLibs: 10M resident, 6024K data, 0B linkedit. MemRegions: 38110 total, 1455M resident, 64M private, 464M shared.
PhysMem:    3133M used (1117M wired), 57M unused. VM: 415G vsize, 1066M framework vsize, 377625(0) swapins, 456249(0) swapouts.
Networks:   packets: 2151630/1814M in, 1950396/921M out.
Disks:      1153140/22G read, 914209/19G written.

PID   COMMAND      %CPU TIME     #TH  #WQ  #PORT #MREG MEM    RPRVT  PURG   CMPRS  VPRVT  VSIZE  PGRP PPID STATE    UID  FAULTS    COW     MSGSENT    MSGRECV   SYSBSD     SYSMACH   CSW        PAGEINS
6941  mdworker     0.0  00:00.10 3    0    52    63    2508K  1668K  0B     0B     58M    2421M  6941 177  sleeping 501  3171      227     538        243       1822       634       324        0




-- Ps  (show process statuses)

This program will display a list of all processes and return to the command line immediately.


ex:  ( ps )

Alexs-MacBook-Air:~ alexcory$ ps 					| there are other arguments we can pass to this but the most common is aux
  PID TTY           TIME CMD
 6937 ttys000    0:00.01 -bash
Alexs-MacBook-Air:~ alexcory$


ex:  ( ps aux )

				        option				            | this being said it should have a '-' in front of it, however based on 
				        |---| 								    | compatibility issues and historical reasons, this is the most compatible 
treehouse ~ $ ps aux  								|   | way to use it. 
| typically there would be a bunch of |   | view a full list of all processes
| code here but there too much so 	  |
| we're going to skip it. 			      |

        	means: a ll processes for the 	| use this to find out:
        		 		|-|u ser 							    | A: what's running
        		 		| |-|x 								    | B: the process ID for a specific task
        				| | |-|
treehouse ~ $ ps a u x




-- Grep  (search for a pattern)

A tool that allows us to take some input, search for a certain pattern, and filter only the lines with that pattern on it.


ex:  ( ps aux | grep )

 					           pipe 							    | this is called a pipe
 					           |-| 							      | we typically use a pipe to combine programs together
treehouse ~ $ ps aux  |  grep "top"


Alexs-MacBook-Air:~ alexcory$ ps aux | grep 'top' 							                        | notice the 'top' at the end. 
alexcory         7106   0.0  0.0  2423368    180 s001  R+   10:53PM   0:00.00 grep top 	| That's what it filtered the 
Alexs-MacBook-Air:~ alexcory$ 															                            | search by this is 
                                                                                        | particularly useful  when you
                                                                                        | want to pause or kill
																						                                            | a process



/* ----------------------------------------------------------------------------------------
    Editing Files   */

Programs like 'nano' or 'pico' allow you to edit files.


ex:

treehouse ~ $ nano nameOfFile.txt				| doing this will open up the program and make a file named 'nameOfFile.txt'




/* ----------------------------------------------------------------------------------------
    Pausing and Resuming   */

Key Sequences

cntrl + z (stop or pause a process)
cntrl + c (Terminate or exit a process)



-- jobs (List jobs for your session)

A process that really belongs to you and your session.  Opening nano and working on a file is considered a job, and you can pause it.


ex:

Alexs-MacBook-Air:~ alexcory$ top 								| here you can see we are opening the 'top' program
[1]+  Stopped                 top 								| by typing 'ctrl + z' we were able top 'stop' or pause this job
Alexs-MacBook-Air:~ alexcory$ jobs 								| by typing jobs it will show us what processes we have stopped
[1]+  Stopped                 top 								| currently.
[2]+  Stopped                (something)
Alexs-MacBook-Air:~ alexcory$




-- fg (Bring a job to the foreground)

Brings the most recently stopped program to the foreground.


ex:

Alexs-MacBook-Air:~ alexcory$ top 								|
[1]+  Stopped                 nano demo.txt 			|
Alexs-MacBook-Air:~ alexcory$ jobs 								| displaying the current 'jobs'
[1]+  Stopped                 nano demo.txt 			|
[2]-  Stopped                 top 								| if you look at the '+' next to the [1], that means that nano will run
Alexs-MacBook-Air:~ alexcory$ fg 1 								| by default
nano demo.txt		(wd: ~)
Use "fg" to return to nano.

[1]+  Stopped                 nano demo.txt	  (wd: ~)
(wd now: ~ alexcory$)
Alexs-MacBook-Air:~ alexcory$ jobs
[1]+  Stopped                 nano demo.txt 			|
[2]-  Stopped                 top
Alexs-MacBook-Air:~ alexcory$ fg 								  |
nano demo.txt		(wd: ~)										        |
Alexs-MacBook-Air:~ alexcory$ jobs								| by hitting 'jobs' ENTER, by default it opened 'nano demo.txt' because
[2]+  Stopped                 top 								| of the '+'.  I then closed out of it without saving, leaving the 'top'
Alexs-MacBook-Air:~ alexcory$ fg								  | process the only 'job' left.  It's still job ID 2. It's not going to
 																                  | move around. By hitting 'fg' I bring it up. and exit
 																                  | out of it normally



/* ----------------------------------------------------------------------------------------
    Killing Processes   */

Sometimes a process gets out of control and you have to kill it yourself. There are several options available when killing processes and great care must be taken whenever you use the kill command.


Commands:

-- kill 														              | send a signal to a process

Signals 														              | message sent to a process by the operating system

-- KILL or 9 													            | Force a process to exit


-- TERM (terminate)(default) 									    | Request a process terminate normally

	- requests that the process terminates after any cleanup


-- STOP 														              | Stop or pause a process


ex:

treehouse ~ $ kill -STOP 1463



/* ----------------------------------------------------------------------------------------
    Environment Variables   */

Environment variables store configuration information on our computers. Here, we learn how to read and write values to the environment. We can create our own environment variable.  Environment variables need to be IN ALL CAPS.


ex:  (environment variables)
-  home
-  path
-  ps1


Commands:

-- which  													              | print the location of a program

Check to see if a program is installed.

				  .- shows the location
ex: 		 / 	   .- program
 				/     /
treehouse ~ $ which git
/usr/bin/git
treehouse ~ $


-- VARIABLE=value  											          | set a local environment variable


-- export VARIABLE=value  									      | set an environment variable that will be visible to child
															                    | processes

-- env  													                | view environment variables


-- bash  													                | start a new session within your current session

Bash.profile bash.rc


-- echo  													                | display the arguments sent to echo

This is actually a program stored in a file on your computer.  We can find out where by typing in 'which echo'





/* ----------------------------------------------------------------------------------------
    Find and Grep   */

The find and grep commands are extremely useful when you are trying to find files.


If you have deleted your hello.txt and want it back, run the following command to restore it to your home directory.

curl -Lo ~/hello.txt http://trhou.se/console_hello

IMPORTANT NOTE:
-- type in 'man grep' to get the manual for help

find X -name "Y"

Replace X with the path to the location on your computer that you wish to search. If you wish to search your entire computer, type “/” or if you wish to search only your user directory, type "~/" there. Replace the Y (in quotes) with the search criteria.


ex:
treehouse ~ $ man grep


Commands:


-- find . -name "search"  									          | look for files with the name search starting from your
															                        | current location

Find allows us to locate a file based on its name, using patterns.


ex:

treehouse ~ $ find . -name 'how_to_go_home.txt'			 	| it's not always necessary to use quotes however there
./documents/how_to_go_home.txt 							 	        | are some benefits like being able to search using multiple
treehouse ~ $ find / -name 'sudoer' 					 	      | words and special characters
| typically there would be a bunch of |
| code here but there too much so 	  |
| we're going to skip it. 			      |


treehouse ~ $ find documents bin ~name 'how_to_go_home.txt' | this is for searching for a file
documents/how_to_go_home.txt
treehouse ~ $ cat hello 									                  | this is for searching for 'text' inside a file



-- grep   													                  | "pattern" file find any lines that contain the pattern in
															                        | the given file

Grep lets us search within files for a certain pattern as well. By default HAS CASE SENSITIVITY.

  			      |G lobal
stands for -> | |R egular
       			  | | |E xpression
       			  | | | |P rint
       			  |-|-|-|-|
treehouse ~ $  g r e p


ex:
        				search term  .- file to search in
        				   |--|			/
treehouse ~ $ grep 'is' hello.txt
This is just some more text to make this file really long.
is
this
Now here is the last line of the file!
treehouse ~ $

          					  .- number line in result
          					 /
treehouse ~ $ grep -n this hello.txt
1:This is just some more text to make this file really long.
3:is
5:this
8:Now here is the last line of the file!
treehouse ~ $
          					  .- perform a case insensitive search 		| -i would high-light 'this' and 'This'
          					 /
treehouse ~ $ grep -i this hello.txt
This is just some more text to make this file really long.
is
this
Now here is the last line of the file!
treehouse ~ $
          					  .- show lines without the pattern   		| -v would show all lines without 'e' in them
          					 /
treehouse ~ $ grep -v e hello.txt
is
this
treehouse ~ $





/* ----------------------------------------------------------------------------------------
    Pipes and Redirection   */

Being able to manipulate the input and output of programs means you can construct some very useful commands by using the simple commands you know in new and interesting ways.


Commands:

-- somecommand < inputfile 									| run somecommand with input from inputfile, instead of the
															              | keyboard

ex:

none//


-- somecommand > outputfile 								| run somecommand with output to outputfile instead of the
															              | terminal screen.

ex:

none//


-- command1 | command2 									  	| pipe the output of command1 to the input of command 2


ex:

none//



When we run a program and create a process there is a standard way of inputting to the program and a standard way of outputting. These are actually referred to as standard in and standard out. Normally the standard out is the console's text and the output from the program is printed as lines of text on the console and the default standard input is our keyboard.

							  	_____________
							   |			       |
							   |			       |
							   |   Program	 |
							   |	 		       |
							   '_____________'
							   		    |
							   		   \ /  	(lines of text on the console)
								  ______'______
							   |			       |
							   |			       |
							   |   Process	 |
standard in	.--> |      	 		 |      -----.   standard out
					/		   '_____________' 		        \			(consoles text)
				 / 								                   |
				| 								                  \ /
	  _____________		 				           ______'________
   |			       |						        |				        |
   |			       |						        |				        |
   |  Keyboard	 |					        	|	   Screen	   	|
   |	 		       |						        |				        |
   '_____________'					         	'_______________'



We can change the standard out to be a file so instead of printing to the terminal all the info is stored in a file.

                                  _____________
                                 |             |
                                 |             |
                                 |   out.txt   |
                                 |             |
                                 '_____________'

							   		  					        ^
                  ______'______         |
                 |             |        /
                 |             |       /
                 |   Process   | -----/
standard in .--> |             |      
          /      '_____________'            
         /                                   
        |                                   
    _____________                      _______________
   |             |                    |               |
   |             |                    |               |
   |  Keyboard   |                    |    Screen     |
   |             |                    |               |
   '_____________'                    '_______________'




We can also use a file as standard input so that instead of a program reading our typed keys it can just read from a file.
	 _____________		 				        ______________
  |			        |					      	 |				       |
  |			        |						       |       				 |
  |   in.txt	  |						       | 	  out.text 	 |
  |	 		        |						       |				       |
	'_____________'						       '_______________'


			|              		   		  					   ^
			 \	  		    ____________ 			      /
				\     		|   			    | 			   /
				 \    		|			        | 		    /
					\	      |   Process	  |		     /
					 \----> |       	 		|  -----/
							    '_____________'

    _____________                      _______________
   |             |                    |               |
   |             |                    |               |
   |  Keyboard   |                    |    Screen     |
   |             |                    |               |
   '_____________'                    '_______________'





/* ----------------------------------------------------------------------------------------
    Building Software From Source   */	   (refer to: SQLite.org)

There are two main ways to install software from the console: building from source, and installing from a package manager. First, we'll see how to build from source.

Build-essential: the package that should be installed in order to build programs from source on Ubuntu Linux


Step 1 	Download source file 						| these steps may change here or there but usually this is all
													| you need
Step 2 	Untar file

Step 3 	Run ./configure script

Step 4 	Run make command

Step 5 	Run sudo make install


Commands:

-- sudo apt-get update  							| Update your computer's catalog of available software

        				  .- we type this because we need super user access priveleges
ex:       			 / 	   .- this is part of the pacakge manager system
        				/     /       .this is to make sure you are using the latest up to date pacakage
treehouse - $ sudo apt-get update
| typically there would be a bunch of |
| code here but there too much so 	  |
| we're going to skip it. 			      |
treehouse - $



-- sudo apt-get install build-essential 			| Install the tools needed to build software from source code


ex:
                   											 .-this is the package we are installing
                  											/
treehouse - $ sudo apt-get install build-essential
| typically there would be a bunch of |
| code here but there too much so 	  |
| we're going to skip it. 			      |
Do you want to install [Y/n]
| typically there would be a bunch of |
| code here but there too much so 	  |
| we're going to skip it. 			      |
treehouse - $ which make 							        | this is how you check to make sure it was installed
/usr/bin/make 										            | 'which' is a program that will tell you where something lives on
treehouse - $										              | the system



-- curl -O URL 										            | Download the file at the URL

        				  .- This is a program that is used for making requests from the internet.
ex:       			 /   .- this will save the file to a file on our machine
        				/   /               .- this link was taken from the SQLite.org's download page
treehouse - $ curl -O http://sqlite.org/2013/sqlite-autoconf-3080100.tar.gz
| typically there would be a bunch of |
| code here but there too much so 	  |
| we're going to skip it. 			      |
treehouse - $



-- tar -xvf FILENAME.tar.gz 						      | Decompress the tar.gz file to the current directory


        				  .- this is much like unzipping a zip file
ex:       			 /    .- x: extract  v: verbose (so we can see what's happening)  f: points to the tar file that we
         				/    / 															                               | want to extract
treehouse ~ $ tar -xvf sqlite-autoconf-3080100.tar.gz
| typically there would be a bunch of |
| code here but there too much so 	  |
| we're going to skip it. 			      |
treehouse ~ $ cd sqlite-autoconf-3080100.tar.gz
treehouse ~/src/sqlite-autoconf-3080100.tar.gz $	     | now we're inside of the sqlite tarred file
treehouse ~/src/sqlite-autoconf-3080100.tar.gz $ ls
| this will list a bunch of files here |
treehouse ~/src/sqlite-autoconf-3080100.tar.gz $



-- ./configure 										                     | Run the configure script that comes with the source code. This
													                             | creates a Makefile

The purpose of this script is to look through our system and prepare some more configuration files that will be used to actually build the program.


ex:

treehouse ~/src/sqlite-autoconf-3080100.tar.gz $ ./configure
| typically there would be a bunch of |
| code here but there too much so 	  | 			          | What this program has done is created a special file called a
| we're going to skip it. 			      |  			          | Makefile. And this is a file that specifies how to build the
treehouse ~/src/sqlite-autoconf-3080100.tar.gz $ 	      | program.



-- make 											                          | Run the build specified in the Makefile

We need to make sure we're in the same directory as our make file, which should be the project directory itself.


ex:

treehouse ~/src/sqlite-autoconf-3080100.tar.gz $ 	   | Now this will usually take a little while. It's actually building
| typically there would be a bunch of | 			       | the program from all the source files.
| code here but there too much so 	  |
| we're going to skip it. 			      |



-- sudo make install 								                 | Run the install script from the Makefile. This installs the
													                           | program

ex:

treehouse ~/src/sqlite-autoconf-3080100.tar.gz $ sudo make install
| typically there would be a bunch of | 		         | Now because it's already built a program, it won't recompile
| code here but there too much so 	  |				       | everything; however, it will just move everything that it has
| we're going to skip it. 			      |  			       | into somewhere that will be accessible in our path.
treehouse ~/src/sqlite-autoconf-3080100.tar.gz $

treehouse ~/src/sqlite-autoconf-3080100.tar.gz $ cd  | now if we want to check if it was installed we return to our
treehouse ~ $ which sqlite3 						             | home directory
/usr/local/bin/sqlite3
treehouse ~ $





/* ----------------------------------------------------------------------------------------
    Introduction to Package Managers   */

Sometimes, building software from source can be more hassle than it's worth. If you have a package manager on your computer, it can make managing your software much easier.

    .- Advanced
   /.- Packaging
  //.- Tool
 ///
APT: package manager for Ubuntu Linux

Ubuntu is actually a member of a family of Linux distributions that are based on Debian Linux. Linux comes in many different flavors and while they share the same core, the tools and configurations and options vary from distribution to distribution. There are many different package managers for Linux, and they vary from distro to distro.

Package Manager for Debian-based Linuxes and its related distros:
- APT

Mac OS X Package Manager:
- Homebrew

Other Package Managers:
- Pacman
- RPM
- YUM



-- apt-get update 									               | Update your package catalog on your computer

This command will update our local databases of the available packages.

ex:

treehouse ~ $ apt-get update
| typically there would be a bunch of |
| code here but there too much so 	  |
| we're going to skip it. 			      |
treehouse ~ $



-- apt-cache search PATTERN 						           | Search the available packages for a pattern


ex:

treehouse ~ $ apt-cache search 'git'
| typically there would be a bunch of |
| code here that would be full of 	  |
| files or directories w 'git' in them|
treehouse ~ $



-- apt-get install PACKAGE 							           | Install one or more packages

After we've searched through the programs and found what we were looking for above we use this.


ex:

treehouse ~ $ apt-get install git
| here is some information about the  |
| package that is about to be 	 	    |
| installed.			 			              |
Do you want to continue [Y/n]?
| typically there would be a bunch of |
| code here but there too much so 	  |
| we're going to skip it. 			      |
treehouse ~ $ which git 							             | 'which git' will show where the location of the program is
/usr/bin/git
treehouse ~ $



-- sudo apt-get upgrade 							| Upgrade to the latest version of all the packages installed
													| MAKE SURE TO USE SUDO

Usually you'll want to run the upgrade AFTER you've done the update.


ex:

treehouse ~ $ sudo apt-get upgrade
| here is some information about the  |
| packages that are about to be 	    |
| about to be upgraded.				        |
Do you want to continue [Y/n]?
| typically there would be a bunch of |
| code here but there too much so 	  |
| we're going to skip it. 			      |
treehouse ~ $



-- sudo apt-get remove PACKAGE 						         | Remove or uninstall package from your computer


ex:

treehouse ~ $ sudo apt-get remove git
| here is some information about the  |
| packages that are about to be 	    |
| removed.							              |
Do you want to continue [Y/n]?
| typically there would be a bunch of |
| code here but there too much so 	  |
| we're going to skip it. 			      |
treehouse ~ $


































































