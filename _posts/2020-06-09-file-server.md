---
title: "set up file server on vps by nginx"
classes: wide
sitemap: true
categories:
  - Blog
tags:
  - content
  - tutorial
toc: true
toc_label: "Table of Contents"
description: set up web file server, h5ai, Aria2 with nginx on debian 9 VPS.
---

## Background

set up web file server, h5ai, Aria2 with nginx on debian 9.

## How to

### basic setting

in `/etc/nginx/sites-enabled/default` add

```
server {			# my file server
	listen xxxx; 	# your file server port
	server_name localhost;
	root /home/bh/share;

	location / {
			autoindex on; # index 
    		autoindex_exact_size on; # file size 
    		autoindex_localtime on; # filetime 
  	}
	
}
```

then `sudo service nginx restart`, and visit your file system on `youdomian.com:xxx`

### with _h5ai

**[h5ai](<https://larsjung.de/h5ai/>)** is a modern file indexer for HTTP web servers with focus on your files.

1. install php, check by `php -v` 

2. in `/etc/nginx/sites-enabled/default`  change to

   check `fastcgi_pass` in `/etc/php5/fpm/pool.d/www.conf`

   ```
   server {			# my file server
   	listen xxxx; 	# your file server port
   	server_name localhost;
   	root /home/bh/share;
   	index index.html /_h5ai/public/index.php;
   	
   	location ~ \.php$ {
       		fastcgi_pass	unix:/run/php/php7.4-fpm.sock;
   			include         fastcgi_params;
       		fastcgi_param   SCRIPT_FILENAME    $document_root$fastcgi_script_name;
       		fastcgi_param   SCRIPT_NAME        $fastcgi_script_name;
   	}
   }
   ```

3. add you can also add your ssl to this server

#### add password to folder

1. add password to your folder, use `httpd-tools`, you can install it by `sudo apt install apache2-utils`,  

create password, the name is the user name for password.

```
htpasswd -c /etc/nginx/passwd name
```

2. add config to `/etc/nginx/sites-enabled/default`

```
location /private {
                autoindex on;
                autoindex_exact_size off;
                autoindex_localtime on;
                auth_basic "Please input passward:";
                auth_basic_user_file /etc/nginx/passwd;
        }
```

3. `sudo service nginx restart`
4. enjoy!

with this server, you can host a git server on cloud, and auto clone you repository to you file web. 

#### Download and upload

If you want to build you own cloud driver, Seafile, Kodexplorer, owncloud, nextlcoud are good choices.

You can build a **ftp** (e.g. vsftpd, sftp) for file upload and download. By doing so, you can download and upload your files by ftp, and view it on nginx hosted web.

If you want to use nginx it self, it can be done by [this](<https://www.yanxurui.cc/posts/server/2017-03-21-NGINX-as-a-file-server/>). or refer [here](<https://www.yanxurui.cc/posts/server/2017-03-21-NGINX-as-a-file-server/>). It done by *nginx_upload_module*.

**Aria2** is a good offline download tool, and it enables you use AriaNG  manage your download processes on web. After you download the video files, you can view it on h5ai.

For cloud, I tried Seafile, but is hard to install on Debian and unstable for my server, I try it  with scrip, manually install and docker, all failed or unstable. Finally, I installed owncloud with docker, and succeeded. 

and from my experience, I think [Nextlcoud](<https://nextcloud.com/>) is a better choice.

and after set up docker, you can set up ssl on nginx by add server:

```
server {
        listen 8082 ssl;
        listen [::]:8082 ssl;
        server_name  dongdongbh.tech;
        
        location / {
        	proxy_pass   http://127.0.0.1:8080;
            proxy_set_header X-Forwarded-For $remote_addr;
            proxy_set_header Host            $http_host;
            
            client_max_body_size    10000m;
		}
```

#### local development

For local developer, I recommend you use samba server, sshfs,  nfs and mount it to local. 

samba is used for the connection between linux and window, if you use two linuxs, just use NFS.

This avoid many *scp* operations.

for ssfs

```
sshfs  user@192.168.1.200:/home/user/share home/user/remote
```

unmount by 

```
sudo umount mountpoint
```

### Aria2+AriaNG+Nginx

ref [this](<https://gist.github.com/GAS85/79849bfd09613067a2ac0c1a711120a6>).

#### Install Aria2

```
sudo apt-get install aria2
```

#### set up aria2

```
mkdir ~/.aria2
touch ~/.aria2/aria2.conf
```

add

```
dir=/home/user_name/aria2/download

file-allocation=trunc
continue=true
daemon=true

disk-cache=32M
file-allocation=none
continue=true
max-concurrent-downloads=10
max-connection-per-server=5
min-split-size=10M
split=20
disable-ipv6=true
input-file=/home/bh/.aria2/aria2.session
save-session=/home/bh/.aria2/aria2.session

enable-rpc=true
rpc-allow-origin-all=true
rpc-listen-all=true
rpc-listen-port=6800
rpc-secret=<your password for rpc>

rpc-certificate=/etc/letsencrypt/live/dongdongbh.tech/fullchain.pem
rpc-private-key=/etc/letsencrypt/live/dongdongbh.tech/privkey.pem
rpc-secure=true

follow-torrent=true
listen-port=6881-6999
enable-dht=true
enable-peer-exchange=true
peer-id-prefix=-TR2770-
user-agent=Transmission/2.77
seed-ratio=0.1
bt-seed-unverified=true
bt-save-metadata=false
```

add ssl

first <u>check</u> permission, replace the `user` with your user name

```
sudo -u user ls -la /etc/letsencrypt/live/YourDomain/privkey.pem
```

and follow to `aria2.conf`

```
rpc-certificate=/etc/letsencrypt/live/YourDomain/fullchain.pem
rpc-private-key=/etc/letsencrypt/live/YourDomain/privkey.pem
rpc-secure=true
```

run 

```
sudo aria2c --conf-path="/home/user_name/.aria2/aria2.conf"
```

#### AriaNG 

download on [github](<https://github.com/mayswind/AriaNg/releases>), down load in `/home/user/aria2/AriaNG`.

#### Nginx

in `/etc/nginx/sites-available` add file `aria.conf`, link by 

```
sudo ln -s /etc/nginx/sites-available/aria.conf /etc/nginx/sites-enabled/aria.conf
```

then edit `aria.conf`

```
server {
	
	listen 80;		# you can use cunstom port
	listen [::]:80;

	server_name dongdongbh.tech;

	index index.html index.htm index.nginx-debian.html;

	gzip on;

	location / {
		root /home/user/aria2/AriaNG;
	}

}

```

```
sudo service nginx restart
```

Then you can visit it by `ip:port`, and you can also add ssl to Nginx config.

In AriaNG web, go `AriaNg Setting->RPC tab`, setup RPC



After finished all of this, I found that the server downloading is really fast, but it's very slow for me to download files from server. So i thinks this things are useless, but it's good to know how to do it. lol.