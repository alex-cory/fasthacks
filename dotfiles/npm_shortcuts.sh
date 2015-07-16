#!/bin/bash
# npm_shortcuts.sh

# NPM Quickes   - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Npm
alias n='npm'

# Start
alias ns='npm start'

# Run
alias nr='npm run'

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
alias nisv="npm install $@ --save"

# Install and Start
alias nis='npm install && npm start'

# Fix Issues --Hard
function nf() {
  rm -rf ./node_modules;
  npm clear cache;
  npm clean cache;
  npm install;
}

# Fix Issues
function nfh() {
  npm clear cache;
  npm clean cache;
}
