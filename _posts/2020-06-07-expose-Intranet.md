---
title: "Accessing an Intranet Machine from Anywhere Using FRP"
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


---

## Background

**Scenario**:  
You have an intranet machine (e.g., a computer in your company) without a public IP, and you want to access it from home or anywhere with internet connectivity. You might also want to host a website on this local machine.

**Requirement**:  
You need access to a server with a public IP.

---

## Solution Overview

To achieve this, tools like **FRP**, [ngrok](https://ngrok.com/), **NPS**, and **Zerotier** can be used. Here, we focus on **FRP (Fast Reverse Proxy)**, an open-source tool. You can download the appropriate version for your operating system from the [FRP GitHub Releases](https://github.com/fatedier/frp/releases).

This guide demonstrates how to set up FRP for SSH access. For more features, refer to the [FRP documentation](https://github.com/fatedier/frp).

---

## SSH Usage

### File Setup

1. Place **`frps`** and **`frps.ini`** on the public server.
2. Place **`frpc`** and **`frpc.ini`** on the intranet machine.

---

### Accessing the Intranet Machine via SSH

#### Step 1: Configure the Public Server

Edit the `frps.ini` file:

```ini
# frps.ini
[common]
bind_port = 7000
```

Start `frps` in the background:

```bash
nohup ./frps -c ./frps.ini > /dev/null 2>&1 &
```

---

#### Step 2: Configure the Intranet Machine

Edit the `frpc.ini` file. Replace `x.x.x.x` with the public server's IP address:

```ini
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

Start `frpc`:

```bash
./frpc -c ./frpc.ini
```

---

#### Step 3: Connect to the Intranet Machine

From any external machine, connect via SSH. Replace `x.x.x.x` with the public server's IP, and assume the username is `test`:

```bash
ssh -oPort=6000 test@x.x.x.x
```

---

### Important Notes

1. Ensure the ports used in FRP (e.g., `7000`, `6000`) are open on the public server's firewall.
2. Each client machine needs a unique **`remote_port`** for mapping.

---

### Extending Access for Web Applications

To access tools like **Jupyter Notebook** or **TensorBoard**, simply add additional port mappings in `frpc.ini`. For example:

```ini
[jupyter]
type = tcp
local_ip = 127.0.0.1
local_port = 8888
remote_port = 8889
```

Then, access the application at `https://x.x.x.x:8889`.

---

## Using SSH on a Mobile Phone

For **iOS**, you can use **Termius**, which offers basic SSH functionality for free.

### Steps to Set Up SSH in Termius

1. Open Termius.
2. Navigate to **Hosts** → **Add New** → Enter the remote IP, SSH username, and password, then save.
3. Connect to the host.

---

### Using SSH Keys in Termius

1. Open Termius.
2. Go to **Keychain** → **Add Key** (or use an existing key).
3. Copy the public key.
4. Append the Termius public key to the server's `~/.ssh/authorized_keys` file.
5. In Termius, edit the host, attach the created key, and save.
6. Connect to the server.

Enjoy secure and efficient SSH access from your mobile device!

---

This guide enables you to set up remote SSH access to an intranet machine using FRP and explains how to extend its functionality for web applications and mobile devices.
