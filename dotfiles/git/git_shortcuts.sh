#!/bin/bash
# git_shortcuts.sh

# GitHub Aliases / Functions  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

# Set Global Git Ignore  (help: http://bit.ly/1DhMjhi)
alias set_global_gitignore="git config --global core.excludesfile '~/.gitignore'"

# Location of my global .gitignore
alias my_global_gitignore="git config --get core.excludesfile"

# Git Yolo
alias yolo='git commit -a -m "DEAL WITH IT" && git push -f origin master'

# Git Branch (shows the git branches)
alias gb='git branch'

# New Branch
alias gchb='git checkout -b'

# Git Pull Origin Master
alias glm='git pull origin master'

# Git Checkout
# alias gch='git checkout'
function gch() {
  re='^[0-9]+$'
  # EX: gch
  if [ -z "${1+xxx}" ]; then
    git checkout HEAD~0
  # EX: gch 1
  elif [[ "$1" =~ $re ]] ; then
      git checkout HEAD@{"$1"}
  else
      git checkout "$@"
  fi
}

# Git Stash
alias gs='git stash'

# Git Stash List
alias gsl='git stash list'

# Git Stash Apply
function gsa() {
  if [ "$#" -e 1 ]; then
    git stash apply stash@{"$1"}
  else
    git stash apply
  fi
}

# Git Stash Pop
alias gsp='git stash pop'

# Git Pull Push
function gpp() {
  git pull origin "$1"
  git push origin "$1"
}

# Git Pull
function gpl() {
  git pull origin "$1"
}

# Git Update Master
function gum() {
  git stash;
  git checkout master;
  git pull origin master;
  git checkout -
}

# Git Ref Log
alias grf='git reflog'

# Pretty Git Log
alias glog='git log --graph -C -M --pretty=format:"<%h> %ad [%an] %Cgreen%d%Creset %s" --all --date=short'

# Pretty Git Log For Me!
alias glme="git log --graph --abbrev-commit --decorate --format=format:'%C(bold blue)%h%C(reset) - %C(bold cyan)%aD%C(reset) %C(bold green)(%ar)%C(reset)%C(bold yellow)%d%C(reset)%n''          %C(white)%s%C(reset) %C(red)- %an%C(reset)' --all  --author=alex-cory"

# Shows Last Commits
alias tree="git log --pretty=format:\"%C(green)%h %C(magenta)(%ar) %C(blue)%an %C(reset)%s\""

# Pretty Git Log All
alias gla="git log --graph --abbrev-commit --decorate --format=format:'%C(bold blue)%h%C(reset) - %C(bold cyan)%aD%C(reset) %C(bold green)(%ar)%C(reset)%C(bold yellow)%d%C(reset)%n''          %C(white)%s%C(reset) %C(red)- %an%C(reset)' --all"
alias gl1="git log --graph --abbrev-commit --decorate --date=relative --format=format:'%C(bold blue)%h%C(reset) - %C(bold green)(%ar)%C(reset) %C(white)%s%C(reset) %C(dim white)- %an%C(reset)%C(bold yellow)%d%C(reset)' --all"

# Pretty Git Log All Detailed
alias glad="git log --graph --abbrev-commit --decorate --date=relative --all"

# Git Add Commit All (gac = git <add> <commit>)
function gac() {
  # if 1 argument (i.e. gac `you commit message`)
  if [ "$#" == 1 ]; then
    git commit -a -m "$1"
    # if 2 arguments (i.e. gac `-n` "your commit message")
  elif [ "$#" == 2 ]; then
    git commit "$1"am "$2"
  fi
}

# Git Pull Origin
function glo() {
  git pull origin "$1"
}

#Git Push Origin <branch>
function gpo() {
  git push origin "$1"
}

# Git Checkout Master
alias gcm="git checkout master"

# Git Quick Update Pull & Push  (gacpp = git <add> <commit> <pull> <push>)
function gacpp() {
  # if 1 argument (i.e. gac `you commit message`)
  if [ "$#" == 1 ]; then
    git commit -a -m "$1"
    # if 2 arguments (i.e. gac `-n` "your commit message")
  elif [ "$#" == 2 ]; then
    git commit "$1"am "$2"
  fi
  git pull origin "$HEAD";
  git push origin "$HEAD";
}

# Git Quick Update Pull & Push  (gacfrp = git <add> <commit> <fetch> <rebase> <force push>)
function gacfrp() {
  git add --all && git commit -a -m "$1" && git fetch && git rebase origin "$2" && git push -f origin "$3"
}

# Git Quick Add Commit Push
function gacp() { # EX: gacp "commit message" branchName
  # if 1 argument (i.e. gac `you commit message`)
  if [ "$#" == 1 ]; then
    git commit -a -m "$1"
    # if 2 arguments (i.e. gac `-n` "your commit message")
  elif [ "$#" == 2 ]; then
    git commit "$1"am "$2"
  fi
  git push origin "$HEAD";
}

# Remove file/dir from remote repo (http://bit.ly/1EPhAaH)
function gcrm() {
  git rm -r --cached "$1" && git commit -m "Remove the now ignored file/dir '$1'" && git push origin "$2"
}

# Git Pull
alias gpl='git pull'

# Git Status
alias gst='git status -s'

# Git Overwrite local Changes
function gol() {
  git fetch origin && git reset --hard origin/master
}

# Go To => git repositories & specific project (lr -- stands for Local Repositories)
function lr() {
  cd $LOCAL_REPOS/"$1";
  # Description: $1: Project Dirctory (in other words, local repo name)
  # Define:  path/to/local/repositories/name_of_repo
  # Live ex: lr hackingedu
  #
  # This saves you from having to type out long commands to cd to a project `
}
