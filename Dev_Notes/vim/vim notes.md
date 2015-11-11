Vim Notes
=========

To look at later
----------------
  1.  Function Under Cursor + Press Key -> Open Language Documentation on Web (http://goo.gl/hLFIk6)



Quick Tips
----------
##### Knowing that visual selection is often not needed to act on these blocks of text will get you even further:
  
  `c/foo<cr>`
  
  `d?bar<cr>`
  
  `:,50d`
  
  `:10,30y`
  
  `:74p`

Resources
---------
  - Best Vim Tips:                http://bit.ly/1Khjj0i
  - Great Vimrc:                  http://dougblack.io/words/a-good-vimrc.html
  - Inline Commenting in a Vimrc: http://bit.ly/1FgKcgK
  - 24 Years of Vim:              http://bit.ly/1PSMkhs
  - Vim reference Card:           http://bit.ly/1EhGfEp
  - Commenting:                   http://bit.ly/1Imdeix

## Commands / Shortcuts

##### Show Leader Key
  `:let mapleader`

##### Move to Right of Screen or View
  `g$`

##### Move to Left of Screen or View
  `g0`

##### Refresh CtrlP Buffer
  `:CtrlPClearCache`

##### Select Previously Selected Text
  `gv`

##### Select Previously Pasted Text (from my .vimrc)
  `vp`

##### Reopen a previously closed window
  `:vs#`

##### Delete Around Paragraph
  `dap`

##### Nth Character in Line  (ref: http://bit.ly/1KXhAKA)
  `3fs`

##### New Verticle Window
  `<C-w>v`

##### Open file name under cursor
  `gf`

##### select from here to next foo
  `v/foo<cr>`

##### select from here to previous foo
  `v?bar<cr>`

##### select from here to mark a
  `v'a`

##### select from here to line 50
  `v50G`

##### select from here to 6 lines above
  `v6k`

##### select between two double quotes
  `vi"`

##### select this HTML tag
  `vat`

-----------------------------------------------------------------------

Plugin Specific
===============

### NERD Commenter

#### Comment out the current line or text selected in visual mode. (NERDComComment)
  ```
  3<leader>cc
  ```

#### Same as <leader>cc but forces nesting. (NERDComNestedComment)
  ```
  3<leader>cn
  ```

#### Toggles the comment state of the selected line(s). If the topmost selected line is commented, all selected lines are uncommented and vice versa. (NERDComToggleComment)
  ```
  3<leader>c
  ```

#### Comments the given lines using only one set of multipart delimiters. (NERDComMinimalComment)
  ```
  /* example here */
  3<leader>cm
  ```

#### Toggles the comment state of the selected line(s) individually. (NERDComInvertComment)
  ```
  3<leader>ci
  ```

#### Comments out the selected lines ``sexily'' (NERDComSexyComment)
  ```
  3<leader>cs
  ```

#### Same as <leader>cc except that the commented line(s) are yanked first. (NERDComYankComment)
  ```
  3<leader>cy
  ```

#### Comments the current line from the cursor to the end of line. (NERDComEOLComment)
  ```
  <leader>c$
  ```

#### Adds comment delimiters to the end of line and goes into insert mode between them. (NERDComAppendComment)
  ```
  <leader>cA
  ```

#### Adds comment delimiters at the current cursor position and inserts between. Disabled by default. (NERDComInsertComment)
  ```

  ```

#### Switches to the alternative set of delimiters. (NERDComAltDelim)
  `<leader>ca `

#### Same as (NERDComComment) except that the delimiters are aligned down the left side (<leader>cl) or both sides (<leader>cb). (NERDComAlignedComment)
  `3<leader>cb`
  `3<leader>cl`

#### Uncomments the selected line(s). (NERDComUncommentLine)
  ```
  3<leader>cu
  ```

### Surround.vim

##### Change Surrounding
  ```
  "Hello world!" -> 'Hello world!'
  cs"'
  ```

##### Change Surrounding
  ```
  'Hello world!' -> <q>Hello world!</q>
  cs'<q>
  ```

##### Change Surrounding
  ```
  <q>Hello world!</q> -> "Hello world!"
  cst"
  ```

##### Delete Surrounding
  ```
  "Hello world!" -> Hello world!
  ds"
  ```

##### Delete surrounding
  ```
  [Hello] -> Hello
  ds[
  ```

##### Surround word
  ```
  Hello -> [Hello]
  ysiw]
  ```

##### Change Surrounding
  ```
  [Hello] -> { Hello }
  cs]{
  ```

##### Wrap the entire line in parentheses
  ```
  [Hello] World -> ([Hello] World)
  yssb or yss)
  ```

##### Surround word (think: yank surround in word)
  ```
  Hello -> <em>Hello</em>
  ysiw<em>
  ```

##### Surround word (think: yank surround in word)
  ```
  Hello World -> <p>
                    Hello World
                 </p>
  VS<p>
  ```



















##### Tags: search leader key
##### Links:
-----------------------------------------------------------------------


-2----------------------------------------------------------------------
## Delete After Cursor and Before

C) C
The quick brown dog jumps over the lazy fox.
     ^
     '----- Cursor is here.
