# Reloads bashrc if any sourced files are changed
# ------------------------------------------------

# PROMPT_COMMAND can be corrupted if reloading is interrupted, so
# use temp variable and set in `finalize_auto_reload` function
export autoreload_prompt_command=""

auto_reload_bashrc() {
  local recent_change="$(bashrc_last_modified)"
  if [ "$BASHRC_LAST_MODIFIED" != "$recent_change" ]; then
    export BASHRC_LAST_MODIFIED="$recent_change"
    source $HOME/.bashrc
  fi
}

bashrc_last_modified() {
  if type gfind > /dev/null 2>&1; then FIND_BIN='gfind'; else FIND_BIN='find'; fi
  $FIND_BIN $SOURCED_FILES -type f -printf '%T@ %p\n' | sort -n | tail -1
}

# Run this function at the end of your bashrc.
finalize_auto_reload() {
  # Sort and clear duplicates from SOURCED_FILES
  SOURCED_FILES=$(echo $SOURCED_FILES | tr " " "\n" | sort | uniq | tr "\n" " ")
  # Turn off 'source' recording
  unset -f source
  unalias .

  # Initialize bashrc last updated timestamp
  export BASHRC_LAST_MODIFIED="$(bashrc_last_modified)"

  # Finalize PROMPT_COMMAND
  export PROMPT_COMMAND="auto_reload_bashrc;$autoreload_prompt_command"
  unset autoreload_prompt_command
}

# Records the list of files sourced from $HOME directory
source() {
  for f in $@; do [[ "$f" =~ "$HOME" ]] && SOURCED_FILES+=" $f"; done
  builtin source $@
}
alias .="source"
export SOURCED_FILES="$HOME/.bashrc $DOTFILES_PATH/bashrc/auto_reload.sh"