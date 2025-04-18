FROM node:18-alpine

WORKDIR /app

# 依存関係をコピー
COPY services/ranking-service/package*.json ./
RUN npm install

# アプリケーションコードをコピー
COPY services/ranking-service/src ./src
COPY shared/schema.ts ./src/schema.ts
COPY services/ranking-service/tsconfig.json ./

# TypeScriptのコンパイル
RUN npm run build

# アプリケーションの起動
EXPOSE 3005

CMD ["node", "dist/server.js"] 