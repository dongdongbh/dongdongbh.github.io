---
title: "Hosting a Jekyll Website on a Virtual Private Server (VPS)"
classes: wide
sitemap: true
categories:
  - Resource
tags:
  - tutorial
toc: true
toc_label: "Table of Contents"
description: Create your website on cloud using git, Nginx, Netdata, SSL, Certbot
---


Learn how to host and manage your Jekyll-based website on a cloud VPS, leveraging Git for automatic deployment, SSL encryption, and performance monitoring.

---

## Requirements

- A VPS (e.g., Google Cloud VM instance)
- A domain name (e.g., `dongdongbh.tech`)

---

## Steps to Host Your Website

### 1. Log in to Your Server

Use SSH to log in to your VPS:
```bash
ssh username@your_vps_ip
```

---

### 2. Install Necessary Software

Install the following:
- Ruby
- [Jekyll](https://jekyllrb.com/docs/)
- Bundler
- Git
- [Nginx](https://www.nginx.com/resources/wiki/start/topics/tutorials/install/)

For Nginx, refer to [this video tutorial](https://www.youtube.com/watch?v=lWjZSgXu5VU&t=10469s).

---

### 3. Configure Nginx

1. **Set Up Nginx Configuration Files:**
   ```bash
   cd /etc/nginx/sites-available/
   sudo rm default
   sudo touch /etc/nginx/sites-available/mysite.conf
   sudo ln -s /etc/nginx/sites-available/mysite.conf /etc/nginx/sites-enabled/mysite.conf
   ```

2. **Edit `/etc/nginx/sites-available/mysite.conf`:**
   Use paste mode in `vim` to avoid alignment issues (`:set paste`).

   ```nginx
   server {
       listen 80;
       listen [::]:80;
       server_name dongdongbh.tech www.dongdongbh.tech;

       rewrite ^(.*)$ https://$host$1 permanent;
   }

   server {
       listen 443 ssl;
       listen [::]:443 ssl;
       server_name dongdongbh.tech www.dongdongbh.tech;

       ssl_certificate   /etc/nginx/cert/your_certificate.pem;
       ssl_certificate_key  /etc/nginx/cert/your_key.key;

       root /var/www/mysite;
       index index.html;

       location / {
           try_files $uri $uri/ =404;
       }
   }
   ```

3. **SSL Encryption:**
   Use free SSL providers like [Let’s Encrypt](https://letsencrypt.org/getting-started/) or [Certbot](https://certbot.eff.org/lets-encrypt/debianstretch-nginx).

   Certbot automatically modifies your Nginx configuration to add SSL settings.

---

### 4. Build and Deploy Your Website

1. **Local Development Setup:**
   Install Ruby, Bundler, and Jekyll. Build your site:
   ```bash
   JEKYLL_ENV=production bundle exec jekyll build
   ```

2. **Deploy to Server:**
   Upload the contents of the `public` folder to `/var/www/mysite` on your server:
   ```bash
   scp -r _site/* username@your_vps:/var/www/mysite
   ```

3. **Test Locally:**
   ```bash
   bundle exec jekyll serve
   ```
   Visit: `http://127.0.0.1:4000`.

---

### 5. Set Up Git for Automatic Deployment

1. **Initialize a Git Repository:**
   On your server, create a bare repository:
   ```bash
   mkdir -p /srv/git/deploy_site.git
   cd /srv/git/deploy_site.git
   git init --bare
   ```

2. **Add a Post-Receive Hook:**
   Edit `/srv/git/deploy_site.git/hooks/post-receive`:
   ```bash
   #!/bin/bash
   GIT_REPO=/srv/git/deploy_site.git
   PUBLIC_WWW=/var/www/mysite
   cd $PUBLIC_WWW
   unset GIT_DIR
   git pull $GIT_REPO
   ```

3. **Push from Local:**
   Add the remote server as a Git remote:
   ```bash
   git remote add server username@your_vps:/srv/git/deploy_site.git
   git push server master
   ```

---

### 6. Enable Remote Monitoring with Netdata

1. **Install Netdata:**
   ```bash
   bash <(curl -Ss https://my-netdata.io/kickstart.sh)
   ```

2. **Secure Netdata with Nginx:**
   - Configure Netdata to listen only on `localhost`:
     ```bash
     sudo sed -i -e "s/# bind to = \*/bind to = 127.0.0.1/" /etc/netdata/netdata.conf
     sudo systemctl restart netdata
     ```

   - Add basic authentication:
     ```bash
     echo "net-user:$(openssl passwd -crypt net-pass)" | sudo tee /etc/nginx/passwd
     ```

   - Create an Nginx configuration file for Netdata:
     ```nginx
     server {
         listen 443 ssl;
         server_name netdata.yourdomain.com;

         ssl_certificate /etc/nginx/cert/your_certificate.pem;
         ssl_certificate_key /etc/nginx/cert/your_key.key;

         auth_basic "Protected";
         auth_basic_user_file /etc/nginx/passwd;

         location / {
             proxy_pass http://127.0.0.1:19999;
             proxy_set_header X-Forwarded-Host $host;
         }
     }
     ```

   - Enable the configuration and reload Nginx:
     ```bash
     sudo ln -s /etc/nginx/sites-available/netdata /etc/nginx/sites-enabled/
     sudo systemctl reload nginx
     ```

---

## Conclusion

Congratulations! Your Jekyll site is now live on a VPS, equipped with HTTPS, automatic Git deployment, and performance monitoring. Let me know if you need further assistance!