The q
     ^
     '----- Cursor is here.

C) d0  -  delete to the real beginning of the line

##### Tags: clear after cursor, clear line after cursor, clear line before cursor
##### Links: (http://goo.gl/FWzVPp)
-----------------------------------------------------------------------


-3----------------------------------------------------------------------
## Delete 3 lines up Or 3 down
=============
C) 3dk

R) Deletes 3 lines up

=============
C) 3dd

R) Deletes 3 lines down

##### Tags: delete lines down, delete multiple lines up
##### Links: http://goo.gl/UvEIcs
-----------------------------------------------------------------------



-4----------------------------------------------------------------------
## Save and Quit ( :wq )
==============
C) ZZ

R) Close Current Buffer ( same as :wq )

==============
C) :x

R) same as :wq

==============
C) Ctrl z

R) takes you back to the command line ( puts vim in the background )

-- to bring vim back

C) fg

R) takes you back to the for-ground


##### Tags:
##### Links:
-----------------------------------------------------------------------



-5----------------------------------------------------------------------
## Uppercase Letters in Command Mode

C) ~ 	(or    shift + ` )

R) Uppercases the current character


##### Tags:
##### Links:
-----------------------------------------------------------------------





-6----------------------------------------------------------------------
## Undo All Changes to a line

C) U   	(or 	shift u )

R) Undo All Changes to a line
:
:
##### Tags:
##### Links:
-----------------------------------------------------------------------



-7---------------------------------------------------------------------
## Delete words before Cursor

C) b4daw

R) Deletes 4 around word back

##### Tags:
##### Links:
-----------------------------------------------------------------------



-8---------------------------------------------------------------------
##


##### Tags:
##### Links:
-----------------------------------------------------------------------



-9---------------------------------------------------------------------
##


##### Tags:
##### Links:
-----------------------------------------------------------------------



-10--------------------------------------------------------------------
##


##### Tags:
##### Links:
-----------------------------------------------------------------------





***********************************************************************
# Bigger things
-----------------------------------------------------------------------

-1----------------------------------------------------------------------
## Ctags

### Commands

Ctrl + ]






### Setup
Ctags - Ctags is required for a few of the plugins. After you have it installed, if you have a project located at:

	~/code/project1

you can run this command:

	ctags -R -f ~/.vim/mytags/project1 ~/code/project1

to have ctags recursively generate a tags file for your project located at

	~/code/project1

and then place that tags file in

	~/.vim/mytags/project1

It's not required to do this but storing tag files in folders named after the project they represent is a nice way of keeping things organized. The final step is to run

	:set tags=~/.vim/mytags/project1

inside of Vim. Here are a few things you can do with a tags file set up:

(leader)] - (or in my case , ] ) Vim's built in function jumping command. Simply place your cursor over a function definition and this command will take you to where that function was defined (opening up a new file if necessary).
Autocomplete with SuperTab - SuperTab allows you to take advantage of Vim's built in auto-completion and a tags file allows it to know about functions and classes in your entire project.
Tagbar uses ctags to generate an overview of the current file so you can get an idea of the functions/variables that exists. This is especially helpful for large files.

##### Tags: ctags setup
##### Links: (http://goo.gl/ajuqaW)
-----------------------------------------------------------------------



-2---------------------------------------------------------------------
## Productive Vim Tips

The Control+R mechanism is very useful :-) In either insert mode or command mode (i.e. on the : line when typing commands), continue with a numbered or named register:

a - z the named registers
" the unnamed register, containing the text of the last delete or yank
% the current file name
# the alternate file name
* the clipboard contents (X11: primary selection)
+ the clipboard contents
/ the last search pattern
: the last command-line
. the last inserted text
- the last small (less than a line) delete
=5*5 insert 25 into text (mini-calculator)
See :help i_CTRL-R and :help c_CTRL-R for more details, and snoop around nearby for more CTRL-R goodness.


Smart movements

* and  # search for the word under the cursor forward/backward.
w to the next word
W to the next space-separated word
b / e to the begin/end of the current word. (B / E for space separated only)
gg / G jump to the begin/end of the file.
% jump to the matching { .. } or ( .. ), etc..
{ / } jump to next paragraph.
'. jump back to last edited line.
g; jump back to last edited position.


Quick editing commands

I insert at the begin.
A append to end.
o / O open a new line after/before the current.
v / V / Ctrl+V visual mode (to select text!)
Shift+R replace text
C change remaining part of line.
Combining commands


Most commands accept a amount and direction, for example:

cW = change till end of word
3cW = change 3 words
BcW = to begin of full word, change full word
ciW = change inner word.
ci" = change inner between ".."
ci( = change text between ( .. )
ci< = change text between < .. > (needs set matchpairs+=<:> in vimrc)
4dd = delete 4 lines
3x = delete 3 characters.
3s = substitute 3 characters.


Useful programmer commands

r replace one character (e.g. rd replaces the current char with d).
~ changes case.
J joins two lines
Ctrl+A / Ctrl+X increments/decrements a number.
. repeat last command (a simple macro)
== fix line indent
> indent block (in visual mode)
< unindent block (in visual mode)


Macro recording

Press q[ key ] to start recording.
Then hit q to stop recording.
The macro can be played with @[ key ].

By using very specific commands and movements, VIM can replay those exact actions for the next lines. (e.g. A for append-to-end, b / e to move the cursor to the begin or end of a word respectively)

>>   Indent line by shiftwidth spaces
<<   De-indent line by shiftwidth spaces
5>>  Indent 5 lines
5==  Re-indent 5 lines

>%   Increase indent of a braced or bracketed block (place cursor on brace first)
=%   Reindent a braced or bracketed block (cursor on brace)
<%   Decrease indent of a braced or bracketed block (cursor on brace)
]p   Paste text, aligning indentation with surroundings

=i{  Re-indent the 'inner block', i.e. the contents of the block
=a{  Re-indent 'a block', i.e. block and containing braces
=2a{ Re-indent '2 blocks', i.e. this block and containing block

>i{  Increase inner block indent
<i{  Decrease inner block indent

gg=G  Re-indent entire buffer


##### Tags: Tab Indent
##### Links: (http://goo.gl/ng2yt)
-----------------------------------------------------------------------




-3---------------------------------------------------------------------
## TextExpander


##### Tags: text expander
##### Links: (http://goo.gl/Mpzmrm)
-----------------------------------------------------------------------



-4---------------------------------------------------------------------
##


##### Tags:
##### Links:
-----------------------------------------------------------------------



-5---------------------------------------------------------------------
##


##### Tags:
##### Links:
-----------------------------------------------------------------------





-6---------------------------------------------------------------------
##


##### Tags:
##### Links:
-----------------------------------------------------------------------



-7---------------------------------------------------------------------
##


##### Tags:
##### Links:
-----------------------------------------------------------------------



-8---------------------------------------------------------------------
##


##### Tags:
##### Links:
-----------------------------------------------------------------------



-9---------------------------------------------------------------------
##


##### Tags:
##### Links:
-----------------------------------------------------------------------



-10--------------------------------------------------------------------
##


##### Tags: ##### Links:
-----------------------------------------------------------------------












