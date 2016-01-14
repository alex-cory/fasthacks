# Docker
alias d="docker"
alias dr="docker run"
alias dk="docker kill"
alias drm="docker rm"
alias drmi="docker rmi"
alias dst="docker start"
alias dstp="docker stop"
alias dc="docker commit"
alias db="docker branch"
alias dlo="docker login"
alias dli="docker login"
alias dlime="docker login --username=alexlcory --email=$EMAIL_1"
alias dv="docker version"
alias dmed="docker-machine env default"
alias dm="docker-machine"
alias dinfo="docker info"
alias dp="docker push"
alias dl="docker pull"
alias dtg="docker tag"
alias dtp="docker top"

# Get container process
alias dps="docker ps"

# Get latest container ID
alias did="docker ps -l -q"

# Get process included stop container
alias dpsa="docker ps -a"

# Get images
alias di="docker images"

# Get container IP
alias dip="docker inspect --format '{{ .NetworkSettings.IPAddress }}'"

# Run deamonized container, e.g., $dd base /bin/echo hello
alias drd="docker run -d -P"

# Run interactive container, e.g., $di base /bin/bash
alias dri="docker run -i -t -P"

# Execute interactive container, e.g., $dex base /bin/bash
alias dx="docker exec -i -t"

# Stop all containers
function dstpa() { 
  docker stop "$(docker ps -a -q)"; 
}

# Remove all containers
function drmcs() { 
  docker rm "$(docker ps -a -q)"; 
}

# Stop and Remove all containers
alias dsr!='docker stop $(docker ps -a -q) && docker rm $(docker ps -a -q)'

# Setup
function dqs() {
  # http://i.imgur.com/pXsKuZQ.jpg
  # Stackoverflow: http://bit.ly/21HTwFI
  docker-machine restart default &&
  dm env default &&
  eval "$(docker-machine env default)"
}

# Remove all images
function drmims() { 
  docker rmi "$(docker images -q)"; 
}

# Dockerfile build, e.g., $dbu tcnksm/test 
function dbu() { 
  docker build -t="$1" .; 
}

# Show all alias related docker
function dalias() { 
  alias | grep 'docker' | sed "s/^\([^=]*\)=\(.*\)/\1 => \2/"| sed "s/['|\']//g" | sort; 
}

function dh() {
  paginate_if_long docker "$@" --help
}

# function dh() {
#   env \
#   LESS_TERMCAP_mb="$(printf "\e[1;31m")" \
#   LESS_TERMCAP_md="$(printf "\e[1;31m")" \
#   LESS_TERMCAP_me="$(printf "\e[0m")" \
#   LESS_TERMCAP_se="$(printf "\e[0m")" \
#   LESS_TERMCAP_so="$(printf "\e[1;44;33m")" \
#   LESS_TERMCAP_ue="$(printf "\e[0m")" \
#   LESS_TERMCAP_us="$(printf "\e[1;32m")" \
#   docker --help | command less -R
# }
