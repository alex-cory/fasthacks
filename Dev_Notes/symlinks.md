# Hardlink: also called `target`  the place where the file or directory actually exists on the machine
#           CANNOT SYMLINK DIRECTORY IN MULTIPLE PLACES
#           Hard links cannot links directories ( cannot link /tmp with /home/you/tmp)
#           Hard links cannot cross file system boundaries 
# Softlink: also called `symlink` which is where the reference to the hardlink is

# puts sym link in fasthacks/Dev\ Notes
# ..gle Drive/_Server_/Developer❯ ln -s ./git\ repositories/fasthacks/Dev\ Notes ./Dev\ Notes     <worked. There was no directory called Dev\ Notes when doing this command

## --== UNIX create a symbolic link command ==--
# - - - - - - - - - EXAMPLE - - - - - - - - - -

# make a file in the backup loaction where the "main" file will be stored
touch ~/Google\ Drive/Developer/git\ repositories/dotfiles/bash_profile

# navigate to the directory where you want the symlink to be
cd ~/

# move the file to the backup location replacing the premade file
mv .bash_profile ~/Google\ Drive/Developer/git\ repositories/dotfiles/bash_profile

# link the backup location's file with where you want the link to be (remmeber, you're in the home directory for this example)
ln -s ~/Google\ Drive/Developer/git\ repositories/dotfiles/bash_profile .bash_profile


# - - - - - - - - - - - - - - - - - - - - - - -


# To create a symbolic link, enter:

ln -s {/path/to/storage/of/file/file-name} {link-name} # in current directory

ln -s /shared/sales/data/file.txt sales.data.txt

vim sales.data.txt

ls -l sales.data.txt



# --== How do I delete a symbolic link? ==--
#       To delete a link, enter:

rm {link-name}

rm sales.data.txt

ls -l

ls -l /shared/sales/data/file.txt



# If you delete the soft link itself (sales.data.txt) , the data file would still be there ( /shared/sales/data/file.txt ). However, if you delete /shared/sales/data/file.txt, sales.data.txt becomes a broken link and data is lost.

#     --== UNIX create a hardlink command ==--
# To create hard link, enter (without the -s option):

ln {file.txt} {hard-link}

ln /tmp/file link-here



#  --== How do I delete a hard link? ==--
# You can delete hard link with the rm command itself:
$ rm {hard-link}
$ rm link-here
If you delete a hard link, your data would be there. If you delete /tmp/file your data still be accessible via link-here hard link file.
