FROM node:18-alpine

WORKDIR /app

# 依存関係をコピー
COPY services/content-service/package*.json ./
RUN npm install

# アプリケーションコードをコピー
COPY services/content-service/src ./src
COPY shared/schema.ts ./src/schema.ts
COPY services/content-service/tsconfig.json ./

# TypeScriptのコンパイル
RUN npm run build

# アプリケーションの起動
EXPOSE 3002
CMD ["node", "dist/server.js"] 