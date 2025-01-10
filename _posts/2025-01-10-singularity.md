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
description: From Docker to Singularity\: Setting Up and Managing Tasks with HTCondor and Slurm
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

### **Why Use Singularity for HPC?**

Containers solve many problems in HPC environments:
1. **Dependency Conflicts**: Applications often require specific libraries that may not be installed on the cluster.
2. **No Root Privileges**: Most HPC users lack `sudo` access, making it hard to install system-level software.
3. **Reproducibility**: Containers ensure the environment is consistent across systems.

**Why not Docker?**
Docker isolates the container from the host and requires root privileges to run, which makes it unsuitable for shared HPC systems. **Singularity**, on the other hand:
- Integrates seamlessly with the host system (e.g., mounts home directories by default).
- Runs without root privileges, making it safer and compatible with shared environments.
- Allows easy access to host-level resources like GPUs, shared filesystems, and user-installed environments (e.g., Conda).

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

### **Step-by-Step Guide: From Docker to Singularity**

#### **1. Save a Running Docker Container as an Image**
1. **Run and Configure the Docker Container**:
   Start a Docker container:
   ```bash
   docker run -it nvidia/cuda:11.8.0-base-ubuntu20.04 bash
   ```
   Inside the container, install system-level dependencies:
   ```bash
   apt-get update && apt-get install -y libjpeg-dev python3 python3-pip
   pip install torch torchvision
   ```

2. **Save the Running Container as a Docker Image**:
   Get the container ID:
   ```bash
   docker ps
   ```
   Commit the running container:
   ```bash
   docker commit <container_id> cuda_image
   ```


#### **2. Convert the Docker Image to a Singularity SIF File**
Use Singularity to convert the Docker image:
```bash
singularity build cuda_image.sif docker-daemon://cuda_image:latest
```

---

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

### **Running Tasks with HTCondor**

#### **1. Wrapper Script**
The wrapper script is executed for each task submission. Ensure it uses the proper shebang:
```bash
#!/usr/bin/bash

# Load Conda and activate the environment
export PATH="/home/user/miniconda3/bin:$PATH"
source /home/user/miniconda3/etc/profile.d/conda.sh
conda activate my_env

# Run the Singularity container and execute the Python script
singularity exec --bind /home/user:/home/user cuda_image.sif bash -c "
  source /home/user/miniconda3/etc/profile.d/conda.sh &&
  conda activate my_env &&
  python /home/user/code/train.py
"
```

#### **2. HTCondor Submit File**
Create a submission file for your task:
```plaintext
executable = wrapper.sh
output     = output/task.out
error      = output/task.err
log        = output/task.log
request_gpus = 1
Requirements = (CUDADeviceName == "NVIDIA A100 80GB PCIe")
queue
```

Submit the task:
```bash
condor_submit task.sub
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
### **Comparing HTCondor and Slurm**

| Feature                | HTCondor                                | Slurm                                     |
|------------------------|-----------------------------------------|------------------------------------------|
| **Best Use Case**      | High-throughput, independent tasks      | Distributed, tightly coupled tasks       |
| **GPU Support**        | Yes                                    | Yes                                      |
| **Ease of Use**        | Simple for independent jobs             | Better for multi-node configurations     |
| **Distributed Training**| Not optimized for communication-heavy jobs | Supports MPI, NCCL, Gloo                 |

---

### **Distributed Training with Singularity**

For distributed training, tools like **NCCL**, **Gloo**, and **MPI** are critical:
1. **NCCL**: Best for multi-GPU training on NVIDIA hardware.
2. **Gloo**: General-purpose communication for PyTorch.
3. **MPI**: High-performance communication for multi-node setups.

**Why InfiniBand?**
- Standard Ethernet introduces bottlenecks in distributed training.
- InfiniBand provides high-speed, low-latency connections for scaling training across nodes.

---

### **Conclusion**

Singularity simplifies the process of running containerized tasks on HPC systems. By combining Singularity with HTCondor and Slurm, you can efficiently manage high-throughput and distributed workloads. Use Docker for building containers, but leverage Singularity for running them in HPC environments. And remember: only include system-level dependencies in the container, while keeping user-level tools and data on the host system.

For more information:
- [Singularity Documentation](https://sylabs.io/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [HTCondor Documentation](https://htcondor.readthedocs.io/)
- [Slurm Documentation](https://slurm.schedmd.com/documentation.html)

---


