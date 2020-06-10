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
description: set up file server on vps by nginx
---

## Background

set up file server

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

1. install php

2. in `/etc/nginx/sites-enabled/default`  change to

   ```
   server {			# my file server
   	listen xxxx; 	# your file server port
   	server_name localhost;
   	root /home/bh/share;
   	index index.html /_h5ai/public/index.php;
   	
   	location ~ \.php$ {
       		fastcgi_pass	unix:/var/run/php/php-fpm.sock;
   			include         fastcgi_params;
       		fastcgi_param   SCRIPT_FILENAME    $document_root$fastcgi_script_name;
       		fastcgi_param   SCRIPT_NAME        $fastcgi_script_name;
   	}
   }
   ```

3. add you can also add your ssl to this server

#### add password to folder

1. add password to your folder, use `httpd-tools`, you can install it by `sudo apt install httpd-tools`, 

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

#### Download and upload

If you want to build you own cloud driver, Seafile, Kodexplorer, owncloud are good choices.

You can build a **ftp** (e.g. vsftpd, sftp) for file upload and download. By doing so, you can download and upload your files by ftp, and view it on nginx hosted web.

If you want to use nginx it self, it can be done by [this](<https://www.yanxurui.cc/posts/server/2017-03-21-NGINX-as-a-file-server/>). or refer [here](<https://www.yanxurui.cc/posts/server/2017-03-21-NGINX-as-a-file-server/>). It done by *nginx_upload_module*.

**Aria2** is a good offline download tool, and it enables you use web to manage you download processes. After you download the video files, you can view it on h5ai.

Seafile is heavy, and  it makes my server down, lol. If you install, please use docker, otherwise it will be realy hard, you man face many unknown problems.

#### local development

For local developer, I recommend you use **samba** server (or nfs) and mount it to local. this avoid many *scp* operations.