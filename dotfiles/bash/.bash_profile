# TODO:
# 3. create github file and include into bashrc
# 4. change command buttons form numbers to F keys above
# 5. make F9 -> command_r
# 6. make F9 + 1 -> iterm
# 7. make F9 + 2 -> iterm
# 8. vim
#   a. file path completion
#   b. tab completion
# Super Globals
# source "/etc/globals.sh"


#######################################
# Re Sym Link Everything
# Files To Sym Link:
#         1. .bashrc -> /Users/AlexCory/GoogleDrive/_Server_/Developer/git repositories/fasthacks/dotfiles/.bashrc
#         2. .zshrc -> /Users/AlexCory/GoogleDrive/_Server_/Developer/git repositories/fasthacks/dotfiles/.zshrc
#         3. ~/Library/Application\ Support/Sublime\ Text\ 3/Packages/
#         4. Default (OSX).sublime-keymap -> /Users/AlexCory/Google Drive/_Server_/Developer/git repositories/fasthacks/dotfiles/Sublime Text/Default (OSX).sublime-keymap
#         5. Preferences.sublime-settings -> /Users/AlexCory/Google Drive/_Server_/Developer/git repositories/fasthacks/dotfiles/Sublime Text/Preferences.sublime-settings
# Usage Examples:
#         resymlink
# Globals:
#         LOCAL_REPOS
#######################################
# check all the symlinks
# if one is bad
# remove it
# resymlink it
function resymlink() {

  # Variables
  sublimeTarget="$LOCAL_REPOS/fasthacks/dotfiles/Sublime Text"
  sublimeSym="$HOME/Library/Application Support/Sublime Text 3/Packages/User"
  devNotesTarget="$LOCAL_REPOS/fasthacks"

  # .bashrc -> /Users/AlexCory/GoogleDrive/_Server_/Developer/git repositories/fasthacks/dotfiles/.bashrc
  replaceSymlink "$DOT_PATH/bash" "$HOME" ".bashrc"
  # .zshrc -> /Users/AlexCory/GoogleDrive/_Server_/Developer/git repositories/fasthacks/dotfiles/.zshrc
  replaceSymlink "$DOT_PATH/zsh" "$HOME" ".zshrc"
  # Sublime Text Keyboard Shortcuts
  replaceSymlink "$sublimeTarget" "$sublimeSym" "Default (OSX).sublime-keymap"
  # Sublime Text Settings
  replaceSymlink "$sublimeTarget" "$sublimeSym" "Preferences.sublime-settings"
  # Dev Notes
  replaceSymlink "$LOCAL_REPOS/fasthacks" "$DEV_PATH" "Dev Notes"
  # Ag Ignore
  replaceSymlink "$DOT_PATH" "$HOME" ".agignore"
  # Git Ignore
  replaceSymlink "$DOT_PATH/git" "$HOME" ".gitignore"
  # Git Config
  replaceSymlink "$DOT_PATH/git" "$HOME" ".gitconfig"
  # .vimrc
  replaceSymlink "$DOT_PATH" "$HOME" ".vimrc"
  # globals
  replaceSymlink "$DOT_PATH" "/etc" "globals"
  # bash_profile
  replaceSymlink "$DOT_PATH/bash" "$HOME" ".bash_profile"
  # Karabiner Private.xml
  replaceSymlink "$DOT_PATH/keyboard_layout" "$KARABINER_PRIVATE_DIR" "private.xml"
  # Vim React Snippets
  replaceSymlink "$DOT_PATH/snippets" "/Users/AlexCory/.vim/bundle/vim-react-snippets/snippets" "javascript.snippets"
  # Bash Notes -> dotfiles/bash/README.md
  ln -s "$DN/bash.md" "$DOT_PATH/bash/README.md"
  # Karabiner examples
  ln -s "$KARABINER_EXAMPLES" "$DOT_PATH/keyboard_layout/KarabinerExamples"
  # .pythonrc
  ln -s "$HOME/.pythonrc" "$DOT_PATH/.pythonrc"
}

# $1: dotfileTarget  (path/to/where/dotfiles/are/stored)
# $2: symlinkTarget  (path/to/where/symlink/will/be)
# $3: symlinkName    (i.e. file.txt or directory/ )
function replaceSymlink() {

  symlink="$2/$3"
  target="$1/$3"

  # TODO: if the file exists, the symlink won't run

  # if the file at the symlink locaiton doesn't exist, create it
  if ! [ -f "$symlink" ]; then
    echo "$symlink doesn't exist. ${Green}MAKING IT NOW${Off}"
    # touch "$symlink"
  fi

  # if the file at the symlink location exists but the file at the target location doesn't
  if [[ -f "${target}" && ! -L "${target}" ]]; then
  
    message="this is a file. \n cp $target $1"
  elif [[ -d "$target" && ! -L "${target}" ]]; then
    message="this is a director \n cp $target $1"
    # copy the file to the target location
    # cp "$symlink" "$1"
    echo "$message"
    # remove the old file
    # rm "$symlink"
    # echo "${Red}$target${Off} doesn't exist"
    # echo "Copying ${Blue}$symlink${Off} to ${Blue}$target${Off}"
  fi

  # If the symlink is broken
  test=`find "$symlink" -type l ! -exec test -e {} \; -print` #     <= prints out broken symlinks
  # echo "$test"
    if [ -n "$test" ]; then #                                       <= if `test` has something in it
    echo "Bad: ${Red}$3${Off}"
    echo "Re-symlinked: ${Green}$3${Off}"
    # Remove the old symlink
    rm "$symlink"
    # Create the new symlink
    ln -s "$target" "$symlink"
  else
    echo "Good:  ${Green}$3${Off}"
  fi
}

# EXAMPLES

## SCP remote -> local
# scp -r -P 2325 james@ssh.hackingedu.co:/home/james/website-ro /Users/AlexCory/GoogleDrive/_Server_/Developer/git\ repositories/
source "$HOME/.profile"
source "`brew --prefix grc`/etc/grc.bashrc"
