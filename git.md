# git

## 下载
* https://git-scm.com/download/win
* 安装后在文件夹下右击 Git Bash Here

## 初始化仓库
```
git init --bare
```
## 生成秘钥
```
ssh-keygen -t rsa -C "ah.liulei@foxmail.com"
```
* 一直Enter
* 密钥 默认存在在用户文件夹/.ssh/id_rsa.pub
## 添加
```
git add .
```
## 代码提交
```
git commit -am [remark]
```
## 添加
```
git remote add [origin_name] [git_url]
```
## 推送
```
git push [origin_name] [local_branch_name]:[remote_branch_name]
```
* -u 记录push到远端分支的默认值
* -f 强制推送
## 下载项目[clone]
```
git clone url
git clone -b branch_name
```
## 拉取更新
```
git pull [origin_name] [remote_branch_name]:[local_branch_name]
```
### 绑定用户
```
git config --global user.name [username]
git config --global user.email [email]
```
``` 获取远程更新
git fetch 
```
* --all 所有更新

## 添加远程仓库
```
git remote add origin url
```
## 删除远程仓库
```
git remote remove origin
```
## 合并仓库
```
git fetch
git merge [branch_name] [origin_name]/[branch_name]
```
## 查看所有远程仓库
```
git remote -v
```
## 删除跟踪的文件
```
git rm -r --cache /cache/*
```
# 分支
## 添加分支
```
git branch test
```
* -b 创建并切换到分支
## 删除分支
```
git branch -D test
```
## 切换分支
```
git checkout test
```
## 推送分支
```
git push [local_branch_name]:[remote_branch_name]
```
## 删除远程分支
```
git push origin --delete test
```
## 分支合并
```
git merge [branch]
```
## 提取分支文件
```
git checkout 分支名 文件
git checkout -b 分支名 origin/分支名
git checkout tagName
```
## 主项目添加子模块
```
git submodule add
```
## 覆盖本地
```
git fetch --all
git reset --hard origin/master
```
## 数据库维护
```
git count-objects -v
git gc
```
## 文件日志
```
git log --pretty=oneline 文件路劲
git show 日志编号
```
## 屏蔽文件
.gitignore
使用通配符屏蔽不需要的文件或目录
*.log   所有以.log为结尾的文件
data/*  目录中结构中出现data,例：/data/*,/upload/data/*,……
/data/* 根目录下data

【乱码路径】
git config --global core.quotepath false

【清空文件】
git clean  -d  -fx

<!-- php -->
.svn/
cache/
tmp/
temp/
upload/
*.php.tpl
*.cache
*.log
*.sql
*.zip

# hooks
```
vim post-update
```
```
unset $(git rev-parse --local-env-vars)
cd /data/www/ontransportjp.com
git pull
```