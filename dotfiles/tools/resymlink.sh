#!/bin/bash
# Filename: error_checking.sh
# source '/etc/globals'
source 'colors'
source 'helpers.sh'

function checkStatus() {
  # Broken Symlink
  if [[ ! -z $(find "$1" -type l ! -exec test -e {} \; -print 2>/dev/null) ]]; then
    # ^ if the string returned by find is not a length of zero
    printf 'broken_symlink'

  # File
  elif [[ -f "$1" && ! -L "$1" ]]; then
    printf 'file'

  # Directory
  elif [[ -d "$1" && ! -L "$1" ]]; then
    printf 'directory'

  # Symlinked File
  elif [[ -f "$1" && -L "$1" ]]; then
    printf 'file_symlink'

  # Symlinked Directory
  elif [[ -d "$1" && -L "$1" ]]; then
    printf 'directory_symlink'

  # File Doesn't Exist
  elif [[ ! -e "$1" ]]; then
    printf 'doesnt_exist'

  # Not Sure
  else
    printf 'idk'
  fi
}



###
# Hardlink: location where actual file is stored.
# Softlink: location where the symlink is stored.
# Symlink:  In the context of variable naming within this tool, it refers to the
#           above two put together. (i.e. `ln -s hardLink softLink`)
###
function resym() {

  # Get the symlink paths from the dotfiles.json file.
  # They are formatted in a colon seperated string like this: "hard/link/1:soft/link/1:"
  commandString=$(jq '.[] | [."hardLink", ."softLink"] | join(":") + ":"' dotfiles.json)
  # trim quotes
  commandString=$(echo $commandString | sed 's/"//g')
  # trims the last char off the end (which is a colon)
  commandString=${commandString%?}

  count=0

  # Create a backups directory if it doesn't exist already
  if [[ ! -d $HOME/.dotfiles/backup ]]; then
    printf "${Purple}NO BACKUP FOR DOTFILES${Off}\n"
    mkdir -p "$HOME/.dotfiles/backup"
    printf "${Yellow}CREATED:${Off}${White} ~/.dotfiles/backup${Off}\n"
  fi

  for path in "${commandString[@]}"; do

    IFS=':' read -a arr <<< "$path"

    for part in "${arr[@]}"; do

      (( count++ ))

      # prints a float if not an even number (e.g. 1.4)
      is_multiple_of_2=$(awk "BEGIN {print $count/2}")

      # checks to see if not an integer (e.g. 1, 2, 3)
      if ! [[ $is_multiple_of_2 =~ ^-?[0-9]+$ ]]; then

        # makes sure some special chars are escaped (i.e. parenthesis, &s, and spaces)
        # hardLinkEsc="$(echo "$part" | sed -e 's/[()& ]/\\&/g')"
        # hardLink="$part"
        hardLinkStatus="$(checkStatus "$(echo $part)")"
        hlNoEsc="$part"
        if [ `expr "$part" : ".*[!@#\$%^\&*()_+].*"` -gt 0 ];
        then 
          hardLink="$(echo $part | sed -e 's/[()& ]/\\&/g')"
        else
          hardLink="$part"
        fi

      else

        index=$is_multiple_of_2

        softLinkStatus="$(checkStatus "$(echo $part)")"
        slNoEsc="$part"
        # makes sure some special chars are escaped (i.e. parenthesis, &s, and spaces)
        if [ `expr "$part" : ".*[!@#\$%^\&*()_+].*"` -gt 0 ];
        then 
          softLink="$(echo $part | sed -e 's/[()& ]/\\&/g')"
        else
          softLink="$part"
        fi

        # check the status (i.e. broken symlink, doesn't exist, etc.)

        backup="$HOME/.dotfiles/backup"

        printf "${Purple}HARD:${Off} $hardLinkStatus ${Grey}$hardLink${Off}\n"
        printf "${Purple}SOFT:${Off} $softLinkStatus ${Grey}$softLink${Off}\n"

        # SL Dir && HL Dir
        #   SL Newer
        #     cp -r $hardLink backup
        #     rm -r $hardLink
        #     sudo ln -sf $hardLink $softLink
        #   HL Newer
        #     cp -r $softLink backup
        #     rm -r $softLink
        #     sudo ln -sf $hardLink $softLink
        # SL File && HL File
        #   SL Newer
        #     cp -r $hardLink backup
        #     rm -r $hardLink
        #     sudo ln -sf $hardLink $softLink
        #   HL Newer
        #     cp -r $softLink backup
        #     rm -r $softLink
        #     sudo ln -sf $hardLink $softLink
        # SL Dir && HL doesnt exist
        # SL File && HL doesnt exist
        # SL broken && HL Dir
        # SL broken && HL File
        # SL doesnt exist && HL Dir
        # SL doesnt exist && HL File
        # SL doesnt exist && HL doesnt exist
        # SL file symlink && HL File || SL dir symlink && HL Dir


        # SL Directory & HL Directory
        if [[ $softLinkStatus == 'directory' && $hardLinkStatus == 'directory' ]]; then

          # SL Newer
          if [[ $slNoEsc -nt $hlNoEsc ]]; then

            printf "${Red}SL Dir & HL Dir. Soft Last Modified:${Off} ${White}$softLink${Off}\n"
            # backup the hard link
            # cp -r "$hardLink" "$backup" # 2>/dev/null
            # then remove it
            # rm "$hardLink" # 2>/dev/null
            # mkdir "$hardLink"
            # mv "$softLink/*" "$hardLink/"
            # create new symlink
            # sudo ln -sf "$hardLink" "$softLink"
            printf "${Yellow}FIXED:${Off} $(basename "$softLink")\n"

          # HL Newer
          else

            printf "${Red}SL Dir & HL Dir. Hard Last Modified:${Off} ${White}$softLink${Off}\n"
            # printf "${Red}BAD SOFT:${Off} $(basename "$hardLink")\n"
            # backup the soft link
            # cp -r "$softLink" "$backup" # 2>/dev/null
            # then remove it
            # rm "$softLink" # 2>/dev/null
            # create new symlink
            # sudo ln -sf "$hardLink" "$softLink"
            printf "${Yellow}FIXED:${Off} $(basename "$softLink")\n"

          fi

        # SL File & HL File
        elif [[ $softLinkStatus == 'file' && $hardLinkStatus == 'file' ]]; then

          # SL Newer
          if [[ $slNoEsc -nt $hlNoEsc ]]; then

            printf "${Red}SL File & HL File. Soft Last Modified:${Off} ${White}$softLink${Off}\n"
            # backup the hard link
            # cp -r "$hardLink" "$backup" # 2>/dev/null
            # then remove it
            # rm "$hardLink" # 2>/dev/null
            # create new symlink
            # sudo ln -sf "$hardLink" "$softLink"
            printf "${Yellow}FIXED:${Off} $(basename "$softLink")\n"

          # HL Newer
          else

            printf "${Red}SL File & HL File. Hard Last Modified:${Off} ${White}$softLink${Off}\n"
            # printf "${Red}BAD SOFT:${Off} $(basename "$hardLink")\n"
            # backup the soft link
            # mv "$softLink" "$backup"
            # create new symlink
            # sudo ln -sf "$hardLink" "$softLink"
            printf "${Yellow}FIXED:${Off} $(basename "$softLink")\n"

          fi

        # SL Dir && HL doesnt exist
        elif [[ $softLinkStatus == 'directory' && $hardLinkStatus == 'doesnt_exist' ]]; then

          printf "${Red}SL Dir && HL doesnt exist:${Off} ${White}$softLink${Off}\n"
          # backup the soft link directory
          # cp -r "$softLink" "$backup"
          # move the soft link dir to the hard link basepath
          # mv "$softLink" "$(basepath $hardLink)"
          # resymlink
          # sudo ln -sf "$hardLink" "$softLink"
          
        # SL File && HL doesnt exist
        elif [[ $softLinkStatus == 'file' && $hardLinkStatus == 'doesnt_exist' ]]; then

          printf "${Red}SL File && HL doesnt exist:${Off} ${White}$softLink${Off}\n"
          # backup the soft link file
          # cp -r "$softLink" "$backup"
          # move the softlink file to the hard link location
          # mv "$softLink" "$hardLink"
          # resymlink
          # sudo ln -sf "$hardLink" "$softLink"

        # SL broken && HL Dir
        elif [[ $softLinkStatus == 'broken_symlink' && $hardLinkStatus == 'directory' ]]; then

          printf "${Red}SL broken && HL Dir:${Off} ${White}$softLink${Off}\n"
          # remove the soft link
          rm -r "$softLink"
          # resymlink
          # sudo ln -sf "$hardLink" "$softLink"

        # SL broken && HL File
        elif [[ $softLinkStatus == 'broken_symlink' && $hardLinkStatus == 'file' ]]; then

          printf "${Red}SL broken && HL File:${Off} ${White}$softLink${Off}\n"
          # remove the soft link
          rm -r "$softLink"
          # resymlink
          sudo ln -sf "$hardLink" "$softLink"

        # SL doesnt exist && HL Dir
        elif [[ $softLinkStatus == 'doesnt_exist' && $hardLinkStatus == 'directory' ]]; then

          printf "${Red}SL doesnt exist && HL Dir:${Off} ${White}$softLink${Off}\n"
          # resymlink
          sudo ln -sf "$hardLink" "$softLink"

        # SL doesnt exist && HL File
        elif [[ $softLinkStatus == 'doesnt_exist' && $hardLinkStatus == 'file' ]]; then

          printf "${Red}SL doesnt exist && HL File:${Off} ${White}$softLink${Off}\n"
          # resymlink
          sudo ln -sf "$hardLink" "$softLink"

        # SL doesnt exist && HL doesnt exist
        elif [[ $softLinkStatus == 'doesnt_exist' && $hardLinkStatus == 'doesnt_exist' ]]; then

          printf "${Red}SL doesnt exist && HL doesnt exist:${Off} ${White}$softLink${Off}\n"
          while true; do
            read -p "Is this symlink supposed to be a file or directory? [f/d]" fd
            case $fd in
              [Ff]* ) touch "$hardLink"; sudo ln -sf "$hardLink" "$softLink"; break;;
              [Dd]* ) mkdir "$hardLink"; sudo ln -sf "$hardLink" "$softLink"; break;;
              * ) echo "Please answer f or d.";;
            esac
          done
          # resymlink
          sudo ln -sf "$hardLink" "$softLink"

        # SL file symlink && HL File || SL dir symlink && HL Dir
        elif [[ $softLinkStatus == 'file_symlink' && $hardLinkStatus == 'file' ]] || [[  $softLinkStatus == 'directory_symlink' && $hardLinkStatus == 'directory' ]]; then
          printf "${Green}GOOD:${Off} $(basename "$hardLink")\n"
        fi






        # TODO:
        # - create function to recursively symlink a directories files
        # - add smart functionality so if file size is the same, don't resymlink it
        # - if the file already exists in the soft location,
        #   - FOR NOW: mv it to a temp backups folder
        #   - EVENTUALLY: run a diff on the two.  If the soft link has
        #                 a lot more changes than the hard link, show
        #                 the diff.  Maybe just open vim up with the two
        #                 files side-by-side split screen mode.
        # - CASES:
        #   - symlink (aka soft link) is broken
        #   - softlink exists but hardlink doesn't exist
        #   - hardlink exists but softlink doesn't exist
        #   - neither exist
        #   - both exist
        #   - not allowed to symlink directories to multiple locations
        #   -


        # echo $symlink

      fi
    done
  done
}

