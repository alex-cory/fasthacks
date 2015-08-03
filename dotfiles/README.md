Dotfiles
================

These are how I have my config files set up to make things faster and easier.

If you install this and aren't able to see the files, just type `show` into your
terminal and hit enter.  This toggles your hidden files.  If you want to go back,
easy, just type `hide` in your terminal.

### List of Amazing Terminal/Command Line Tools

#### Percol
- adds a flavor of interactive selection to the shell
- Details: https://github.com/mooz/percol
- Install: `pip install percol`

#### HTTPIE
- super awesome http request color output and more
- Details: https://github.com/jkbrzt/httpie
- Install: `brew install httpie`

#### The Silver Searcher:
- A code searching tool similar to ack, with a focus on speed.
- Details: http://git.io/d9N0MA
- Install: `brew install the_silver_searcher`

#### BPython
- Fancy Interface to the Python Interpreter
- Details: http://bpython-interpreter.org/downloads.html
- Install: `pip install bpython`

#### Bro Pages
- bro pages are a highly readable supplement to man pages
  bro pages show concise, common-case examples for Unix commands
- Details: http://bropages.org/
- Install: `sudo gem install bropages`

#### MTR:
- mtr combines the functionality of the 'traceroute' and 'ping' programs in a single network diagnostic tool.
- Details: http://bit.ly/1HYhOmq
- Install: `brew install mtr`

#### JQ:
- colored json output
- Learn:   https://jqplay.org/
- Details: http://stedolan.github.io/jq/
- Install: http://stedolan.github.io/jq/

#### Auto-fu.zsh
- Automatic word complete & list choices
- Details: https://github.com/hchbaw/auto-fu.zsh
- Install: Go to his github.

#### Boom
- Great cli tool for lists
- Details: http://zachholman.com/boom/
- Install: `sudo gem install boom`

#### Autojump:
- A cd command that learns - easily navigate directories from the command line
- Details: http://git.io/vLgfd
- Install: brew install autojump

#### NPM
#### NVM
- version manager for node.js
- Details: https://github.com/creationix/nvm
- Install: `brew install nvm`

#### Pyenv
- version manager for python
- Details: https://github.com/yyuu/pyenv
- Install: `brew install pyenv`

#### Ngrep
- For serious network packet analysis.
- Details: http://bit.ly/1Ik4llk
- Install: `brew install ngrep`
- Usage:
```
    # Captures all packets that that contain GET or POST
    ngrep -q -W byline "^(GET|POST) .*"

    # filter traffic going to or from Google on port 80
    ngrep -q -W byline "search" host www.google.com and port 80
```

#### Mitmproxy
- An interactive console program that allows traffic flows to be intercepted, inspected, modified and replayed.
- Details: http://bit.ly/1Ik6221
- Install: `brew install mitmproxy`

#### Whatmask:
- Details: http://bit.ly/1HYhOmq
- Install: `brew install whatmask`

#### xml2json
- Converts XML to JSON
- Details: https://github.com/parmentf/xml2json
- Install: `npm install -g xml2json-command`

#### Homebrew
#### PIP

#### Really Great List of Command Line Tools
http://bit.ly/1DU2JNb

![alt text][github]

[github]: https://github.com/alex-cory/fasthacks/blob/master/dotfiles/dotfiles.png "dotfiles"
