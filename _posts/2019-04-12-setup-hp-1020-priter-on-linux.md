---
title: "Resolving HP LaserJet 1020 Printer Driver Issues on Linux"
classes: wide
sitemap: true
categories:
tags:
  - tutorial
toc: true
toc_label: "Table of Contents"
description: hp laserjet 1020 plugin problem
---


## Background

Most Linux distributions include printer drivers by default, such as HPLIP for HP printers. However, the HP LaserJet 1020 requires an additional proprietary plugin. While attempting to install this plugin, I encountered issues, which are detailed below.

---

## Problem

Error Message:
```
hp laserjet 1020, hpcups 3.17.10, requires proprietary plugin
```

---

## Solution 1: Using HPLIP

1. **Install HPLIP**:
   ```bash
   sudo apt-get install hplip hplip-gui
   ```

2. **Install the Plugin**:
   - Connect the printer and run:
     ```bash
     hp-plugin
     ```
   - Follow the GUI prompts to download and install the plugin. However, if you face a 404 error (possibly due to network restrictions in China), proceed to the manual installation.

3. **Manual Plugin Installation**:
   - Download the required plugin from [here](https://www.openprinting.org/download/printdriver/auxfiles/HP/plugins/).
   - Use the `hp-plugin` command to load the downloaded plugin file locally.

4. **Test the Printer**:
   - Once the plugin is installed, your printer should work as expected.

---

## Solution 2: Using `foo2zjs`

`foo2zjs` is an open-source library compatible with HP LaserJet 1020 and a good alternative to HPLIP.

1. **Remove HPLIP**:
   ```bash
   sudo apt-get remove --assume-yes hplip hpijs hplip-cups hplip-data libhpmud0 foomatic-db-hpijs
   ```

2. **Install `foo2zjs`**:
   ```bash
   sudo apt-get install cupsys-bsd foo2zjs make build-essential
   wget http://support.ideainformatica.com/hplj1020/foo2zjs-patched.tar.gz
   tar zxvf foo2zjs-patched.tar.gz
   cd foo2zjs
   make
   sudo make install
   sudo make install-udev
   sudo udevstart
   ```

3. **Restart Printing Service**:
   ```bash
   sudo /etc/init.d/cupsys restart
   ```

4. **Adjust Print Settings** (Optional):
   For better text formatting, run:
   ```bash
   sudo lpoptions -o cpi-12 -o lpi=7 -o page-left=36 -o page-right=36 -o page-top=36 -o page-bottom=36
   ```

5. **Configure Printer Model**:
   - Open your system's printer manager.
   - Set the HP printer model to `foo2zjs`.
   - Select the appropriate `.ppd` file for your printer from the `foo2zjs/ppd` directory.

6. **Modify `.ppd` File (if needed)**:
   If you encounter issues, such as page size defaults, manually edit the `.ppd` file:
   ```bash
   sudo gedit foo2zjs/ppd/LaserJet-1020.ppd
   ```
   Example: Change the default page size from "Letter" to "A4."

7. **Test and Enjoy**:
   Your printer should now work seamlessly.

--- 

By following either of these methods, you can successfully set up your HP LaserJet 1020 on Linux.
