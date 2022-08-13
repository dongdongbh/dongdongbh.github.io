---
title: "Expose Intranet machine to outside by frp"
classes: wide
sitemap: true
categories:
  - Blog
tags:
  - content
  - tutorial
toc: true
toc_label: "Table of Contents"
description: Expose Intranet machine to outside
---

## Background

**condition**: you have a Intranet machine(mabe the machine is in your company), and it do not have a pubic IP, and you want to visit your machine at your home or anywhere can connect Internet. Or you may want to host your website on your local machine.

**requirements**: you need have a server with a public IP.

**Howto**:

There are many tools to do that, e.g. frp, [ngrok](<https://ngrok.com/>), nps, Zerotier. Here, we use a open source named [frp](<https://github.com/fatedier/frp>),   your can choose the version of your operate system and download it from [Github repo](https://github.com/fatedier/frp/releases).

and we just describe the bash ssh function, more functions you can refer frp Readme file

## SSH Usage

Put **frps** and **frps.ini** to your server with public IP.

Put **frpc** and **frpc.ini** to your server in LAN.

### Access your computer in LAN by SSH

1. Modify frps.ini:

```
# frps.ini
[common]
bind_port = 7000
```

1. Start frps on background:

```
nohup ./frps -c ./frps.ini > /dev/null 2>&1 &
```

1. Modify frpc.ini, `server_addr` is your frps's server IP:

```
# frpc.ini
[common]
server_addr = x.x.x.x
server_port = 7000

[ssh]
type = tcp
local_ip = 127.0.0.1
local_port = 22
remote_port = 6000
```

1. Start frpc:

```
./frpc -c ./frpc.ini
```

1. Connect to server in LAN by ssh assuming that username is test:

```
ssh -oPort=6000 test@x.x.x.x
```

**Notice**: 

* you must open your port used in frs( eg. 7000,6000) on your server, usually it is on the setting of firewall rules.
* Every client need one **remote_port** to map.

and if you want to visit Jupyter notebook and tensorboard, you only need to add a new port to frpc, and then visit https://x.x.x.x:port

## ssh on your mobile phone

here we just describe the method on IOS. we use a software named Termius, the basic ssh function of it is free.

1. open the Termius
2. Hosts—>add new—->input you remote ip, ssh username, password and save it
3. just connect the host

if you'd like to use ssh on Termius,  

1. open the Termius
2. Keychain—>add key(or use existed one)
3. edit it and copy the public key 
4. append the Termius public key  to your server's `~/.ssh/authorized_keys` file
5. on Termius, edit your host and add the key your created in Keychain ,and then save it
6. connect server and enjoy it!

