FROM node:18-alpine

WORKDIR /app

# 依存関係をコピー
COPY services/archive-service/package*.json ./
RUN npm install

# アプリケーションコードをコピー
COPY services/archive-service/src ./src
COPY shared/schema.ts ./src/schema.ts
COPY services/archive-service/tsconfig.json ./

# TypeScriptのコンパイル
RUN npm run build

# アプリケーションの起動
EXPOSE 3009
CMD ["npm", "start"] 