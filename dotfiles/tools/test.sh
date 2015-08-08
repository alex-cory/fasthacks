# #!/bin/bash
#
# source '/etc/globals'
#
# ###
# # Hardlink: location where actual file is stored.
# # Softlink: location where the symlink is stored.
# # Symlink:  In the context of variable naming within this tool, it refers to the
# #           above two put together. (i.e. `ln -s hardLink softLink`)
# ###
# function rsym() {
#
#   # Get the symlink paths from the dotfiles.json file.
#   # They are formatted in a colon seperated string like this: "hard/link/1:soft/link/1:"
#   commandString=$(jq '.[] | [."hardLink", ."softLink"] | join(":") + ":"' dotfiles.json)
#   commandString=$(echo $commandString | sed 's/"//g')
#   commandString=${commandString%?}                      # trims the last char off the end (which is a colon)
#
#   count=0
#
#   for path in "${commandString[@]}"; do
#     IFS=':' read -a arr <<< "$path"
#
#     for part in "${arr[@]}"; do
#       (( count++ ))
#
#       # prints a float if not an even number (e.g. 1.4)
#       is_multiple_of_2=$(awk "BEGIN {print $count/2}")
#
#       # checks to see if not an integer (e.g. 1, 2, 3)
#       if ! [[ $is_multiple_of_2 =~ ^-?[0-9]+$ ]]; then
#
#         # makes sure some special chars are escaped (i.e. parenthesis, &s, and spaces)
#         hardLink=$(echo $part | sed -e 's/[()& ]/\\&/g')
#
#       else
#
#         # makes sure some special chars are escaped (i.e. parenthesis, &s, and spaces)
#         softLink=$(echo $part | sed -e 's/[()& ]/\\&/g')
#
#         # Neither Hard nor Soft Link
#         if [[ ! -e $hardLink ]] && [[ ! -e $softLink ]]; then
#
#           printf "${Red}BAD HARD:${Off} $(basename "$hardLink")\n"
#           printf "${Red}BAD SOFT:${Off} $(basename "$softLink")\n"
#           printf "${Yellow}FIXING:${Off} $(basename "$hardLink")\n"
#           # touch $hardLink
#           # ln -s $hardLink $softLink
#
#         # No Soft Link
#         elif [[ ! -e $softLink ]] && [[ -e $hardLink ]]; then
#
#           # TODO: this is where you would put the diffing
#           printf "${Red}BAD SOFT:${Off} $(basename "$softLink")\n"
#           printf "${Yellow}FIXING:${Off} $(basename "$softLink")\n"
#           # ln -s $hardLink $softLink
#
#         # No Hard Link
#         elif [[ -e $softLink ]] && [[ ! -e $hardLink ]]; then
#
#           # TODO: this is where you would put the diffing
#           printf "${Red}BAD HARD:${Off} $(basename "$hardLink")\n"
#           printf "${Yellow}FIXING:${Off} $(basename "$hardLink")\n"
#           hardLinkPath="${hardLink%/*}/"
#           # mv $softLink $hardLinkPath
#           # ln -s $hardLink $softLink
#
#         # Both Hard & Soft Links ✔
#         elif [[ -e $softLink ]] && [[ -e $hardLink ]]; then
#
#           printf "${Green}GOOD:${Off} $(basename "$hardLink")\n"
#
#         fi
#         #   echo EXISTS: $(basename "$hardLink")
#         # echo All: $(basename "$hardLink")
#         # if [[ -d $softLink ]]; then
#         #   echo DIRECTORY: $(basename "$softLink")
#         # # elif [[ -L $softLink ]]; then # CHANGE TO THIS WHEN DONE
#         # elif [[ -e $softLink ]]; then
#         #   echo FILE: $(basename "$softLink")
#         # fi
#         # echo $(basename "$softLink")
#         ###
#         # - private.xml
#         # - .lessfilter
#         # - .agignore
#         # - Dev_Notes
#         # - Preferences Sublime
#         # - Defaults Sublime
#
#         # ln -s $DOT/keyboard_layout/private.xml $KARABINER_PRIVATE
#         # http://bit.ly/1KMhYg0
#         # if softlink file exists and the hardlink file exists
#
#         # brokenSoftLink=$(find "$softLink" -type l ! -exec test -e {} \; -print) #     <= prints out broken symlinks
#         # if [[ ! -L "$softLink" ]] && [[ ! -f $hardLink ]]; then # || [ ! -d "$softLink" ]; then
#         # if [[ ${#brokenSoftLink} > 0 ]]; then
#         #   echo "BAD Soft Link: $softLink"
#         # fi
#             # echo "GOOD: $softLink"
#         #     echo "BAD Hard Link: $hardLink"
#
#           # if hardlink file doesn't exist, but softlink does
#           # mv softlink to hardlink location
#           # then symlink the new hardlink to the old softlink location
#
#         # if [ -L "$softLink" ]; then
#         #   if readlink -q $softLink >/dev/null ; then
#         #     echo "GOOD: $softLink"
#         #   else
#         #     echo "BAD: $softLink" >/dev/stderr
#         #     # echo "$F: bad link" >/dev/stderr
#         #   fi
#         # fi
#         # if [[ -f $softLink ]]; then
#         #   echo "BAD: $softLink"
#         # fi
#         # TODO:
#         # - create function to recursively symlink a directories files
#         # - add smart functionality so if file size is the same, don't resymlink it
#         # - if the file already exists in the soft location,
#         #   - FOR NOW: mv it to a temp backups folder
#         #   - EVENTUALLY: run a diff on the two.  If the soft link has
#         #                 a lot more changes than the hard link, show
#         #                 the diff.  Maybe just open vim up with the two
#         #                 files side-by-side split screen mode.
#         # - CASES:
#         #   - symlink (aka soft link) is broken
#         #   - softlink exists but hardlink doesn't exist
#         #   - hardlink exists but softlink doesn't exist
#         #   - neither exist
#         #   - both exist
#         #   - not allowed to symlink directories to multiple locations
#         #   -
#
#         # creating the symlink
#         symlink="ln -s $hardLink $softLink"
#
#         # echo $symlink
#
#       fi
#     done
#   done
# }
#
# rsym
#
# # OLD FUNCTION
# # function replaceSymlink() {
# #
# #   symlink="$2/$3"
# #   target="$1/$3"
# #
# #   # TODO: if the file exists, the symlink wont run
# #
# #   # if the file at the symlink locaiton doesnt exist, create it
# #   if ! [ -f "$symlink" ]; then
# #     echo "$symlink doesnt exist. ${Green}MAKING IT NOW${Off}"
# #     # touch "$symlink"
# #   fi
# #
# #   # if the file at the symlink location exists but the file at the target location doesnt
# #   if [[ -f "${target}" && ! -L "${target}" ]]; then
# #
# #     message="this is a file. \n cp $target $1"
# #   elif [[ -d "$target" && ! -L "${target}" ]]; then
# #     message="this is a director \n cp $target $1"
# #     # copy the file to the target location
# #     # cp "$symlink" "$1"
# #     echo "$message"
# #     # remove the old file
# #     # rm "$symlink"
# #     # echo "${Red}$target${Off} doesnt exist"
# #     # echo "Copying ${Blue}$symlink${Off} to ${Blue}$target${Off}"
# #   fi
# #
# #   # If the symlink is broken
# #   test=`find "$symlink" -type l ! -exec test -e {} \; -print` #     <= prints out broken symlinks
# #   # echo "$test"
# #     if [ -n "$test" ]; then #                                       <= if `test` has something in it
# #     echo "Bad: ${Red}$3${Off}"
# #     echo "Re-symlinked: ${Green}$3${Off}"
# #     # Remove the old symlink
# #     rm "$symlink"
# #     # Create the new symlink
# #     ln -s "$target" "$symlink"
# #   else
# #     echo "Good:  ${Green}$3${Off}"
# #   fi
# # }
#
#
# # Symlink Directory
# # IPORTANT NOTE!
# #   You cannot actually symlink a directory in multiple places,
# #   but you can symlink files in multiple places.  This
# #   symlinks all the files in the directory specified. If you
# #   add or remove files from within the `hardlink` (aka where
# #   the original file is), you will need to re-run this command
# #   on the specified directory.
# #   Current: ignore .git (eventually add feature to ingore whatever)
# #   Reference: http://bit.ly/1CXf6gp
# # Usage:
# #   lnd /path/to/hardlink
# #   lnd     (would just run on current directory)
# # function lnd() { # TODO: make work
#   # recursively traverse the directory specified and list only the symbolic links
#   # ls-lR "specifiedDirectory" | ag ^l
#   # SUDO CODE
#   # for each hardLink in arg1HardLinkDir
#     # softLink = file.getSoftLink()
#     # remove softlink
#     # create new symlink
#     # ln -s $hardlink $softlink
#   # DIR="$1"
#   # IFS=$'\n'; # if filename contains a space  (note, it won't work if there's a `return` in the filename
#   # for f in $(find "$DIR" -name '*.pdf' -or -name '*.doc'); do
#   #   rm $f;
#   # done
#   # rm -f images_all/*
#   # for i in images_[abc]/* ; do; ln -s $i images_all/$(basename $i) ; done
# # }
#
# function resolve_path() {
#   #I'm bash only, please!
#   # usage:  resolve_path <a file or directory>
#   # follows symlinks and relative paths, returns a full real path
#   #
#   local owd="$PWD"
#   #echo "$FUNCNAME for $1" >&2
#   local opath="$1"
#   local npath=""
#   local obase=$(basename "$opath")
#   local odir=$(dirname "$opath")
#   if [[ -L "$opath" ]]
#   then
#     #it's a link.
#     #file or directory, we want to cd into it's dir
#     cd $odir
#     #then extract where the link points.
#     npath=$(readlink "$obase")
#     #have to -L BEFORE we -f, because -f includes -L :(
#     if [[ -L $npath ]]
#     then
#       #the link points to another symlink, so go follow that.
#       resolve_path "$npath"
#       #and finish out early, we're done.
#       return $?
#       #done
#     elif [[ -f $npath ]]
#       #the link points to a file.
#     then
#       #get the dir for the new file
#       nbase=$(basename $npath)
#       npath=$(dirname $npath)
#       cd "$npath"
#       ndir=$(pwd -P)
#       retval=0
#       #done
#     elif [[ -d $npath ]]
#     then
#       #the link points to a directory.
#       cd "$npath"
#       ndir=$(pwd -P)
#       retval=0
#       #done
#     else
#       echo "$FUNCNAME: ERROR: unknown condition inside link!!" >&2
#       echo "opath [[ $opath ]]" >&2
#       echo "npath [[ $npath ]]" >&2
#       return 1
#     fi
#   else
#     if ! [[ -e "$opath" ]]
#     then
#       echo "$FUNCNAME: $opath: No such file or directory" >&2
#       return 1
#       #and break early
#     elif [[ -d "$opath" ]]
#     then
#       cd "$opath"
#       ndir=$(pwd -P)
#       retval=0
#       #done
#     elif [[ -f "$opath" ]]
#     then
#       cd $odir
#       ndir=$(pwd -P)
#       nbase=$(basename "$opath")
#       retval=0
#       #done
#     else
#       echo "$FUNCNAME: ERROR: unknown condition outside link!!" >&2
#       echo "opath [[ $opath ]]" >&2
#       return 1
#     fi
#   fi
#   #now assemble our output
#   echo -n "$ndir"
#   if [[ "x${nbase:=}" != "x" ]]
#   then
#     echo "/$nbase"
#   else
#     echo
#   fi
#   #now return to where we were
#   cd "$owd"
#   return $retval
# }
