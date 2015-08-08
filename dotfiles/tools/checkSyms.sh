#!/bin/bash
# symstatus
source 'helpers.sh'
source 'colors'

###
# Checks what the status of a file is.
# i.e. broken symlink, file, directory, file symlink, directory symlink, non existent
###
function checkfile() {
  # Broken Symlink
  if [[ ! -z $(find "$1" -type l ! -exec test -e {} \; -print 2>/dev/null) ]]; then
    # ^ if the string returned by find is not a length of zero
    printf "${Yellow}$2 Broken Symlink${Off}: $(basename "$1")\n"

  # File
  elif [[ -f "$1" && ! -L "$1" ]]; then
    printf "${Green}$2 File ${Off}: $(basename "$1")\n"

  # Directory
  elif [[ -d "$1" && ! -L "$1" ]]; then
    printf "${Green}$2 Directory${Off}: $(basename "$1")\n"

  # Symlinked File
  elif [[ -f "$1" && -L "$1" ]]; then
    printf "${Blue}$2 Symlink File${Off}: $(basename "$1")\n"

  # Symlinked Directory
  elif [[ -d "$1" && -L "$1" ]]; then
    printf "${Blue}$2 Symlink Directory${Off}: $(basename "$1")\n"

  # File Doesn't Exist
  elif [[ ! -e "$1" ]]; then
    printf "${Red}$2 Does Not Exist${Off}: $(basename "$1")\n"
    printf "$1\n"

  # Not Sure
  else
    printf "${Red}Whyyyyy!${Off}\n"
    echo "$1\n"
    # printf "${Red}Whyyy... whyyyy!${Off}  ${IRed}Pleeeeassse!${Off} ${Green}:(${Off} ${Yellow}\nI don't know${Off} ${Blue}what's the matter!"
  fi
}

###
# Tells you the status of all your symlinks.
###
function symstatus() {

  # Get the symlink paths from the dotfiles.json file.
  # They are formatted in a colon seperated string like this: "hard/link/1:soft/link/1:"
  commandString=$(jq '.[] | [."hardLink", ."softLink"] | join(":") + ":"' dotfiles.json)
  # trim quotes
  commandString=$(echo $commandString | sed 's/"//g')
  # trims the last char off the end (which is a colon)
  commandString=${commandString%?}

  count=0

  for path in "${commandString[@]}"; do

    IFS=':' read -a arr <<< "$path"

    for part in "${arr[@]}"; do

      (( count++ ))

      # prints a float if not an even number (e.g. 1.4)
      is_multiple_of_2=$(awk "BEGIN {print $count/2}")

      # checks to see if not an integer (e.g. 1, 2, 3)
      if ! [[ $is_multiple_of_2 =~ ^-?[0-9]+$ ]]; then

        # makes sure some special chars are escaped (i.e. parenthesis, &s, and spaces)
        hardLinkEsc="$(echo "$part" | sed -e 's/[()& ]/\\&/g')"
        hardLink="$part"

      else

        index=$is_multiple_of_2

        # makes sure some special chars are escaped (i.e. parenthesis, &s, and spaces)
        softLinkEsc="$(echo $part | sed -e 's/[()& ]/\\&/g')"
        softLink="$part"

        checkfile "$(echo $hardLink)" 'Hard Link: '
        checkfile "$(echo $softLink)" 'Soft Link: '
        # printf "\n"

      fi
    done
  done
}

symstatus