resym



######  SORT OF WORKS BUT WEIRD ########
        # if [[ $hardLinkStatus == 'directory_symlink' && $softLinkStatus == 'directory' ]]; then
        #
        #   printf "${Red}Hard Link = directory symlink, Softlink = directory${Off} $(basename "$hardLink")\n"
        #   # printf "${Red}BAD HARD:${Off} $(basename "$hardLink")\n"
        #   rm "$hardLinkEsc"
        #   mv "$softLinkEsc" "$hardLink"
        #   sudo ln -sf "$hardLinkEsc" "$softLinkEsc"
        #   printf "${Yellow}FIXED:${Off} $(basename "$softLink")\n"
        #
        # elif [[ $hardLinkStatus == 'file' && $softLinkStatus == 'file_symlink' ]] || [[ $hardLinkStatus == 'directory' && $softLinkStatus == 'directory_symlink' ]]; then
        #
        #   printf "${Green}GOOD:${Off} $(basename "$hardLink")\n"
        #
        #
        # # Both are files or directories
        # elif [[ $softLinkStatus == 'directory' && $hardLinkStatus == 'directory' ]]; then
        #
        #   # if soft link is newer than hard link
        #   if [[ $softLink -nt $hardLink ]]; then
        #
        #     printf "${Red}Soft Is Last Modified:${Off} $softLink\n"
        #     # printf "${Red}BAD HARD:${Off} $(basename "$softLink")\n"
        #
        #     # backup the hard link
        #     cp -r "$hardLink" "$HOME/.dotfiles/backup" 2>/dev/null
        #     # then remove it
        #     rm "$hardLink" 2>/dev/null
        #     # make new hardlink dir
        #     mkdir "$hardLink"
        #     echo "mkdir $hardLink"
        #     # move the soft link into the hard link directory
        #     cp -r "$softLink/*" "$hardLink/"
        #     echo "cp -r $softLink/* $hardLink/"
        #     # remove softlink
        #     rm "$softLink"
        #     echo "rm $softLink"
        #     sudo ln -sf "$hardLink" "$softLink"
        #     printf "${Yellow}FIXED:${Off} $(basename "$softLink")\n"
        #
        #   # if the hard link is newer than the soft link
        #   else
        #
        #     printf "${Red}Hard Is Last Modified:${Off} $softLink\n"
        #     # printf "${Red}BAD SOFT:${Off} $(basename "$hardLink")\n"
        #
        #     # backup the soft link
        #     mv "$softLinkEsc" "$HOME/.dotfiles/backup"
        #     sudo ln -sf "$hardLinkEsc" "$softLinkEsc"
        #     printf "${Yellow}FIXED:${Off} $(basename "$softLink")\n"
        #
        #   fi
        #
        # elif [[ $softLinkStatus == 'file' && $hardLinkStatus == 'file' ]]; then
        #   printf "${Cyan} IF BOTH ARE FILES HANDLE THIS${}\n"
        #
        #
        # # No Hard Link or Soft Link
        # elif [[ $softLinkStatus == 'doesnt_exist' && $hardLinkStatus == 'doesnt_exist' ]] || [[ $softLinkStatus == 'broken_symlink' && $hardLinkStatus == 'doesnt_exist' ]]; then
        #
        #   printf "${Red}No Hard or Soft:${Off}${White}$softLink${Off}\n"
        #   # printf "${Red}BAD HARD:${Off} $(basename "$hardLink")\n"
        #   # printf "${Red}BAD SOFT:${Off} $(basename "$softLink")\n"
        #
        #   # make the hard link
        #   touch $hardLinkEsc
        #   # ^ IF ABOVE BREAKS: try: touch "$(echo $hardLinkEsc)"
        #   sudo ln -sf "$hardLinkEsc" "$softLinkEsc"
        #   printf "${Yellow}CREATED AND SYMLINKED${Off} $(basename "$hardLink")\n"
        #
        # # Soft Link Exists But No Hard Link
        # elif [[ $softLinkStatus == 'file' && $hardLinkStatus == 'doesnt_exist' ]] || [[ $softLinkStatus == 'directory' && $hardLinkStatus == 'doesnt_exist' ]]; then
        #
        #   if [[ $softLinkStatus == 'file' ]]; then
        #     printf "${Red}Yes Soft Link File, No Hard Link${Off} $(basename $softLink)\n"
        #     # printf "${Red}BAD HARD:${Off} $(basename "$hardLink")\n"
        #     # move the soft link to the hard link directory
        #     # hardLinkPath="${hardLink%/*}/"
        #     mv "$softLinkEsc" "$hardLinkEsc"
        #     sudo ln -sf "$hardLinkEsc" "$softLinkEsc"
        #     printf "${Yellow}FIXED:${Off} $(basename "$hardLink")\n"
        #   else
        #     printf "${Red}Yes Soft Link Dir, No Hard Link${Off} $(basename $softLink)\n"
        #
        #     cp -r "$hardLink" "$HOME/.dotfiles/backup" 2>/dev/null
        #     echo "rm -r "$hardLink" 2>/dev/null"
        #     echo "mkdir $hardLink"
        #     echo "mv $softLink/* $hardLink/"
        #     echo "rm -r $softLink" 
        #     echo "sudo ln -sf $hardLink $softLink"
        #     # rm -r "$hardLink" 2>/dev/null
        #     # mkdir "$hardLink"
        #     # mv "$softLink/*" "$hardLink/"
        #     # rm -r "$softLink" 
        #     # sudo ln -sf "$hardLink" "$softLink"
        #   fi
        #
        # # Hard Link Exists, But No Soft Link
        # elif [[ $hardLinkStatus == 'file' || $hardLinkStatus == 'directory' ]]; then
        #
        #   # Soft Link doesn't exist
        #   if [[ $softLinkStatus == 'doesnt_exist' ]]; then
        #
        #     printf "${Red}Yes Hard Link, No Soft Link${Off} $(basename $hardLink)\n"
        #     # printf "${Red}BAD SOFT:${Off} $(basename "$softLink")\n"
        #
        #     sudo ln -sf "$hardLinkEsc" "$softLinkEsc"
        #     printf "${Yellow}FIXED:${Off} $(basename "$softLink")\n"
        #
        #   # Soft Link is a file
        #   elif [[ $softLinkStatus == 'file' ||  $softLinkStatus == 'broken_symlink' && -f $softLink ]]; then
        #
        #     printf "${Red}Yes Hard Link, Somehow Soft Link is File ${Off} ${White}$softLink${Off}\n"
        #     cp -r "$hardLink" "$HOME/.dotfiles/backup"
        #     rm "$hardLink"
        #     mv "$softLink" "$hardLink"
        #     sudo ln -sf "$hardLink" "$softLink"
        #
        #   # Soft Link is a directory
        #   elif [[ $softLinkStatus == 'directory' || $softLinkStatus == 'broken_symlink' && -d $softLink ]]; then
        #
        #     printf "${Red}Yes Hard Link, Somehow Soft Link is Dir ${Off} ${White}$softLink${Off}\n"
        #     cp -r "$hardLink" "$HOME/.dotfiles/backup" # 2>/dev/null
        #     # echo "rm -r "$hardLink" 2>/dev/null"
        #     # echo "mkdir $hardLink"
        #     # echo "mv $softLink/* $hardLink/"
        #     # echo "rm -r $softLink" 
        #     # echo "sudo ln -sf $hardLink $softLink"
        #     # rm -r "$hardLink" 2>/dev/null
        #     mkdir "$hardLink"
        #     mv "$softLink/*" "$hardLink/"
        #     rm -r "$softLink" 
        #     sudo ln -sf "$hardLink" "$softLink"
        #
        #   # Soft Link is broken symlink
        #   # elif [[ ]]; then
        #   #
        #   #   printf "${Red}Yes Hard Link, Broken Soft Link${Off} ${White}$softLink${Off}\n"
        #   #   # printf "${Red}BAD SOFT:${Off} $(basename "$softLink")\n"
        #   #
        #   #   # mv "$softLink" "$HOME/.dotfiles/backup"
        #   #   # [[ -L "$softLink" ]] &&
        #   #   # rm "$"
        #   #   sudo ln -sf $hardLink $softLink
        #   #   printf "${Yellow}FIXED:${Off} $(basename "$softLink")\n"
        #
        #   fi
        #
        # elif [[ $softLinkStatus == 'file' || $softLinkStatus == 'directory' ]] && [[ $hardLinkStatus == 'file' || $hardLinkStatus == 'directory' ]]; then
        #   printf "${Red}Yes Hard Link and Soft Link, but Soft Link is NOT a symlink.${Off}\n"
        #   # printf "${Red}BAD HARD AND SOFT:${Off} $(basename "$softLink")\n"
        #   # printf "${Yellow}FIXED:${Off} $(basename "$softLink")\n"
        #   # cmd=""
        #   # printf ""
        #
        # elif [[ $hardLinkStatus == 'broken_symlink' && $softLinkStatus == 'file' ]]; then
        #
        #   # printf "${Red}BAD HARD:${Off} $(basename "$softLink")\n"
        #   # printf "${Yellow}FIXED:${Off} $(basename "$softLink")\n"
        #   printf "${Red}Yes Hard Link is Broken, but we'll fix it!${Off}\n"
        #   # cmd="mv $hardLink /Users/AlexCory/.dotfilesBackup"
        #   rm "$hardLinkEsc"
        #   mv "$softLinkEsc" "$hardLinkEsc"
        #   sudo ln -s "$hardLinkEsc" "$softLinkEsc"
        #   printf "${Yellow}FIXED:${Off} $(basename "$softLink")\n"
        #
        # elif [[ $softLinkStatus == 'broken_symlink' ]] && [[ $hardLinkStatus == 'directory' ]]; then
        #   printf "${Red}Hard Link Directory, Soft Link Broken Symlink ${Off} ${White}$softLink${Off}\n"
        #   cp -r "$hardLink" "$HOME/.dotfiles/backup" 2>/dev/null
        #   echo "rm -r "$hardLink" 2>/dev/null"
        #   echo "mkdir $hardLink"
        #   echo "mv $softLink/* $hardLink/"
        #   echo "rm -r $softLink" 
        #   echo "sudo ln -sf $hardLink $softLink"
        #   # rm -r "$hardLink" 2>/dev/null
        #   # mkdir "$hardLink"
        #   # mv "$softLink/*" "$hardLink/"
        #   # rm -r "$softLink" 
        #   # sudo ln -sf "$hardLink" "$softLink"
        #
        # elif [[ $softLinkStatus == 'file_symlink' && $hardLinkStatus == 'file' || $softLinkStatus == 'directory_symlink' && $hardLinkStatus == 'directory' ]]; then
        #   printf "${Green}Looks like a good symlink${Off}\n"
        # fi
