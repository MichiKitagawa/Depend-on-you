FROM node:18-alpine

WORKDIR /app

# 依存関係をコピー
COPY services/economy-service/package*.json ./
RUN npm install

# アプリケーションコードをコピー
COPY services/economy-service/src ./src
COPY shared/schema.ts ./src/schema.ts
COPY services/economy-service/tsconfig.json ./

# TypeScriptのコンパイル
RUN npm run build

# アプリケーションの起動
EXPOSE 3010
CMD ["npm", "start"] 