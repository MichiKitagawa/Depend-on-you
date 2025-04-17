FROM node:16-alpine

WORKDIR /app

# 依存関係のコピーとインストール
COPY services/portfolio-service/package*.json ./
COPY shared/ ../shared/

RUN npm install

# ソースコードのコピー
COPY services/portfolio-service/ ./

# TypeScriptのビルド
RUN npm run build

# アプリケーションの実行
EXPOSE 3007
CMD ["npm", "start"] 