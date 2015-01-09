

-------------------------------------------------------------------------------------------------------------------------
ZSH Notebook  		-- (http://goo.gl/Ivc29)





-- Syntax  --------------------------------------------------------------------------------------------------------------

	Sometimes I will show both what you type into a shell interactively, and what the shell throws back at you:
	
	  % print $ZSH_VERSION
	  3.1.9
	  % print $CPUTYPE
	  i586

	Here, `%' shows the prompt the shell puts up to tell you it is expecting input. Actually, you probably see something before the percent sign like the name of the machine or your user name, or maybe something fancier. I've pruned it to the minimum to avoid confusion.  If you want to input the `%' in front into a terminal to be executed, you can do this where you don't even have to edit the line first:

	  alias %=' '

	Then % at the start of a line is turned into nothing whatsoever; the space just indicates that any following aliases should be expanded. So the line `% print $CPUTYPE' will ignore the `%' and execute the rest of the line. (I hope it's obvious, but your own prompt is always ignored; this is just if you copy the prompts from the guide into the shell.)

	There are lots of different types of object in zsh, but one of the most common is parameters, which I will always show with a `$' sign in front, like `$ZSH_VERSION', to remind you they are parameters. You need to remember that when you're setting or fiddling with the parameter itself, rather than its value, you omit the `$'. When you do and don't need it should become clearer as we go along.

	The other objects I'll show specially are shell options --- choices about how the shell is to work --- which I write like this: `SH_WORD_SPLIT', `NO_NOMATCH', `ZLE'. Again, that's not the whole story since whenever the shell expects options you can write them in upper or lower case with as many or as few underscores as you like; and often in code chunks I'll use the simplest form instead: `shwordsplit', `nonomatch', `zle'. If you're philosophical you can think of it as expressing the category difference between talking about programming and actual programming, but really it's just me being inconsistent.






------------------------------------------------------------------------------------------------------------------------
CHAPTER 2: What to put in your startup files




--(2.1)-- Types of shell: interactive and login shells  ----------------------------------------------------------------

	Shell:
	 - Basically, the shell is just there to take a list of commands and run them; it doesn't really care whether the 
	   commands are in a file, or typed in at the terminal.


	Interactive Shell:
	 - When you are typing at a prompt and waiting for each command to run, the shell is interactive.


	Non-Interactive Shell:
	 - When the shell is reading commands from a file, it is, consequently, non-interactive.


	Script:
	 -  A list of commands used in this second way --- typically by typing something like zsh filename, although there 
	 	are shortcuts --- is called a script, as if the shell was acting in a play when it read from it (and shells can be real hams when it comes to playacting).


	-- What is a login shell? Simple tests

		Telling if the shell you are looking at is interactive is usually easy: if there's a prompt, it's interactive. As you may have gathered, telling if it's a login shell is more involved because you don't always know how the shell was started or if the option got changed. If you want to know, you can type the following (one line at a time if you like, see below),

	❯ if [[ -o login ]]; then                                                             our_clone_project/git/new_feature 
	then> print yes
	then> else
	else> print no
	else> fi
	yes

		What you're testing goes inside the `[[ ... ]]'; in this case, the -o tells the shell to test an option, here login.
		Although you usually know when a shell is interactive, in fact you can test that in exactly the same way, too: just use `[[ -o interactive ]]'. This is one option you can't change within the shell; if you turn off reading from the keyboard, where is the shell supposed to read from? 

		Aside for beginners in shell programming: maybe the semicolon looks a bit funny; that's because the `then' is really a separate command. The semicolon is just instead of putting it on a new line; the two are interchangeable. In fact, I could have written,

	if [[ -o login ]]; then; print yes; else; print no; fi





