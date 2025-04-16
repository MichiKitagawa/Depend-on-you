FROM node:18-alpine

WORKDIR /app

# 依存関係をコピー
COPY services/content-service/package*.json ./
COPY shared/ /app/shared/

# 依存関係のインストール
RUN npm install

# アプリケーションコードをコピー
COPY services/content-service/ ./

# TypeScriptのコンパイル
RUN npm run build

# アプリケーションの起動
EXPOSE 3002
CMD ["node", "dist/server.js"] 