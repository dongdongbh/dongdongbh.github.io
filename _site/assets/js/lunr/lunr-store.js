var store = [{
        "title": "Dongdongbh, Launches Site",
        "excerpt":"Well. Finally got around to putting this old website together. Neat thing about it - powered by Jekyll and I can use Markdown to author my posts. It actually is a lot easier than I thought it was going to be.","categories": ["test"],
        "tags": ["content"],
        "url": "http://localhost:4000/test/dongdong-site-launched/",
        "teaser":null},{
        "title": "git tutorial ",
        "excerpt":"a simple tutorial link git tutorial Chinese versionTable of contents setup git config basic command work with github branch merge UNDO merge and rebase subtreegithub add keyadd your github key file(id_rsa) to ~/.ssh/, then run following cmd in terminal:chmod 400 ~/.ssh/id_rsagit configglobal configgit config --global core.editor \"subl -n -w\" //change...","categories": [],
        "tags": ["git","tutorial"],
        "url": "http://localhost:4000/git-tutorial/",
        "teaser":null},{
        "title": "Markup: HTML Tags and Formatting",
        "excerpt":"A variety of common markup showing how the theme styles them.Header twoHeader threeHeader fourHeader fiveHeader sixBlockquotesSingle line blockquote: Stay hungry. Stay foolish.Multi line blockquote with a cite reference: People think focus means saying yes to the thing you’ve got to focus on. But that’s not what it means at all....","categories": ["Markup"],
        "tags": ["content","tutorial","formatting","html","markup"],
        "url": "http://localhost:4000/markup/markup-html-tags-and-formatting/",
        "teaser":"http://localhost:4000/assets/images/markup-syntax-highlighting-teaser.jpg"},{
        "title": "Some useful resource links",
        "excerpt":"Tutorials set  Ryan’s TutorialsTechnical  Linux Tutorial  Bash Scripting Tutorial  Regular ExpressionsPhilosophy  Problem Solving Skills  Graphic Design TutorialFor fun  Rubik’s Cube Tutorial","categories": ["Resource"],
        "tags": ["tutorial"],
        "url": "http://localhost:4000/resource/useful-resource-link/",
        "teaser":"http://localhost:4000/assets/images/markup-syntax-highlighting-teaser.jpg"},{
        "title": "ssh connection",
        "excerpt":"Insatll and configuration$ apt-get install openssh-server$ sudo subl /etc/ssh/sshd_config$ sudo service ssh restartShow guiOn serverconfig on /etc/ssh/sshd_config X11Forwarding yes X11DisplayOffset 10 X11UseLocalhost no ForwardAgent yes ForwardX11 yes ForwardX11Trusted yesOn clientssh -X remote_host(ip)test$ ssh -X user@host_ip$ xclockFile transfercmd:$ scp &lt;file&gt; &lt;username&gt;@&lt;IP address or hostname&gt;:&lt;Destination&gt;$ scp -r (recursive) username@server:(remote location) (local location)$...","categories": ["Markup"],
        "tags": ["content","tutorial"],
        "url": "http://localhost:4000/markup/ssh-usage/",
        "teaser":"http://localhost:4000/assets/images/markup-syntax-highlighting-teaser.jpg"},{
        "title": "link tty port on linux",
        "excerpt":"How to link node name with a custom name run next cmd to see the port device $ udevadm info -a -n /dev/ttyUSB0 $(udevadm info -q path -n /dev/ttyUSB0) Then open (or create) a file in /etc/udev/rules.d/ (named, for example, serial-symlinks.rules), and put the udev rule there. $ sudo subl...","categories": ["Markup"],
        "tags": ["content","tutorial"],
        "url": "http://localhost:4000/markup/link-tty-port-on-linux/",
        "teaser":"http://localhost:4000/assets/images/markup-syntax-highlighting-teaser.jpg"},{
        "title": "Transfer files over a LAN between two Linux computers",
        "excerpt":"netcat + tar (fast but not secure)To send a directory, cd to inside the directory whose contents you want to send on the computer doing the sending and do:$ tar -cz . | nc -q 10 -l -p 45454On the computer receiving the contents, cd to where you want the...","categories": ["Markup"],
        "tags": ["content","tutorial"],
        "url": "http://localhost:4000/markup/file-transport/",
        "teaser":"http://localhost:4000/assets/images/markup-syntax-highlighting-teaser.jpg"},]
