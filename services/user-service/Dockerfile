FROM node:18-alpine

WORKDIR /app

# 依存関係をコピー
COPY services/user-service/package*.json ./
RUN npm install

# アプリケーションコードをコピー
COPY services/user-service/src ./src
COPY shared/schema.ts ./src/schema.ts
COPY services/user-service/tsconfig.json ./

# TypeScriptのコンパイル
RUN npm run build

# アプリケーションの起動
EXPOSE 3001
CMD ["node", "dist/server.js"] 