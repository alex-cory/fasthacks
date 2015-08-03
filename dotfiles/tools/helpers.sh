#!/bin/sh
# Helpers

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
  # j=1
  # for (( j = 1; j <= ${#answers[@]}; j++ )); do
    # if [[ j > 1 ]]; then
    #   
    # else
    #
    # fi
    # if [[ ${answers[j]} ]]; then
    #   #statements
    # fi
    # (( j++ ))

    # if [[ ${answers[0]} ]]; then
    #   #statements
    # fi
    # echo ${answers[$j]}
  # done
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
function_exists() {
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
