

# Applications/Programs Needed

# CLI Tools
# - oh-my-zsh
# - vim
# - percol
#   - sudo easy_install install percol
# - brew
#   - sudo easy_install install brew
#   - brew install caskroom/cask/brew-cask
# - pip
#   - sudo easy_install install pip
# - rbenv
#   - brew install rbenv
# - pyenv
#   - brew install pyenv
# - npm
#   - brew install npm
# - jq
#   - brew install jq
# - httpie
#   - brew install httpie
# - pygmentize
#   - pip install pygments
# - Grunt
#   - npm install -g grunt-cli
# - Bower
#   - npm install -g bower
# - React Tools
#   - npm install -g react-tools
# - Bpython - WARNING: may be depricated and need to switch to a new tool
#   - pip install bpython
# - wget
#   - brew install wget
# - Silver Searcher
#   - brew install ag
# - Java
#   - brew install java
# - jenv
#   - brew install jenv
# - gradle
#   - brew install gradle
# - awscli # cli tools for aws
#   - pip install awscli
# - go
#   - brew install go
# - gulp
#   - npm install -g gulp-cli
# - fast-cli
#   - npm install --global fast-cli

# Applications
# - Alfred
# - Karabiner
# - Seil
# - iTerm 2
# - bartender
# - Google Chrome
#   - brew cask install google-chrome
# - Xcode
#   - xcode-select --install
# - Dash Dock
# - Slack
# - Color Snapper
# - Divvy
#   - http://bit.ly/1NvjQMN
# - Captured
# - Spotify
# - Evernote
# - Skitch
# - Google Drive
# - Dropbox


#!/bin/sh
#
# Homebrew
#
# This installs some of the common dependencies needed (or at least desired)
# using Homebrew.

set -e

# Check for Homebrew
if test ! $(which brew)
then
  echo "  Installing Homebrew for you."
  ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
fi

cd "$(dirname "$0")"

# homebrew packages

TAPS=(
    homebrew/binary
    homebrew/dupes
    homebrew/versions
    caskroom/cask
    caskroom/versions
)

FORMULAS=(
    android-sdk
    ant
    autoconf
    automake
    boot2docker
    caskroom/cask/brew-cask
    coreutils
    ctags
    docker
    erlang
    go
    grc
    homebrew/versions/maven30
    memcached
    mercurial
    packer
    pkg-config
    pyenv
    python
    python3
    rbenv
    ruby-build
    sbt
    scala
    spark
)

CASKS=(
    alfred
    arduino
    audio-hijack-pro
    bartender
    bettertouchtool
    caffeine
    choosy
    dash
    devonthink-pro
    dropbox
    fantastical
    firefox
    fluid
    flux
    gimp
    google-chrome
    google-drive
    google-hangouts
    gpgtools
    graphsketcher
    hazel
    induction
    intellij-idea-community-eap
    istat-menus
    iterm2
    keyboard-maestro
    mailmate
    marked
    node
    nvalt
    omnigraffle
    omnioutliner
    omnipresence
    onepassword
    osxfuse
    p4merge
    pandoc
    postgres
    rdm
    robomongo
    screenflow
    scrivener
    sequel-pro
    sketch
    skype
    sourcetree
    spotify
    sublime-text3
    textexpander
    the-unarchiver
    tower
    transmit
    ubersicht
    utorrent
    vagrant
    virtualbox
    visualvm
    vlc
    wireshark
    xquartz
)

for tap in ${TAPS[@]}
do
    brew tap $tap
done

brew install ${FORMULAS[@]}

brew update

brew cask install ${CASKS[@]}

brew cask alfred link

# Special cases that need flags...
brew install macvim --with-cscope --with-lua --HEAD
brew install vim --with-lua
brew linkapps macvim

brew cleanup

exit 0
