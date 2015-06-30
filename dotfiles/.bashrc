# ////////////////////////////////////////////////////////////////////
# //                     Bash Configuration                         //
# ////////////////////////////////////////////////////////////////////
#
# Bash Style Guide: (http://bit.ly/1H7w1IX)
# How To Activate Aliases (use: source ~/.bashrc)

# Constants
source ~/.bash_profile
# Quick Sourcing
alias src='source ~/.bashrc'

# Path References
KARABINER_EXAMPLES='/Users/AlexCory/GoogleDrive/_Server_/Developer/tool enhancers/Karabiner-master/src/core/server/Resources/include/checkbox'
KARABINER_PRIVATE='/Users/AlexCory/Library/Application Support/Karabiner/private.xml'

# Since I'm using Zsh as my main shell I put the command `source ~/.bashrc`
# in .zshrc to automatically run `source ~/.bashrc`


# Reusabe = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =

# TODO: Quick Notes Function
n() {
  ls /Users/AlexCory/GoogleDrive/_Server_/Developer/Dev\ Notes/ | less
}

# TODO: fix the commenting
function swap()
{ # Swap 2 filenames around, if they exist (from Uzi's bashrc).
    local TMPFILE=tmp.$$

    [ $# -ne 2 ] && echo "swap: 2 arguments needed" && return 1
    [ ! -e "$1" ] && echo "swap: $1 does not exist" && return 1
    [ ! -e "$2" ] && echo "swap: $2 does not exist" && return 1

    mv "$1" $TMPFILE
    mv "$2" "$1"
    mv $TMPFILE "$2"
}

exists() {
  if test -e "$1"; then
    echo "Alright man... it" >&2
  else
    echo "Yuck! Where is it??" >&2
    exit 1
  fi
}

# TODO: fix the commenting
x()      # Handy Extract Program
{
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
update() {
  brew update; brew upgrade;
  gem update --system;
}

# Update Dotfiles Repo
ud() {
  cd /Users/AlexCory/GoogleDrive/_Server_/Developer/git\ repositories/fasthacks
  git commit -am 'quick update'
  git pull origin master
  git push origin master
}

# Pretty Curl    (Dependencies: http://stedolan.github.io/jq/)
function curl() {
  command curl "$@" | jq '.'
}

# Colorful Man Pages
man() {
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
ccat() {
    local out colored
    out=$(/bin/cat $@)
    colored=$(echo $out | pygmentize -f console -g 2>/dev/null)
    [[ -n $colored ]] && echo "$colored" || echo "$out"
}


# Create a ZIP archive of a file or folder.
function makezip() { zip -r "${1%%/}.zip" "$1" ; }

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
    vim scp://$ALEX_SERVER_UNAME@$ALEX_SERVER_PORT/$1
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
function sym() {
	ln -s $1 $2
}

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
	javac ./*.java && command java $1 $2 $3 $4 $5 $6 $7 $8 $9
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
function chide() {
	# if the `chide` argument is not set
	if [ -z "${1+xxx}" ]; then
		# then auto hide `iterm`
		/usr/libexec/PlistBuddy -c 'Add :LSUIElement bool true' /Applications/iTerm.app/Contents/Info.plist
	else
		# then perform basic hide the specified application
		/usr/libexec/PlistBuddy -c 'Add :LSUIElement bool true' /Applications/$1.app/Contents/Info.plist
	fi
}

#######################################
# Unhide an application from ⌘ + tab
# If an argument is not set, default to unhiding iTerm.
# Usage Examples:
# 				cunhide
# 				cunhide iTerm
# Arguments:
#   			$1: App Name You Want To Unhide From `⌘ + tab screen`
#######################################
function cunhide() {
	# if the `cunhide` argument is not set
	if [ -z "${1+xxx}" ]; then
		# then auto hide `iterm`
		/usr/libexec/PlistBuddy -c 'Add :LSUIElement bool true' /Applications/iTerm.app/Contents/Info.plist
	else
		# then perform basic hide the specified application
		/usr/libexec/PlistBuddy -c 'Add :LSUIElement bool true' /Applications/$1/Contents/Info.plist
	fi
}

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
	else
		# then perform basic `ssh` command
		command ssh $1
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
	find . -name $1 -print
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
		kill $1
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
	echo $N_IP'               '$E_IP
}

# Opens iOS Emulator
function ios() {
  xcrun instruments -w "iPhone 6 (8.3 Simulator)"
  open -a Safari http://localhost:$1
  #xcrun simctl openurl 6A58BC08-C9A4-4911-9CA3-8F6B586114A4 http://localhost:$1
}
# Emulator Notes
# - xcrun instruments -s devices      <- lists kown devices and device id's

# Editing Config Files  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
#  Main (.bashrc)
alias bashconf='subl ~/.bashrc'
#       (.bashrc)
alias bashs='open -a Sublime\ Text ~/.bashrc'
alias basht='vim ~/.bashrc'
alias bt='vim ~/.bashrc'

# bash_profile
alias bashprofs='open -a Sublime\ Text ~/.bash_profile'
alias bashproft='vim ~/.bash_profile'
alias bpt='vim ~/.bash_profile'

# Karabiner
alias kt='mvim $KARABINER_PRIVATE'

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

# WeeChat
alias weechatt='vim ~/.weechat/weechat.conf'

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

# Quickly Edit Vim Files
alias v='mvim'

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
alias cbd="pwd | pbcopy"

# Copy current git SHA-1
alias cbg="git rev-parse --verify HEAD | pbcopy"

# Quick Path Reference Aliases / Functions  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Go To => {directory}  and list contents
cdl() { cd $1; ls; }

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
	cd ~/GoogleDrive/_Server_/Developer/sandbox/$1
	# Description: $1: Sandbox Dirctory (in other words, sandbox example name)
	# Define:  path/to/sandbox
	# Live ex: sbox sandbox_directory
	#
	# This saves you from having to type out long commands to cd to a project
}

# Go To => Dev Notes
function dn() {
	cd ~/GoogleDrive/_Server_/Developer/Dev\ Notes/$1
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

# Git Pull Push
gpp() {
  git pull origin $1
  git push origin $1
}

# Git Pull
gpl() {
  git pull origin $1
}

# Git Update Master
function gum() {
  if [ "$#" -ne 1 ]; then
    # if argument is most likely being used for an operator (i.e. git commit `-am`  )
    if [[ ${#1} -le 5 && ${1} == *"-"* ]]; then # contains a -
      git commit "$1"am 'quickly pulling in changes to master'
      git checkout master
      git pull origin master
    else
      git commit -am $1
      git checkout master
      git pull origin master
    fi
  elif [ "$#" -ne 2 ]; then
    git commit "$1"am $2
    git checkout master
    git pull origin master
  else
    git commit -am 'quickly pulling in changes to master'
    git checkout master
    git pull origin master
  fi
}

# Pretty Git Log
alias glog='git log --graph -C -M --pretty=format:"<%h> %ad [%an] %Cgreen%d%Creset %s" --all --date=short'

# Pretty Git Log For Me!
alias glme="git log --graph --abbrev-commit --decorate --format=format:'%C(bold blue)%h%C(reset) - %C(bold cyan)%aD%C(reset) %C(bold green)(%ar)%C(reset)%C(bold yellow)%d%C(reset)%n''          %C(white)%s%C(reset) %C(red)- %an%C(reset)' --all  --author=alex-cory"

# Shows Last Commits
alias tree="git log --pretty=format:\"%C(green)%h %C(magenta)(%ar) %C(blue)%an %C(reset)%s\""

# Pretty Git Log All
alias gla="git log --graph --abbrev-commit --decorate --format=format:'%C(bold blue)%h%C(reset) - %C(bold cyan)%aD%C(reset) %C(bold green)(%ar)%C(reset)%C(bold yellow)%d%C(reset)%n''          %C(white)%s%C(reset) %C(red)- %an%C(reset)' --all"
# alias gl1="git log --graph --abbrev-commit --decorate --date=relative --format=format:'%C(bold blue)%h%C(reset) - %C(bold green)(%ar)%C(reset) %C(white)%s%C(reset) %C(dim white)- %an%C(reset)%C(bold yellow)%d%C(reset)' --all"

# Pretty Git Log All Detailed
alias glad="git log --graph --abbrev-commit --decorate --date=relative --all"

# Git Add Commit All (gacpp = git <add> <commit> <pull> <push>)
function gac() {
    if [ "$#" -ne 1 ]; then
      git commit -am $1
    elif [ "$#" -ne 2 ]; then
      git commit -"$1"am $2
    fi
}

#Git Push Origin <branch>
function gpo() {
  git push origin $1
}

# Git Checkout Master
alias gcm="git checkout master"

# Git Quick Update Pull & Push  (gacpp = git <add> <commit> <pull> <push>)
function gacpp() {
    git add --all && git commit -am $1 && git pull origin master && git push origin master
}

# Git Quick Update Pull & Push  (gacfrp = git <add> <commit> <fetch> <rebase> <force push>)
function gacfrp() {
    git add --all && git commit -am $1 && git fetch && git rebase origin $2 && git push -f origin $3
}

# Git Quick Add Commit Push
function gacp() {
    git add --all && git commit -am $1 && git push origin $2
}
# Remove file/dir from remote repo (http://bit.ly/1EPhAaH)
function gcrm() {
  git rm -r --cached $1 && git commit -m "Remove the now ignored file/dir '$1'" && git push origin $2
}

# Git Pull
alias gpl='git pull'

# Git Stash
alias gst='git stash'

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

# NPM Quickes   - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Start
alias ns='npm start'

# Run
alias nr='npm run'

# Lint
alias nrl='npm run lint'

# Install
alias ni='npm install'

# Install and Start
alias nis='npm install && npm start'

# Fix Issues --Hard
nf() {
  rm -rf ./node_modules
  npm clear cache
  npm clean cache
  npm install
}

# Fix Issues
nfh() {
  npm clear cache
  npm clean cache
}

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

export NVM_DIR="/Users/alexcory/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm
export LC_ALL=en_US.UTF-8 export LANG=en_US.UTF-8 # This loads the fonts for .vimrc
export PATH="$PATH:$HOME/.rvm/bin" # Add RVM to PATH for scripting
