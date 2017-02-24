#!/bin/bash
# npm_shortcuts.sh

# NPM Quickes   - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Npm
# alias n='npm'

alias nif='npm init -f'

# List all globally install packages
alias nlsg="ls /usr/local/lib/node_modules/"

# Path to all globally installed packages
alias npmGlobalModules='/usr/local/lib/node_modules/'

# Save Dev
alias nisd='npm install --save-dev' # -D

# Uninstall Save Dev
alias nusd='npm uninstall --save-dev'

# Node
alias nd="node"

# Start
alias ns='npm start'

# Help
alias nh='npm help'

# Run
alias nr='npm run'

# Package Info
alias ninfo='npm view'

# Search Packages
alias n:='npm search'

# Lint
alias nl='npm run lint'

# Lint Watch
alias nlw='npm run test-watch'

# Install
alias ni='npm install'

# Install Globally
alias nig='npm install -g'

# Install Globally and Save
alias nigs="npm install -g $@ --save"

# Install and Save
alias niss="npm install $@ --save"
alias niS="npm install $@ --save"

# Install and Start
function nis() {
  if [ -z "${1+xxx}" ]; then # If no argument is set
    npm install && npm start
  else
    npm install $@ && npm start
  fi
}

# Run Test
alias nrt='npm run test'

# Test
alias nt='npm test'

# Fix Issues --Hard
function nf() {
  rm -rf ./node_modules &&
  npm prune &&
  npm cache clear &&
  npm cache clean &&
  npm install;
}

# Fix Issues
function nfh() {
  npm cache clear;
  npm cache clean ;
}
