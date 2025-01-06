---
title: "Linking Node Names to Custom Names with Udev"
sitemap: true
categories:
  - Markup
tags:
  - content
  - tutorial
toc: true
---

This guide explains how to assign a custom name to a device node using **udev** rules. Follow the steps below to create a persistent and meaningful device name.

---

#### **Step 1: Identify the Device Attributes**

Run the following command to inspect the device's attributes and find its unique identifiers (e.g., `idVendor` and `idProduct`):

```bash
udevadm info -a -n /dev/ttyUSB0 $(udevadm info -q path -n /dev/ttyUSB0)
```

This command provides detailed information about the device at `/dev/ttyUSB0`.

---

#### **Step 2: Create or Edit the Udev Rule File**

1. Open (or create) a file for udev rules in the `/etc/udev/rules.d/` directory. For example:
   ```bash
   sudo subl /etc/udev/rules.d/serial-symlinks.rules
   ```

2. Add a rule using the attributes you identified. For instance:
   ```bash
   ACTION=="add", ATTRS{idVendor}=="0403", ATTRS{idProduct}=="6001", SYMLINK+="tty-xxx"
   ```

   - Replace `0403` and `6001` with the `idVendor` and `idProduct` values from your device.
   - The `SYMLINK+="tty-xxx"` part specifies the custom name (`tty-xxx`).

---

#### **Step 3: Restart Udev**

Apply the changes by restarting the udev service:

```bash
sudo service udev restart
```

---

#### **Step 4: Verify the Custom Name**

Check whether the custom name (`tty-xxx`) has been created:

```bash
ls /dev/tty*
```

Look for `tty-xxx` in the list of device nodes.

---

#### **Summary of Steps**

```bash
udevadm info -a -n /dev/ttyUSB0
sudo subl /etc/udev/rules.d/serial-symlinks.rules
# Modify the file to include the udev rule
sudo service udev restart
ls /dev/tty*
```

---

By following these steps, you can assign a persistent custom name to a device node, making it easier to identify and use specific devices in your system.
