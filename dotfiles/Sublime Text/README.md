***

***


#Creating Custom Key Bindings For Sublime Text

 **It's easiest to make a macro for these,** but it's really easy.  Just go to Sublime Text, Tools > Record Macro, or hit cntrl Q.  Save the file in Packages/User/ and then hit ⌘ ,  to open up your User Settings.  Paste the settings below in there and boom. **( The  | below represents my cursor )**






----------


##Function auto-bracketizer


<img align='right' src='http://imageshack.us/a/img196/2977/qhm0.gif'>

When the cursour is here:

    totallyAwesomeness(|)
Use the **option + tilda** shortcut.

##⌥ ~

This prefills the function with brackets and the text ' # code... ' highlighted. It only works when inside the parenthesis.

###Sublime User Settings

    {
    "keys": ["option+`"], "command": "run_macro_file", "args": {"file": "Packages/User/superBracketizeFunction.sublime-macro"}
    },

[Download Macro][2]

--------

##Auto-End Line With Semicolon <img align='right' src='http://imageshack.us/a/img7/4976/jpja.gif'>

When the cursour is here:

    echo 'say what!!??|'

Use the **command + semicolon** shortcut.

##⌘ ;

This adds a closing ; at the end of current line and moves you to the line below it. It actually works wherever you are on the line.

###Sublime User Settings

    {
    "keys": ["super+;"], "command": "run_macro_file", "args": {"file":  "Packages/User/superEndLineWiSemiColin.sublime-macro"}
    },

[Download Macro][3]

----------
## Exit Argument & Exit Function <img align='right' src='http://imageshack.us/a/img844/7263/8sn.gif'>

When your cursor is anywhere inside the function it will end up here:

    public function totallyAwesomeness()
    	{
    		echo 'say what!!??';
    	} |
    	echo 'yep... that just happened';

Use the **command + enter** shortcut.

<img align='right' src='http://imageshack.us/a/img854/3702/e5d.gif'>
##⌘ Enter

This will let you jump outside the argument and a space to the right as well as anywhere from within the function it will jump you out of it just being the closing bracket.

###Sublime User Settings

    {
    "keys": ["option+enter"], "command": "run_macro_file", "args": {"file": "Packages/User/superExitFunctionArg.sublime-macro"}
    },

[Download Macro][4]

-----------
Just in case you don't know what the path is to your User folder is, it is shown below.

    /Users/alexcory/Library/Application Support/Sublime Text 3/Packages/User/

Also the Library folder is usually hidden, so you can download a program called [Revealer][5] that will allow you to toggle those hidden files.

If you want to know how I made these just hit me up and I'll show you! :D



  [2]: https://drive.google.com/file/d/0B5LhVy_zkvWqZ1U2R3NORXRUdXc/edit?usp=sharing
  [3]: https://drive.google.com/file/d/0B5LhVy_zkvWqT3J2MW44V2ZBaUE/edit?usp=sharing
  [4]: https://drive.google.com/file/d/0B5LhVy_zkvWqQ1NqaGlkY2dieUU/edit?usp=sharing
  [5]: http://trcdatarecovery.com/software-apps/revealer-app
***
***