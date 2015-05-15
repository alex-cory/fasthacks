# ////////////////////////////////////////////////////////////////////
# //                     Bash Configuration                         //
# ////////////////////////////////////////////////////////////////////
#
# How To Activate Aliases (use: source ~/.bashrc)

# Constants
source ~/.bash_profile

# Since I'm using Zsh as my main shell I put the command `source ~/.bashrc`
# in .zshrc to automatically run `source ~/.bashrc`


# ///////////////////////////////////////////////////
# //                 Functions	                   //
# ///////////////////////////////////////////////////

# Reusabe = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =

# Automating Password Process on New Servers
function no_pw_allowed() {
	scp $LOCAL_PATH_TO_SSH_KEY $1@$2:$REMOTE_PATH_TO_SSH_KEY
	# Description: $1: Username  |  $2:  Hostname
	# Define ex:   scp ~/path/to/local/public_ssh_key username@yourDomain.com:~/path/to/remote/public_ssh_key
	# Live ex:     scp ~/.ssh/id_rsa.pub username@yourDomain.com:~/.ssh/authorized_keys
	# IF YOU NEED A NEW SSH KEY use command below
	#              ssh-keygen -t rsa
	# ref:         (http://goo.gl/6ccvfJ)
	# TODO: find the built in function
}

# Remotely edit remote files in Vim locally
function rvim() {
    vim scp://$ALEX_SERVER_UNAME@$ALEX_SERVER_PORT/$1
    # Description: $1: path/to/file
	# ex:          $1= portfolio/index.html
	# Live ex:     rvim portfolio/index.html
}

# TODO: make this work
# contains() {
#     string="$1"
#     substring="$2"
#     if test "${string#*$substring}" != "$string"
#     then
#         echo '$substring is in $string'
#         return 1    # $substring is in $string
#     else
#         echo '$substring is not in $string'
#         return 0    # $substring is not in $string
#     fi
# }

# Quickly scp files in Workspace to Remote
function scpp() {
	scp -r $LOCAL_REPOS/$1 $ALEX_SERVER_UNAME@$ALEX_SERVER_PORT:$ALEX_REMOTE_ROOT_PATH/$2
	# Description: $1: Local Path  |  $2:  Remote Path
	# Define ex:   scpp local/path/to/file/or/directory remote/path/to/file/or/directory
	# Live ex:     scpp alexcory/index.php alexcory/index.php
	#
	# This Saves you from having long commands that look like this:
	# scp -r ~/Google\ Drive/server/developer/git\ repositories/alexcory/index.php alexander@alexander.com:/home3/alexander/public_html/alexcory/index.php
}

# # Quickly scp files in Workspace to Remote       TODO: make it work with scp
# function scp() {
# 	# local_repo=${(q)1}
# 	# remote_repo=${(q)2}
# 	local_repo="$1"
# 	remote_repo="$2"

# 	command scp -r $LOCAL_REPOS/$local_repo $ALEX_SERVER_UNAME@$ALEX_SERVER_PORT:$ALEX_REMOTE_ROOT_PATH/$remote_repo
# 	# command scp -r ${(q)LOCAL_REPOS}/$local_repo $ALEX_SERVER_UNAME@$ALEX_SERVER_PORT:$ALEX_REMOTE_ROOT_PATH/$remote_repo

# 	# Description: $1: Local Path  |  $2:  Remote Path
# 	# Define ex: scpp local/path/to/file/or/directory/* remote/path/to/file/or/directory/*
# 	# Live ex: scpp alexcory/index.php alexcory/index.php
# 	# Live ex: scpp alexcory/* alexcory/*
# 	#
# 	# This Saves you from having long commands that look like this:
# 	# scp -r ~/Google\ Drive/server/developer/git\ repositories/alexcory/index.php alexander@alexander.com:/home3/alexander/public_html/alexcory/index.php

# 	# TODO:
# 	# jason says --
# 	# lookup `awk` , `sed` commands
# }
# # alias scp='noglob scp' # to allow `*` to work. ex: scp hackingedu/* hackingedu

