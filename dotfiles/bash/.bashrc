source ~/GoogleDrive/_Server_/Developer/git_repositories/fasthacks/dotfiles/globals.sh
# ////////////////////////////////////////////////////////////////////
# //                     Bash Configuration                         //
# ////////////////////////////////////////////////////////////////////
#
# Bash Style Guide: (http://bit.ly/1H7w1IX)
# How To Activate Aliases (use: source ~/.bashrc)


# Details about an alias. (might not work properly on some machines, but should spit out the code for an alias with syntax highlighting)
function details() {
  which "$@" | pygmentize -l sh
}

# Use `htop` instead of `top`
alias top="htop" # you may have to use `sudo htop`

# upload images to imgur
alias imgur="imguru"

# AWESOME SPACESHIP! (dependencies: npm: terminal-kit - https://github.com/cronvel/terminal-kit)
alias spaceship="node /usr/local/lib/node_modules/terminal-kit/demo/spaceship.js"

# Enhance `mkdir` so you can make all parents too. ex: `mkdir -p tmp/a/b/c`
alias mkdir="command mkdir -p"

# Mispells
alias mkdr="command mkdir -p"
alias eho="echo"

# Silver Searcher pager awesomeness (if the output from `ag` is longer than a page, enable scrolling pager)
function ag() {
  agLineCount="$(($(command ag $@ | wc -l)*2))"
  screenHeight="$(echo $(tput lines))"

  # if output from `ag` is longer than the screen height
  if [ "$agLineCount" -gt "$screenHeight" ]; then
    # echo "AG LINE COUNT IS BIGGER THAN SCREEN"
    # use the pager
    command ag --pager 'less -R' "$@"
  else
    # echo "AG LINE COUNT IS SMALLER THAN SCREEN."
    # otherwise don't
    command ag "$@"
  fi
}

# Enhance `remove`
alias rmr="rm -r"

# Add alias on the fly
# function add-alias() {
#   echo "alias $1=\047$2\047" >> ~/.bashrc
# }

# Show open ports
alias ports="netstat -tulanp"

# Remove an alias
# unalias aliasname

# List Most commonly used commands
function most() {
  var="$(history | awk 'BEGIN {FS="[ \t]+|\\|"} {print $3}' | sort | uniq -c | sort -nr | head)";
  echo "$var"
}

# Copy Files Only
function cpf() {
  find . -maxdepth 1 -type f -name "$@" -exec cp -n {} "${@: -1}" \;
}

# Interview Prep Quick Function
function interviews() {
  cd "$LOCAL_REPOS/Interviews";
  open -a Finder "$BOOKS";
  vim;
  open -a Preview "$BOOKS/Cracking The Coding Interview 4th Edition.pdf";
}

# Find all directories in the current directory
alias lsd='find . -maxdepth 1 -type d -not -name "\.*"'

# Show File/Dir Sizes for Current Directory Recursively
alias sz='du -a -h | sort -r | less -R' # list all file sizes
alias tsz=''
alias szs='for entry in $(ls); do du -s "$entry"; done | sort -n'

# Makes specified file an executable
alias makeExec='chmod u+x' # notes: http://bit.ly/1VU56e2

# Reusabe = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =

# Shows the $PATH in a prettier format
function path(){
  # echo $PATH | tr -s ':' '\n'

  for i in `echo $PATH | sed "s/:/ /g"`; do
    # if [[ $(contains "$i" 'Android') == 1 ]]; then
    #   echo ${Green}$i${Off}
    # else
      echo $i
    # fi
  done
  # Resources:
  # - http://bit.ly/1Jx6K08
  # - 
}

#######################################
# Find the path for a file in the current working tree
# Usage Examples:
# 				pfind file.txt
# Arguments:
#   			$1: File Name
#######################################
function f() {
  # Find the path for a file in the current working tree
  find . -name "$1" -print
}