--(2.2)-- All the startup files  ---------------------------------------------------------------------------------------


	print $ZDOTDIR 		- If you get something other than a blank line, or an error message telling you the parameter 
						  isn't set, it's telling you a directory other than `~' where your startup files live

	/etc/zshenv
		Always run for every zsh.

	~/.zshenv
		Usually run for every zsh (see below).

	/etc/zprofile
		Run for login shells.

	~/.zprofile
		Run for login shells.

	/etc/zshrc
		Run for interactive shells.

	~/.zshrc
		Run for interactive shells.

	/etc/zlogin
		Run for login shells.

	~/.zlogin
		Run for login shells.

---------------------------------
First Law of Zsh Administration:
  - Put as little as possible in the file /etc/zshenv, as every single zsh which starts up has to read it.
---------------------------------

	You should probably surround any option settings in /etc/zshenv with

		if [[ ! -o norcs ]]; then
		... <commands to run if NO_RCS is not set, 
		     such as setting options> ...
		fi

	There are two files run at the end: ~/.zlogout and /etc/zlogout, in that order.









--(2.3)-- Options  ---------------------------------------------------------------------------------------------


--(2.4)-- Parameters  ---------------------------------------------------------------------------------------------
	
	- 	foo='This is a parameter.'

	- 	foo='This is a parameter.
  		This is still the same parameter.'

	- 	print -- '$foo is "'$foo'"'
		
		$foo is "This is a parameter."

	Parameters are used with the `$' stuck in front, to remind you what they are, but you should remember that the `$' is missing when you set them, or, indeed, any time when you're referring to the name of the parameter instead of its value.



