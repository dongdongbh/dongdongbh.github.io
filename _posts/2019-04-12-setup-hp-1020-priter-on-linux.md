---
title: "Set up HP laserjet 1020 printer on linux"
classes: wide
sitemap: true
header:
  teaser: "assets/images/markup-syntax-highlighting-teaser.jpg"
categories:
  - Resource
tags:
  - tutorial
toc: true
toc_label: "Table of Contents"
description: hp laserjet 1020 plugin problem
---

## Set up HP laserjet 1020 printer on linux

### Background

most Linux distributions has printer driver by default, for HP, it is  HPLIB, but there an addition plugin which is close source needed for this 1020 printer, when installing this plug-in, I counter some problems, and I will describe it later.

### Problem

print error

`hp laserjet 1020, hpcups 3.17.10, requires proprietary plugin`

### Solution 1 hpip

1. install hplip

`sudo apt-get install hplip hplip-gui`

2. refer [this](<https://developers.hp.com/hp-linux-imaging-and-printing/binary_plugin.html>) to install plugin:
   1. connect the printer and type command `  hp-plugin` 
   2. follow GUI and automatically download the plugin, **but** there is a 404 problem for me, many be caused by my network(I am in China, LOL). so you need manually download the plugin and install it.
   3. you can manually download xxx.plugin file [here](<https://www.openprinting.org/download/printdriver/auxfiles/HP/plugins/>), and load it from local file to HPLIB by `hp-plugin` command.
   4. enjoy it!

### Solution 2 foo2zjs

`foo2zjs` is an open source laib for printer, and it work well on HP 1020.

1. remove HPLIB`sudo apt-get remove --assume-yes hplip hpijs hplip-cups hplip-data libhpmud0 foomatic-db-hpijs `

2. make install foo2zjsby 
   ```
   sudo apt-get install cupsys-bsd foo2zjs make build-essential
   wget http://support.ideainformatica.com/hplj1020/foo2zjs-patched.tar.gz
   tar zxvf foo2zjs-patched.tar.gz
   cd foo2zjs
   make
   sudo make install
   sudo make install-udev
   sudo udevstart
   ```

3. plug the printer and run `sudo /etc/init.d/cupsys restart`

4. to make plain (lpr) text print nicely, run 

    ```
    sudo lpoptions -o cpi-12 -o lpi=7 -o page-left=36 -o page-right=36 -o page-top=36 -o page-bottom=36
    ```

5. open system printer manager and set up HP printer model as foo2zji by changing the model form `foo2zjs/ppd`  and select the `xxx.ppd` for your printer.

6. if there any problem, you many modify the ppd file manually, e.g. change the Default page size to A4 from "Letter"

   `sudo gedit xxx/ppd/LaserJet-1020.ppd`

7. enjoy it!