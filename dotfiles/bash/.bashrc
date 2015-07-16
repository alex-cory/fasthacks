# TODO: BUGFIXS
# 1. `open` command doesn't work properly

# TODO:
# - MAKE A TODOs program to display all the todo's in dotfiles
# - Karabiner:
#   - hold `d`  -> vim navigation
#   - holde `d+f` -> command + vim navigation
#   - hold `d+s`  -> option  + vim navigation
# - Vim Shortcut: ⌘ +; -> end of line add semicolon

# ////////////////////////////////////////////////////////////////////
# //                     Bash Configuration                         //
# ////////////////////////////////////////////////////////////////////
#
# Bash Style Guide: (http://bit.ly/1H7w1IX)
# How To Activate Aliases (use: source ~/.bashrc)

# source "globals" # Where all the custom paths for your machine are stored that are used in the functions below
source "/etc/globals"

# Reusabe = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =

# Run Javascript Code in AppleScript
alias js='osascript -l JavaScript'

# BUGFIX
function open() {
  /usr/bin/open "$@"
}

# Search Google
function ggl() {
    search=""
    echo "Googling: $@"
    for term in $@; do
        search="$search%20$term"
    done
    open "http://www.google.com/search?q=$search"
}

# Quick Sourcing
function src() {
  if [ -z "${1+xxx}" ]; then # If no argument is set
    source /Users/`whoami`/.bashrc
    # /bin/bash -c 'source ~/.bashrc'
  else
    source /Users/`whoami`/"$@"
    # /bin/bash -c "source $@"
  fi
}

# TODO: Quick Notes Function
# function dn() {
#   ls "$DEV_PATH"/Dev\ Notes/ | less
# }

# TODO: fix the commenting
function swap() { # Swap 2 filenames around, if they exist (from Uzi's bashrc).
  local TMPFILE=tmp.$$

  [ $# -ne 2 ] && echo "swap: 2 arguments needed" && return 1
  [ ! -e "$1" ] && echo "swap: $1 does not exist" && return 1
  [ ! -e "$2" ] && echo "swap: $2 does not exist" && return 1

  mv "$1" $TMPFILE
  mv "$2" "$1"
  mv $TMPFILE "$2"
}

function exists() {
  if test -e "$1"; then
    echo "${Green}Yep! :)"
  else
    echo "${Red}Yuck! Where is it??"
  fi
}

# TODO: fix the commenting
function x() {     # Handy Extract Program
  if [ -f "$1" ] ; then
    case $1 in
      *.tar.bz2)   tar xvjf "$1"     ;;
      *.tar.gz)    tar xvzf "$1"     ;;
      *.bz2)       bunzip2 "$1"      ;;
      *.rar)       unrar x "$1"      ;;
      *.gz)        gunzip "$1"       ;;
      *.tar)       tar xvf "$1"      ;;
      *.tbz2)      tar xvjf "$1"     ;;
      *.tgz)       tar xvzf "$1"     ;;
      *.zip)       unzip "$1"        ;;
      *.Z)         uncompress "$1"   ;;
      *.7z)        7z x "$1"         ;;
      *)           echo "'$1' cannot be extracted via >extract<" ;;
    esac
  else
    echo "'$1' is not a valid file!"
  fi
}

# One command to update them all
function update() {
  # Update
  brew update; 
  brew upgrade;
  gem update --system;
  npm update;
  sudo npm cache clean -f;
  sudo npm install -g n;
  sudo n stable;
  # Current Versions
  echo "\n-------- Versions --------"
  echo "${RED}$(brew -v)";
  echo "${YELLOW}npm $(npm -v)"
  echo "${GREEN}node $(node -v)"
  echo "${BLUE}$(ruby -v)"
}

# Update Dotfiles Repo
function ud() {
  # export keyboard layout to location in dotfiles repo
  "$KARABINER" export > "$KARABINER_IMPORT";
  # sync the local dotfiles repo with remote
  cd "$DOT_PATH";
  if [ "$#" == 1 ]; then
    git commit -am "$1";
  else
    git commit -am 'quick update';
  fi
  git pull origin "$HEAD";
  git push origin "$HEAD";
  cd -;
}