(1)-- Arrays

	- 	foo=(This is a parameter.)

	There must be no space between the `=' and the `('

	- 	print -- ${foo[4]}

		parameter.

	The array stores the words separately, and you can retrieve them separately by putting the number of the element of the array in square brackets.

	- 	foo=('first element' 'second element')
  		print -- ${foo[2]}

  		second element

  	I believe the arrays are indexed beginning at 1 instead of 0




--(2.5)--  What to put in your startup files  --------------------------------------------------------------------------

	At the last count there were over 130 options and several dozen parameters which are special to the shell. Here are some options and parameters to think about setting in ~/.zshrc.


(1)--  Compatibility options: SH_WORD_SPLIT and others

	BARE_GLOB_QUAL, GLOB_SUBST, SH_FILE_EXPANSION, SH_GLOB, KSH_GLOB

	NOMATCH, BAD_PATTERN

	BG_NICE, NOTIFY

	HUP

	KSH_ARRAYS

	FUNCTION_ARG_ZERO

	KSH_AUTOLOAD

	LOCAL_OPTIONS, LOCAL_TRAPS

	PROMPT_PERCENT, PROMPT_SUBST

	RM_STAR_SILENT

	SH_OPTION_LETTERS

	SH_WORD_SPLIT

	Starting zsh as ksh



(2)--  Options for csh junkies



(3)--  The history mechanism: types of history

	Editing the history directly

	`Bang'-history

Ksh-style history commands



(4)--  Setting up history



(5)--  History options

	APPEND_HISTORY, INC_APPEND_HISTORY, SHARE_HISTORY

	EXTENDED_HISTORY

	HIST_IGNORE_DUPS, HIST_IGNORE_ALL_DUPS, HIST_EXPIRE_DUPS_FIRST, HIST_SAVE_NO_DUPS, HIST_FIND_NO_DUPS

	HIST_ALLOW_CLOBBER, HIST_REDUCE_BLANKS

	HIST_IGNORE_SPACE, HIST_NO_STORE, HIST_NO_FUNCTIONS

	NO_HIST_BEEP



:D(6)--  Prompts 										---------------------------------------------------------------


	Prompt Escapes:
		-  prompt escapes are sequences that start with a `%'. If you get really sophisticated, you might need to turn on 
		   PROMPT_SUBST.


	The main prompt is in a parameter called either:
	-	$PS1 
		or 
	-	$PROMPT
		or 
	-	$prompt;

		The reason for having all these names is historical --- they come from different shells --- so I'll just stick with the shortest. 

	Prints a prompt at the right of the screen.
	- 	$RPS1

		The point of this is that it automatically disappears if you type so far along the line that you run into it, so it can help make the best use of space for showing long things like directories.

	Debugging:
	- 	$PS4 

		There is an option XTRACE which causes the shell to print out lines about to be executed, preceded by $PS4. 
		--- see `Location in script or function' in the following list.

	Note that you can try this out before you alter the prompt by using
	- 	 print -P

		This expands strings just as they are in prompts. You will probably need to put the string in single quotes.



The time

	Zsh allows you lots of different ways of putting the time into your prompt with percent escapes. 
	- 	%t

		12 hour format

	- 	%T

		24 hour format

	- 	%*

		24 hour with seconds

	- 	%w

		Wed 22

	- 	%W 		(US format)

		9/22/99

	- 	%D 		(international format)

		99-09-22 

	- 	%D{...}

		%D{%L:%M} which gives the time in hours and minutes, with the hours as a single digit for 1 to 9

	- 	%(numX.true.false)

		where X is one of t or T. For t, if the time in minutes is the same as num (default zero), then true is used as the text for this section of the prompt, while false is used otherwise. T does the same for hours. Hence

  	- 	PS1='%(t.Ding!.%D{%L:%M})%# '

		prints the message `Ding!' at zero minutes past the hour, and a more conventional time otherwise. The `%#' is the standard sequence which prints a `#' if you are the superuser (root), or a `%' for everyone else, which occurs in a lot of people's prompts. Likewise, you could use `%(30t.Dong!....' for a message at half past the hour.



The current directory

	- 	%~

		prints out the current directory

	Shortening the directory

	1 	If you are using a windowing system you can put the directory in the title bar, rather than anywhere inside the 	window.

	2 	$RPS1

		Disappears when you type near it.

	3 	%1~

		Pick segments out of `%~' or `%/' by giving them a number after the `%': for example, `%1~' just picks out the last segment of the path to the current directory.

 * 	4 	Prompts or parts of prompts, not just bits showing the directory, can be truncated to any length you choose. To
		truncate a path on the left, use something like `%10<...<%~'. That works like this: the `%<<' is the basic form for truncation. The 10 after the `%' says that anything following is limited to 10 characters, and the characters `...' are to be displayed whenever the prompt would otherwise be longer than that (you can leave this empty). This applies to anything following, so now the %~ can't be longer than 10 characters, otherwise it will be truncated (to 7 characters, once the `...' has been printed). You can turn off truncation with `%<<', i.e. no number after the `%'; truncation then applies to the entire region between where it was turned on and where it was turned off (this has changed from older versions of zsh, where it just applied to individual `%' constructs).
	 	



What are you waiting for?

Location in script or function

	- 	%h

		shows you the history entry number, useful if you are using bang-history

	- 	%m

		shows you the current host name up to any dot

	- 	%n 

		shows the username.



Other bits and pieces

	- 	PS1='%(?..(%?%))%# '

		know when the last command failed

	- 	PS1='%(2L.+.)%# '

		know if you're in a subshell, that is if you've started another shell within the main one by typing `zsh'. You can do this by using another ternary expression that checks the parameter SHLVL, which is incremented every time a new zsh starts.  So if there was already one running (which would have set SHLVL to 1), it will now be 2; and if SHLVL is at least 2, an extra `+' is printed in front of the prompt, otherwise nothing. 



Colours

	- 	  PS1="%{${bg[white]}${fg[red]}%}%(?..(%?%))\ 
  		  %{${fg[yellow]}${bg[black]}%}%# "

  		  Produces a red-on-white `(1)' if the previous programme exited with status 1, but nothing if it exited with status 0, followed by a yellow-on-black `%' or `#' if you are the superuser. Note the use of the double quotes here to force the parameters to be expanded straight away --- the escape sequences are fixed, so they don't need to be re-extracted from the parameters every time the prompt is shown
		

	- 	

		



Themes

	See the zshcontrib manual page for how to do this (search for `prompt themes').





:D(7)--  Named directories 								----------------------------------------------------------------

	As already mentioned, `~/' at the start of a filename expands to your home directory. More generally, `~user/' allows you to refer to the home directory of any other user. Furthermore, zsh lets you define your own named directories which use this syntax. The basic idea is simple, since any parameter can be a named directory:

		~❯ dir=/Desktop/Code_Playground
		~❯ print ~dir
		/Desktop/Code_Playground


	 The difference comes if you use the `%~' construct, described above, in your prompt. Then when you change into that directory, instead of seeing the message `/tmp/mydir', you will see the abbreviation `~dir'.




:D(8)--  `Go faster' options for power users			----------------------------------------------------------------

	Here are a few more random options you might want to set in your .zshrc.


	- 	NO_BEEP

		Normally zsh will beep if it doesn't like something. This can get extremely annoying; `setopt nobeep' will turn it off. I refer to this informally as the OPEN_PLAN_OFFICE_NO_VIGILANTE_ATTACKS option.


	- 	AUTO_CD

		If this option is set, and you type something with no arguments which isn't a command, zsh will check to see if it's actually a directory. If it is, the shell will change to that directory. So `./bin' on its own is equivalent to `cd ./bin', as long as the directory `./bin' really exists. This is particularly useful in the form `..', which changes to the parent directory.


	- 	CD_ABLE_VARS

		This is another way of saving typing when changing directory, though only one character. If a directory doesn't exist when you try to change to it, zsh will try and find a parameter of that name and use that instead. You can also have a `/' and other bits after the parameter. So `cd foo/dir', if there is no directory `foo' but there is a parameter $foo, becomes equivalent to `cd $foo/dir'.


	- 	EXTENDED_GLOB

		Patterns, to match the name of files and other things, can be very sophisticated in zsh, but to get the most out of them you need to use this option, as otherwise certain features are not enabled, so that people used to simpler patterns (maybe just `*', `?' and `[...]') are not confused by strange happenings. I'll say much more about zsh's pattern features, but this is to remind you that you need this option if you're doing anything clever with `~', `#', `^' or globbing flags --- and also to remind you that those characters can have strange effects if you have the option set.


	- 	MULTIOS

		I mentioned above that to get zsh to behave like ksh you needed to set NO_MULTIOS, but I didn't say what the MULTIOS option did. It has two different effects for output and input.

		First, for output. Here it's an alternative to the tee programme. I've mentioned once, but haven't described in detail, that you could use >filename to tell the shell to send output into a file with a given name instead of to the terminal. With MULTIOS set, you can have more than one of those redirections on the command line:

		  echo foo >file1 >

		Here, `foo' will be written to both the named files; zsh copies the output. The pipe mechanism, which I'll describe better in chapter 3, is a sort of redirection into another programme instead of into a file: MULTIOS affects this as well:

		  echo foo >file1 | sed 's/foo/bar/'

		Here, `foo' is again written to file1, but is also sent into the pipe to the programme sed (`stream editor') which substitutes `foo' into `bar' and (since there is no output redirection in this part) prints it to the terminal.
		Note that the second example above has several times been reported as a bug, often in a form like:

		 some_command 2>&1 >/dev/null | sed 's/foo/bar/'


		The intention here is presumably to send standard error to standard output (the `2>&1', a very commonly used shell hieroglyphic), and not send standard output anywhere (the `>/dev/null'). (If you haven't met the concept of `standard error', it's just another output channel which goes to the same place as normal output unless you redirect it; it's used, for example to send error messages to the terminal even if your output is going somewhere else.) In this example, too, the MULTIOS feature forces the original standard output to go to the pipe. You can see this happening if we put in a version of `some_command':


		 { echo foo error >&2; echo foo not error;  } 2>&1 >/dev/null |
		  sed 's/foo/bar/'


		where you can consider the stuff inside the `{...}' as a black box that sends the message `foo error' to standard error, and `foo not error' to standard output. With MULTIOS, however, the result is

		 error bar
		  not error bar


		because both have been sent into the pipe. Without MULTIOS you get the expected result,
		 error bar
		as any other Bourne-style shell would produce. There
		On input, MULTIOS arranges for a series of files to be read in order. This time it's a bit like using the programme cat, which combines all the files listed after it. In other words,

		  cat file1 file2 | myprog

		(where myprog is some programme that reads all the files sent to it as input) can be replaced by

		  myprog <file1 <file2

		which does the same thing. Once again, a pipe counts as a redirection, and the pipe is read from first, before any files listed after a `<':

		  echo then this >testfile
		  echo this first | cat <testfile


	- 	CORRECT, CORRECT_ALL

		If you have CORRECT set, the shell will check all the commands you type and if they don't exist, but there is one with a similar name, it will ask you if you meant that one instead. You can type `n' for no, don't correct, just go ahead; `y' for yes, correct it then go ahead; `a' for abort, don't do anything; `e' for edit, return to the editor to edit the same line again. Users of the new completion system should note this is not the same correction you get there: it's just simple correction of commands.

		CORRECT_ALL applies to all the words on the line. It's a little less useful, because currently the shell has to assume that they are supposed to be filenames, and will try to correct them if they don't exist as such, but of course many of the arguments to a command are not filenames. If particular commands generate too many attempts to correct their arguments, you can turn this off by putting `nocorrect' in front of the command name. An alias is a very good way of doing this, as described next.





(9)--  aliases											----------------------------------------------------------------







(10)--  Environment variables



(11)--  Path


(12)--  Mail


(13)--  Other path-like things


(14)--  Version-specific things
















----------------------------------------------------------------------------------------------------------------------
CHAPTER 3: Dealing with basic shell syntax


--(3.1)-- External commands  -----------------------------------------------------------------------------------------

--(3.2)-- Builtin commands  ------------------------------------------------------------------------------------------

(1)-- Builtins for printing



(2)-- Other builtins just for speed



(3)-- Builtins which change the shell's state



(4)-- cd and friends



(5)-- Command control and information commands



(6)-- Parameter control



(7)-- History control commands



(8)-- Job control and process control



(9)-- Terminals, users, etc.



(10)-- Syntactic oddments



(11)-- More precommand modifiers: exec, noglob



(12)-- Testing things



(13)-- Handling options to functions and scripts



(14)-- Random file control things



(15)-- Don't watch this space, watch some other



(16)-- And also




--(3.3)-- Functions  -------------------------------------------------------------------------------------------


(1)-- Loading functions


(2)-- Function parameters


(3)-- Compiling functions




--(3.4)-- Aliases  -------------------------------------------------------------------------------------------





--(3.5)-- Command summary  -------------------------------------------------------------------------------------------





--(3.6)-- Expansions and quotes  -------------------------------------------------------------------------------------

(1)-- History expansion



(2)-- Alias expansion



(3)-- Process, parameter, command, arithmetic and brace expansion



(4)-- Filename Expansion



(5)-- Filename Generation





--(3.7)-- Redirection: greater-thans and less-thans  -----------------------------------------------------------------

(1)-- Clobber


(2)-- File descriptors


(3)-- Appending, here documents, here strings, read write


(4)-- Clever tricks: exec and other file descriptors


(5)-- Multios






--(3.8)-- Shell syntax: loops, (sub)shells and so on  ----------------------------------------------------------------

(1)-- Logical command connectors


(2)-- Structures


(3)-- Subshells and current shell constructs


(4)-- Subshells and current shells





--(3.9)-- Emulation and portability  ---------------------------------------------------------------------------------

(1)--


(2)--


3.9.1: Differences in detail
3.9.2: Making your own scripts and functions portable



--(3.10)-- Running scripts -----------------------------------------------------------------------------------------


















-----------------------------------------------------------------------------------------------------------------------
CHAPTER 4: The Z-Shell Line Editor



--(4.2)-- Moving  -------------------------------------------------------------------------------------------


(1)-- Deleting


(2)-- More deletion






--(4.3)-- Fancier editing  -------------------------------------------------------------------------------------------

(1)-- Options controlling zle



(2)-- The minibuffer and extended commands



(3)-- Prefix (digit) arguments


(4)-- Words, regions and marks



(5)-- Regions and marks



--(4.4)-- History and searching  --------------------------------------------------------------------------------------

(1)-- Moving through the history



(2)-- Searching through the history



(3)-- Extracting words from the history




--(4.5)-- Binding keys and handling keymaps  --------------------------------------------------------------------------

(1)-- Simple key bindings



(2)-- Removing key bindings



(3)-- Function keys and so on



(4)-- Binding strings instead of commands



(5)-- Keymaps




--(4.6)-- Advanced editing  ------------------------------------------------------------------------------------------

(1)-- Multi-line editing


(2)-- The builtin vared and the function zed



(3)-- The buffer stack





--(4.7)-- Extending zle  -------------------------------------------------------------------------------------------


(1)-- Widgets



(2)-- Executing other widgets



(3)-- Some special builtin widgets and their uses



(4)-- Special parameters: normal text



(5)-- Other special parameters



(6)-- Reading keys and using the minibuffer



(7)-- Examples



















------------------------------------------------------------------------------------------------------------------------
CHAPTER 5: Substitutions



--(5.1)-- Quoting -------------------------------------------------------------------------------------------

(1)-- Backslashes



(2)-- Single quotes



(3)-- POSIX quotes



(4)-- Double quotes



(5)-- Backquotes






--(5.2)-- Modifiers and what they modify  -----------------------------------------------------------------------------






--(5.3)-- Process Substitution ---------------------------------------------------------------------------------------






--(5.4)-- Parameter substitution  -------------------------------------------------------------------------------------

(1)-- Using arrays



(2)-- Using associative arrays



(3)-- Substituted substitutions, top- and tailing, etc.



(4)-- Flags for options: splitting and joining



(5)-- Flags for options: GLOB_SUBST and RC_EXPAND_PARAM



(6)-- Yet more parameter flags



(7)-- A couple of parameter substitution tricks


(8)--Nested parameter substitutions





--(5.5)-- That substitution again -------------------------------------------------------------------------------------






--(5.6)-- Arithmetic Expansion  ---------------------------------------------------------------------------------------

(1)--


(2)--

5.6.1: Entering and outputting bases
5.6.2: Parameter typing





--(5.7)-- Brace Expansion and Arrays  -------------------------------------------------------------------------------






--(5.8)-- Filename Expansion  ----------------------------------------------------------------------------------------






--(5.9)-- Filename Generation and Pattern Matching ------------------------------------------------------------------


(1)-- Comparing patterns and regular expressions


(2)-- Standard features


(3)-- Extensions usually available


(4)-- Extensions requiring EXTENDED_GLOB


(5)-- Recursive globbing


(6)-- Glob qualifiers


(7)-- Globbing flags: alter the behaviour of matches


(8)-- The function zmv




















----------------------------------------------------------------------------------------------------------------------
CHAPTER 6: Completion, old and new




--(6.1)-- Completion and expansion  ----------------------------------------------------------------------------------





--(6.2)-- Configuring completion using shell options ----------------------------------------------------------------

(1)-- Ambiguous completions



(2)-- ALWAYS_LAST_PROMPT



(3)-- Menu completion and menu selection



(4)-- Other ways of changing completion behaviour



(5)-- Changing the way completions are displayed








--(6.3)-- Getting started with new completion  -----------------------------------------------------------------------







--(6.4)-- How the shell finds the right completions  ----------------------------------------------------------------

(1)-- Contexts



(2)-- Tags








--(6.5)-- Configuring completion using styles  ----------------------------------------------------------------------

(1)-- Specifying completers and their options



(2)-- Changing the format of listings: groups etc.



(3)-- Styles affecting particular completions









--(6.6)-- Command widgets ------------------------------------------------------------------------------------------


(1)-- _complete_help



(2)-- _correct_word, _correct_filename, _expand_word



(3)-- _history_complete_word



(4)-- _most_recent_file



(5)-- _next_tags



(6)-- _bash_completions



(7)-- _read_comp



(8)-- _generic



(9)-- predict-on, incremental-complete-word










--(6.7)-- Matching control and controlling where things are inserted  -----------------------------------------------

(1)-- Case-insensitive matching



(2)-- Matching option names



(3)-- Partial word completion



(4)-- Substring completion



(5)-- Partial words with capitals



(6)-- Final notes















--(6.8)-- Tutorial ------------------------------------------------------------------------------------------


(1)-- The dispatcher



(2)-- Subcommand completion: _arguments



(3)-- Completing particular argument types



(4)-- The rest

















--(6.9)-- Writing new completion functions and widgets  -------------------------------------------------------------


(1)-- Loading completion functions: compdef



(2)-- Adding a set of completions: compadd



(3)-- Functions for generating filenames, etc.



(4)-- The zsh/parameter module



(5)-- Special completion parameters and compset


(6)-- Fancier completion: using the tags and styles mechanism




(7)-- Getting the work done for you: handling arguments etc.



(8)-- More completion utility functions






--(6.10)-- Finally ------------------------------------------------------------------------------------------





























----------------------------------------------------------------------------------------------------------------------
CHAPTER 7: Modules and other bits and pieces Not written




--(7.1)-- Control over modules: zmodload  ---------------------------------------------------------------------------


(1)--


(2)--


(3)--

7.1.1: Modules defining parameters
7.1.2: Low-level system interaction
7.1.3: ZFTP







--(7.2)-- Contributed bits ------------------------------------------------------------------------------------------


7.2.1: Prompt themes



























