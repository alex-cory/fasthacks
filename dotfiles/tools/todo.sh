#!/bin/bash
# todo.sh
# This will help keep up with all the todo's of my configuration.

## Explanation of what it will do
## commands: 
#   td    - open the editable todo list
#   tdl   - shows a list of current todos

## explanations:
# recursively look through each file's contents in the `dotfiles` directory searching for the
# string `TODO:` (case sensitive)
# if the file contains the `TODO:` string, append the `file name & todo text` to the list.sh file

## Example contents of list.sh file:
# bashrc:              fix the `lsd` command
# vimrc:               debug why this isn't working
# bashrc:              why is the `open` command not working
# javascript.snippets: add snippet for `something`

## Example of running `tdl`
# it's like running the command `ls | less` but doing that with the contents of list.sh
# if you hit enter on a specific todo, it will bring you to the specified file unless the todo
# isn't tied to editing a file