######  SORT OF WORKS BUT WEIRD ########


# Symlink Directory
# IPORTANT NOTE!
#   You cannot actually symlink a directory in multiple places,
#   but you can symlink files in multiple places.  This
#   symlinks all the files in the directory specified. If you
#   add or remove files from within the `hardlink` (aka where
#   the original file is), you will need to re-run this command
#   on the specified directory.
#   Current: ignore .git (eventually add feature to ingore whatever)
#   Reference: http://bit.ly/1CXf6gp
# Usage:
#   lnd /path/to/hardlink
#   lnd     (would just run on current directory)
# function lnd() { # TODO: make work
  # recursively traverse the directory specified and list only the symbolic links
  # ls-lR "specifiedDirectory" | ag ^l
  # SUDO CODE
  # for each hardLink in arg1HardLinkDir
    # softLink = file.getSoftLink()
    # remove softlink
    # create new symlink
    # ln -s $hardlink $softlink
  # DIR="$1"
  # IFS=$'\n'; # if filename contains a space  (note, it won't work if there's a `return` in the filename
  # for f in $(find "$DIR" -name '*.pdf' -or -name '*.doc'); do
  #   rm $f;
  # done
  # rm -f images_all/*
  # for i in images_[abc]/* ; do; ln -s $i images_all/$(basename $i) ; done
