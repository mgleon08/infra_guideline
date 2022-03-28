# Base image
FROM node:alpine

# 設定 App 主要的放置位置
ENV APP_PATH /usr/src/app

# 將檔案複製到 $APP_PATH 位置
COPY . $APP_PATH

# 切換到 $APP_PATH 目錄
WORKDIR $APP_PATH

# 安裝 bash (因為 alpine 比較輕量化，因此要額外安裝)
RUN apk update \
    && apk upgrade \
    && apk add bash

# 安裝 dependencies
RUN yarn install

# 指定啟動 container 後執行命令
CMD ["yarn", "run", "start"]
