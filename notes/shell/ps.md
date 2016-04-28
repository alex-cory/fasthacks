ps
===
Display processes running in the current shell.

#### Commands:
```sh
ps -e    # display running daemons
ps -f    # display processes with full options
ps -l    # list more information on processes
ps -ef   # display all processes and daemons running on ttys (aka: the terminal)
ps a     # list all processes that run on terminals
ps x     # list all processes that do not run on terminals
ps aux   # list all processes running on or off terminals and format the results with additional info
```

#### Field Definitions:
```sh
UID      # user ID
PID      # process ID
PPID     # parent process ID
C        # CPU utilization
STIME    # time started
TTY      # terminal process is running on
TIME     # time process has taken on CPU
CMD      # the command, program, or process
F        # flag (ex: 4 = root user)
S        # Process State (S = sleeping, R = running, Z = zombie, T = traced)
PRI      # Process priority (0 = highest, 127 = lowest)
NI       # nice value (-20 = highest, 19 = lowest)
ADDR     # process memory address
SZ       # size of process in memory
WCHAN    # what process is waiting for while sleeping

```

#### Videos
 - [Process Control 1 - The ps Command](https://www.youtube.com/watch?v=B2ly0I4Uz7o)
