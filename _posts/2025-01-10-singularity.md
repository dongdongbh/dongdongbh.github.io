---
title: "From Docker to Singularity: Setting Up and Managing Tasks with HTCondor and Slurm"
classes: wide
sitemap: true
categories:
  - Blog
tags:
  - content
  - tutorial
toc: true
toc_label: "Table of Contents"
description: Setting Up a Nebula Overlay Network with Syncthing
---


### **Background**

When I first started using my university’s computing cluster, I quickly realized I needed to set up custom environments for my tasks. Like many, I initially turned to **Docker**, a popular tool for containerization. However, I soon ran into challenges when using Docker on an HPC cluster. This led me to discover **Singularity**, a container solution specifically designed for HPC environments. In this post, I’ll explain why we need containers in HPC, the key differences between Docker and Singularity, and provide a step-by-step guide to managing tasks with Singularity, HTCondor, and Slurm.

---

### **Why Do We Need Containers in HPC?**

HPC clusters are shared environments where multiple users run diverse tasks. This can create conflicts:
1. **Dependency Issues**: Programs often require specific libraries, compilers, or environments that may not be installed on the cluster.
2. **Permission Restrictions**: Most HPC systems don’t grant users `sudo` access, making it difficult to install system-level packages.
3. **Reproducibility**: Without containers, reproducing results across different systems can be challenging.

**Containers** solve these problems by bundling applications and their dependencies into portable environments. With a container, you can:
- Install software that requires `sudo` inside the container.
- Run the container on any compatible system without worrying about the host environment.

---

### **Why Use Singularity Instead of Docker for HPC?**

At first, I assumed **Docker** would work perfectly for HPC. I built a Docker image, set up a user inside it, and configured my environment. However, when I tried to run it on the cluster, I encountered these issues:

1. **Root Privileges**:  
   Docker containers require root privileges to run. This is a security risk for shared HPC systems and is often disabled by cluster administrators.

2. **Isolation vs Integration**:  
   Docker isolates the container from the host system, which is great for production environments but problematic for HPC. Singularity, on the other hand:
   - **Integrates** with the host system.
   - By default, mounts the host’s home directory and environment variables into the container.
   - Makes it easy to access your files and host-level tools (e.g., Conda environments).

3. **Designed for HPC**:  
   Singularity was specifically designed for HPC. It:
   - Runs without requiring elevated privileges.
   - Provides seamless access to host resources, including GPUs and shared filesystems.

### **Key Difference Between Docker and Singularity**

| Feature                | Docker                                | Singularity                            |
|------------------------|---------------------------------------|----------------------------------------|
| **Isolation**          | Containers are isolated from the host | Integrates with the host system        |
| **Root Privileges**    | Requires root privileges to run       | Runs without root privileges           |
| **HPC Compatibility**  | Not designed for HPC                 | Specifically designed for HPC          |
| **Filesystem Access**  | Host filesystem is not mounted        | Host home directory is mounted by default |

---

### **Best Practices for Singularity in HPC**

The key realization when using Singularity is that you **only need to install software requiring `sudo`** inside the container. For everything else (e.g., user-level Python packages or Conda environments), you can use the host environment.

For example:
1. Use Singularity to install system-level dependencies (e.g., CUDA libraries).
2. Use the host system for Conda environments, scripts, and datasets.

---

### **Step-by-Step Guide to Using Singularity**

#### **1. Build a Docker Container**
Start with a Docker image and install required `sudo` packages:
```bash
docker pull nvidia/cuda:11.8.0-base-ubuntu20.04
docker run -it nvidia/cuda:11.8.0-base-ubuntu20.04 bash
```
Inside the Docker container:
```bash
apt-get update && apt-get install -y libjpeg-dev python3 python3-pip
pip install torch torchvision
```
Save the image locally:
```bash
docker save cuda_image -o cuda_image.tar
```

#### **2. Convert Docker Image to Singularity**
Convert the Docker image to a Singularity SIF file:
```bash
singularity build cuda_image.sif docker-daemon://cuda_image:latest
```

#### **3. Use Singularity with Host Resources**
Run the Singularity container, binding the host’s home directory and using the host’s Conda environment:
```bash
singularity exec --bind /home/user:/home/user cuda_image.sif bash -c "
  source /home/user/miniconda3/etc/profile.d/conda.sh &&
  conda activate my_env &&
  python /home/user/code/train.py
"
```

---

### **Managing Tasks with HTCondor**

#### **1. HTCondor Submit File**
Write a submission file for your task:
```plaintext
executable = wrapper.sh
output     = output/task.out
error      = output/task.err
log        = output/task.log
request_gpus = 1
Requirements = (CUDADeviceName == "NVIDIA A100 80GB PCIe")
queue
```

#### **2. Wrapper Script**
This script sets up the environment and runs the task:
```bash
#!/bin/bash

export PATH="/home/user/miniconda3/bin:$PATH"
source /home/user/miniconda3/etc/profile.d/conda.sh
conda activate my_env

singularity exec --bind /home/user:/home/user cuda_image.sif python /home/user/code/train.py
```

#### **3. Monitor Jobs**
Check the status of your jobs:
```bash
condor_q
```
Check GPU availability:
```bash
condor_status -constraint 'CUDADeviceName == "NVIDIA A100 80GB PCIe"'
```

---

### **Managing Tasks with Slurm**

Slurm is another workload manager, optimized for distributed training and tightly coupled tasks.

#### **1. Slurm Script**
Write a Slurm submission script:
```bash
#!/bin/bash
#SBATCH --job-name=my_task
#SBATCH --output=task.out
#SBATCH --error=task.err
#SBATCH --gres=gpu:1

singularity exec /path/to/cuda_image.sif python /home/user/code/train.py
```

Submit the job:
```bash
sbatch task.slurm
```

---

### **Distributed Training and InfiniBand**

Distributed training requires efficient GPU-to-GPU communication, especially across nodes. Key tools include:
1. **NCCL**: Optimized for NVIDIA GPUs.
2. **Gloo**: General-purpose communication.
3. **MPI**: High-performance communication for multi-node setups.

**Why InfiniBand?**
- Standard Ethernet introduces communication bottlenecks.
- InfiniBand provides high-speed, low-latency connections, essential for scaling distributed training.

---

### **Conclusion**

Using Singularity, Docker, HTCondor, and Slurm has made it possible to run complex tasks efficiently on HPC clusters. Singularity’s integration with the host system, combined with Conda environments and workload managers like HTCondor and Slurm, provides a scalable and reproducible workflow. For anyone exploring these tools, remember:
- Use Singularity for `sudo`-level packages.
- Leverage the host system for user-level tools and datasets.

For more information:
- [Singularity Documentation](https://sylabs.io/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [HTCondor Documentation](https://htcondor.readthedocs.io/)
- [Slurm Documentation](https://slurm.schedmd.com/documentation.html)

---

