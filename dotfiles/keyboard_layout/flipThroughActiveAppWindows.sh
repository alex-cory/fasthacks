#!/bin/sh
exec <"$0" || exit; read v; read v; exec /usr/bin/osascript - "$@"; exit

-- the above is some shell trickery that lets us write the rest of
-- the file in plain applescript

# tell application "System Events"
#     set theProcesses to application processes
#     repeat with theProcess from 1 to count theProcesses
#         tell process theProcess
#             repeat with x from 1 to (count windows)
#                 set windowPosition to position of window x
#                 set windowSize to size of window x
#                 set position of window x to {0, 0}
#                 set size of window  to {100, 100}
#             end repeat
#         end tell
#     end repeat
# end tell

# set AccesEnables to do shell script "[ -e \"/private/var/db/.AccessibilityAPIEnabled\" ] && echo \"Yes\" || echo \"No\""
# if (AccesEnables is equal to "No") then
#     set askUser to display dialog "This application requires access for assistive devices. Enable this feature?" default button 2
#     set answer to button returned of askUser
#     if answer is equal to "OK" then
#         do shell script "touch /private/var/db/.AccessibilityAPIEnabled" with administrator privileges
#     else
#         close
#     end if
# end if

tell application "System Events"
    keystroke "`" using {command down}
end tell
