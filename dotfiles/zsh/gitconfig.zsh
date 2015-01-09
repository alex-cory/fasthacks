My Git Config Hacks

[merge]
    summary = true    
    tool = "p4merge" 
[mergetool "p4merge"]    
    cmd = /PATH/TO/p4merge \            
        "$PWD/$BASE" \                
            "$PWD/$LOCAL" \                
            "$PWD/$REMOTE" \                
            "$PWD/$MERGED"     
    keepBackup = false        
        trustExitCode = false

# Now, whenever git complains that a conflict must be resolved, just type:
#   git mergetool

[alias]
        l = log --graph --pretty=format:'%Cred%h%Creset - %C(yellow)%d%Creset %s %Cgreen  (%cr %C(cyan) %an)%Creset' --abbrev-commit --date=relative
        la = log --graph --pretty=format:'%Cred%h%Creset - %C(yellow)%d%Creset %s %Cgreen  (%cr %C(cyan) %an)%Creset' --abbrev-commit --date=relative --all
        g='git'
        gs='git status'
        gd='git diff'
        gdc='git diff --cached'
        gl='git pull'
        gup='git pull --rebase'
        gp='git push'
        gd='git diff'
        gc='git commit -v'
        gc!='git commit -v --amend'
        gca='git commit -v -a'
        gca!='git commit -v -a --amend'
        gcmsg='git commit -m'
        gco='git checkout'
        gcm='git checkout master'
        gr='git remote'
        grv='git remote -v'
        grmv='git remote rename'
        grrm='git remote remove'
        grset='git remote set-url'
        grup='git remote update'
        grbi='git rebase -i'
        grbc='git rebase --continue'
        grba='git rebase --abort'
        gb='git branch'
        gba='git branch -a'
        gcount='git shortlog -sn'
        gcl='git config --list'
        gcp='git cherry-pick'
        glg='git log --stat --max-count=10'
        glgg='git log --graph --max-count=10'
        glgga='git log --graph --decorate --all'
        glo='git log --oneline'
        gss='git status -s'
        ga='git add'
        gm='git merge'
        grh='git reset HEAD'
        grhh='git reset HEAD --hard'
        gclean='git reset --hard && git clean -dfx'
        gwc='git whatchanged -p --abbrev-commit --pretty=medium'

#remove the gf alias
#alias gf='git ls-files | grep'

        gpoat='git push origin --all && git push origin --tags'
        gmt='git mergetool --no-prompt'
      
        gg='git gui citool'
        gga='git gui citool --amend'
        gk='gitk --all --branches'
      
        gsts='git stash show --text'
        gsta='git stash'
        gstp='git stash pop'
        gstd='git stash drop'

