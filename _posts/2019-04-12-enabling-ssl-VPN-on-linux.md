---
title: "Running SSL VPN Software on Linux via Virtual Machine"
classes: wide
sitemap: true
categories:
tags:
  - tutorial
toc: true
toc_label: "Table of Contents"
description: Enabling ssl VPN on linux, set up HUAWEI VPN on linux
---


## Why?

Many SSL VPN software providers (e.g., Huawei, Sangfor) do not offer Linux clients. To overcome this limitation, we can use a virtual machine (VM) to run the Windows client and bridge the network to Linux. Refer to this [post](https://zsrkmyn.github.io/how-to-use-sangfor-sslvpn-in-linux.html) (in Chinese) for more details.

---

## Installing Windows on QEMU (Ubuntu 18.04 Host)

### Steps:

1. **Install Required Packages**:
   Ensure that `qemu-kvm` and `virt-manager` are installed:
   ```bash
   sudo apt-get install qemu-kvm virt-manager
   ```

2. **Download Resources**:
   - Windows installation ISO file.
   - [VirtIO Drivers ISO](https://fedoraproject.org/wiki/Windows_Virtio_Drivers): Ensure you use the latest version to avoid network instability.

3. **Launch Installation**:
   - Open **Virtual Machine Manager** and follow the GUI installation steps:
     ![Virtual Machine Manager](../assets/images/vpn_post/1555035639703.png)
   - Follow [this guide](https://github.com/hpaluch/hpaluch.github.io/wiki/Install-Windows7-on-KVM-Qemu) for detailed instructions.

**Important Note**: Huawei’s VPN software works on Windows 8 or later but not on Windows 7 in my tests.

---

## Setting Up Network Bridging

1. **Create and Start a Bridge**:
   ```bash
   sudo ip l add qbr0 type bridge
   sudo ip l set qbr0 up
   ```

2. **Configure the Virtual Machine**:
   - Add the bridge network card (`qbr0`) to your virtual machine. 
     ![Bridge Setup](../assets/images/vpn_post/1555061415008.png)

3. **Enable VPN Network Sharing**:
   - Share the VPN network card (NC) with the bridge NC in the guest machine.

4. **Start the VPN Software**:
   - Run the VPN SSL client on the Windows guest machine.
   - Configure the bridge NC IP as `192.168.137.1`:
     ![VPN Network Setup](../assets/images/vpn_post/1555062668324.png)

5. **Setup the Bridge on Linux Host**:
   Execute the following commands to finalize the setup:
   ```bash
   sudo ip l add qbr0 type bridge
   sudo ip l set qbr0 up
   sudo ip a add 192.168.137.9/24 dev qbr0
   sudo ip r add 10.0.0.0/8 via 192.168.137.1 dev qbr0
   ```

6. **Verify the Routing**:
   Use `ip r` to confirm the routes. Example:
   - `172.xx.xx.xx`: Host network card IP.
   - `192.168.122.xx`: Virtual machine bridge IP (for internet access).
   - `192.168.137.x`: Bridge VPN IP.

   ![Route Setup](../assets/images/vpn_post/route2.png)

7. **Connect to the VPN**:
   ```bash
   ssh username@10.xx.xx.xx
   ```

---

## Acknowledgments

Special thanks to my friend [Stephen](https://zsrkmyn.github.io/) for helping debug this setup. 

Enjoy the complex but rewarding network setup process. Thanks for reading!
