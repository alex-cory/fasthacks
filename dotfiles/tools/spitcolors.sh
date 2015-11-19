#!/bin/sh
# Filename: spitcolors.sh

# function clrs() {
#   echo
#   echo "reg  bld  und  bckg hi-int bld-hi-int bg-hi-int"
#   echo "${Black}Text ${BBlack}Text ${UBlack}Text${Off} ${On_Black}Text${Off} ${IBlack}Text   ${BIBlack}Text       ${On_IBlack}Text${Off}"
#   echo "${Red}Text ${BRed}Text ${URed}Text${Off} ${On_Red}Text${Off} ${IRed}Text   ${BIRed}Text       ${On_IRed}Text${Off}"
#   echo "${Green}Text ${BGreen}Text ${UGreen}Text${Off} ${On_Green}Text${Off} ${IGreen}Text   ${BIGreen}Text       ${On_IGreen}Text${Off}"
#   echo "${Yellow}Text ${BYellow}Text ${UYellow}Text${Off} ${On_Yellow}Text${Off} ${IYellow}Text   ${BIYellow}Text       ${On_IYellow}Text${Off}"
#   echo "${Blue}Text ${BBlue}Text ${UBlue}Text${Off} ${On_Blue}Text${Off} ${IBlue}Text   ${BIBlue}Text       ${On_IGreen}Text${Off}"
#   echo "${Purple}Text ${BPurple}Text ${UPurple}Text${Off} ${On_Purple}Text${Off} ${IPurple}Text   ${BIPurple}Text       ${On_IPurple}Text${Off}"
#   echo "${Cyan}Text ${BCyan}Text ${UCyan}Text${Off} ${On_Cyan}Text${Off} ${ICyan}Text   ${BICyan}Text       ${On_ICyan}Text${Off}"
#   echo "${White}Text ${BWhite}Text ${UWhite}Text${Off} ${On_White}Text${Off} ${IWhite}Text   ${BIWhite}Text       ${On_IWhite}Text${Off}"
#   echo
# }

# Color Variables
function clrs() {
  echo
  echo "regular   bold       underline  background   hi intensity bold hi intensity  background hi intensity"
  echo "${Black}\${Black}  ${BBlack}\${BBlack}  ${UBlack}\${UBlack}${Off}  ${On_Black}\${On_Black}${Off}  ${IBlack}\${IBlack}    ${BIBlack}\${BIBlack}         ${On_IBlack}\${On_IBlack}${Off}"
  echo "${Red}\${Red}    ${BRed}\${BRed}    ${URed}\${URed}${Off}    ${On_Red}\${On_Red}${Off}    ${IRed}\${IRed}      ${BIRed}\${BIRed}           ${On_IRed}\${On_IRed}${Off}"
  echo "${Green}\${Green}  ${BGreen}\${BGreen}  ${UGreen}\${UGreen}${Off}  ${On_Green}\${On_Green}${Off}  ${IGreen}\${IGreen}    ${BIGreen}\${BIGreen}         ${On_IGreen}\${On_IGreen}${Off}"
  echo "${Yellow}\${Yellow} ${BYellow}\${BYellow} ${UYellow}\${UYellow}${Off} ${On_Yellow}\${On_Yellow}${Off} ${IYellow}\${IYellow}   ${BIYellow}\${BIYellow}        ${On_IYellow}\${On_IYellow}${Off}"
  echo "${Blue}\${Blue}   ${BBlue}\${BBlue}   ${UBlue}\${UBlue}${Off}   ${On_Blue}\${On_Blue}${Off}   ${IBlue}\${IBlue}     ${BIBlue}\${BIBlue}          ${On_IBlue}\${On_IBlue}${Off}"
  echo "${Purple}\${Purple} ${BPurple}\${BPurple} ${UPurple}\${UPurple}${Off} ${On_Purple}\${On_Purple}${Off} ${IPurple}\${IPurple}   ${BIPurple}\${BIPurple}        ${On_IPurple}\${On_IPurple}${Off}"
  echo "${Cyan}\${Cyan}   ${BCyan}\${BCyan}   ${UCyan}\${UCyan}${Off}   ${On_Cyan}\${On_Cyan}${Off}   ${ICyan}\${ICyan}     ${BICyan}\${BICyan}          ${On_ICyan}\${On_ICyan}${Off}"
  echo "${White}\${White}  ${BWhite}\${BWhite}  ${UWhite}\${UWhite}${Off}  ${On_White}\${On_White}${Off}  ${IWhite}\${IWhite}    ${BIWhite}\${BIWhite}         ${On_IWhite}\${On_IWhite}${Off}"
  echo
}

