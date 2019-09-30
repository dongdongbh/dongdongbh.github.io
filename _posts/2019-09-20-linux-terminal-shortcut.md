---
title: "Linux tricks"
classes: wide
sitemap: true
header:
  teaser: "assets/images/markup-syntax-highlighting-teaser.jpg"
categories:
tags:
  - tutorial
toc: true
toc_label: "Table of Contents"
description: Linux terminal shortcuts list
---
## Tricks on Linux command line
`cd -`: back to  the last working directory

#### Running multiple commands

* Running multiple commands in one single command

	```
command_1; command_2; command_3
	```

* Running multiple commands in one single command only if the **previous command was successful**

  ```
  command_1 && command_2
  ```

#### Previous commands and arguments

!! the last command

!\$: the $ of previous command argument

Alt+. previous command argument

#### Check for Spelling of Words in Linux

`look docum`


## Linux terminal shortcuts list

1. Ctrl+a Move cursor to **start of line**
2. Ctrl+e Move cursor to **end of line**
3. Ctrl+b Move back one character
4. Alt+b Move back one word
5. Ctrl+f Move forward one character
6. Alt+f Move forward one word
7. Ctrl+d Delete current character
8. Ctrl+w Cut the last word
9. Ctrl+k Cut everything **after the cursor**
10. Alt+d Cut word after the cursor
11. Alt+w Cut word before the cursor
12. Ctrl+y Paste the last deleted command
13. Ctrl+_ Undo
14. Ctrl+u Cut everything **before the cursor**
15. Ctrl+xx Toggle between first and current position
16. Ctrl+l **Clear the terminal**
17. Ctrl+c Cancel the command 
18. Ctrl+r **Search** command in history - type the search term
19. Ctrl+j End the search at current history entry
20. Ctrl+g Cancel the search and restore original line
21. Ctrl+n Next command from the History
22. Ctrl+p previous command from the History

Ref [stackoverflow](<https://stackoverflow.com/questions/9679776/how-do-i-clear-delete-the-current-line-in-terminal>)

## pretty view csv file in terminal

add this to .bashrc, and then just `pretty_csv xxx.csv`

```
function pretty_csv {
    column -t -s, -n "$@" | less -F -S -X -K
}
```

