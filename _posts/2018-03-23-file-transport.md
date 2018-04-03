---
title: "Transfer files over a LAN between two Linux computers"
sitemap: true
header:
  teaser: "assets/images/markup-syntax-highlighting-teaser.jpg"
categories:
  - Markup
tags:
  - content
  - tutorial
toc: true
---

## netcat + tar (fast but not secure)
To send a directory, cd to inside the directory whose contents you want to send on the computer doing the sending and do:

`$ tar -cz . | nc -q 10 -l -p 45454`

On the computer receiving the contents, cd to where you want the contents to appear and do:

`$ nc -w 10 $REMOTE_HOST 45454 | tar -xz`

Replace `$REMOTE_HOST` with `ip / hostname` of computer doing the sending. You can also use a different port instead of 45454.

## Copying Files with SSH
cmd: 
```
$ scp <file> <username>@<IP address or hostname>:<Destination>
$ scp -r (recursive) username@server:(remote location) (local location)
$ scp -r (local location) username@server:(remote location)
```