# }

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










        #
        #
        #
        # # Neither Hard nor Soft Link Exist
        # if [[ $softLinkStatus == 'broken_symlink' && $hardLinkStatus == 'doesnt_exist' ]] ||
        #    [[ $softLinkStatus == 'doesnt_exist' && $hardLinkStatus == 'doesnt_exist' ]]; then
        #
        #   printf "${Red}BAD HARD:${Off} $(basename "$hardLink")\n"
        #   printf "${Red}BAD SOFT:${Off} $(basename "$softLink")\n"
        #   printf "${Yellow}CREATED AND SYMLINKED${Off} $(basename "$hardLink")\n"
        #   # touch $hardLink
        #   # ln -s $hardLink $softLink
        #
        # # No Soft Link
        # # - symlink exists, but is broken
        # #   - action: remove symlink, then create new one
        # # - file exists but is not a symlink,
        # #   - action: check if it has been modified more recently than the hard link
        # #   - action: true: mv hardLink to backup, mv softLink to hardLink location, create new symlink
        # #   - action: false: mv file to backup, create new symlink
        # # - no symlink OR file
        # #   - action: create new symlink
        # elif [[ $softLinkStatus ==  'broken_symlink' && -e $hardLink ]]; then
        #
        #   # TODO: this is where you would put the diffing
        #   printf "${Red}BAD SOFT:${Off} $(basename "$softLink")\n"
        #   printf "${Yellow}FIXING:${Off} $(basename "$softLink")\n"
        #   # ln -s $hardLink $softLink
        #
        # # No Hard Link
        # elif [[ -e $softLink ]] && [[ ! -e $hardLink ]]; then
        #
        #   # TODO: this is where you would put the diffing
        #   printf "${Red}BAD HARD:${Off} $(basename "$hardLink")\n"
        #   printf "${Yellow}FIXING:${Off} $(basename "$hardLink")\n"
        #   # hardLinkPath="${hardLink%/*}/"
        #   # mv $softLink $hardLinkPath
        #   # ln -s $hardLink $softLink
        #
        # # Both Hard & Soft Links ✔
        # elif [[ -e $softLink ]] && [[ -e $hardLink ]]; then
        #
        #   printf "${Green}GOOD:${Off} $(basename "$hardLink")\n"
        #
        # fi



        # if [[ $hardLinkStatus == 'directory_symlink' && $softLinkStatus == 'directory' ]]; then
        #
        #   printf "${Red}Hard Link = directory symlink, Softlink = directory${Off} $(basename "$hardLink")\n"
        #   # printf "${Red}BAD HARD:${Off} $(basename "$hardLink")\n"
        #   rm "$hardLink"
        #   mv "$softLink" "$hardLink"
        #   ln -s "$hardLink" "$softLink"
        #   printf "${Yellow}FIXED:${Off} $(basename "$softLink")\n"
        #
        # elif [[ $hardLinkStatus == 'file' && $softLinkStatus == 'file_symlink' ]] || [[ $hardLinkStatus == 'directory' && $softLinkStatus == 'directory_symlink' ]]; then
        #
        #   printf "${Green}GOOD:${Off} $(basename "$hardLink")\n"
        #
        # # No Hard Link or Soft Link
        # #   - Hard Link Doesn't exist & Soft Link Doesn't Exist
        # elif [[ $softLinkStatus == 'file' && $hardLinkStatus == 'file' ]] || [[ $softLinkStatus == 'directory' && $hardLinkStatus == 'directory' ]]; then
        #
        #   if [[ $softLink -nt $hardLink ]]; then
        #
        #     # Soft Last Modified
        #     printf "${Red}Soft Is Last Modified:${Off} $softLink\n"
        #     # printf "${Red}BAD HARD:${Off} $(basename "$softLink")\n"
        #     cp "$hardLink" "$HOME/.dotfiles/backup"
        #     rm "$hardLink"
        #     mv "$softLink" "$hardLink"
        #     ln -s "$hardLink" "$softLink"
        #     printf "${Yellow}FIXED:${Off} $(basename "$softLink")\n"
        #
        #   else
        #
        #     # Hard Last Modified
        #     # printf "${Red}BAD SOFT:${Off} $(basename "$hardLink")\n"
        #     printf "${Red}Hard Is Last Modified:${Off} $softLink\n"
        #     mv "$softLink" "$HOME/.dotfiles/backup"
        #     ln -s "$hardLink" "$softLink"
        #     printf "${Yellow}FIXED:${Off} $(basename "$softLink")\n"
