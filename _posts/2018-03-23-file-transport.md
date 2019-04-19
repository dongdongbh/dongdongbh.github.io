---
title: "Transfer files between two computers"
sitemap: true
header:
  teaser: "assets/images/markup-syntax-highlighting-teaser.jpg"
categories:
  - Markup
tags:
  - content
  - tutorial
toc: true
description: Transfer files over a LAN between two computers
---

## Linux-Linux

### netcat + tar (fast but less secure)

To send a directory, cd to inside the directory whose contents you want to send on the computer doing the sending and do:

`$ tar -cz . | nc -q 10 -l -p 45454`

On the computer receiving the contents, cd to where you want the contents to appear and do:

`$ nc -w 10 $REMOTE_HOST 45454 | tar -xz`

Replace `$REMOTE_HOST` with `ip / hostname` of computer doing the sending. You can also use a different port instead of 45454.

### Copying Files with SCP
cmd: 
```
$ scp <file> <username>@<IP address or hostname>:<Destination>
$ scp -r (recursive) username@server:(remote location) (local location)
$ scp -r (local location) username@server:(remote location)
```

### Using sshfs (NFS)

install

```bash
sudo apt-get install sshfs
```

##### Mounting the Remote File System

format: `sshfs -o transform_symlinks -ofollow_symlinks  user@hostname: [dir]mountpoint`. e.g. :


```bash
sshfs –o cache=yes,allow_other user@192.168.1.200:/home/user/code home/user/code
```

for detail, ref  `man sshfs`

##### unmount

```
sudo umount mountpoint
```

## Windows-Linux

### samba server

samba is very convenient tool for sharing files between win-Linux, just like NFS.

##### How to set up

refer [this tutorial](<https://tutorials.ubuntu.com/tutorial/install-and-configure-samba#0>)

basically, 

```bash
sudo apt update
sudo apt install samba

mkdir /home/<username>/sambashare/

sudo vim /etc/samba/smb.conf
```

add follow in smb.conf

> ```
> [sambashare]   # the name show on remote
>     comment = Samba on Ubuntu
>     path = /home/username/sambashare
>     read only = no
>     browsable = yes
> ```

restart samba

```
sudo service smbd restart
```

add user to samba and set passward, Username used must belong to a system account, else it won't save.

```
sudo smbpasswd -a username
```

On Windows, open up File Manager and edit the file path to:

```
\\ip-address\sambashare
```

