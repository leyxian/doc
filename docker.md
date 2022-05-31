【查看当前正在运行的容器】
docker ps 

【查看所有容器的状态】
docker ps -a

【启动/停止某个容器】
docker start/stop id/name

【进入某个容器(使用exit退出后容器也跟着停止运行)】
docker attach id

【启动一个伪终端以交互式的方式进入某个容器（使用exit退出后容器不停止运行）】
docker exec -ti id /bin/bash

【查看本地镜像】
docker images 

【删除某个容器】
docker rm id/name

【删除某个镜像】
docker rmi id/name

【复制ubuntu容器并且重命名为test且运行，然后以伪终端交互式方式进入容器，运行bash】
docker run --name test -ti ubuntu /bin/bash

【通过当前目录下的Dockerfile创建一个名为soar/centos:7.1的镜像】
docker build -t soar/centos:7.1 . 

【以镜像soar/centos:7.1创建名为test的容器，并以后台模式运行，并做端口映射到宿主机2222端口，P参数重启容器宿主机端口会发生改变】
[/usr/sbin/init 提高权限]
docker run -d -p 2222:22 --name test soar/centos:7.1 /usr/sbin/init

docker run -d -p 80:80 -p 443:443 -v d:/web:/www/wwwroot --link=memcache:memcache lnmp richarvey/nginx-php-fpm:php5

docker run -itd --name c8 --privileged -p 8888:8888 -p 80:80 -p 22:22 -p 3306:3306 -p 8099:8099 -v F:/php:/www/wwwroot centos /usr/sbin/init

[service not found]
yum install initscripts 

docker run --name my-memcache -d memcached

docker run --link my-memcache:memcache -d my-app-image

docker run --name my-memcache -d memcached memcached -m 64

【centos8 yum】
sudo sed -i -e "s|mirrorlist=|#mirrorlist=|g" /etc/yum.repos.d/CentOS-*
sudo sed -i -e "s|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g" /etc/yum.repos.d/CentOS-*

【修改端口】
cd /var/lib/docker/3b6ef264a040* #这里是CONTAINER ID
如果config.v2.json里面也记录了端口，也要修改
vi hostconfig.json
如果之前没有端口映射, 应该有这样的一段:
"PortBindings":{}
增加一个映射, 这样写:
"PortBindings":{"3306/tcp":[{"HostIp":"","HostPort":"3307"}],"80/tcp":[{"HostIp":"","HostPort":"8080"}]}
前一个数字是容器端口, 后一个是宿主机端口. 
而修改现有端口映射更简单, 把端口号改掉就行.

【退出】
Ctrl+P+Q

【端口映射查看】
docker port

【IP查看】
docker inspect lnmp | grep IPAddress

【将容器a404c6c174a2 保存为新的镜像,并添加提交人信息和说明信息。】
docker commit -a "runoob.com" -m "my apache" a404c6c174a2  mymysql:v1 

【自启动】
docker update --restart=always [容器名]

【访问宿主机】
RUN /sbin/ip route|awk '/default/ { print  $3,"\tdockerhost" }' >> /etc/hosts


【laradock】
PHP_VERSION=7.2
WORKSPACE_INSTALL_SOAP=true
WORKSPACE_INSTALL_IMAP=true
WORKSPACE_TIMEZONE=Asia/Shanghai
PHP_FPM_INSTALL_MEMCACHE=true
PHP_FPM_INSTALL_IMAP=true
PHP_FPM_INSTALL_SOAP=true
WORKSPACE_INSTALL_NPM_GULP=false
WORKSPACE_INSTALL_YARN=false

# WSL
## 修改wsl版本
wsl --set-version <name> 1

## 查看
wsl -l -v

# .wslconfig
```
[wsl2]
guiApplications=false
memory=2GB
swap=1GB
swapFile=F:\wsl\centos\swap.vhdx
processors=1
localhostForwarding=true
```