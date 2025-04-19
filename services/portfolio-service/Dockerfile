FROM node:18-alpine

WORKDIR /app

# 依存関係をコピー
COPY services/portfolio-service/package*.json ./
RUN npm install

# アプリケーションコードをコピー
COPY services/portfolio-service/src ./src
COPY shared/schema.ts ./src/schema.ts
COPY services/portfolio-service/tsconfig.json ./

# TypeScriptのコンパイル
RUN npm run build

# アプリケーションの起動
EXPOSE 3007
CMD ["node", "dist/index.js"] 