# Quickly run a java file
function java() {
	javac ./*.java && command java $1 $2 $3 $4 $5 $6 $7 $8 $9
}

# Hide an application from ⌘ + tab
function hctab() {
	# if the `hctab` argument is not set
	if [ -z "${1+xxx}" ]; then
		# then auto hide `iterm`
		/usr/libexec/PlistBuddy -c 'Add :LSUIElement bool true' /Applications/iTerm.app/Contents/Info.plist
	else
		# then perform basic hide the specified application
		/usr/libexec/PlistBuddy -c 'Add :LSUIElement bool true' /Applications/$1/Contents/Info.plist
	fi
}

# Unhide an application from ⌘ + tab
function uhctab() {
	# if the `hctab` argument is not set
	if [ -z "${1+xxx}" ]; then
		# then auto hide `iterm`
		/usr/libexec/PlistBuddy -c 'Add :LSUIElement bool true' /Applications/iTerm.app/Contents/Info.plist
	else
		# then perform basic hide the specified application
		/usr/libexec/PlistBuddy -c 'Add :LSUIElement bool true' /Applications/$1/Contents/Info.plist
	fi
}

# Fast SSH
function ssh() {
	DEFAULT_SERVER=$ALEX_SERVER_UNAME@$ALEX_SERVER_PORT
	# if the `ssh` argument is not set
	if [ -z "${1+xxx}" ]; then
		# then auto `ssh` into default server
		command ssh $DEFAULT_SERVER
	else
		# then perform basic `ssh` command
		command ssh $1
	fi
	# By default, if no argument is passed to the ssh function, it will automatically ssh into the default server
}

# Find the path for a file in the current working tree
function pfind() {
	find . -name $1 -print
}

# Quickly kill Jobs		(saves time for me becasue then I have a defualt, as well as my ⌃ + C doesn't work for killing processes (-__-)  )
function k() {
	# if the argument is not set
	if [ -z "${1+xxx}" ]; then
		# then auto `kill` the first Job
		kill %1
	else
		# then perform basic `kill` command
		kill $1
	fi
}

# Displays Internal & External IP Address
function myip() {
                                       # en0 represents the network interface to use
	N_IP=`ipconfig getifaddr en0`      # (also known as Local or Private IP, System Preferences ▶ Network ▶ view your IP)
	E_IP=`curl -sS ipecho.net/plain`   # (also known as Public IP, the one that our ISP provides, whatismyip.com)
	echo 'Network/Private IP     Public IP'
	echo $N_IP'               '$E_IP
}


# Case-Specific Functions = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =

# Quickly edit files on CCSF server
function hills() {
    vim scp://$CCSF_UNAME@$CCSF_HOST/$1
}




# ///////////////////////////////////////////////////
# //                 Aliases	                   //
# ///////////////////////////////////////////////////

# Reusabe = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =

# Editing Config Files  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
#  Main (.bashrc)
alias bashconf='subl ~/.bashrc'
#       (.bashrc)
alias bashs='open -a Sublime\ Text ~/.bashrc'
alias basht='vim ~/.bashrc'

# bash_profile
alias bashprofs='open -a Sublime\ Text ~/.bash_profile'
alias bashproft='vim ~/.bash_profile'

#  PHP
alias phps='open -a Sublime\ Text /Applications/MAMP/bin/php/php5.5.10/conf/php.ini'
alias phpt='vim /Applications/MAMP/bin/php/php5.5.10/conf/php.ini'

#  mySQL
alias mysqlconf='open -a Sublime\ Text ~/.my.cnf'

#  Apache
alias apacheconf='open -a Sublime\ Text /etc/apache2/httpd.conf'

#  Git
alias gits='open -a Sublime\ Text ~/.gitconfig'

# Git Ignore
alias gitignore='open -a Sublime\ Text ~/.gitignore'

#  Vim
alias vims='open -a Sublime\ Text ~/.vimrc'
alias vimt='$LOCAL_REPOS/dotfiles/vimrc'
# ~/.vimrc
alias vimlocalconf='open -a Sublime\ Text ~/.vim/vimrc.local'
alias vimcustomconf='open -a Sublime\ Text ~/.vim/vimrc.custom'
alias vimrc='vim ~/.vimrc'

#  Zsh
alias zshs='open -a Sublime\ Text ~/.zshrc'
alias zsht='vim ~/.zshrc'

#  SSH
alias sshconf='open -a Sublime\ Text ~/.ssh/config'


# Plugin Aliases  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Ctags -- navigate to the directory and run this command
alias ctags="`brew --prefix`/bin/ctags; ctags -R -f .tags"


# Other Cool Aliases  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# PHP Error Logs (Debugging Purposes)
alias php-error-log='tail -f /Applications/MAMP/logs/php_error.log'
# alias pretty-phpel='colortail -f /Applications/MAMP/logs/php_error.log' #  | grep --color=always PHP\ Notice:
# alias phpel='tail -f /Applications/MAMP/logs/apache_error.log'

# Apache Error Log
alias apache-error-log='tail -f /Applications/MAMP/logs/apache_error.log'

# Open in Sublime Text
alias subl='open -a Sublime\ Text'

# Open in Brackets
alias br='open -a Brackets'

# Open in Finder
alias finder='open .'

# List contents
alias list='ls -a | less'

# List All dotfiles Only
alias lh='ls -d .*'

# ls -a | grep '^\.'

# List Fancy (gives human readable sizes)
alias ll='ls -alhF'

# Gain root access
alias su='sudo -s'

# Quick Install
alias i='brew install'

# Heroku
alias h='heroku'

# Show Hidden Files in Finder
alias show='defaults write com.apple.finder AppleShowAllFiles -bool TRUE && killall Finder'

# Hide Hidden Files in Finder
alias hide='defaults write com.apple.finder AppleShowAllFiles -bool FALSE && killall Finder'

# Display last time you restarted you mac
# uptime

# Restart Your Mac Immediately
alias restartme='sudo shutdown -r now'

# Shut Down You Mac Immediately
alias shutmedown='sudo shutdown -h now'

# Keep Your Mac Awake Indefinitely
# caffeinate

# Keep Your Mac Awake For 600 Seconds
# caffeinate -u -t 600


# Quick Path Reference Aliases / Functions  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Go To => {directory}  and list contents
function cdl { cd $1; ls; }

# Go To => Developer
alias dev='~/Google\ Drive/_Server_/Developer/'

# Go To => htdocs
alias htdocs='/Applications/MAMP/htdocs/'

# Go To => Downloads
alias downloads='~/Downloads/'

# Go To => Alfred Data
alias alfred-data='~/Library/Application Support/Alfred 2/Workflow Data/'

# Go To => Alfred Workflows
alias alfred-wf='~/Library/Application\ Support/Alfred\ 2/Alfred.alfredpreferences/workflows/'

# Go To => Code Playground
alias code-playground='~/Google\ Drive/_Server_/Developer/Code_Playground/'

# Go To => Sublime Packages
alias stp='~/Library/Application\ Support/Sublime\ Text\ 3/Packages/'

# Go To => Dot Files
alias dot='$LOCAL_REPOS/dotfiles'

# Go To => Sandbox & specific directory
function sb() {
	cd ~/Google\ Drive/_Server_/Developer/sandbox/$1
	# Description: $1: Sandbox Dirctory (in other words, sandbox example name)
	# Define:  path/to/sandbox
	# Live ex: sbox sandbox_directory
	#
	# This saves you from having to type out long commands to cd to a project
}

# Go To => Dev Notes
function dn() {
	cd ~/Google\ Drive/_Server_/Developer/Dev\ Notes/$1
	# Description: $1: Developer Notes Dirctory/File
	# Define:  path/to/dev_notes
	# Live ex: dn example_note
	#
	# This saves you from having to type out long commands to cd to a project
}


# GitHub Aliases / Functions  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Git Yolo
alias yolo='git commit -am "DEAL WITH IT" && git push -f origin master'

# Git Branch (shows the git branches)
alias gb='git branch'

# Git Checkout
alias gch='git checkout'

# Pretty Git Log All
alias gla="git log --graph --abbrev-commit --decorate --format=format:'%C(bold blue)%h%C(reset) - %C(bold cyan)%aD%C(reset) %C(bold green)(%ar)%C(reset)%C(bold yellow)%d%C(reset)%n''          %C(white)%s%C(reset) %C(dim white)- %an%C(reset)' --all"
# alias gl1="git log --graph --abbrev-commit --decorate --date=relative --format=format:'%C(bold blue)%h%C(reset) - %C(bold green)(%ar)%C(reset) %C(white)%s%C(reset) %C(dim white)- %an%C(reset)%C(bold yellow)%d%C(reset)' --all"

# Pretty Git Log All Detailed
alias glad="git log --graph --abbrev-commit --decorate --date=relative --all"

# Git Quick Update Pull & Push  (gacpp = git <add> <commit> <pull> <push>)
function gacpp() {
    git add --all && git commit -am $1 && git pull origin master && git push origin master
}

# Git Quick Update Pull & Push  (gacfrp = git <add> <commit> <fetch> <rebase> <force push>)
function gacfrp() {
    git add --all && git commit -am $1 && git fetch && git rebase origin $2 && git push -f origin $3
}

# Git Stash
alias gs='git stash'

# Git Overwrite local Changes
function gol() {
	git fetch origin && git reset --hard origin/master
}

# Go To => git repositories & specific project (lr -- stands for Local Repositories)
function lr() {
	cd $LOCAL_REPOS/$1
	# Description: $1: Project Dirctory (in other words, local repo name)
	# Define:  path/to/local/repositories/name_of_repo
	# Live ex: lr hackingedu
	#
	# This saves you from having to type out long commands to cd to a project `
}


# Sync Aliases  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


# MySQL Quickies  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Connect to MySQL
alias cmysql='mysql -u root -p -h 127.0.0.1 -P 3306'



# Case-Specific Functions = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =




# ///////////////////////////////////////////////////
# //                   Notes	                   //
# ///////////////////////////////////////////////////


# New Git SSH Key Github  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# cd ~/.ssh
# ssh-keygen -t rsa -C "youremail@yomama.com"
#
# Or you can just type `ssh-keygen` and it will do everything for you
#
# Find more instructions here: (http://goo.gl/8cIfqq)




# ///////////////////////////////////////////////////
# //                   Other	                   //
# ///////////////////////////////////////////////////

# Random  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# [[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm" # Load RVM into a shell session *as a function*
# source ~/.profile

# Java Path Variable  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Allows Java to run from Terminal / Command Line
# export JAVA_HOME=$(/usr/libexec/java_home)

export NVM_DIR="/Users/alexcory/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

export PATH="$PATH:$HOME/.rvm/bin" # Add RVM to PATH for scripting
