---
title: "Convolution Operations and Key Concepts in CNNs"
classes: wide
date: 2018-12-01
sitemap: true
math: true
categories:
tags:
  - note
description: CNN dimension, channels, strides, padding
toc: true
toc_label: "Table of Contents"
---


#### **Convolution Operation: Shared Convolution Core**

The output size of a convolution operation is calculated as:
$$
O = (n - f + 1) \times (n - f + 1)
$$
where:
- \(n \times n\): Input size
- \(f \times f\): Convolution core size

![Convolution Core](../assets/images/cnn/convolution_core.gif)

---

#### **Key Terms: Channels, Strides, Padding**

##### **Channels**
- For an input of size \(6 \times 6 \times 3\) (an RGB image with 3 channels), and a convolution core of size \(3 \times 3 \times 3\), the last dimension of the core matches the number of input channels.
- The convolution results in a single-channel output of size \(4 \times 4 \times 1\).

If multiple convolution cores are used, the output contains multiple feature maps:
- Using two cores, the output size becomes \(4 \times 4 \times 2\).
- The number of output channels (\(C_o\)) becomes the input channels for the next layer.

![Convolution Example](../assets/images/cnn/convolution.png)  
![Multiple Channels](../assets/images/cnn/cnn.png)  
![Layered CNN](../assets/images/cnn/layers.png)

The output size formula becomes:
$$
O = (n - f + 1) \times (n - f + 1) \times C_o
$$

---

##### **Padding**
Padding adds extra data around the input's borders, often to ensure the output size matches the input size.

![Padding](../assets/images/cnn/padding.png)

Output size formula with padding:
$$
O = (n + 2p - f + 1) \times (n + 2p - f + 1) \times C_o
$$
where:
- \(p\): Padding length for one side (e.g., \(p = 1\) in the image above).

To maintain the same input and output size:
$$
p = \frac{f - 1}{2}
$$
as this ensures \(n + 2p - f + 1 = n\).

---

##### **Strides**
Stride determines the step length for moving the convolution core.

![Stride 1](../assets/images/cnn/stride.png)  
![Stride 2](../assets/images/cnn/stride-2.png)

Output size formula with strides:
$$
O = \left(\frac{n + 2p - f}{s} + 1\right) \times \left(\frac{n + 2p - f}{s} + 1\right) \times C_o
$$
where:
- \(s\): Stride length.

---

#### **Demo: Calculate Output Size**

Given:
- \(p = 1\)
- \(s = 2\)
- Input size (\(S_{input}\)): \(7 \times 7 \times 3\)
- Core size (\(S_{core}\)): \(3 \times 3 \times 3\)
- Number of output channels (\(C_o\)): \(2\)

The output size (\(S_{out}\)) is calculated as:
$$
\begin{aligned}
S_{out} &= \left(\frac{n + 2p - f}{s} + 1\right) \times \left(\frac{n + 2p - f}{s} + 1\right) \times C_o \\
&= \left(\frac{7 + 2 - 3}{2} + 1\right) \times \left(\frac{7 + 2 - 3}{2} + 1\right) \times 2 \\
&= 4 \times 4 \times 2
\end{aligned}
$$

![Demo](../assets/images/cnn/demo.gif)
