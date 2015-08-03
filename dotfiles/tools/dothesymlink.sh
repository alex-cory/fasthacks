#!/bin/bash
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# .dothesymlink.sh          Do The Sym Link!  ;)
# This script creates symlinks from the home directory to any desired centralized dotfiles directory in ~/dotfiles
#
# Steps:
# 1. Clean up any old symlinks that may exist in our Home directory and put them into a folder called dotfiles_old.
# 2. Then iterate through any files in our $DOTFILES directory and create symlinks from our home directory to these files.
# 3. Name these symlinks and prepend a dot to their filename.
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

# Variables - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

dir="$HOME"                                                                                   # where dotfiles initially stored 
olddir=/Users/alexcory/Google\ Drive/Developer/git\ repositories/dotfiles                     # backup directory
files=".bash_profile .bashrc .my.cnf .zshrc .oh-my-zsh .gitconfig"                                  # list of files/folders to symlink in homedir
# Below are files that need to be addedd.
# Alex_Corys_iTerm_Configuration.itermcolors 
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

# create dotfiles_old in homedir
echo -n "Creating $olddir for backup of any existing dotfiles in ~ ..."
mkdir -p $olddir
echo "done"

# change to the dotfiles directory
echo -n "Changing to the $dir directory ..."
cd $dir
echo "done"

# move any existing dotfiles in homedir to dotfiles_old directory, then create symlinks from the homedir to any files in the ~/dotfiles directory specified in $files
for file in $files; do
    echo "Moving any existing dotfiles from ~ to $olddir"
    mv ~/.$file ~/dotfiles_old/
    echo "Creating symlink to $file in home directory."
    ln -s $dir/$file ~/.$file
done

# move any existing dotfiles in homedir to dotfiles_old directory, then create symlinks from the homedir to any files in the ~/dotfiles directory specified in $files
# for file in $files; do
#    echo "Moving any existing dotfiles from ~ to $olddir"
#    mv ~/.$file ~/dotfiles_old/
#    echo "Creating symlink to $file in home directory."
#    ln -s $dir/$file ~/.$file
#done

install_zsh () {
# Test to see if zshell is installed.  If it is:
if [ -f /bin/zsh -o -f /usr/bin/zsh ]; then
    # Clone my oh-my-zsh repository from GitHub only if it isn't already present
    if [[ ! -d $dir/oh-my-zsh/ ]]; then
        git clone http://github.com/michaeljsmalley/oh-my-zsh.git
    fi
    # Set the default shell to zsh if it isn't currently set to zsh
    if [[ ! $(echo $SHELL) == $(which zsh) ]]; then
        chsh -s $(which zsh)
    fi
else
    # If zsh isn't installed, get the platform of the current machine
    platform=$(uname);
    # If the platform is Linux, try an apt-get to install zsh and then recurse
    if [[ $platform == 'Linux' ]]; then
        sudo apt-get install zsh
        install_zsh
    # If the platform is OS X, tell the user to install zsh :)
    elif [[ $platform == 'Darwin' ]]; then
        echo "Please install zsh, then re-run this script!"
        exit
    fi
fi
}

install_zsh
