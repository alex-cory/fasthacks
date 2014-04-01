###########  How To Activate Aliases (copy command below) ############
# source ~/.bash_profile
alias alias-enable='source ~/.bash_profile'


###########  Config Files ############
#  PHP
alias phpconf='sudo vim /Applications/MAMP/bin/php/php5.5.3/conf/php.ini'

#  mySQL
alias mysqlconf='nano ~/.my.cnf'

#  Main (bash profile)
alias aliases='nano ~/.bash_profile'
alias bashconf='nano ~/.bash_profile'

#  Git
alias gitconf='sudo nano ~/.gitconfig'

###########  Other Cool Aliases ############
# PHP Error Logs (Debugging Purposes)
alias php-error-log='cat /Applications/MAMP/logs/apache_error.log'
alias phpel='cat /Applications/MAMP/logs/apache_error.log'

# Open in Sublime Text
alias subl='open -a Sublime\ Text'

# Edit Bash Profile in Sublime Text
alias bashprof='subl .bash_profile'

# Go To => {directory}  and list contents
function cdl { cd $1; ls; }

# Go To => git repositories
alias github='~/Google\ Drive/Developer/git\ repositories'

# Go To => htdocs
alias sites='/Applications/MAMP/htdocs/'

# Go To => CIT-31300
alias cit313='/Applications/MAMP/htdocs/CIT-31300/'


###########  Dev Note Aliases ############
alias dnp='~/Desktop/Code_Playground/Dev\ Notes/'

alias cddnp='cd ~/Desktop/Code_Playground/Dev\ Notes/'

alias devn='cat ~/Desktop/Code_Playground/Dev\ Notes/Console/Console\ Essentials.txt'

alias edevn='nano ~/Desktop/Code_Playground/Dev\ Notes/Console/Console\ Essentials.txt'

alias gitn='cat ~/Desktop/Code_Playground/Dev\ Notes/VCS/Git/Git.txt'

alias egitn='nano ~/Desktop/Code_Playground/Dev\ Notes/VCS/Git/Git.txt'

alias st='sudo ln -s "/Applications/Sublime Text 2.app/Contents/SharedSupport/bin/subl" /usr/bin/subl'


[[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm" # Load RVM into a shell session *as a function*


source ~/.profile
