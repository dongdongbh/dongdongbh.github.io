---
title: "Comprehensive Guide to Setting Up a Web File Server with h5ai, Aria2, and Nginx on Linux"
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


---

## Background

This guide explains how to set up a web file server using [h5ai](https://larsjung.de/h5ai/), [Aria2](https://aria2.github.io/), and Nginx on Debian 9. It includes step-by-step instructions for creating an efficient file server with additional features like directory indexing, secure access, and file downloading/uploading.

---

## Step-by-Step Setup

### Basic Nginx Configuration

1. Open the Nginx configuration file:

   ```bash
   sudo vim /etc/nginx/sites-enabled/default
   ```

2. Add the following configuration:

   ```nginx
   server { 
       listen xxxx;  # Replace xxxx with your desired port number
       server_name localhost;
       root /home/bh/share;

       location / {
           autoindex on;              # Enable directory listing
           autoindex_exact_size on;   # Show exact file sizes
           autoindex_localtime on;    # Show file modification times
       }
   }
   ```

3. Reload Nginx to apply the changes:

   ```bash
   sudo service nginx reload
   ```

4. Access your file server at `yourdomain.com:xxxx`.

---

### Adding h5ai for Enhanced Directory Indexing

[h5ai](https://larsjung.de/h5ai/) is a modern file indexer for HTTP web servers, providing a polished interface.

1. Install PHP:

   ```bash
   sudo apt install php
   php -v
   ```

2. Update the Nginx configuration file:

   ```nginx
   server {
       listen xxxx;
       server_name localhost;
       root /home/bh/share;
       index index.html /_h5ai/public/index.php;

       location ~ \.php$ {
           fastcgi_pass unix:/run/php/php7.4-fpm.sock;  # Adjust based on your PHP version
           include fastcgi_params;
           fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
           fastcgi_param SCRIPT_NAME $fastcgi_script_name;
       }
   }
   ```

3. Reload Nginx:

   ```bash
   sudo service nginx reload
   ```

4. Add SSL for secure access by updating the server block with SSL configurations.

---

### Securing Directories with Password Protection

1. Install `httpd-tools`:

   ```bash
   sudo apt install apache2-utils
   ```

2. Create a password file:

   ```bash
   htpasswd -c /etc/nginx/passwd username
   ```

3. Add the following block to the Nginx configuration:

   ```nginx
   location /private {
       autoindex on;
       autoindex_exact_size off;
       autoindex_localtime on;
       auth_basic "Restricted Access";
       auth_basic_user_file /etc/nginx/passwd;
   }
   ```

4. Reload Nginx:

   ```bash
   sudo service nginx reload
   ```

Now, access to `/private` requires authentication.

---

### Adding File Upload/Download and Cloud Features

For a full-featured cloud server, consider tools like:

- **Seafile**, **Kodexplorer**, **OwnCloud**, or **NextCloud**.
- **FTP Options**: Set up `vsftpd` or `sftp` for file transfers.

For Nginx-based file upload and download, refer to [this guide](https://www.yanxurui.cc/posts/server/2017-03-21-NGINX-as-a-file-server/).

---

### Setting Up Aria2 + AriaNg + Nginx

#### Installing Aria2

1. Install Aria2:

   ```bash
   sudo apt install aria2
   ```

2. Configure Aria2:

   ```bash
   mkdir ~/.aria2
   vim ~/.aria2/aria2.conf
   ```

   Add the following:

   ```ini
   dir=/home/username/aria2/download
   file-allocation=trunc
   continue=true
   daemon=true
   enable-rpc=true
   rpc-allow-origin-all=true
   rpc-listen-all=true
   rpc-listen-port=6800
   rpc-secret=<your_rpc_password>
   ```

3. Start Aria2:

   ```bash
   aria2c --conf-path="/home/username/.aria2/aria2.conf"
   ```

---

#### Adding AriaNg as a Frontend

1. Download AriaNg:

   ```bash
   wget -P /home/username/aria2/AriaNg https://github.com/mayswind/AriaNg/releases/latest/download/AriaNg.zip
   unzip AriaNg.zip -d /home/username/aria2/AriaNg
   ```

2. Configure Nginx:

   ```bash
   sudo vim /etc/nginx/sites-available/aria.conf
   ```

   Add:

   ```nginx
   server {
       listen 443 ssl;
       server_name yourdomain.com;

       root /home/username/aria2/AriaNg;

       location ^~ /jsonrpc {
           proxy_pass http://127.0.0.1:6800/jsonrpc;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header Host $http_host;
       }

       ssl_certificate /path/to/fullchain.pem;  # Managed by Certbot
       ssl_certificate_key /path/to/privkey.pem;
   }
   ```

3. Enable the configuration and reload Nginx:

   ```bash
   sudo ln -s /etc/nginx/sites-available/aria.conf /etc/nginx/sites-enabled/aria.conf
   sudo service nginx reload
   ```

4. Access AriaNg at `https://yourdomain.com`.

---

### Running Aria2 as a Systemd Service

1. Create a service file:

   ```bash
   sudo vim /etc/systemd/system/aria2.service
   ```

   Add:

   ```ini
   [Unit]
   Description=Aria2c Download Manager
   After=network.target

   [Service]
   User=username
   ExecStart=/usr/bin/aria2c --conf-path=/home/username/.aria2/aria2.conf
   Restart=on-failure

   [Install]
   WantedBy=multi-user.target
   ```

2. Enable and start the service:

   ```bash
   sudo systemctl daemon-reload
   sudo systemctl start aria2.service
   sudo systemctl enable aria2.service
   ```

---

### Enhancing Development Workflow with Samba, SSHFS, or NFS

For local development:

- **Samba**: Ideal for Linux-Windows file sharing.
- **NFS**: Best for Linux-to-Linux setups.
- **SSHFS**: Mount remote directories over SSH:

   ```bash
   sshfs user@remote:/path/to/share /local/mount/point
   ```

   Unmount with:

   ```bash
   sudo umount /local/mount/point
   ```

---

### Conclusion

This guide walks you through setting up a robust web file server with modern directory indexing, secure file management, and download/upload capabilities. Tools like h5ai and Aria2 provide seamless functionality, while Nginx ensures scalability and performance. Explore further enhancements to suit your needs!
