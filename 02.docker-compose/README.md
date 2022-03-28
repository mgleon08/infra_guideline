# Docker Compose

* [Docker Compose file](https://docs.docker.com/compose/compose-file/)
* [Docker Compose CLI](https://docs.docker.com/compose/reference/)

Docker Compose 是一個工具，用來定義與執行多個 container 組成的 Docker Applications。你可以使用 Compose 檔案來組態設定你的應用服務。然後使用單一命令，透過你的組態設定來建立與啟動你的服務。

使用 Compose 有基本的三個處理步驟：

* 使用 Dockerfile 定義你的 app 環境，讓它可以在任何地方都能複製(reproduced)。
* 使用 docker-compose.yml 定義你的服務，讓他們可以在獨立環境內一起執行。
* 最後，執行 docker-compose up，Compose 將會開始與執行你所有的 app。

# Start

```ruby
# 建立 image
docker-compose build
# -d 背景處理 (image 還沒 build 也會自動去 build)
docker-compose up -d
docker-compose stop
docker-compose down
```
