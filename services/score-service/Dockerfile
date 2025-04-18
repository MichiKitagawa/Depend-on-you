FROM node:18-alpine

WORKDIR /app

# 依存関係をコピー
COPY services/score-service/package*.json ./
RUN npm install

# アプリケーションコードをコピー
COPY services/score-service/src ./src
COPY shared/schema.ts ./src/schema.ts
COPY services/score-service/tsconfig.json ./

# TypeScriptのコンパイル
RUN npm run build

# アプリケーションの起動
EXPOSE 3004

CMD ["node", "dist/server.js"] 