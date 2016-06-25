# =========================================================================
#                         ENVIRONMENT VARIABLES                           #
# =========================================================================
# About Environment Variables: http://bit.ly/1eEPDfZ

# LONG - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
export GLOBALS="/etc/globals"

export DEV_PATH="$HOME/GoogleDrive/_Server_/Developer"

export LOCAL_REPOS="$DEV_PATH/git_repositories"

export DOT_PATH="$LOCAL_REPOS/fasthacks/dotfiles"

export COLORS="$DOT_PATH/tools/colors"

export LOCAL_PATH_TO_SSH_KEY="$HOME/.ssh/id_rsa.pub"

export KARABINER_REPO="$DEV_PATH/tool_enhancers/Karabiner"

export KARABINER_EXAMPLES="$KARABINER_REPO/src/core/server/Resources/include/checkbox"

export KARABINER_PRIVATE="$HOME/Library/Application Support/Karabiner/private.xml"

export KARABINER_PRIVATE_DIR="$HOME/Library/Application Support/Karabiner"

export KARABINER="/Applications/Karabiner.app/Contents/Library/bin/karabiner" # CLI Tool

export KARABINER_KEY_CODES="$KARABINER_REPO/src/bridge/generator/keycode/data/KeyCode.data"

export KARABINER_CONFIG="$HOME/Library/Preferences/org.pqrs.Karabiner.plist" # help: http://bit.ly/1dZ0f9g

export KARABINER_IMPORT="$DOT_PATH/keyboard_layout/karabiner-import.sh" # help: http://bit.ly/1dZ0f9g

export GIT_SHORTCUTS="$DOT_PATH/git/git_shortcuts.sh"

export NPM_SHORTCUTS="$DOT_PATH/npm/npm_shortcuts.sh"

export NPM_GLOBAL_NODE_MODULES="/usr/local/lib/node_modules/"

export SCREENSHOTS=$(defaults read com.apple.screencapture location)

export BOOKS="$DEV_PATH/Books"

export CLINT_FORCE_COLOR=1

export PYTHONSTARTUP="$HOME/.pythonrc"

export DN="$DOT_PATH/notes"

export ANDROID_HOME="/usr/local/opt/android-sdk"

export JAVA_HOME="$(/usr/libexec/java_home)"

export EC2_PRIVATE_KEY="$(/bin/ls "$HOME"/.ssh/pk-*.pem | /usr/bin/head -1)"

# export EC2_CERT="$(/bin/ls "$HOME"/.ec2/cert-*.pem | /usr/bin/head -1)"

export AWS_AUTO_SCALING_HOME="/usr/local/Cellar/auto-scaling/1.0.61.3/libexec"

export AWS_CLOUDFORMATION_HOME="/usr/local/Cellar/aws-cfn-tools/1.0.12/libexec"

export AWS_ELASTICACHE_HOME="/usr/local/Cellar/aws-elasticache/1.9.000/libexec"

export AWS_ELB_HOME="/usr/local/Cellar/elb-tools/1.0.23.0/libexec"

export EC2_HOME="/usr/local/Cellar/ec2-api-tools/1.6.12.0/libexec"

export AWS_IAM_HOME="/usr/local/opt/aws-iam-tools/jars"

export AWS_SNS_HOME="/usr/local/Cellar/aws-sns-cli/2013-09-27/libexec"

export AWS_CLOUDWATCH_HOME="/usr/local/Cellar/cloud-watch/1.0.13.4/libexec"

export SERVICE_HOME="$AWS_CLOUDWATCH_HOME"

export EC2_AMITOOL_HOME="/usr/local/Cellar/ec2-ami-tools/1.4.0.9/libexec"

export AWS_RDS_HOME="/usr/local/Cellar/rds-command-line-tools/1.14.001/libexec"
# SHORT - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
# Globals
export G="/etc/globals"

# Colors
export C="$DOT_PATH/bash/colors"

# Dot
export DOT="$DOT_PATH"

# SSH Key
export SSHK="$LOCAL_PATH_TO_SSH_KEY"

# Local Repositories
export LR="$LOCAL_REPOS"

# Developer
export D="$DEV_PATH"

# Karabiner Examples
export KE="$KARABINER_EXAMPLES"

# Karabiner Private.xml
export KP="$KARABINER_PRIVATE"

# Karabiner Key Codes
export KKC="$KARABINER_KEY_CODES"

# Git Shortcuts
export GS="$GIT_SHORTCUTS"

# NPM Shortcuts
export NS="$NPM_SHORTCUTS"


# =========================================================================
#                           EIRONMENT VARIABLES                           #
# =========================================================================
export PYENV_ROOT="$HOME/.pyenv" # http://bit.ly/1ODw7Nj 

# =========================================================================
#                           GLOBAL FUNCTIONS                              #
# =========================================================================
# IF EXISTS SOURCE
function ifexists_source () {
  [[ -f "$1" ]] && source "$1"
}

# GIT GLOBALS
# if you're currently in a git repository
function ingit_source() {
  inside_git_repo="$(git rev-parse --is-inside-work-tree 2>/dev/null)"
  if [ "$inside_git_repo" ]; then
    source "$1"
  else
    GIT_ERROR="${Red}Are you in a git repo?"
  fi
}

# Karabiner
# error checking for the macvim app path in private.xml
# grab the old macvim path from private.xml
# old_macvim_location="$(grep -A 1 'VK_OPEN_URL_APP_MacVim</name' $KARABINER_PRIVATE | sed '1d' | sed -e 's/<[^>]*>//g' | tr -d '[[:space:]]' 2>/dev/null)"
# grab the new macvim path from brew
# new_macvim_location="$(brew info macvim | sed -n '4p' | awk '{print $1}')/MacVim.app"
# if the macvim file doesn't exist
# if [[ $old_macvim_location != $new_macvim_location ]]; then
#   # old_macvim_location=$(grep -A 1 'VK_OPEN_URL_APP_MacVim</name' $KARABINER_PRIVATE | sed '1d' | sed -e 's/<[^>]*>//g')
#   echo "Fixing path in karabiner private.xml. View /etc/globals to see what this is doing"
#   echo "Old macvim path: $old_macvim_location"
#   echo "New macvim path: $new_macvim_location"
#   # Changing the macvim path in  private.xml so your shortcut will work!
#   sed "s|$old_macvim_location|$new_macvim_location|g" "$KARABINER_PRIVATE"
# fi

# =========================================================================
#                              AUTO SOURCE                                #
# =========================================================================
ifexists_source "/etc/private.sh" # private paths
ingit_source "$GIT_SHORTCUTS"
source "$COLORS"
source "$NPM_SHORTCUTS"
source "$DOT/tools/helpers.sh"
source "$DOT/tools/spitcolors.sh"
# source "$DOT/tools/resymlink.sh"
source "$DOT/python/python_shortcuts.sh"
source "$DOT/docker_shortcuts.sh"
source "$LR/table.co/.tablerc"
# .profile is sourced in .bash_profile
