---
title: "Transfer files between two computers"
sitemap: true
categories:
  - Markup
tags:
  - content
  - tutorial
toc: true
description: Transfer files over a LAN between two computers, Efficient File Transfer Between Linux and Windows Systems.
---


#### **File Transfer Between Linux Systems**

---

##### **1. Netcat + Tar** (Fast but Less Secure)

To send a directory:

1. On the **sender**:
   ```bash
   tar -cz . | nc -q 10 -l -p 45454
   ```

2. On the **receiver**:
   ```bash
   nc -w 10 $REMOTE_HOST 45454 | tar -xz
   ```

   - Replace `$REMOTE_HOST` with the sender's IP address or hostname.
   - You can change the port `45454` to another port of your choice.

---

##### **2. Copying Files with SCP**

Commands for file transfer using `scp`:

1. To transfer a file:
   ```bash
   scp <file> <username>@<IP or hostname>:<Destination>
   ```

2. To transfer directories recursively:
   ```bash
   scp -r <local_path> <username>@<server>:(remote_path)
   scp -r <username>@<server>:(remote_path) <local_path>
   ```

---

##### **3. Using SSHFS (Secure and Convenient)**

**Installation:**

On the client:
```bash
sudo apt-get install sshfs
```

**Mounting a Remote File System:**

```bash
sshfs -o transform_symlinks -ofollow_symlinks user@hostname:/remote/path /local/mountpoint
```

Example:
```bash
sshfs -o cache=yes,allow_other user@192.168.1.200:/home/user/code /home/user/code
```

**Unmounting:**

```bash
sudo umount /local/mountpoint
```

**Note:** For sharing with multiple users, consider using **NFS**. Refer to this [NFS configuration tutorial](https://www.howtoforge.com/tutorial/how-to-configure-a-nfs-server-and-mount-nfs-shares-on-ubuntu-18.04/) for details.

---

#### **File Transfer Between Windows and Linux**

---

##### **1. Samba Server**

Samba is a convenient tool for sharing files between Windows and Linux, similar to NFS.

**Setting Up Samba on Linux:**

1. Install Samba:
   ```bash
   sudo apt update
   sudo apt install samba
   ```

2. Create a shared directory:
   ```bash
   mkdir /home/<username>/sambashare/
   ```

3. Edit the Samba configuration file:
   ```bash
   sudo vim /etc/samba/smb.conf
   ```

   Add the following lines:
   ```
   [sambashare]
       comment = Samba on Ubuntu
       path = /home/<username>/sambashare
       read only = no
       browsable = yes
   ```

4. Restart Samba:
   ```bash
   sudo service smbd restart
   ```

5. Add a Samba user and set a password:
   ```bash
   sudo smbpasswd -a <username>
   ```

   **Note**: The Samba username must match a system account for it to work.

**Accessing Samba Shares from Windows:**

1. Open **File Explorer** on Windows.
2. Enter the following in the address bar:
   ```
   \\<ip-address>\sambashare
   ```
   Replace `<ip-address>` with the Linux machine's IP address.

---

This guide provides efficient methods for secure and convenient file sharing across Linux and Windows systems.
