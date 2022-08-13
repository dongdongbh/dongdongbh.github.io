---
title: "Set up file server on vps by nginx"
classes: wide
sitemap: true
categories:
  - Blog
tags:
  - content
  - tutorial
toc: true
toc_label: "Table of Contents"
description: Set up web file server, h5ai, Aria2 with nginx on debian VPS.
---

## Background

Set up web file server, [h5ai](<https://larsjung.de/h5ai/>), [Aria2](https://aria2.github.io/) with nginx on debian 9.

## How to

### Basic setting

In `/etc/nginx/sites-enabled/default` add

```yaml
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

Then `sudo service reload nginx`, and visit your file system on `youdomian.com:xxx`

### With _h5ai

**[h5ai](<https://larsjung.de/h5ai/>)** is a modern file indexer for HTTP web servers with focus on your files.

1. Install php, check by `php -v` 

2. In `/etc/nginx/sites-enabled/default`  change to

   Check `fastcgi_pass` in `/etc/php5/fpm/pool.d/www.conf`

   ```yaml
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

3. And you can also add your ssl to this server

#### Add password to folder

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

3. `sudo service reload nginx`
4. enjoy!

with this server, you can host a git server on cloud, and auto clone you repository to you file web. 

#### Download and upload

If you want to build you own **cloud server**, Seafile, Kodexplorer, owncloud, nextlcoud are good choices.

You can build a **ftp** (e.g. vsftpd, sftp) for file upload and download. By doing so, you can download and upload your files by ftp, and view it on nginx hosted web.

If you want to use **nginx** it self, it can be done by [this](<https://www.yanxurui.cc/posts/server/2017-03-21-NGINX-as-a-file-server/>). or refer [here](<https://www.yanxurui.cc/posts/server/2017-03-21-NGINX-as-a-file-server/>). It done by `nginx_upload_module`.

**Aria2** is a good offline download tool, and it enables you use [AriaNG](https://github.com/mayswind/AriaNg) front-end to  manage your download processes on web. After you download the video files, you can view it on [h5ai](https://github.com/lrsjng/h5ai).

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

#### Local development

For local developer, I recommend you use `samba` server, `sshfs`,  `nf`s and mount it to local. 

samba is used for the connection between linux and window, if you use two linuxs, just use NFS.

This avoid many *scp* operations.

for ssfs

```bash
sshfs  user@192.168.1.200:/home/user/share home/user/remote
```

unmount by 

```bash
sudo umount mountpoint
```

### Aria2+AriaNG+Nginx

some of this part are referred from [this post](<https://gist.github.com/GAS85/79849bfd09613067a2ac0c1a711120a6>).

#### Install Aria2

```bash
sudo apt-get install aria2
```

#### Set up aria2

```bash
mkdir ~/.aria2
vim ~/.aria2/aria2.conf
```

add

```yaml
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
input-file=/home/user_name/.aria2/aria2.session
save-session=/home/user_name/.aria2/aria2.session

enable-rpc=true
rpc-allow-origin-all=true
rpc-listen-all=true
rpc-listen-port=6800
rpc-secret=<your password for rpc>

# I use nginx to do ssl in the frontend.
rpc-secure=true
# rpc-certificate=/etc/letsencrypt/live/your-host/fullchain.pem
# rpc-private-key=/etc/letsencrypt/live/your-host/privkey.pem

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

#### Add ssl

Setting up ssl aria2c lead to the permission problem on starting arai2. Instead, I use **nginx** to do ssl in the frontend, and managed by [Certbot](https://certbot.eff.org/) so the ssl in aria2c setting was disabled.

~~first <u>check</u> permission, replace the `user` with your user name~~

```
sudo -u user ls -la /etc/letsencrypt/live/YourDomain/privkey.pem
```

~~and follow to `aria2.conf`~~

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

 [AriaNG](https://github.com/mayswind/AriaNg) is a front-end for `aria2`. Another popular front-end is [webui-aria2](https://github.com/ziahamza/webui-aria2)

download on [github](<https://github.com/mayswind/AriaNg/releases>), down load in `/home/user/aria2/AriaNG`.

#### Nginx

in `/etc/nginx/sites-available` add file `aria.conf`, link by 

```
sudo ln -s /etc/nginx/sites-available/aria.conf /etc/nginx/sites-enabled/aria.conf
```

then edit `aria.conf`

```bash
server {

	listen 443 ssl; # managed by Certbot
	listen [::]:443 ssl;
	# the virtual host name of this 
	server_name $your-virtua-erver.address; 
	# frontend here
	root /home/$user/aria2/AriaNG;

	# backend only connect to rpc
	location ^~ /jsonrpc {
	proxy_http_version 1.1;
	add_header Front-End-Https on;
	proxy_set_header Connection "";
	proxy_set_header Host $http_host;
	proxy_set_header X-NginX-Proxy true;
	proxy_set_header X-Real-IP $remote_addr;
	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	proxy_pass http://127.0.0.1:6800/jsonrpc;
	proxy_pass_header X-Transmission-Session-Id;
	}
	ssl_certificate path/fullchain.pem; # managed by Certbot
	ssl_certificate_key path/privkey.pem; # managed by Certbot


}
server{
    if ($host = $your-virtua-erver.address) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


	listen 80;
        listen [::]:80;
	server_name $your-virtua-erver.address;


}
```

```
sudo service reload nginx
```

Then you can visit it by `ip:port`, and you can also add ssl to Nginx config.

In AriaNG web, go `AriaNg Setting->RPC tab`, setup RPC. Set port to 443, and fill the rpc password.

#### Set aria2 as daemon

1. add service by `sudo vim /etc/systemd/system/aria2.service`, and add following lines

   ```bash
   [Unit]
   Description=Aria2c download manager
   Requires=network.target
   After=dhcpcd.service
       
   [Service]
   User=$user
   Type=forking
   RemainAfterExit=yes
   ExecStart=/usr/bin/aria2c --conf-path=/home/$user/.aria2/aria2.conf 
   ExecReload=/usr/bin/kill -HUP $MAINPID
   ExecStop=/usr/bin/kill -s STOP $MAINPID
   RestartSec=1min
   Restart=on-failure
       
   [Install]
   WantedBy=multi-user.target
   ```

2. reload daemon 

   ```bash
   sudo systemctl daemon-reload
   ```

3. start daemon by

   ```
   sudo systemctl start aria2.service
   ```

   check if start correctly by

   ```bash
   systemctl status aria2.service
   ```

4. enable daemon start on system startup

   ```
   sudo systemctl enable aria2.service
   ```

   
