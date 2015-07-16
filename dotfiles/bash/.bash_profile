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
source "/etc/globals"

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
function resymlink() {

  # Variables
  dotfileTarget="$LOCAL_REPOS/fasthacks/dotfiles"
  sublimeTarget="$LOCAL_REPOS/fasthacks/dotfiles/Sublime Text"
  sublimeSym="$HOME/Library/Application Support/Sublime Text 3/Packages/User"
  devNotesTarget="$LOCAL_REPOS/fasthacks"

  # .bashrc -> /Users/AlexCory/GoogleDrive/_Server_/Developer/git repositories/fasthacks/dotfiles/.bashrc
  replaceSymlink "$dotfileTarget/bash" "$HOME" ".bashrc"
  # .zshrc -> /Users/AlexCory/GoogleDrive/_Server_/Developer/git repositories/fasthacks/dotfiles/.zshrc
  replaceSymlink "$dotfileTarget/zsh" "$HOME" ".zshrc"
  # Sublime Text Keyboard Shortcuts
  replaceSymlink "$sublimeTarget" "$sublimeSym" "Default (OSX).sublime-keymap"
  # Sublime Text Settings
  replaceSymlink "$sublimeTarget" "$sublimeSym" "Preferences.sublime-settings"
  # Dev Notes
  replaceSymlink "$devNotesTarget" "$DEV_PATH" "Dev Notes"
  # Ag Ignore
  replaceSymlink "$dotfileTarget" "$HOME" ".agignore"
  # Git Ignore
  replaceSymlink "$dotfileTarget/git" "$HOME" ".gitignore"
  # Git Config
  replaceSymlink "$dotfileTarget/git" "$HOME" ".gitconfig"
  # .vimrc
  replaceSymlink "$dotfileTarget" "$HOME" ".vimrc"
  # globals
  replaceSymlink "$dotfileTarget" "/etc" "globals"
  # bash_profile
  replaceSymlink "$dotfileTarget/bash" "$HOME" ".bash_profile"
}

# $1: dotfileTarget  (path/to/where/dotfiles/are/stored)
# $2: symlinkTarget  (path/to/where/symlink/will/be)
# $3: symlinkName    (i.e. file.txt or directory/ )
function replaceSymlink() {

  symlink="$2/$3"
  target="$1/$3"

  if ! [ -f "$target" ] && [ -f "$symlink" ]; then
    cp "$symlink" "$1"
    rm "$symlink"
    echo "${Red}$target${Off} doesn't exist"
    echo "Copying ${Blue}$symlink${Off} to ${Blue}$1${Off}"
    # echo "Copying to ${Green}$1${Off}"
    # mv "$target" "$symlink"
  fi

  # If the symlink is broken
  test=`find "$symlink" -type l ! -exec test -e {} \; -print` #     <= prints out broken symlinks
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
