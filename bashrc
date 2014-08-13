# ////////////////////////////////////////////////////////////////////
# //         How To Activate Aliases (use: source ~/.bashrc)        //
# ////////////////////////////////////////////////////////////////////
# Automatic source ~/.bashrc
source ~/.bash_profile # (where constants are stored)
# Since I'm using Zsh as my main shell I put the command `source ~/.bashrc`
# in .zshrc to automatically run `source ~/.bashrc`



# ///////////////////////////////////////////////////
# //                 Functions				       //
# ///////////////////////////////////////////////////

# Reusabe = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =

# Automating Password Process on New Servers
function no_pw_allowed() {
	scp ~/.ssh/id_rsa.pub $1@$2:~/.ssh/authorized_keys
	# Description: $1: Username  |  $2:  Hostname
	# ex: scp ~/.ssh/id_rsa.pub alexander@alexander.com:~/.ssh/authorized_keys
	# IF YOU NEED A NEW SSH KEY
	# ssh-keygen -t rsa
	# http://goo.gl/6ccvfJ
}

# Remotely edit remote files in Vim locally
function rvim() {
    vim scp://$ALEX_SERVER_UNAME@$ALEX_SERVER_PORT/$1
    # Description: $1: path/to/file
	# ex: $1= portfolio/index.html
	# Live ex: rvim portfolio/index.html
}

# Quickly scp files in Workspace to Remote
function scpp() {
	scp -r $LOCAL_REPOS/$1 $ALEX_SERVER_UNAME@$ALEX_SERVER_PORT:$ALEX_REMOTE_ROOT_PATH/$2
	# Description: $1: Local Path  |  $2:  Remote Path
	# Define ex: scpp local/path/to/file/or/directory/* remote/path/to/file/or/directory/*
	# Live ex: scpp alexcory/index.php alexcory/index.php
	# Live ex: scpp alexcory/* alexcory/*
	#
	# This Saves you from having long commands that look like this:
	# scp -r ~/Google\ Drive/server/developer/git\ repositories/alexcory/index.php alexander@alexander.com:/home3/alexander/public_html/alexcory/index.php
}

# Quickly run a java file
function jjava() {
	javac ./*.java && java $1
}


# Case-Specific Functions = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =

# Quickly edit files on CCSF server
function hills() {
    vim scp://$CCSF_UNAME@$CCSF_HOST/$1
}




# ///////////////////////////////////////////////////
# //                 Aliases				       //
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
alias gitconf='open -a Sublime\ Text ~/.gitconfig'

# Git Ignore
alias gitignore='open -a Sublime\ Text ~/.gitignore'

#  Vim
alias vims='open -a Sublime\ Text ~/.vimrc'
alias vimt='/Users/alexcory/Google\ Drive/_Server_/Developer/git\ repositories/dotfiles/vimrc'
# ~/.vimrc'
alias vimlocalconf='open -a Sublime\ Text ~/.vim/vimrc.local'
alias vimcustomconf='open -a Sublime\ Text ~/.vim/vimrc.custom'

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


# Quick Path Reference Aliases  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Go To => {directory}  and list contents
function cdl { cd $1; ls; }

# Go To => git repositories (lr -- stands for Local Repositories)
# alias lr='~/Google\ Drive/_Server_/Developer/git\ repositories'

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
alias dot='/Users/alexcory/Google\ Drive/_Server_/Developer/git\ repositories/dotfiles'


# GitHub Aliases / Functions  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Git Yolo
alias yolo='git commit -am "DEAL WITH IT" && git push -f origin master'

# Git Quick Update Pull & Push  (gacpp = git <add> <commit> <pull> <push>)
function gacpp() {
    git add -A && git commit -am $1 && git pull origin master && git push origin master
}

# Git Overwrite local Changes
function gol() {
	git fetch origin && git reset --hard origin/master
}

# Go To => git repositories & specific project (lr -- stands for Local Repositories)
function lr() {
	cd ~/Google\ Drive/_Server_/Developer/git\ repositories/$1
	# Description: $1: Project Dirctory (in other words, local repo name)
	# Define: cd path/to/local/repositories/name_of_repo
	# Live ex: lr hackingedu
	#
	# This saves you from having to type out long commands to cd to a project `
}


# Sync Aliases  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Full Projects Sync
alias sync_projects='rsync -avz /Applications/MAMP/htdocs/ ~/Google\ Drive/_Server_/Developer/git\ repositories/projects\ backup; rm -r .DS_Store;'


# MySQL Quickies  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Connect to MySQL
alias cmysql='mysql -u root -p -h 127.0.0.1 -P 3306'



# Case-Specific Functions = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =

## Google Helpouts
alias scp-techtalksfsu='scp -r /Applications/MAMP/htdocs/techtalksfsu/* alexcory@74.220.215.206:/home2/alexcory/public_html/techtalksfsu'




# ///////////////////////////////////////////////////
# //                   Notes				       //
# ///////////////////////////////////////////////////


# New Git SSH Key Github  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# cd ~/.ssh
# ssh-keygen -t rsa -C "youremail@yomama.com"
#
# Or you can just type `ssh-keygen` and it will do everything for you
#
# Find more instructions here: (http://goo.gl/8cIfqq)




# ///////////////////////////////////////////////////
# //                   Other				       //
# ///////////////////////////////////////////////////

# Random  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# [[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm" # Load RVM into a shell session *as a function*
# source ~/.profile

# Java Path Variable  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Allows Java to run from Terminal / Command Line
export JAVA_HOME=$(/usr/libexec/java_home)