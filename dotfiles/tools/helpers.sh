#!/bin/sh
# Helpers

###
# Checks to see if a given substring is contained within the string.
# Ex: contains 'cool man' 'coo'             -> 1 #aka true
# Ex: contains 'cool man' 'cool' AND 'man'  -> 1 #aka true
# Ex: contains 'cool man' 'bro' OR 'an'     -> 1 #aka true
###
function contains() {
  local previousDecision=0
  answers=()
  operators=()

  for (( i = 1; i <= $#; i++ )); do
    eval arg=\$$i

    # if it's the first argument, set that to be the main string to check against
    [[ $i == 1 ]] && string="$arg"

    # for all arguments after the first one
    if [[ $i > 1 ]] ; then

      # Is this in the main string?
      local substring="$arg"

      # Prints a float if not an even number (e.g. 1.4)
      is_multiple_of_2=$(awk "BEGIN {print $i/2}")

      # Checks to see if not an integer (e.g. 1, 3, 5)
      if ! [[ $is_multiple_of_2 =~ ^-?[0-9]+$ ]]; then
        # if $i is 3 or greater and odd, it's a && or ||

        if [[ $substring == 'OR' ]]; then
          operators+=('OR')
        else # AND
          operators+=('AND')
        fi

      else # on the evens, starting at arg 2

        if [[ $string != *"$substring"* ]]; then
          answers+=(0)
        else
          answers+=(1)
        fi

      fi
    fi
  done

  # TODO: put this in a loop so you can have more than 1 operator (e.g. contains string substr AND substr2 OR substr3)
  if [[ ${#operators[@]} == 1 ]] && [[ ${operators[1]} == "AND" ]]; then

    if [[ ${answers[1]} == 1 ]] && [[ ${answers[2]} == 1 ]]; then
      echo 1 # true
    else
      echo 0 # false
    fi

  elif [[ ${#operators[@]} == 1 ]] && [[ ${operators[1]} == "OR" ]]; then

    if [[ ${answers[1]} == 1 ]] || [[ ${answers[2]} == 1 ]]; then
      echo 1 # true
    else
      echo 0 # false
    fi

  elif [[ ${#operators[@]} == 0 ]]; then

    if [[ ${answers[1]} == 1 ]]; then
      echo 1 # true
    else
      echo 0 # false
    fi

  fi
}

###
# Simple for printing out arrays
###
function var_dump() {
  printf '%s\n' "$1"
}

# escapestr_sed()
# read a stream from stdin and escape characters in text that could be interpreted as
# special characters by sed
function escape_sed() {
 sed \
  -e 's/\//\\\//g' \
  -e 's/\&/\\\&/g'
}

##
# Returns the passed in string with escaped chars.
##
function esc_chars() {
  # escape spaces first
  local q=$(echo $1 | sed 's/ /\\ /g')
  # then everything else
  return "$(printf %q $1)"
}

# Tells you whether a function exists. Can be used in a terminal or in a file.
function function_exists() {
  # declare -f -F $1 > /dev/null
  # return $?
  fname=`declare -f -F $1`
  [ -n "$fname" ] && echo Function ${Green}$1${Off} ${Blue}exists.${Off} || echo Declare -f says $1 does not exist
}

# Shows what's in the function
function func() {
  fname=`declare -f -F $1`
  echo $fname
}

# Checks to see if a file exists
function exists() {
  if test -e "$1"; then
    printf "${Green}Yep! :)"
  else
    printf "${Red}Yuck! Where is it??"
  fi
}

###
#
###
function if_noexist_create() {
  if [[ -f "$1" ]]; then
    return
    # printf "${Green}File Exists Already:${Off} $1"
  elif [[ -d "$1" ]]; then
    return
    # printf "${Green}Directory Exists Already:${Off} $1"
  # if the last part of the path contains a slash and doesn't contain a dot
  elif [[ $2 == 'DIR' ]]; then
    mkdir "$1"
  elif [[ $2 == 'FILE' ]]; then
    touch "$1"
  fi
}

function recurseSym() {
  sourceDir="$1"
  destDir="$2"
  cd "$sourceDir"
  for i in `ls `; do
    ln -s $i "$destDir"/$i
  done
}

