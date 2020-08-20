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

!:n : the n of previous command argument. e.g. !:0 is the last command, and !:-1 is the first argument of last command

<kbd>Alt</kbd>+<kbd>.</kbd>  the last argument of any of the previous commands.

<kbd>Esc</kbd> +<kbd> .</kbd>  last argument of the last command.

```
!^      first argument
!$      last argument
!*      all arguments
!:2     second argument

!:2-3   second to third arguments
!:2-$   second to last arguments
!:2*    second to last arguments
!:2-    second to next to last arguments

!:0     the command
!!      repeat the previous line
```

#### Check for Spelling of Words in Linux

`look docum`


## Linux terminal shortcuts list

1. **<kbd>Ctrl</kbd>+<kbd>a</kbd>** Move cursor to **start of line**
2. **<kbd>Ctrl</kbd>+<kbd>e</kbd>** Move cursor to **end of line**
3. **<kbd>Ctrl</kbd>+<kbd>u</kbd>** Cut everything **before the cursor**
4. **<kbd>Ctrl</kbd>+<kbd>k</kbd>** Cut everything **after the cursor**
5. **<kbd>Ctrl</kbd>+<kbd>i</kbd>** Clear the terminal
6. <kbd>Ctrl</kbd>+<kbd>r</kbd> **Search** command in history - type the search term
7. <kbd>Ctrl</kbd>+<kbd>b</kbd> Move back one character
8. <kbd>Alt</kbd>++<kbd>b</kbd> Move back one word
9. <kbd>Ctrl</kbd>+<kbd>f</kbd> Move forward one character
10. <kbd>Alt</kbd>++<kbd>f</kbd> Move forward one word
11. <kbd>Ctrl</kbd>+<kbd>d</kbd> Delete current character
12. <kbd>Ctrl</kbd>+<kbd>w</kbd> Cut the last word
13. <kbd>Alt</kbd>++<kbd>d</kbd> Cut word after the cursor
14. <kbd>Alt</kbd>++<kbd>w</kbd> Cut word before the cursor
15. <kbd>Ctrl</kbd>+<kbd>y</kbd> Paste the last deleted command
16. <kbd>Ctrl</kbd>+<kbd>_</kbd> Undo
17. <kbd>Ctrl</kbd>+<kbd>x</kbd>x Toggle between first and current position
18. <kbd>Ctrl</kbd>+<kbd>c</kbd> Cancel the command 
19. <kbd>Ctrl</kbd>+<kbd>j</kbd> End the search at current history entry
20. <kbd>Ctrl</kbd>+<kbd>g</kbd> Cancel the search and restore original line
21. <kbd>Ctrl</kbd>+<kbd>n</kbd> Next command from the History
22. <kbd>Ctrl</kbd>+<kbd>p</kbd> previous command from the History

Ref [stackoverflow](<https://stackoverflow.com/questions/9679776/how-do-i-clear-delete-the-current-line-in-terminal>)

## pretty view csv file in terminal

add this to .bashrc, and then just `pretty_csv xxx.csv`

```
function pretty_csv {
    column -t -s, -n "$@" | less -F -S -X -K
}
```

## pretty print code in paper with `enscript`

```bash
sudo apt install enscript
enscript -2rj --highlight=python --color=1 -o minpack.ps minpack.py
```

## Check disk usage

```bash
sudo du -ah --max-depth=1  / | sort -hr
```

create crontab tasks with `cron -e`