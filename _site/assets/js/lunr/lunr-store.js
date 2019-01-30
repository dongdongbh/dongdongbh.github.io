var store = [{
        "title": "Dongdongbh, Launches Site",
        "excerpt":"Well. Finally got around to putting this old website together. Neat thing about it - powered by Jekyll and I can use Markdown to author my posts. It actually is a lot easier than I thought it was going to be.  ","categories": ["test"],
        "tags": ["content"],
        "url": "http://localhost:4000/test/dongdong-site-launched/",
        "teaser":null},{
        "title": "git tutorial ",
        "excerpt":"a simple tutorial link git tutorial Chinese version Table of contents setup git config basic command work with github branch merge UNDO merge and rebase subtree github add key add your github key file(id_rsa) to ~/.ssh/, then run following cmd in terminal: chmod 400 ~/.ssh/id_rsa git config global config git...","categories": [],
        "tags": ["git","tutorial"],
        "url": "http://localhost:4000/git-tutorial/",
        "teaser":null},{
        "title": "Markup: HTML Tags and Formatting",
        "excerpt":"A variety of common markup showing how the theme styles them. Header two Header three Header four Header five Header six Blockquotes Single line blockquote: Stay hungry. Stay foolish. Multi line blockquote with a cite reference: People think focus means saying yes to the thing you’ve got to focus on....","categories": ["Markup"],
        "tags": ["content","tutorial","formatting","html","markup"],
        "url": "http://localhost:4000/markup/markup-html-tags-and-formatting/",
        "teaser":"http://localhost:4000/assets/images/markup-syntax-highlighting-teaser.jpg"},{
        "title": "Some useful resource links",
        "excerpt":"Tutorials set     Ryan’s Tutorials   Technical     Linux Tutorial   Bash Scripting Tutorial   Regular Expressions   Philosophy     Problem Solving Skills   Graphic Design Tutorial   For fun     Rubik’s Cube Tutorial   ","categories": ["Resource"],
        "tags": ["tutorial"],
        "url": "http://localhost:4000/resource/useful-resource-link/",
        "teaser":"http://localhost:4000/assets/images/markup-syntax-highlighting-teaser.jpg"},{
        "title": "ssh connection",
        "excerpt":"Insatll and configuration $ apt-get install openssh-server $ sudo subl /etc/ssh/sshd_config $ sudo service ssh restart Show gui On server config on /etc/ssh/sshd_config X11Forwarding yes X11DisplayOffset 10 X11UseLocalhost no ForwardAgent yes ForwardX11 yes ForwardX11Trusted yes On client ssh -X remote_host(ip) test $ ssh -X user@host_ip $ xclock File transfer cmd:...","categories": ["Markup"],
        "tags": ["content","tutorial"],
        "url": "http://localhost:4000/markup/ssh-usage/",
        "teaser":"http://localhost:4000/assets/images/markup-syntax-highlighting-teaser.jpg"},{
        "title": "link tty port on linux",
        "excerpt":"How to link node name with a custom name run next cmd to see the port device $ udevadm info -a -n /dev/ttyUSB0 $(udevadm info -q path -n /dev/ttyUSB0) Then open (or create) a file in /etc/udev/rules.d/ (named, for example, serial-symlinks.rules), and put the udev rule there. $ sudo subl...","categories": ["Markup"],
        "tags": ["content","tutorial"],
        "url": "http://localhost:4000/markup/link-tty-port-on-linux/",
        "teaser":"http://localhost:4000/assets/images/markup-syntax-highlighting-teaser.jpg"},{
        "title": "Transfer files over a LAN between two Linux computers",
        "excerpt":"netcat + tar (fast but not secure) To send a directory, cd to inside the directory whose contents you want to send on the computer doing the sending and do: $ tar -cz . | nc -q 10 -l -p 45454 On the computer receiving the contents, cd to where...","categories": ["Markup"],
        "tags": ["content","tutorial"],
        "url": "http://localhost:4000/markup/file-transport/",
        "teaser":"http://localhost:4000/assets/images/markup-syntax-highlighting-teaser.jpg"},{
        "title": "Using Google cloud to build a Virtual Private Server (VPS)",
        "excerpt":"set up a VPS on Google cloud buy a VM on Google cloud (it has one year free trial now) choose Debian Linux and the place near to get fast access (eg, asia-east, asia-noutheast) use ssh connect VPS (you can use browser ssh or ssh key on terminal) if you...","categories": ["Blog"],
        "tags": ["content","tutorial"],
        "url": "http://localhost:4000/blog/vps/",
        "teaser":null},{
        "title": "Reinforcement learning notes",
        "excerpt":"Table of contents Basic Cross-entropy method Tabular Learning DQN Policy Gradients DRL in NLP NN functions basic Markov Decision Process (MDP) environment, state, observation, reward, action, agent Policy State-value function where $r_t$ is the reward at step $t$, $\\gamma\\in[0,1]$ is the discount-rate. Value function Action value function method classification model-based:...","categories": [],
        "tags": ["note"],
        "url": "http://localhost:4000/RL-note/",
        "teaser":null},{
        "title": "Convolutional Neural Networks dimension",
        "excerpt":"convolution operation: share the convolution core output size is: where input size is $n\\times n$, convolution core size is $f\\times f$. terms: channels, strides, padding channels: look following picture, the input is $6\\times 6\\times 3$ RGB picture, and we use $3\\times 3\\times 3$ convolution core, the last 3 is the...","categories": [],
        "tags": ["note"],
        "url": "http://localhost:4000/CNN-dimension/",
        "teaser":null},{
        "title": "Create your website on cloud",
        "excerpt":"Create your website on Virtual Private Server(VPS) We host our website on cloud VPS, our website based on Jekyll, so we can simply write our pages by Markdown. For the convenience of updating our site, we build Git server on VPS to auto publish it. Requirements a VPS (e.g. google...","categories": ["Resource"],
        "tags": ["tutorial"],
        "url": "http://localhost:4000/resource/create-website/",
        "teaser":"http://localhost:4000/assets/images/markup-syntax-highlighting-teaser.jpg"},]
