fast Hacks
==========

This project started out as a library of my notes, what I was currently learning, and what I wanted to learn. Now it has grown into a very useful tool as you can see below the things I am working on.

Current Ideas
-------------

| Idea/Command         | Description                                                                  | Status     |
| -------------------- | ---------------------------------------------------------------------------- | ----------- |
| `fh`                 | if no arguments are passed, shows a list maybe of what all fasthacks does    | Not Started |
| `td` or `todo`       | todo app                                                                     | Not Started |
| `pathm`              | tool for helping you manage your machines `$PATH`.  Things often get lost, out of order, and it can be confusing to keep track of it all.  This will have a json file with all the paths in it call `paths.json`. | Not Started |
| `up`                 | an awesome update tool that will update all packages if no argument is specified. If a program/plugin/app is updated, it will update them reguardless of package manager | In Progress (sorta) |
| `help`               | universal help tool. (ex: help ruby, etc.) (may not be necessary)            | Not Started |
| `il`                 | install location - shows all the locations an app, program, etc. is installed on your computer. (i.e. checks to see if vim is installed aditionally by homebrew or elsewhere.) Can help solve dependency issues quicker.        | Not Started |
| `use`                | switch between versions of anything (ex: use ruby 2.1, use nodejs 3.7, etc.) | Not Started |
| `theme`              | switch between themes for everything in your terminal or specific programs.  | Not Started |
| `details`            | Similar to doing `which cmd` where `cmd` is a function or alias you have in your .bashrc or elsewhere.  <br> Ex:   <br>`$ details up` <br> `Description: Updates everything if no argumetns passed or updates the specified program.` <br> `Example: up vim` <br> `Location: .bashrc on line 21` <br> `Path: ~/.bashrc`  | Not Started |
| `edit`               | quickly edit your functions and aliases for your dotfiles.                    | Not Started |

<!--|                      | `$ details up`  | |
|                      | `Command: up`  | |
|                      | `Description: Updates everything or whatever.`  | | 
|                      | `Usage: up [program] `  | |
|                      | `Example: up vim `  | |
|                      | `Location: .bashrc `  | |
|                      | `Line: 21 `  | |
|                      | `Path to Location: ~/.bashrc`  | |-->

Current Commands Done & in the Works
----------------------------------------

| Command              | Eventual gif/Description                                    | Status      |
| -------------------- | ----------------------------------------------------------- | ----------- |
| `cat`                | Colored `cat` output! The goal is for syntax highlighting!  | Not Production Quality |
| `less`               | Colored `less` output! The goal is for syntax highlighting! | Not Production Quality |
| `man`                | Colored `man` pages! The goal is for syntax highlighting!   | Not Production Quality |
| `ssh`                | Setup default servers you go to the most so all you have to do is type `ssh` and boom presto shazam. | Done, needs reviews
| `pv` or `preview`    | Colored preview of file.  It also allows you to lookup what an alias or command does. | Not Production Quality |
| `olss`               | Open last screen shot                                       | Needs Optimization & Testing |
| `path`               | Will probably eventually be replaced by `pathm`, but shows the $PATH in a prettier format.| Should Be Good |
| `src`                | Quick sourcing.  No more `source ~/.bashrc` etc, etc.  Just type `src` and it'll take care of the rest for you! You may also pass a path to it `src ~/.bashrc`. | Needs Review |
| `up` or `update`     | Allows anything to be updated with just one command.        | Started |
| `un` or `uninstall`  | Uninstalls the specified applications.                      | Started |
| `resymlink`          | You put all the absolute paths to your dotfiles with names, etc. into this `symlinks.json` file.  If something ever goes wrong, just type resymlink!                            | Started |
| `checksyms`          | Checks to see which symlinks are broken                     | Started |
| `clrs` or `colors`   | Spits out colors and codes.                                 | Done |
| `chide`              | Hides the specified app from the `command + tab` window.    | Done, Need Reviews (didn't work on Google Chrome |
| `cshow`              | Unhides hidden application from the `command + tab` window. | Done, Need Reviews |
| `show`               | Shows all your hidden dot files.                            | Done |
| `hide`               | Re-hides all your hidden dot files.                         | Done |

ToDo's
------
- [ ] Install Script
- [ ] Website + documentation
