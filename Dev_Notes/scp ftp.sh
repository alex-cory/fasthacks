## FTP & SCP & RSYNC in Bash

rsync -avz local_directory/ alexcory@74.220.215.206:/path/to/remote_directory


### SCP
#   use scp (secure copy) when the remote host supports ssh (as so many of them do).

scp -r local_directory/* username@74.212.212.222:/absolute/path/to/remote_directory


# The -r means "recursive" so it will recursively copy the entire directory.
# Replace username with your username, etc., etc.  destdir is a relative path on
# the remote server (whatever directory you wind up in if you log in) as long as
# you don't use a leading slash / -- then it will be an absolute path.







### FTP 		(my live example)

## IN SHORT
terminal>cd <local dir>
terminal>ftp user@host
password:xXxXx
ftp>
ftp>cd <remote dir>
ftp>
ftp>mput *
ftp>
ftp>close


## MY EXAMPLE
~❯ htdocs 														# Navigate to the Local file Directory
/Applications/MAMP/htdocs❯ techtalksfsu

..ons/MAMP/htdocs/techtalksfsu❯ ftp alexcory@74.220.215.206 	# Run the `ftp username@domain.com`  OR `ftp username@74.220.215.206`
Connected to 74.220.215.206. 									# 										  (but w/ your port #)
220---------- Welcome to Pure-FTPd [privsep] [TLS] ----------
220-You are user number 101 of 1000 allowed.
220-Local time is now 21:45. Server port: 21.
220-This is a private system - No anonymous login
220-IPv6 connections are also welcome on this server.
220 You will be disconnected after 15 minutes of inactivity.
331 User alexcory OK. Password required
Password: 														# Type in your password
ftp> cd /public_html/techtalksfsu 								# Navigate to the correct Remote File Directory
ftp> ..ml/techtalksfsu
ftp>
ftp> mput * 													# This command will FTP All the Contents of the Local Directory into the
ftp> 															# the Remote Directory
ftp> close



# ===================
# My Specific Example


~❯ github
..e/Developer/git repositories❯ scp -r googlesfsu alexcory@74.220.215.206:/home2/alexcory/public_html/googlesfsu
alexcory@74.220.215.206s password:
bootstrap-responsive.min.css                                                                                                                    100%   16KB  16.5KB/s   00:00
bootstrap.min.css                                                                                                                               100%  107KB 107.0KB/s   00:00
bootstrap.min.js                                                                                                                                100%   28KB  28.0KB/s   00:00
index.html                                                                                                                                      100%   10KB  10.2KB/s   00:00
main.css                                                                                                                                        100% 6645     6.5KB/s   00:00
main.js                                                                                                                                         100%    1     0.0KB/s   00:00
variables.less

# OR
..e/Developer/git repositories❯ ssh 74.220.215.206
alexcory@74.220.215.206s password:
Last login: Fri Apr 18 14:33:35 2014 from c-50-143-144-65.hsd1.ca.comcast.net
alexcory@alexcory.com [~]#

# which will just take you into the server

##### Tags: sftp in terminal ftp in command line iterm
##### Links: (http://goo.gl/xJ2AZt)