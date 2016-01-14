# This is the file to use if you need to set something globally (at least for me since I run zsh)

source '/etc/globals.sh'
export ZSH=$HOME/.oh-my-zsh

# For Autojump to work properly
[[ -s $(brew --prefix)/etc/profile.d/autojump.sh ]] && . $(brew --prefix)/etc/profile.d/autojump.sh

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
## Zsh Themes

ZSH_THEME="nicoulaj"
# ZSH_THEME="nanotech"
# ZSH_THEME="frontcube"
# ZSH_THEME="jnrowe"


# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Automatic Bash Alias Usage
function ppgrep() {
    if [[ $1 == "" ]]; then
        PERCOL=percol
    else
        PERCOL="percol --query $1"
    fi
    ps aux | eval $PERCOL | awk '{ print $2 }'
}

function ppkill() {
    if [[ $1 =~ "^-" ]]; then
        QUERY=""            # options only
    else
        QUERY=$1            # with a query
        [[ $# > 0 ]] && shift
    fi
    ppgrep $QUERY | xargs kill $*
}

function exists { which $1 &> /dev/null }

if exists percol; then
    function percol_select_history() {
        local tac
        exists gtac && tac="gtac" || { exists tac && tac="tac" || { tac="tail -r" } }
        BUFFER=$(fc -l -n 1 | eval $tac | percol --query "$LBUFFER")
        CURSOR=$#BUFFER         # move cursor
        zle -R -c               # refresh
    }

    zle -N percol_select_history
    bindkey '^R' percol_select_history
fi

# Turns Alias Tips white so they're more noticeable
export ZSH_PLUGINS_ALIAS_TIPS_TEXT="$(echo ${BWhite}Alias tip:) "
# Exlude some tings from alias tips
export ZSH_PLUGINS_ALIAS_TIPS_EXCLUDES="eho mkdr"

# Makes Testing For Devices Anywhere
# Genymotion stuff
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
plugins=(git ruby sublime command-not-found taskwarrior alias-tips osx chucknorris)
plugins+=(zsh-completions docker)
autoload -U compinit && compinit

source "$HOME/.bash_profile"
source "$DOT_PATH/bash/.bashrc" # Runs the .bash_profile & .bashrc on startup making all aliases available from the git-go
source "$ZSH/oh-my-zsh.sh"

export LESS='-R'
export LESSOPEN='|~/.lessfilter %s'
# Customize to your needs...
export PATH=$PATH:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin

PATH=$PATH:/Applications/Genymotion\ Shell.app/Contents/MacOS/:/Applications/Genymotion.app/Contents/MacOS/
PATH=$PATH:$HOME/.rvm/bin # Add RVM to PATH for scripting

### Added by the Heroku Toolbelt
export PATH="/usr/local/heroku/bin:$PATH"
export PATH="/usr/local/sbin:$PATH"

# Django
export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init -)"

# Citrix
# export PATH="$CITRIX_LOCAL/apache-maven-3.1.1/bin"

source /usr/local/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
. `brew --prefix`/etc/profile.d/z.sh

# For `hstr` cmd: which is nice command history searching
export HISTFILE=~/.zsh_history  # ensure history file visibility
export HH_CONFIG=hicolor        # get more colors
bindkey -s "\C-r" "\eqhh\n"     # bind hh to Ctrl-r (for Vi mode check doc)

# jsenv usage for managing java versions
export PATH="$HOME/.jenv/bin:$PATH"
eval "$(jenv init -)"

# AWS
export PATH=$PATH:$AWS_IAM_HOME/bin

# Docker    (TODO: I feel like I shouldn't have to do this)
# eval "$(docker-machine env default)"

# Go
export PATH=$PATH:/usr/local/opt/go/libexec/bin

# Zsh Completions for AWS tool
source '/Users/AlexCory/.pyenv/versions/3.4.0/lib/python3.4/site-packages/awscli/bin/aws_zsh_completer.sh'

