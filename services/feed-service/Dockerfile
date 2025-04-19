FROM node:18-alpine

WORKDIR /app

# 依存関係をコピー
COPY services/feed-service/package*.json ./
RUN npm install

# アプリケーションコードをコピー
COPY services/feed-service/src ./src
COPY shared/schema.ts ./src/schema.ts
COPY services/feed-service/tsconfig.json ./

# TypeScriptのコンパイル
RUN npm run build

# アプリケーションの起動
EXPOSE 3006
CMD ["npm", "start"] 