### SFTP Example
```
..ogleDrive/_Server_/Developer❯ sftp -P 2325 james@ssh.hackingedu.co
james@ssh.hackingedu.co's password:
Connected to ssh.hackingedu.co.
ftp> pwd
Remote working directory: /gpfs/home/jwh128
sftp> lpwd
Local working directory: /home/jwh128
sftp> cd work/depot
sftp> pwd
Remote working directory: /gpfs/work/jwh128/depot
sftp> lcd results
sftp> lpwd
Local working directory: /home/jwh128/results
sftp> ls -l
-rw-r--r--    1 root     root            5 Mar  3 12:08 dump
sftp> lls -l
total 0
sftp> get dump
Fetching /gpfs/work/jwh128/depot/dump to dump
/gpfs/work/jwh128/depot/dump        100%    5     0.0KB/s   0.0KB/s   00:00    
sftp> lls -l
total 4
-rw-r--r-- 1 jwh128 jwh128 5 Mar  3 12:09 dump
sftp>
```
