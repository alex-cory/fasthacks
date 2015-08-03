#!/bin/sh
# Filename: error_checking.sh
# TODO: check to see if all the symlinks are good.
#       if they aren't, spit out which files/dirs
#       aren't linked, and resymlink them.


# NAMES=('.bashrc')
# HARD=("$DOT/bash")
# SOFT=("$HOME")


# for each symlink of symlinks
  # if soft link is broken
    # echo "Symlink $FILENAME is bad. Fixing now."
    # resymlink $HARD $SOFT $FILENAME
