FROM node:18-alpine

WORKDIR /app

# 依存関係をコピー
COPY services/curation-service/package*.json ./
RUN npm install

# アプリケーションコードをコピー
COPY services/curation-service/src ./src
COPY shared/schema.ts ./src/schema.ts
COPY services/curation-service/tsconfig.json ./

# TypeScriptのコンパイル
RUN npm run build

# アプリケーションの起動
EXPOSE 3008
CMD ["npm", "start"] 