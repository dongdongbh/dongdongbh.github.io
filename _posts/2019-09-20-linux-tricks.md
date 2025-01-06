---
title: "Mastering the Linux Command Line: Tips and Tricks"
classes: wide
sitemap: true
categories:
tags:
  - tutorial
toc: true
toc_label: "Table of Contents"
description: Linux terminal shortcuts list
---


## Navigating the Directory
- **`cd -`**: Switch back to the last working directory.

---

## Running Multiple Commands

- **Run commands sequentially**:
  ```bash
  command_1; command_2; command_3
  ```

- **Run commands sequentially only if the previous command succeeds**:
  ```bash
  command_1 && command_2
  ```

---

## Previous Commands and Arguments

- **Repeat the last command**:
  ```bash
  !!
  ```

- **Access specific arguments of the previous command**:
  - `!:n`: Replace with the nth argument of the last command.  
    Example: `!:0` for the command itself, `!:-1` for the first argument.
  - **Keyboard shortcuts**:
    - <kbd>Alt</kbd> + <kbd>.</kbd>: Last argument of any previous command.
    - <kbd>Esc</kbd> + <kbd>.</kbd>: Last argument of the most recent command.

- **Common argument patterns**:
  ```bash
  !^      # First argument
  !$      # Last argument
  !*      # All arguments
  !:2     # Second argument
  !:2-3   # Second to third arguments
  !:2-$   # Second to last arguments
  !:2*    # Second to all arguments
  !:2-    # Second to second-last arguments
  !!      # Repeat the last command
  ```

---

## Spelling Check in Linux
- Use `look` to check word spelling:
  ```bash
  look docum
  ```

---

## Linux Terminal Shortcuts

1. **<kbd>Ctrl</kbd> + <kbd>a</kbd>**: Move to the start of the line.
2. **<kbd>Ctrl</kbd> + <kbd>e</kbd>**: Move to the end of the line.
3. **<kbd>Ctrl</kbd> + <kbd>u</kbd>**: Cut everything before the cursor.
4. **<kbd>Ctrl</kbd> + <kbd>k</kbd>**: Cut everything after the cursor.
5. **<kbd>Ctrl</kbd> + <kbd>l</kbd>**: Clear the terminal.
6. **<kbd>Ctrl</kbd> + <kbd>r</kbd>**: Search command history.
7. **<kbd>Ctrl</kbd> + <kbd>b</kbd>**: Move back one character.
8. **<kbd>Alt</kbd> + <kbd>b</kbd>**: Move back one word.
9. **<kbd>Ctrl</kbd> + <kbd>f</kbd>**: Move forward one character.
10. **<kbd>Alt</kbd> + <kbd>f</kbd>**: Move forward one word.
11. **<kbd>Ctrl</kbd> + <kbd>d</kbd>**: Delete the current character.
12. **<kbd>Ctrl</kbd> + <kbd>w</kbd>**: Cut the last word.
13. **<kbd>Alt</kbd> + <kbd>d</kbd>**: Cut the word after the cursor.
14. **<kbd>Alt</kbd> + <kbd>w</kbd>**: Cut the word before the cursor.
15. **<kbd>Ctrl</kbd> + <kbd>y</kbd>**: Paste the last deleted content.
16. **<kbd>Ctrl</kbd> + <kbd>_</kbd>**: Undo.
17. **<kbd>Ctrl</kbd> + <kbd>x</kbd>, <kbd>x</kbd>**: Toggle between the first and current cursor position.
18. **<kbd>Ctrl</kbd> + <kbd>c</kbd>**: Cancel the current command.
19. **<kbd>Ctrl</kbd> + <kbd>j</kbd>**: End search at the current history entry.
20. **<kbd>Ctrl</kbd> + <kbd>g</kbd>**: Cancel search and restore the original line.
21. **<kbd>Ctrl</kbd> + <kbd>n</kbd>**: Next command in history.
22. **<kbd>Ctrl</kbd> + <kbd>p</kbd>**: Previous command in history.

For more, check [StackOverflow](https://stackoverflow.com/questions/9679776/how-do-i-clear-delete-the-current-line-in-terminal).

---

## CSV Files: Pretty Display in Terminal
Add this function to your `.bashrc`:
```bash
function pretty_csv {
    column -t -s, -n "$@" | less -F -S -X -K
}
```
Use with:
```bash
pretty_csv your_file.csv
```

---

## Pretty Code Printing with `enscript`
```bash
sudo apt install enscript
enscript -2rj --highlight=python --color=1 -o output.ps your_script.py
```

---

## Check Disk Usage
```bash
sudo du -ah --max-depth=1 / | sort -hr
```

---

## Scheduling Tasks with Crontab
Edit and schedule tasks:
```bash
cron -e
```