# Find Last Modified  (RESOURCE: http://bit.ly/1V9bMVn)
function fm() {
  ignore="-not -iwholename '*.git*'"
  if [ -z "${1+xxx}" ]; then # If no argument is set
    # find the single most recently edited file
    cmd="find . $ignore -type f -print0 | xargs -0 stat -f \"%m %N\" | sort -rn | head -1 | cut -f2- -d\" \""
  elif [ "$1" == '-m' ]; then
    # Recursively Find Last Modified File in Current Directory unless Specifiying a Path
    cmd="find . $ignore -type f -print0 | xargs -0 gstat --format '%Y :%y %n' | sort -nr | cut -d: -f2- | head"
  else
    cmd="find $1 `$ignore` -type f -print0 | xargs -0 stat -f \"%m %N\" | sort -rn | head -1 | cut -f2- -d\" \""
  fi
  eval $cmd
}

# Open Last Screenshot Taken
function olss() {
  screenshot="$(find "$SCREENSHOTS" -type f -print0 | xargs -0 stat -f "%m %N" | sort -rn | head -1 | cut -f2- -d " ")" &&
  open "$screenshot"
}

# Change Screenshot Path
function cssp() {
  if [ -z "${1+xxx}" ]; then # If no argument is set
    echo "You must specify a path! ^_^"
  else
    defaults write com.apple.screencapture location "$1" &&
    killall SystemUIServer
  fi
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
    source "$HOME/.bashrc"
    source "$HOME/.zshrc"
    ingit_source "$GIT_SHORTCUTS"
    source "$NPM_SHORTCUTS"
    # /bin/bash -c 'source ~/.bashrc'
  else
    source "$HOME/$@"
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
function up() {
  # if no args
  if [ -z "${1+xxx}" ]; then
    # Update
    brew update;
    brew upgrade --all;
    sudo pip install --upgrade pip;
    sudo gem update --system;
    rvm get head;
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
    echo "${PURPLE}$(pip -V)"
  # pip
  elif [[ $1 == 'pip' || $1 == 'p' ]]; then
    sudo pip install --upgrade pip
  elif [[ $1 == 'brew' || $1 == 'b' ]]; then
    brew update;
    brew upgrade;
  elif [[ $1 == 'ruby' || $1 == 'r' ]]; then
    gem update --system;
  elif [[ $1 == 'npm' || $1 == 'n' ]]; then
    npm update;
    sudo npm cache clean -f;
    sudo npm install -g n;
    sudo n stable;
  elif [[ $1 == 'python' || $1 == 'py' ]]; then
    brew upgrade python; 
    brew cleanup python;
    # issues? Check here: http://bit.ly/1KA1ASC
  fi
}

# Uninstall things
# TODO: how to get a list of all installed tools/applications
function un() {
  # if no args
  if [ -z "${1+xxx}" ]; then
    echo "${Green}I can't uninstall everything bro! What do you want me to uninstall?"
  # pip
  elif [[ $1 == 'pip' || $1 == 'p' ]]; then
    echo "I haven't got pip uninstall stuff done yet 😢"
    echo "BUT! I googled how to uninstall it for you! 😛"

  elif [[ $1 == 'brew' || $1 == 'b' ]]; then
    echo "I haven't got brew uninstall stuff done yet 😢"
    echo "BUT! I googled how to uninstall it for you! 😛"
  elif [[ $1 == 'ruby' || $1 == 'r' ]]; then
    echo "I haven't got ruby uninstall stuff done yet 😢"
    echo "BUT! I googled how to uninstall it for you! 😛"
  elif [[ $1 == 'npm' || $1 == 'n' ]]; then
    echo "I haven't got npm uninstall stuff done yet 😢"
    echo "BUT! I googled how to uninstall it for you! 😛"
  elif [[ $1 == 'python' || $1 == 'py' ]]; then
    echo "I haven't got python uninstall stuff done yet 😢"
    echo "BUT! I googled how to uninstall it for you! 😛"
  fi
}

# Update Dotfiles Repo
function ud() {
  # export keyboard layout to location in dotfiles repo
  "$KARABINER" export > "$KARABINER_IMPORT";
  git add --all;
  # sync the local dotfiles repo with remote
  cd "$DOT_PATH";
  if [ "$#" == 1 ]; then
    git commit -a -m "$1";
  else
    git commit -a -m 'quick update';
  fi
  git pull origin "$HEAD";
  git push origin "$HEAD";
  cd -;
}

# Colorful Curl
# Idea: always output data from curl in a pretty, color coated format
# function curl() {
#   command curl "$@" | pygmentize
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

# Colorful Less
# alias less='pygmentize | less'
# function less() {
  # while read data; do
  # if read data; then
  #   # pygmentize "$data" | command less -r
  #   
  #   # printf "$data"
  # fi
  # read foo
  # echo "$foo"
  # local jqError=$(contains "$(command cat $1 | jq '.' 2>&1)" 'parse error: Invalid numeric literal' OR 'No such file or directory')
  # local pygError=$(contains "$(command cat $1 | pygmentize 2>&1)" 'Error: no lexer for filename')
  #
  # if [[ $1 == *.json ]] || [[ $1 == *.sublime-settings ]]; then
  #
  #   # If neither of them work, just us normal less
  #   if [[ $jqError == 1 ]] && [[ $pygError == 1 ]]; then
  #     command less
  #
  #   # Default to JQ
  #   # elif [[ $jqError != 1 ]]; then
  #     # jq '.' | command less
  #
  #   # if they both work
  #   # elif [[ $pygError != 1 ]] && [[ $jqError != 1 ]]; then
  #     # pygmentize | command less
  #
  #   # if only Pygments works
  #   # elif [[ $pygError != 1 ]] && [[ $jqError == 1 ]]; then
  #   else
  #     pygmentize $1 | command less
  #   fi
  #
  # else
  #   # if they both don't work
  #   if [[ $pygError == 1 ]] && [[ $jqError == 1 ]]; then
  #     command less
  #   else
  #     pygmentize $1 | command less
  #   fi
  # fi
# }

# Quickly Preview a file
function pv() {
  if [ ! -x "$(which pygmentize)" ]; then
      echo "package \'pygmentize\' is not installed!"
      return -1
  fi

  if [ $# -eq 0 ]; then
      pygmentize -g $@
  fi

  for FNAME in $@
  do
      filename=$(basename "$FNAME")
      lexer=`pygmentize -N \"$filename\"`
      if [ "Z$lexer" != "Ztext" ]; then
          pygmentize -l $lexer "$FNAME" | command less -R
      else
          pygmentize -g "$FNAME" | command less -R
      fi
  done  
  # local jqError=$(contains "$(command cat $1 | jq '.' 2>&1)" 'parse error: Invalid numeric literal' OR 'No such file or directory')
  # local pygError=$(contains "$(command cat $1 | pygmentize 2>&1)" 'Error: no lexer for filename')
  #
  # # echo "$($pygError != 1)"
  # if [[ $1 == *.json ]] || [[ $1 == *.sublime-settings ]]; then
  #
  #   # if they both work
  #   if [[ $pygError != 1 ]] && [[ $jqError != 1 ]]; then
  #     pygmentize $1 | command less -r
  #     # command cat "$1" | jq '.' | command less
  #
  #   # if only Pygments works
  #   elif [[ $pygError != 1 ]] && [[ $jqError == 1 ]]; then
  #     pygmentize $1 | command less -r
  #     # command cat "$1" | pygmentize | command less
  #
  #   # If neither of them work, just use normal `less`
  #   elif [[ $jqError == 1 ]] && [[ $pygError == 1 ]]; then
  #     echo "something went wrong :("
  #     # command cat $1 | command less
  #
  #   # Default to JQ
  #   elif [[ $jqError != 1 ]]; then
  #     pygmentize $1 | command less -r
  #     # command cat "$1" | jq '.' | command less
  #   fi
  # elif [[ $1 == .* ]]; then
  #     pygmentize $1 | command less -r
  #   # command cat "$1" | pygmentize -l sh | command less
  #
  # else
  #   # if only Pygments works
  #   # if [[ $pygError == 1 ]] && [[ $jqError == 1 ]]; then
  #     pygmentize $1 | command less -r
  #     # LINE NUMBERS
  #     # pygmentize $1 -O linenos=1 | command less -r
  #     # command cat $1 | command less
  #   # else
  #   #   command cat "$1" | pygmentize | command less
  #   # fi
  # fi
}

alias grep='grep --color=auto'

# Colorful Cat
alias cat='vimcat'
# function cat() {
  # local jqError=$(contains "$(command cat $1 | jq '.' 2>&1)" 'parse error: Invalid numeric literal' OR 'No such file or directory')
  # local pygError=$(contains "$(command cat $1 | pygmentize 2>&1)" 'Error: no lexer for filename')
    # local out colored
    # out=$(/bin/cat $@)
    # colored=$(echo $out | pygmentize -f console -g 2>/dev/null)
    # [[ -n $colored ]] && echo "$colored" || echo "$out"

  #   # If neither of them work, just us normal less
  #   if [[ $jqError == 1 ]] && [[ $pygError == 1 ]]; then
  #     command cat $1
  #
  #   # Default to JQ
  #   elif [[ $jqError != 1 ]]; then
  #     command cat "$1" | jq '.' | command less
  #
  #   # if they both work
  #   elif [[ $pygError != 1 ]] && [[ $jqError != 1 ]]; then
  #     command cat "$1" | jq '.' | command less
  #
  #   # if only Pygments works
  #   elif [[ $pygError != 1 ]] && [[ $jqError == 1 ]]; then
  #     command cat "$1" | pygmentize | command less
  #   fi
  #
  # else
  #   # if only Pygments works
  #   if [[ $pygError == 1 ]] && [[ $jqError == 1 ]]; then
  #     command cat $1 | command less
  #   else
  #     command cat "$1" | pygmentize | command less
  #   fi
#   if [[ $1 == *.json ]] || [[ $1 == *.sublime* ]]; then
#     command cat "$1" | jq '.'
#   elif [[ $1 == .* ]]; then
#     command cat "$1" | pygmentize -l sh
#   else
#     command cat "$1" | pygmentize
#   fi
# }


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
    vim scp://"$ALEX_SERVER_UNAME"@"$ALEX_SERVER_PORT"/"$1"
}

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
# 				cshow
# 				cshow iTerm
# Arguments:
#   			$1: App Name You Want To Unhide From `⌘ + tab screen`
#######################################
function cshow() {
  # if the `cshow` argument is not set
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
  elif [ "$1" == "h" ]; then
    command ssh -p 2325 "$HACKINGEDU_SERVER"
  else
    # then perform basic `ssh` command
    command ssh "$@"
  fi
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

# Open App
alias oa='open -a'

# Opens iOS Emulator
# function ios() {
#   xcrun instruments -w "iPhone 6 (8.3 Simulator)"
#   open -a Safari http://localhost:"$1"
#   #xcrun simctl openurl 6A58BC08-C9A4-4911-9CA3-8F6B586114A4 http://localhost:$1
# }
# Emulator Notes
# - xcrun instruments -s devices      <- lists kown devices and device id's

# Editing Config Files  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

# This helps me edit files that my user isn't the owner of
alias edit='SUDO_EDITOR="open -FWne" sudo -e'

# Open Helpers file
alias .helpers="vim $DOT/tools/helpers.sh"

# The alias that takes me here - to editing these very aliases
alias .pr='vim ~/.profile'

# I do a lot of web development, so I need to edit these non-owned files fairly often
alias .h='vim /etc/hosts'
alias .httpd='vim /etc/apache2/httpd.conf'
alias .php='vim /etc/php.ini'
alias .vh='vim /etc/apache2/extra/httpd-vhosts.conf'

# edit taskwarrior config
alias .taskrc='vim $HOME/.taskrc'
alias .tw='vim $HOME/.taskrc'

# edit dotfiles
alias .dot="cd $DOT; vim; cd -"

# edit fast hacks
alias .fh="cd $DOT/../; vim; cd -"

# cli tools list
alias .tl="vim $DOT/README.md"

# open bpython config
alias .bpy="vim $HOME/.config/bpython/config"

# open python_shortcuts.sh
alias .ps="vim $DOT/python/python_shortcuts.sh"

# open .pythonrc
alias .py="vim $HOME/.pythonrc"

# open dotfile symlinks
alias .sl="vim $DOT/tools/dotfiles.json"

# open .agignore
alias .ai="vim $DOT_PATH/.agignore"

# open `b`ashrc in `t`erminal
alias .b='vim ~/.bashrc'

# Git Helpers
alias .g='vim $GIT_SHORTCUTS'

# bash_profile
alias .bp='vim ~/.bash_profile'

# NPM Helpers
alias .n='vim $NPM_SHORTCUTS'

# Karabiner Private.xml
alias .k='vim $KARABINER_PRIVATE'

# Karabiner Private_old.xml
alias .ko="vim $DOT_PATH/keyboard_layout/private_old.xml"

# Git Ignore
alias .gi='vim ~/.gitignore'

#  Vimrc
alias .v='vim $HOME/.vimrc'

#  Zsh
alias .z='vim $HOME/.zshrc'

# Open Globals
alias .gl="sudo vim /etc/globals.sh"

# Edit Colors
alias .cl="vim $COLORS"

# Karabiner Examples
alias ke='vim $KARABINER_EXAMPLES'

# Karabiner Key Codes
alias kk='vim $KARABINER_KEY_CODES'

# Karabiner CLI  (notes: http://bit.ly/1I1clek)
alias kb="$KARABINER"

# Karabiner Root Path
alias kr="$KARABINER_REPO"

# Screenshot Quickref
alias ss="cd $SCREENSHOTS"

# Faster Running osascript
alias osa='osascript'

# Spit out Colors
alias cl='spit_colors'

# Bash Colors Help
alias clh='colors_help'

# Check Symlinks
alias chsym="bash $DOT/tools/checkSyms.sh"
alias checksyms="bash $DOT/tools/checkSyms.sh"

# Re-symlink Everything
alias resym="bash $DOT/tools/resymlink.sh"
alias resymlink="bash $DOT/tools/resymlink.sh"

# ToDo
# alias td='$HOME' #TODO: aggregates a list of all todos in all dotfiles with filename and reference.  Kind of like the output of silver_searcher

# Go To => git repositories & specific project (lr -- stands for Local Repositories)
function lr() {
  cd $LOCAL_REPOS/"$1";
  # Description: $1: Project Dirctory (in other words, local repo name)
  # Define:  path/to/local/repositories/name_of_repo
  # Live ex: lr hackingedu
  #
  # This saves you from having to type out long commands to cd to a project `
}

# Quick Navigate to Trash
alias trash='~/.Trash'

#  PHP
alias phpt='vim /Applications/MAMP/bin/php/php5.5.10/conf/php.ini'

#  mySQL
# alias mysqlconf='open -a Sublime\ Text ~/.my.cnf'

# Stop mysqld
#   - Resource: http://bit.ly/1IN9LL4
#   - http://bit.ly/1MVUWn3

#  Apache
# alias apacheconf='open -a Sublime\ Text /etc/apache2/httpd.conf'

#  SSH
# alias sshconf='open -a Sublime\ Text ~/.ssh/config'

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
# alias subl='open -a Sublime\ Text'

# Open in Brackets
# alias br='open -a Brackets'

# Quickly Edit Vim Files
alias v='vim'

# See http://www.shellperson.net/using-sudo-with-an-alias/
alias sudo='sudo '

# Quicker Sudo
alias s='sudo '

# Quicker Exit/Quit
alias q='exit'

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

# Percol CLI Tool (http://bit.ly/1DU0dX6)
alias p='percol'

# Run Javascript Code in AppleScript
alias ojs='osascript -l JavaScript'

# Run Python Code Quickly
alias py='bpython'

# Python Manage (Django)
alias pm='python manage.py'

# Python Manage Shell (Django)
alias pms='python manage.py shell'

# Migrate Database (Django)
alias pmg="python$@ manage.py migrate"

# Make Migrations (you’re telling Django that you’ve made some changes to your models) (Django)
alias pmkm="python manage.py makemigrations"

# Checks for any problems in your project without making migrations or touching the database (Django)
alias pch="python manage.py check"

# Run Development Server (Django)
alias prs="python manage.py runserver"

# Start/Create New Python/Django App (Django)
alias psa="python manage.py startapp"

# Django Admin
alias da='django-admin'

# Django Start Project
alias dasp='django-admin startproject'

# Pyenv
alias pe='pyenv'

# Pyenv Install
alias pei='pyenv install' # would have to do `pyenv rehash` but I installed `pyenv-pip-rehash`

# Pyenv Commands
alias pec='pyenv commands'

# Pyenv Global
alias peg='pyenv global'

# Pyenv Local
alias pel='pyenv local'

# Pyenv Version
alias pev='pyenv version'

# Pyenv Versions
alias pevs='pyenv versions'

# Pip Info
alias pinfo='pip show'

# Pip Install
alias pi='pip install'

# Pip List
alias pl='pip list'

# Pip Search # POTENTIAL BUGFIX (idk if you can put semicolons in alias names)
alias p:='pip search'

# Pip Unintall
alias pu='pip uninstall'

# Easy Install
alias ei='easy_install'

# Quick Install
alias bi='brew install'

# Brew List
alias bl='brew list'

# Brew Uninstall
alias bu='brew uninstall'

# Brew Help
alias bh='brew --help'

# Brew Update
alias bupd='brew update'

# Brew Upgrade
alias bupg='brew upgrade'

# Brew Search
alias b:='brew search'

# Brew Info
alias binfo='brew info'

# Brew
alias b='brew'

# Heroku
alias h='heroku'

# List Recursively
alias lsr='ls -R'

# History
alias hist='history'

# Show Hidden Files in Finder
alias show='defaults write com.apple.finder AppleShowAllFiles -bool TRUE && killall Finder'

# Hide Hidden Files in Finder
alias hide='defaults write com.apple.finder AppleShowAllFiles -bool FALSE && killall Finder'

# Builds the locate functionality  (see article: http://bit.ly/1SuUbG1)
alias buildLocate='sudo launchctl load -w /System/Library/LaunchDaemons/com.apple.locate.plist'

# Increase cursor speed
alias fastcursor='defaults write NSGlobalDomain KeyRepeat -int 0'

# Restart Your Mac Immediately
alias restartme='sudo shutdown -r now'

# Shut Down You Mac Immediately
alias shutmedown='sudo shutdown -h now'

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
# function cdl() { cd $1; ls; }

# Go To => Developer
alias dev='~/GoogleDrive/_Server_/Developer/'

# Go To => htdocs
alias htdocs='/Applications/MAMP/htdocs/'

# Go To => Downloads
alias downloads='cd ~/Downloads/'
alias dl='cd ~/Downloads/'

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

# Open Dev Notes in MacVim
alias mvdn="cd $DEV_PATH/Dev_Notes; vim"

# Open Dev Notes in Terminal Vim
alias vdn="cd $DEV_PATH/Dev_Notes; vim"

# Go To => Dev Notes
function dn() {
	cd "$DEV_PATH/Dev_Notes/$1"
	# Description: $1: Developer Notes Dirctory/File
	# Define:  path/to/dev_notes
	# Live ex: dn example_note
	#
	# This saves you from having to type out long commands to cd to a project
}


# MySQL Quickies  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Connect to MySQL
alias cmysql='mysql -u root -p -h 127.0.0.1 -P 3306'

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
### Todo's
## Fasthacks
# - `fh` - if no arguments are passed, shows a list maybe of what all fasthacks does?
## Bashrc
# - make a todo's program
# - simpler path manager (so you don't lose track of what's what in your path and in what order they're invoked.  put these in a jason file called path.json.)
# - `vsn[version]` function: tells version of any program. (ex: version ruby, version npm)
# - `up` - will update all packages if nothing is specified otherwise will update reguardless of package manager
#    - vim - http://stackoverflow.com/questions/7211820/update-built-in-vim-on-mac-os-x 
# - `help` - universal help tool
# - `il` - install location - shows all the locations an app, program, etc. is installed on your computer. (i.e. checks to see if vim is installed aditionally by homebrew or elsewhere.)
# - `use` - switch between versions of anything (ex: use ruby 2.1, use nodejs 3.7, etc.)
## Karabiner
# - `double tab hold` - function

# source "globals" # Where all the custom paths for your machine are stored that are used in the functions below
# source "/etc/globals"

# This keeps the number of todos always available the right hand side of my
# command line. I filter it to only count those tagged as "+next", so it's more
# of a motivation to clear out the list.
# function todo_count() {
#   if $(which todo &> /dev/null)
#   then
#     num=$(echo $(todo ls $1 | wc -l))
#     let todos=num-2
#     if [ $todos != 0 ]
#     then
#       echo "$todos"
#     else
#       echo ""
#     fi
#   else
#     echo ""
#   fi
# }
#
# function todo_prompt() {
#   local COUNT=$(todo_count $1);
#   if [ $COUNT != 0 ]; then
#     echo "$1: $COUNT";
#   else
#     echo "";
#   fi
# }
