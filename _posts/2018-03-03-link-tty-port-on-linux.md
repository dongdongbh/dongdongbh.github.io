---
title: "link tty port on linux"
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
### How to link node name with a custom name
1. run next cmd to see the port device 
```
$ udevadm info -a -n /dev/ttyUSB0  $(udevadm info -q path -n /dev/ttyUSB0)
```
2. Then open (or create) a file in /etc/udev/rules.d/ (named, for example, serial-symlinks.rules), and put the udev rule there.
```
$ sudo subl /etc/udev/rules.d/serial-symlinks.rules
```
3. ...you can write this rule:
>ACTION=="add", ATTRS{idVendor}=="0403", ATTRS{idProduct}=="6001", SYMLINK+="tty-xxx"    //some attrs to lock specific USB device

then your ttyUSB0 can using the new name "tty-xxx"

4. and restart udev using
```
$ sudo service udev restart
```


###so the step as follows:
```
$ udevadm info -a -n /dev/ttyUSB0
$ sudo subl /etc/udev/rules.d/serial-symlinks.rules
```
modify the file
```
$ sudo service udev restart
```
using following cmd check it
```
$ ls /dev/tty*
```
