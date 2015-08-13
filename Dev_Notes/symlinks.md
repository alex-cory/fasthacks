Symlinks
=======


#### Hardlink: 

Also called `target`  the place where the file or directory actually exists on the machine.
- Hard links cannot link directories in multiple places ( cannot link /tmp with /home/you/tmp)
- Hard links cannot cross file system boundaries 

#### Softlink: 

Also called `symlink` which is where the reference to the hardlink is.

```bash
# move the file to the backup (aka hardlink) location
mv .bash_profile ~/path/to/dotfiles/folder

# link the backup location's file with where you want the link to be.
ln -s ~/path/to/dofiles/folder ~/.bash_profile
```


Create a Symlink
---------------------
```bash
ln -s {/path/to/storage/of/file/file-name} {link-name} # in current directory

ln -s /shared/sales/data/file.txt sales.data.txt

vim sales.data.txt

ls -l sales.data.txt
```


Delete a Symlink
----------------
```bash
rm {link-name}

rm sales.data.txt

ls -l

ls -l /shared/sales/data/file.txt
```

If you delete the soft link itself (sales.data.txt) , the data file would still be there ( /shared/sales/data/file.txt ). However, if you delete /shared/sales/data/file.txt, sales.data.txt becomes a broken link and data is lost.


Create a Hardlink
-----------------

To create hard link, enter (without the -s option):
```
ln {file.txt} {hard-link}

ln /tmp/file link-here
```


Delete a Hardlink?
-----------------
```bash
# You can delete hard link with the rm command itself:
$ rm {hard-link}
$ rm link-here
```

If you delete a hard link, your data would be there. If you delete /tmp/file your data still be accessible via link-here hard link file.