function colors_help() {
  echo
  echo "regular   bold       underline  background   hi intensity bold hi intensity  background hi intensity"
  echo "${Black}\${Black}  ${BBlack}\${BBlack}  ${UBlack}\${UBlack}${Off}  ${On_Black}\${On_Black}${Off}  ${IBlack}\${IBlack}    ${BIBlack}\${BIBlack}         ${On_IBlack}\${On_IBlack}${Off}"
  echo "${Red}\${Red}    ${BRed}\${BRed}    ${URed}\${URed}${Off}    ${On_Red}\${On_Red}${Off}    ${IRed}\${IRed}      ${BIRed}\${BIRed}           ${On_IRed}\${On_IRed}${Off}"
  echo "${Green}\${Green}  ${BGreen}\${BGreen}  ${UGreen}\${UGreen}${Off}  ${On_Green}\${On_Green}${Off}  ${IGreen}\${IGreen}    ${BIGreen}\${BIGreen}         ${On_IGreen}\${On_IGreen}${Off}"
  echo "${Yellow}\${Yellow} ${BYellow}\${BYellow} ${UYellow}\${UYellow}${Off} ${On_Yellow}\${On_Yellow}${Off} ${IYellow}\${IYellow}   ${BIYellow}\${BIYellow}        ${On_IYellow}\${On_IYellow}${Off}"
  echo "${Blue}\${Blue}   ${BBlue}\${BBlue}   ${UBlue}\${UBlue}${Off}   ${On_Blue}\${On_Blue}${Off}   ${IBlue}\${IBlue}     ${BIBlue}\${BIBlue}          ${On_IBlue}\${On_IBlue}${Off}"
  echo "${Purple}\${Purple} ${BPurple}\${BPurple} ${UPurple}\${UPurple}${Off} ${On_Purple}\${On_Purple}${Off} ${IPurple}\${IPurple}   ${BIPurple}\${BIPurple}        ${On_IPurple}\${On_IPurple}${Off}"
  echo "${Cyan}\${Cyan}   ${BCyan}\${BCyan}   ${UCyan}\${UCyan}${Off}   ${On_Cyan}\${On_Cyan}${Off}   ${ICyan}\${ICyan}     ${BICyan}\${BICyan}          ${On_ICyan}\${On_ICyan}${Off}"
  echo "${White}\${White}  ${BWhite}\${BWhite}  ${UWhite}\${UWhite}${Off}  ${On_White}\${On_White}${Off}  ${IWhite}\${IWhite}    ${BIWhite}\${BIWhite}         ${On_IWhite}\${On_IWhite}${Off}"
  echo
  echo "${White}Example Alias in .bashrc, .bash_profile, etc.${Off}"
  echo 'alias bam="echo \"${Red}Woah, ${Green}this ${Blue}is ${Yellow}pretty ${Purple}damn ${Cyan}cool! \""'
  echo
  echo "${White}Example Usage:${Off}"
  echo "❯ ls"
  echo "Applications Desktop"
  echo "❯ bam"
  echo "${Red}Woah, ${Green}this ${Blue}is ${Yellow}pretty ${Purple}damn ${Cyan}cool!"
  echo
}
# function colors() {
#   cd "$DOT_PATH"/bash; mvim
# }

# function tputcolors() {
#   echo
#   echo -e "$(tput bold) reg  bld  und   tput-command-colors$(tput sgr0)"
#
#   for i in $(seq 1 7); do
#     echo " $(tput setaf $i)Text$(tput sgr0) $(tput bold)$(tput setaf $i)Text$(tput sgr0) $(tput sgr 0 1)$(tput setaf $i)Text$(tput sgr0)  \$(tput setaf $i)"
#   done
#
#   echo ' Bold            $(tput bold)'
#   echo ' Underline       $(tput sgr 0 1)'
#   echo ' Reset           $(tput sgr0)'
#   echo
# }
