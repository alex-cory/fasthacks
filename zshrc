# This is the file to use if you need to set something globally (at least for me since I run zsh)

ZSH=$HOME/.oh-my-zsh

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
## iTerm (move around quickly) ##

# Quickly Jump to Beginning and End of Lines
# 	set in iTerm > Preferences > Keys > Global Shortcut Keys
#     FOR  ACTION         SEND
#     ⌘←  "HEX CODE"      0x01 
#     ⌘→  "HEX CODE"      0x05

# Quickly Jump Through Words
# 	set in iTerm > Preferences > Profiles (click profile) > Keys
#	  FOR  ACTION         SEND
#	  ⌥←  "SEND ESC SEQ"  b
#	  ⌥→  "SEND ESC SEQ"  f

# Reference: (http://goo.gl/VWXjH)


# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
## Zsh Themes

ZSH_THEME="nicoulaj"
# ZSH_THEME="nanotech"
# ZSH_THEME="frontcube"
# ZSH_THEME="jnrowe"


# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Automatic Bash Alias Usage

# Runs the .bash_profile & .bashrc on startup making all aliases available from the git-go
source ~/.bash_profile
source ~/.bashrc


# Makes Testing For Devices Anywhere
export PATH=/Applications/Android\ Studio.app/sdk/platform-tools:$PATH
# command: adb devices

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Other Zsh Settings

# To activate the bash-style comments.
setopt interactivecomments

# Change Default Name
# Normally: alexcory@Alexs-MacBook-Air
DEFAULT_USER="Alex"

# Set to this to use case-sensitive completion
# CASE_SENSITIVE="true"

# Uncomment this to disable bi-weekly auto-update checks
# DISABLE_AUTO_UPDATE="true"

# Uncomment to change how often before auto-updates occur? (in days)
# export UPDATE_ZSH_DAYS=13

# Uncomment following line if you want to disable colors in ls
# DISABLE_LS_COLORS="true"

# Uncomment following line if you want to disable autosetting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment following line if you want to disable command autocorrection
# DISABLE_CORRECTION="true"

# Uncomment following line if you want red dots to be displayed while waiting for completion
# COMPLETION_WAITING_DOTS="true"

# Uncomment following line if you want to disable marking untracked files under
# VCS as dirty. This makes repository status check for large repositories much,
# much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Which plugins would you like to load? (plugins can be found in ~/.oh-my-zsh/plugins/*)
# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
plugins=(git ruby sublime)

source $ZSH/oh-my-zsh.sh

# Customize to your needs...
export PATH=$PATH:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin

PATH=$PATH:$HOME/.rvm/bin # Add RVM to PATH for scripting
