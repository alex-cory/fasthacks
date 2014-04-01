###########  How To Activate Aliases (copy command below) ############
# source ~/.bash_profile

###########  Config Files ############
#  Main (bash profile)
alias bashconf='subl ~/.bash_profile'
alias bashprof='subl .bash_profile'

#  PHP
alias phpconf='open -a Sublime\ Text /Applications/MAMP/bin/php/php5.5.3/conf/php.ini'

#  mySQL
alias mysqlconf='open -a Sublime\ Text ~/.my.cnf'

#  Apache
alias apacheconf='open -a Sublime\ Text /etc/apache2/httpd.conf'

#  Git
alias gitconf='open -a Sublime\ Text ~/.gitconfig'

#  Vim
alias vimconf='open -a Sublime\ Text ~/.vimrc'
alias vimlocalconf='open -a Sublime\ Text ~/.vim/vimrc.local'
alias vimcustomconf='open -a Sublime\ Text ~/.vim/vimrc.custom'

#  Zsh
alias zshconf='open -a Sublime\ Text ~/.zshrc'

###########  Plugin Aliases ############
# Ctags -- navigate to the directory and run this command
alias ctags="`brew --prefix`/bin/ctags; ctags -R -f .tags"



###########  Other Cool Aliases ############
# PHP Error Logs (Debugging Purposes)
alias php-error-log='tail -f /Applications/MAMP/logs/php_error.log'
alias phpel='tail -f /Applications/MAMP/logs/apache_error.log'

# Apache Error Log
alias apache-error-log='tail -f /Applications/MAMP/logs/apache_error.log'

# Open in Sublime Text
alias subl='open -a Sublime\ Text'

# Open in Finder
alias finder='open .'

# List contents
alias list='ls -a | less'



###########  Quick Path Reference Aliases ############
# Go To => {directory}  and list contents
function cdl { cd $1; ls; }

# Go To => git repositories
alias github='~/Google\ Drive/Developer/git\ repositories'

# Go To => Developer
alias dev='~/Google\ Drive/Developer/'

# Go To => htdocs
alias htdocs='/Applications/MAMP/htdocs/'

# Go To => CIT-31300
alias cit313='/Applications/MAMP/htdocs/CIT-31300/'

# Go To => Downloads
alias downloads='~/Downloads/'



###########  Sync Aliases ############
# Full Projects Sync
alias sync_projects='rsync -avz /Applications/MAMP/htdocs/ ~/Google\ Drive/Developer/git\ repositories/projects\ backup; rm -r .DS_Store;'


###########  MySQL Quickies ############
# Connect to MySQL
alias cmysql='mysql -u root -p -h 127.0.0.1 -P 3306'



###########  Random ############

# [[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm" # Load RVM into a shell session *as a function*


# source ~/.profile
