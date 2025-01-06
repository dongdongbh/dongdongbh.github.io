---
title: "Setting Up a File Server on VPS with Nginx"
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

This guide provides a detailed walkthrough to set up a web file server using **Nginx**, **h5ai**, **Aria2**, and **AriaNG** on a Debian-based VPS. Additionally, it explains how to enhance functionality with SSL and local development options.

---

## Background

Learn to host a file server with [h5ai](https://larsjung.de/h5ai/), manage downloads using [Aria2](https://aria2.github.io/), and set up configurations via **Nginx** on a Debian 9 VPS.

---

## How to

### 1. Basic Nginx Configuration

Update the Nginx configuration to host your file server:

1. Open `/etc/nginx/sites-enabled/default` and add:
   ```yaml
   server {
       listen xxxx; # Replace xxxx with your desired port
       server_name localhost;
       root /home/bh/share;

       location / {
           autoindex on;           # Enable directory listing
           autoindex_exact_size on; # Show file sizes
           autoindex_localtime on; # Show local time for files
       }
   }
   ```

2. Reload Nginx:
   ```bash
   sudo service nginx reload
   ```

3. Access the file server at `yourdomain.com:xxxx`.

---

### 2. Enhance with h5ai

#### Install h5ai

1. Install PHP:
   ```bash
   sudo apt install php
   ```

2. Update the Nginx configuration in `/etc/nginx/sites-enabled/default`:
   ```yaml
   server {
       listen xxxx;
       server_name localhost;
       root /home/bh/share;
       index index.html /_h5ai/public/index.php;

       location ~ \.php$ {
           fastcgi_pass unix:/run/php/php7.4-fpm.sock; # Check your PHP socket path
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

---

### 3. Add Folder Password Protection

Protect specific folders with HTTP authentication:

1. Install `apache2-utils`:
   ```bash
   sudo apt install apache2-utils
   ```

2. Create a password file and user:
   ```bash
   htpasswd -c /etc/nginx/passwd your-username
   ```

3. Update Nginx configuration:
   ```yaml
   location /private {
       autoindex on;
       auth_basic "Restricted Access";
       auth_basic_user_file /etc/nginx/passwd;
   }
   ```

4. Reload Nginx:
   ```bash
   sudo service nginx reload
   ```

---

### 4. Integrate Aria2 and AriaNG

#### Install Aria2
```bash
sudo apt install aria2
```

#### Configure Aria2
1. Create configuration files:
   ```bash
   mkdir ~/.aria2
   vim ~/.aria2/aria2.conf
   ```

2. Add the following:
   ```yaml
   dir=/home/your-username/aria2/download
   enable-rpc=true
   rpc-listen-all=true
   rpc-listen-port=6800
   rpc-secret=your_rpc_password
   file-allocation=none
   continue=true
   max-concurrent-downloads=10
   ```
3. Run Aria2:
   ```bash
   aria2c --conf-path="/home/your-username/.aria2/aria2.conf"
   ```

---

#### Install and Configure AriaNG

1. Download [AriaNG](https://github.com/mayswind/AriaNg/releases).
2. Place files in `/home/your-username/aria2/AriaNG`.

---

#### Configure Nginx for Aria2

1. Create a new Nginx configuration in `/etc/nginx/sites-available/aria.conf`:
   ```yaml
   server {
       listen 443 ssl;
       server_name your-domain.com;

       root /home/your-username/aria2/AriaNG;

       location ^~ /jsonrpc {
           proxy_pass http://127.0.0.1:6800/jsonrpc;
           proxy_set_header Host $http_host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }

       ssl_certificate /path/to/fullchain.pem; # Adjust paths
       ssl_certificate_key /path/to/privkey.pem;
   }
   ```

2. Enable the configuration:
   ```bash
   sudo ln -s /etc/nginx/sites-available/aria.conf /etc/nginx/sites-enabled/
   sudo service nginx reload
   ```

3. Visit the web interface and configure RPC settings in AriaNG.

---

### 5. Set Up SSL with Certbot

1. Install Certbot:
   ```bash
   sudo apt install certbot
   ```

2. Obtain and configure an SSL certificate:
   ```bash
   sudo certbot --nginx
   ```

3. Update Nginx configurations to use SSL.

---

### 6. Run Aria2 as a Daemon

1. Create a systemd service:
   ```bash
   sudo vim /etc/systemd/system/aria2.service
   ```
2. Add:
   ```bash
   [Unit]
   Description=Aria2c download manager
   After=network.target

   [Service]
   User=your-username
   ExecStart=/usr/bin/aria2c --conf-path=/home/your-username/.aria2/aria2.conf
   Restart=on-failure

   [Install]
   WantedBy=multi-user.target
   ```
3. Enable and start the service:
   ```bash
   sudo systemctl enable aria2.service
   sudo systemctl start aria2.service
   ```

---

### 7. Local Development Options

1. Use **samba** or **NFS** for local file sharing.
2. For SSHFS:
   ```bash
   sshfs user@host:/path/to/share /local/mount/point
   ```
   Unmount with:
   ```bash
   sudo umount /local/mount/point
   ```

---

By following this guide, you can successfully set up a secure, functional file server, integrate powerful tools like Aria2 and AriaNG, and enable seamless file management both locally and remotely.
