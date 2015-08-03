#!/bin/sh
exec <"$0" || exit; read v; read v; exec /usr/bin/osascript - "$@"; exit

-- the above is some shell trickery that lets us write the rest of
-- the file in plain applescript

# CURRENTLY WORKS
tell application "Google Chrome" to reload active tab of window 1

# CURRENTLY WORKS TOO
# tell application "Google Chrome"
#     reload active tab of window 1
# end tell

# BELOW DOESN'T WORK FOR ME
# tell application "Google Chrome"
#   activate
#   tell application "System Events"
#     tell process "Google Chrome"
#       keystroke "r" using {command down, shift down}
#     end tell
#   end tell
# end tell