# Pretty Curl    (Dependencies: http://stedolan.github.io/jq/)
# function curl() {
#   command curl "$@" | jq '.'
# }

# Colorful Man Pages
function man() {
  env \
  LESS_TERMCAP_mb="$(printf "\e[1;31m")" \
  LESS_TERMCAP_md="$(printf "\e[1;31m")" \
  LESS_TERMCAP_me="$(printf "\e[0m")" \
  LESS_TERMCAP_se="$(printf "\e[0m")" \
  LESS_TERMCAP_so="$(printf "\e[1;44;33m")" \
  LESS_TERMCAP_ue="$(printf "\e[0m")" \
  LESS_TERMCAP_us="$(printf "\e[1;32m")" \
  man "$@"
}

# Colorful Cat
# function ccat() {
#     local out colored
#     out=$(/bin/cat $@)
#     colored=$(echo $out | pygmentize -f console -g 2>/dev/null)
#     [[ -n $colored ]] && echo "$colored" || echo "$out"
# }


# Create a ZIP archive of a file or folder.
# function makezip() { zip -r "${1%%/}.zip" "$1" ; }

#######################################
# Automating Password Process on New Servers
# Reference: 	(http://goo.gl/6ccvfJ)
# Usage Examples:
# 				scp ~/path/to/local/public_ssh_key username@yourDomain.com:~/path/to/remote/public_ssh_key
# 				scp ~/.ssh/id_rsa.pub username@yourDomain.com:~/.ssh/authorized_keys
# New SSH Key:
# 				ssh-keygen -t rsa
# Globals:
#   			LOCAL_PATH_TO_SSH_KEY
#  				REMOTE_PATH_TO_SSH_KEY
# Arguments:
#   			$1: Username 	(ex: alexcory07)
#   			$2: Hostname    (ex: alexcory07.com  OR  22.231.113.64)
#######################################
function no_pw_allowed() {
	scp $LOCAL_PATH_TO_SSH_KEY $1@$2:$REMOTE_PATH_TO_SSH_KEY
	# TODO: find the built in function
}

#######################################
# Remotely edit remote files in Vim locally
# Usage Example:
# 				rvim portfolio/index.html
# Globals:
#   			ALEX_SERVER_UNAME
#  				ALEX_SERVER_PORT
# Arguments:
#   			$1: path/to/file
#######################################
function rvim() {
    vim scp://"$ALEX_SERVER_UNAME"@"$ALEX_SERVER_PORT"/"$1"
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

#######################################
# Quickly scp files in Workspace to Remote
# This Saves you from having long commands that look like this:
# 	scp -r ~/GoogleDrive/server/developer/git\ repositories/alexcory/index.php alexander@alexander.com:/home3/alexander/public_html/alexcory/index.php
# Usage Examples:
# 				scpp local/path/to/file/or/directory remote/path/to/file/or/directory
# 				scpp alexcory/index.php alexcory/index.php
# Globals:
#   			LOCAL_REPOS
#  				ALEX_SERVER_UNAME
#  				ALEX_SERVER_PORT
#  				ALEX_REMOTE_ROOT_PATH
# Arguments:
#   			$1: Local Path
#   			$2: Remote Path
#######################################
function scpp() {
	scp -r $LOCAL_REPOS/$1 $ALEX_SERVER_UNAME@$ALEX_SERVER_PORT:$ALEX_REMOTE_ROOT_PATH/$2
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
# 	# scp -r ~/GoogleDrive/server/developer/git\ repositories/alexcory/index.php alexander@alexander.com:/home3/alexander/public_html/alexcory/index.php

# 	# TODO:
# 	# jason says --
# 	# lookup `awk` , `sed` commands
# }
# # alias scp='noglob scp' # to allow `*` to work. ex: scp hackingedu/* hackingedu

#######################################
# Symlink Fils & Directories
# Usage Examples:
# 				sym path/to/target/file/or/dir nameOfSymlink
# Reference: 	(http://bit.ly/1PoCkS1)
# Arguments:
#   			$1: Target Directory of File
#   			$2: Symlink Name
#######################################
# function sym() {
# 	ln -s $1 $2
# }

#######################################
# Quickly Run a Java File
# Usage Examples:
# 				java className
# 				java className1 className2
# Arguments:
#   			$1: Class Name 1
#   			$2: Class Name 2
#######################################
function java() {
  javac ./*.java && command java "$@"
}

#######################################
# Hide an application from ⌘ + tab
# If an argument is not set, default to hiding iTerm.
# Usage Examples:
# 				chide
# 				chide iTerm
# Arguments:
#   			$1: App Name You Want To Hide From `⌘ + tab screen`
#######################################
# function chide() {
#   # if the `chide` argument is not set
#   if [ -z "${1+xxx}" ]; then
#           # then auto hide `iterm`
#           /usr/libexec/PlistBuddy -c 'Add :LSUIElement bool true' /Applications/iTerm.app/Contents/Info.plist
#   else
#           # then perform basic hide the specified application
#           /usr/libexec/PlistBuddy -c 'Add :LSUIElement bool true' /Applications/$1.app/Contents/Info.plist
#   fi
# }

#######################################
# Unhide an application from ⌘ + tab
# If an argument is not set, default to unhiding iTerm.
# Usage Examples:
# 				cunhide
# 				cunhide iTerm
# Arguments:
#   			$1: App Name You Want To Unhide From `⌘ + tab screen`
#######################################
# function cunhide() {
# 	# if the `cunhide` argument is not set
# 	if [ -z "${1+xxx}" ]; then
# 		# then auto hide `iterm`
# 		/usr/libexec/PlistBuddy -c 'Add :LSUIElement bool true' /Applications/iTerm.app/Contents/Info.plist
# 	else
# 		# then perform basic hide the specified application
# 		/usr/libexec/PlistBuddy -c 'Add :LSUIElement bool true' /Applications/$1/Contents/Info.plist
# 	fi
# }

#######################################
# Fast SSH
# By default, if no argument is passed to the ssh function,
# it will automatically ssh into the default server
# Usage Examples:
# 				ssh
# 				ssh username@yourDomain.com
# Globals:
# 				ALEX_SERVER_UNAME
# 				ALEX_SERVER_PORT
# Arguments:
#   			$1: username@yourDomain.com
#######################################
function ssh() {
  DEFAULT_SERVER=$ALEX_SERVER_UNAME@$ALEX_SERVER_PORT
  # if the `ssh` argument is not set
  if [ -z "${1+xxx}" ]; then
    # then auto `ssh` into default server
    command ssh $DEFAULT_SERVER
  elif [ "$1" == "h" ]; then
    command ssh -p 2325 "$HACKINGEDU_SERVER"
  else
    # then perform basic `ssh` command
    command ssh "$@"
  fi
}

#######################################
# Find the path for a file in the current working tree
# Usage Examples:
# 				pfind file.txt
# Arguments:
#   			$1: File Name
#######################################
function f() {
  find . -name "$1" -print
}


#######################################
# Quickly kill Jobs
# Usage Examples:
# 				k
# 				k %2
# Arguments:
#   			$1: Job Number
#######################################
function k() {
  # if the argument is not set
  if [ -z "${1+xxx}" ]; then
    # then auto `kill` the first Job
    kill %1
  else
    # then perform basic `kill` command
    kill "$1"
  fi
}

#######################################
# Displays Internal & External IP Address
# Usage Examples:
# 				myip
#######################################
function myip() {
                                     # en0 represents the network interface to use
  N_IP=`ipconfig getifaddr en0`      # (also known as Local or Private IP, System Preferences ▶ Network ▶ view your IP)
  E_IP=`curl -sS ipecho.net/plain`   # (also known as Public IP, the one that our ISP provides, whatismyip.com)
  echo 'Network/Private IP     Public IP'
  echo "$N_IP"'                  '"$E_IP"
}

# Opens iOS Emulator
# function ios() {
#   xcrun instruments -w "iPhone 6 (8.3 Simulator)"
#   open -a Safari http://localhost:"$1"
#   #xcrun simctl openurl 6A58BC08-C9A4-4911-9CA3-8F6B586114A4 http://localhost:$1
# }
# Emulator Notes
# - xcrun instruments -s devices      <- lists kown devices and device id's

# Editing Config Files  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# TODO: create function to handle all these
# alias dp="vim $P"
# alias dc="vim $C"

# open `b`ashrc in `t`erminal
alias .b='vim ~/.bashrc'

# Git Helpers
alias .g='vim $GIT_SHORTCUTS'

# bash_profile
alias .bp='vim ~/.bash_profile'

# NPM Helpers
alias .n='vim $NPM_SHORTCUTS'

# Karabiner Private.xml
alias .k='mvim $KARABINER_PRIVATE'

# Git Ignore
alias .gi='vim ~/.gitignore'

#  Vimrc
alias .v='vim $HOME/.vimrc'

#  Zsh
alias .z='vim $HOME/.zshrc'

# Open Globals
alias .gl="sudo vim /etc/globals"

# Karabiner Examples
alias ke='mvim $KARABINER_EXAMPLES'

# Karabiner Key Codes
alias kk='mvim $KARABINER_KEY_CODES'

# Karabiner CLI  (notes: http://bit.ly/1I1clek)
alias k="$KARABINER"

# ToDo
alias td='$HOME' #TODO: aggregates a list of all todos in all dotfiles with filename and reference.  Kind of like the output of silver_searcher

#  PHP
alias phpt='vim /Applications/MAMP/bin/php/php5.5.10/conf/php.ini'

#  mySQL
alias mysqlconf='open -a Sublime\ Text ~/.my.cnf'

#  Apache
alias apacheconf='open -a Sublime\ Text /etc/apache2/httpd.conf'

#  SSH
alias sshconf='open -a Sublime\ Text ~/.ssh/config'

# WeeChat
alias weechatt='vim $HOME/.weechat/weechat.conf'

# Kill MongoDB
alias km="mongo --eval \"db.getSiblingDB('admin').shutdownServer()\""

# Ctags -- navigate to the directory and run this command
alias ctags="`brew --prefix`/bin/ctags; ctags -R -f .tags"

# PHP Error Logs (Debugging Purposes)
alias php-error-log='tail -f /Applications/MAMP/logs/php_error.log'
alias pretty-phpel='colortail -f /Applications/MAMP/logs/php_error.log' #  | grep --color=always PHP\ Notice:
alias phpel='tail -f /Applications/MAMP/logs/apache_error.log'

# Apache Error Log
alias apache-error-log='tail -f /Applications/MAMP/logs/apache_error.log'

# Open in Sublime Text
alias subl='open -a Sublime\ Text'

# Open in Brackets
alias br='open -a Brackets'

# Quickly Edit Vim Files
alias v='mvim'

# Open in Finder
alias finder='open .'

# List contents
alias lst='ls -a | less'

# List All dotfiles Only
alias lh='ls -d .*'

# ls -a | grep '^\.'

# List Fancy (gives human readable sizes)
alias ll='ls -alhF'

# Gain root access
alias su='sudo -s'

# Quick Install
alias bi='brew install'

# Brew Upgrade
alias bu='brew upgrade'

# Brew Help
alias bh='brew --help'

# Heroku
alias h='heroku'

# Show Hidden Files in Finder
alias show='defaults write com.apple.finder AppleShowAllFiles -bool TRUE && killall Finder'

# Hide Hidden Files in Finder
alias hide='defaults write com.apple.finder AppleShowAllFiles -bool FALSE && killall Finder'

# Builds the locate functionality  (see article: http://bit.ly/1SuUbG1)
alias buildLocate='sudo launchctl load -w /System/Library/LaunchDaemons/com.apple.locate.plist'

# Increase cursor speed
alias fastcursor='defaults write NSGlobalDomain KeyRepeat -int 0'

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

# Quick `babel-node`  (to use JavaScript ES6)
alias bn='babel-node'

# Clipboard
alias cb="pbcopy"

# Copy contents of a file
alias cbf="pbcopy <"

# Copy SSH public key
alias cbs="pbcopy < ~/.ssh/id_rsa.pub"

# Copy current working directory
alias cppwd="pwd | pbcopy"

# Copy current git SHA-1
alias cbg="git rev-parse --verify HEAD | pbcopy"

# Quick Path Reference Aliases / Functions  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Go To => {directory}  and list contents
function cdl() { cd $1; ls; }

# Go To => Developer
alias dev='~/GoogleDrive/_Server_/Developer/'

# Go To => htdocs
alias htdocs='/Applications/MAMP/htdocs/'

# Go To => Downloads
alias downloads='~/Downloads/'

# Go To => Alfred Data
alias alfred-data='~/Library/Application Support/Alfred 2/Workflow Data/'

# Go To => Alfred Workflows
alias alfred-wf='~/Library/Application\ Support/Alfred\ 2/Alfred.alfredpreferences/workflows/'

# Go To => Code Playground
alias code-playground='~/GoogleDrive/_Server_/Developer/Code_Playground/'

# Go To => Sublime Packages
alias stp='~/Library/Application\ Support/Sublime\ Text\ 3/Packages/'

# Go To => Dot Files
alias dot='$LOCAL_REPOS/fasthacks/dotfiles'

# Go To => Sandbox & specific directory
function sb() {
	cd "$DEV_PATH/sandbox/$1"
	# Description: $1: Sandbox Dirctory (in other words, sandbox example name)
	# Define:  path/to/sandbox
	# Live ex: sbox sandbox_directory
	#
	# This saves you from having to type out long commands to cd to a project
}

# Go To => Dev Notes
function dn() {
	cd "$DEV_PATH/Dev Notes/$1"
	# Description: $1: Developer Notes Dirctory/File
	# Define:  path/to/dev_notes
	# Live ex: dn example_note
	#
	# This saves you from having to type out long commands to cd to a project
}




# Sync Aliases  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


# MySQL Quickies  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Connect to MySQL
alias cmysql='mysql -u root -p -h 127.0.0.1 -P 3306'


# ///////////////////////////////////////////////////
# //                   Notes	                   //
# ///////////////////////////////////////////////////


## New Git SSH Key Github   - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# cd ~/.ssh
# ssh-keygen -t rsa -C "youremail@yomama.com"
#
# Or you can just type `ssh-keygen` and it will do everything for you
#
# Find more instructions here: (http://goo.gl/8cIfqq)

## Sourcing
# /bin/bash -c "source fileName.sh"

# ///////////////////////////////////////////////////
# //                Great CLI Tools	           //
# ///////////////////////////////////////////////////

# Autojump:
# - A cd command that learns - easily navigate directories from the command line
# - Details: http://git.io/vLgfd
# - Install: brew install autojump

# MTR:
# - mtr combines the functionality of the 'traceroute' and 'ping' programs in a single network diagnostic tool.
# - Details: http://bit.ly/1HYhOmq
# - Install: brew install mtr

# JQ:
# - color output
# - Learn:   https://jqplay.org/
# - Details: http://stedolan.github.io/jq/
# - Install: http://stedolan.github.io/jq/

# HTTPIE
# - super awesome http request color output and more
# - Details:
# - Install:

# Whatmask:
# -
# - Details: http://bit.ly/1HYhOmq
# - Install: brew install whatmask

# The Silver Searcher:
# - A code searching tool similar to ack, with a focus on speed.
# - Details: http://git.io/d9N0MA
# - Install: brew install the_silver_searcher

# Bro Pages
# - bro pages are a highly readable supplement to man pages
#   bro pages show concise, common-case examples for Unix commands
# - Details: http://bropages.org/
# - Install: sudo gem install bropages

# ///////////////////////////////////////////////////
# //                   Other	                   //
# ///////////////////////////////////////////////////

# Random  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# [[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm" # Load RVM into a shell session *as a function*
# source ~/.profile

# Java Path Variable  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Allows Java to run from Terminal / Command Line
# export JAVA_HOME=$(/usr/libexec/java_home)

export NVM_DIR="/Users/`whoami`/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm
export LC_ALL=en_US.UTF-8 export LANG=en_US.UTF-8 # This loads the fonts for .vimrc
export PATH="$PATH:$HOME/.rvm/bin" # Add RVM to PATH for scripting
