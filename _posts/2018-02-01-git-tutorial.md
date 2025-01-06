---
title: "Comprehensive Git Guide with Tutorials and Commands"
sitemap: true
date: 2018-02-01
tags:
  - git
  - tutorial
toc: true
description: git tutorial 
---


#### **Useful Tutorials**
- [A Simple Git Tutorial](http://rogerdudler.github.io/git-guide/index.zh.html)  
- [Git Tutorial by Atlassian](https://www.atlassian.com/git/tutorials)  
- [Git Recipes (Chinese)](https://github.com/geeeeeeeeek/git-recipes/wiki)

---

### **Table of Contents**
1. [GitHub Add Key](#github-add-key)  
2. [Git Config](#git-config)  
3. [Basic Commands](#basic-command)  
4. [Working with GitHub](#work-with-github)  
5. [Branch Management](#branch)  
6. [Merging](#merge)  
7. [Undo Changes](#UNDO)  
8. [Merge and Rebase](#merge-and-rebase)  
9. [Subtree Management](#subtree)  

---

## **GitHub Add Key**
To add your GitHub key (`id_rsa`) to `~/.ssh/`, run:  
```bash
chmod 400 ~/.ssh/id_rsa
```

---

## **Git Config**

### **Global Configuration**
```bash
git config --global core.editor "subl -n -w" # Set Sublime Text as the default editor
git config --global user.name "dongdongbh"
git config --global user.email "18310682633@163.com"

git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit --"
# Sets 'git lg' as an alias for a formatted log output
```

### **Windows Merge Tool Configuration**
```bash
git config --global --add merge.tool kdiff3
git config --global --add mergetool.kdiff3.path "C:/Program Files/KDiff3/kdiff3.exe"
git config --global --add mergetool.kdiff3.trustExitCode false
```

### **Ubuntu Merge Tool Configuration**
```bash
git config --global diff.tool kdiff3
git config --global merge.tool kdiff3
```

### **View Current Configuration**
```bash
git-config --list
git config --global --list
git config --local --list
```

---

## **Basic Commands**
```bash
git init                               # Initialize a repository
git add .                              # Add all files to the staging area
git add <file-name>                    # Add specific file
git rm <file-name>                     # Remove file
git commit -m "Message"                # Take a snapshot
git status -s                          # Show status (short format)

git log --oneline -5                   # Show the last 5 commits
git log --pretty=oneline               # Show concise commit history
git log -- <file-name>                 # Show commits for a specific file
```

---

## **Working with GitHub**
```bash
git clone <repo-url>                   # Clone a repository
git clone -b <branch> <repo-url>       # Clone a specific branch

git remote add origin <repo-url>
git remote -v                          # Show remote repository details
git pull origin master --allow-unrelated-histories
git push origin master

# Push to two repositories simultaneously
git remote add all <repo-url-1>
git remote set-url --add --push all <repo-url-2>
git push all master

git fetch --all                        # Fetch changes from all remotes
```

---

## **Branch Management**
```bash
git branch <branch-name>               # Create a branch
git checkout -b <branch-name>          # Create and switch to a branch
git branch                             # List all branches

git checkout --orphan <branch-name>    # Create an empty branch

git push origin <branch-name>          # Push branch to remote
git branch --set-upstream-to=origin/<branch-name> <local-branch-name> 
                                        # Set upstream tracking

git branch -d <branch-name>            # Delete a local branch
git push origin --delete <branch-name> # Delete a remote branch
```

---

## **Merge Operations**
```bash
git diff                               # Compare working tree with staging area
git diff --staged                      # Compare staging area with last commit
git merge <branch-name>                # Merge a branch
git mergetool                          # Use merge tool for conflict resolution
```

---

## **Undo Changes**
```bash
git checkout -- <file-name>            # Reset file from staging area
git reset HEAD <file-name>             # Reset file from commit to staging area
git reset --hard HEAD^                 # Undo the last commit
git reset --hard <commit-ID>           # Reset to a specific commit
git push -f origin <branch>            # Force push (use cautiously)

git commit --amend                     # Modify the last commit message
```

---

## **Diff and Patch**
```bash
git diff                               # Show differences not yet staged
git diff --cached                      # Show differences in staged files
git diff --name-only                   # Show only file names that differ

# Save differences to a file and apply later
git diff <from-commit> <to-commit> > patch.diff
git apply patch.diff
```

---

## **Subtree Management**
```bash
git remote add <remote-name> <repo-url>
git subtree add --prefix=<local-dir> <remote-name> <branch-name>
git subtree pull --prefix=<local-dir> <remote-name> <branch-name>
git subtree push --prefix=<local-dir> <remote-name> <branch-name>
```

---

## **Merge and Rebase**
```bash
git merge --squash <branch-name>       # Merge without retaining commits
git rebase <branch-name>               # Rebase current branch onto another
git checkout <branch-name>
git merge <re-based-branch>            # Merge after rebase (clean history)
```

---

## **Change History Tree**
```bash
git commit --amend --no-edit           # Add changes to the last commit
git rebase -i                          # Modify commit history interactively
```

---

## **Summary**

- **Git Transport:**  
  ![git transport]({{ "/assets/images/git-transport.png" | absolute_url }}){:.image-caption}  

- **Command List:**  
  ![command list]({{ "assets/images/git cmd.png" | absolute_url }}){:.image-caption}  

---

## **Copy Right**
This document is written by **Dongda**. All rights reserved.
