# Docker

* [Docker download](https://docs.docker.com/get-docker/)
* [Docker](https://www.docker.com/)
* [Docker file](https://docs.docker.com/engine/reference/builder/)
* [Docker CLI](https://docs.docker.com/engine/reference/commandline/docker/)
* [Docker Hub](https://hub.docker.com/)

docker 讓應用程式佈署在軟體容器下的工作可以自動化進行，藉此在Linux作業系統上，提供一個額外的軟體抽象層，以及作業系統層虛擬化的自動管理機制。

<img src="https://wiki.aquasec.com/download/attachments/2854889/Container_VM_Implementation.png?version=1&modificationDate=1520172703952&api=v2" align="center">

## Build image

```ruby
# -t: tag name
docker build -t docker-demo .
```

## Run image

```ruby
# -p 3000:3000 (主機 port, container port)
# --name name for container
# -d daemon 模式，放到背景去跑
docker run -d -p 3000:3000 --name demo_server docker-demo

# open http://localhost:3000/
```

## Tag and Publish the image

```ruby
# 要 push 的話，必須將 image tag 成 username/imagename 的形式才可以 push
docker tag docker-demo mgleon08/docker-demo:0.1.0

# 登入 docker hub
docker login

# push image 到 docker hub
docker push mgleon08/docker-demo:0.1.0
```

## multi-stage

* [Use multi-stage builds](https://docs.docker.com/develop/develop-images/multistage-build/)

透過 multi-stage build 可以減少 image size，也可以隱藏一些私密資訊。

## Base command

```ruby
# 查看版本
docker --version

# 從 hub 取得所需要的 images :後面為版本號，若沒加則會拉最新的
docker pull ubuntu:12.04

# 搜尋 Image
docker search ubuntu
docker search ubuntu -f is-official=true # is-official=true 官方的意思

# 列出所有正在跑的 docker
docker ps
# 列出所有 docker 包含沒在 run 的
docker ps -a
# 啟動 docker
docker start <containerID>
# 停止 docker
docker stop <containerID>
# 刪除 docker
docker rm <containerID>
# 一次刪除所有 docker
docker rm $(docker container ls -a -q)

# 列出所有 images
docker images
# 刪除 image
docker rmi <imageID>|<imageName>
# 強制刪除 image
docker rmi <imageID>|<imageName> -f
# 一次刪除所有 image
docker rmi $(docker images -q)

# 顯示 container 的資訊
docker inspect <containerID>

# 進去 container 執行 bash
# -t 選項讓 Docker 分配一個虛擬終端（pseudo-tty）並綁定到容器的標準輸入上。
# -i 則讓容器的標準輸入保持打開。
docker exec -it <imageID>|<imageName> bash

# 連到 container 最後執行
# 當多個窗口同時 attach 到同一個容器的時候，所有窗口都會同步顯示。當某個窗口因命令阻塞時,其他窗口也無法執行操作了
docker attach <imageID>|<imageName>

# 看 container log，-f=follow, -t=time
docker logs -tf <imageID>|<imageName>

# 複製檔案到外面
docker cp <containerId>:<containerPath> <localPath>

# 複製檔案到 container 裡面
docker cp  <localPath> <containerId>:<containerPath>

# 清空不需要的資源
docker system prune --all
```
