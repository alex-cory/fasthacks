# Bash Notes
-----------------------------------------------------------------------
#### Great environment variables article: http://do.co/1IyOeQ0

### list all currently established sockets and related information

    netstat

### find global/environment variables:

    printenv

### Search for where global/environment variable is set

    printenv | grep VIM_APP_PATH

### Find location of global/environment variables:
#### output to terminal:

     bash -x

#### output to file:

     bash -x -ls -c "exit" 2> shell-startup-output-file

### IFS (internal field seperator)

### New Git SSH Key Github
    cd ~/.ssh
    ssh-keygen -t rsa -C "youremail@yomama.com"

### Or you can just type `ssh-keygen` and it will do everything for you
Find more instructions here: (http://goo.gl/8cIfqq)

### Sourcing

    /bin/bash -c "source fileName.sh"

### Open Command Location from source

    /usr/bin/open 'fileName.sh'

### Create new file and paste contents of clipboard

    pbpaste > newFileName.sh

### SCP (Secure Copy Protocol)
Use scp (secure copy) when the remote host supports ssh (as so many of them do).
The -r means "recursive" so it will recursively copy the entire directory.
Replace username with your username, etc., etc.  destdir is a relative path on
the remote server (whatever directory you wind up in if you log in) as long as
you don't use a leading slash / -- then it will be an absolute path.

    scp -r local_directory/* username@74.212.212.222:/absolute/path/to/remote_directory

### FTP (File Transfer Protocol)

    $ ftp user@host
    $ password:xXxXx
    $ ftp>mkdir <remote dir>
    $ ftp>cd <remote dir>
    $ ftp>lcd <local dir>
    $ ftp>mput *
    $ ftp>close

Links: (http://goo.gl/xJ2AZt)

### Display last time you restarted you mac

    uptime

# Keep Your Mac Awake Indefinitely

    caffeinate

# Keep Your Mac Awake For 600 Seconds

    caffeinate -u -t 600

# Unhide an application from ⌘ + tab (ex: iTerm)

    /usr/libexec/PlistBuddy -c 'Add :LSUIElement bool true' /Applications/iTerm.app/Contents/Info.plist


# Hide an application from ⌘ + tab (ex: iTerm)

    /usr/libexec/PlistBuddy -c 'Add :LSUIElement bool true' /Applications/iTerm.app/Contents/Info.plist

# Example Recursive Bash Function

Removes all PDF's and DOC's in the current directory recursively

    recursiverm() {
      for d in *; do
        if [ -d $d ]; then
          (cd $d; recursiverm)
        fi
        rm -f *.pdf
        rm -f *.doc
      done
    }
Reference: http://bit.ly/1Kn1xtc






