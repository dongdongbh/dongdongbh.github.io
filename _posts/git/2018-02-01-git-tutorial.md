---
title: "git tutorial "
date: 2018-02-01
---
[a simple tutorial link](http://rogerdudler.github.io/git-guide/index.zh.html)
----------------------------------------------------------------------
## Table of contents
* [setup](git-tutorial#github-add-key)
* [git config](git-tutorial#git-config)
* [basic command](git-tutorial#basic-command)
* [work with remote](git-tutorial#work-with-remote)
* [branch](git-tutorial#branch)
* [merge](git-tutorial#merge)
* [UNDO](git-tutorial#UNDO)
* [merge and rebase](git-tutorial#merge-and-rebase)
* [subtree](git-tutorial#subtree)



## github add key 
add your github key file(id_rsa) to ~/.ssh/, then run following cmd in terminal:
`chmod 400 ~/.ssh/id_rsa`
## git config

### global config
```
git config --global core.editor "subl -n -w"            //change vi to subl
git config --global user.name "dongdongbh"
git config --global user.email "18310682633@163.com"
alias graph="git log --all --decorate --oneline --graph"
```
### windows merge tool config
```
git config --global --add merge.tool kdiff3                                             //need to install kdiff3
git config --global --add mergetool.kdiff3.path "C:/Program Files/KDiff3/kdiff3.exe"        
git config --global --add mergetool.kdiff3.trustExitCode false
```
### ubuntu merge tool config
```
git config --global diff.tool kdiff3
git config --global merge.tool kdiff3
```
### revive config
```
git-config --list
git config --global --list
git config --local  --list
```
## basic command
```
git init
git add .                   //add all files to staging area
git add file-name
git rm file-name
git commit -m "init commit"         //take a commit (snapshot)
git status -s                   //show short status

git log --oneline -5                //view recent 5 commit massage
git log --pretty=oneline            //show the vision ID
git log --file-name             //show commits about file
```
## work with remote repository
```
git clone                       //clone others git repository
git clone -b <branch> <remote_repo>         //clone a single branch

git remote add origin https://github.com/dongdongbh/Test.git
git remote -v                       //look up remote repository
git pull origin master --allow-unrelated-histories
git push origin master

git fetch --all
```
## branch
```
git branch local                    //add branch
git checkout -b local_2                 //add branch and switch to it
git branch                      //show branches

git checkout local                  //switch to branch
git commit -a -m 'branch update'            //commit all tracking file
git push origin local                   //add local branch to remote server

git fetch origin                //get remote branch(that exists only on the remote, but not locally)
git checkout --track origin/<remote_branch_name>

git push -d <remote_name> <branch_name>         //delete remote branch
git branch —set-upstream-to=master origin/master    //tracking remote master
git branch -vv                      //check remote master
git branch -d local_2
git push origin :Local                  //delete Local branch from remote server
```
## merge
```
git diff                    //diff between working tree and staging area
git diff --staged               //diff between staging area and last commit
git checkout master         
git merge local_2

git merge origin/master             //merge with remote branch
git mergetool
```

## UNDO
```
git checkout -- file-name               //reset file from stage area to working tree
git checkout hash_id -- file            //reset file from specific commit to working tree and staging area
git reset HEAD file-name            //reset file from commit to stage area

git reset --hard HEAD^              //reset the last vision
git reset --hard    ID          //ID is vision ID, and change to the vision     
git reset --hard origin/master          //reset to remote master
git reset --hard origin/master          //use this two command to replace the local by remote
```
## subtree 
set remote module repositoryS as a subtree of project repositoryA

```
git remote add xxx(remote submodule repositoryS) github_remote_address
git subtree add --prefix=local_dir xxx master 
git subtree pull --prefix=local_dir xxx master      //pull from remote module repositoryS
git subtree push --prefix=local_dir xxx master      //push to remote module repositoryS
git push origin master                  //push to the project repositoryA
```
## merge and rebase
```
git merge --squash another_branch       //merge anther branch but delete the commits on that branch
git commit -m "xxxxxx"              //add commit to this merge work


git rebase another_branch           //re-base current branch to another branch  
git checkout another_branch                 
git merge rebased_branch            //merge re-based branch (fast forward). to achieve a clear history
```
![command list](https://github.com/dongdongbh/dongdongbh.github.io/blob/master/_posts/git/git%20cmd.png "command list")
## copy right
tutorial write by Dongda. All rights reserved.