#!/bin/bash
# npm_shortcuts.sh

# NPM Quickes   - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Npm
alias n='npm'

# Node
alias nd='node'

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

# Install and Start
alias nis='npm install && npm start'

# Run Test
alias nrt='npm run test'

# Test
alias nt='npm test'

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
