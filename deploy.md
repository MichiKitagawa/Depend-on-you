# deploy.md 1.0

# [deploy.md](http://deploy.md/) – Deploy & Environment Setup Guide

## 概要

本ドキュメントは、Depend on You プラットフォーム全体をローカルまたは本番環境で起動・運用するための手順と設定情報を記載するものです。

---

## ディレクトリ構成

```
/project-root
├── services/
│   ├── user-service
│   ├── content-service
│   ├── reader-action-service
│   ├── score-service
│   ├── ranking-service
│   ├── feed-service
│   ├── portfolio-service
│   ├── curation-service
│   ├── archive-service
│   └── economy-service
├── shared/
│   └── schema.ts
├── docker-compose.yml
├── .env (複数サービス共有)
└── deploy.md

```

---

## 環境構成

### 使用ツール

- Node.js (18+)
- TypeScript
- Docker / Docker Compose
- PostgreSQL（各サービス共通または分割）
- Redis（必要に応じて）

---

## Docker 起動手順（開発環境）

1. `.env` ファイルの作成

```
# .env
GLOBAL_JWT_SECRET=changeme123
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=depend_db

```

1. docker-compose 起動

```
docker-compose up --build

```

1. 各サービスへのアクセス例

```
<http://localhost:3001/users>
<http://localhost:3002/contents>
...

```

---

## サービスポート一覧

| サービス名 | ポート番号 |
| --- | --- |
| user-service | 3001 |
| content-service | 3002 |
| reader-action-service | 3003 |
| score-service | 3004 |
| ranking-service | 3005 |
| feed-service | 3006 |
| portfolio-service | 3007 |
| curation-service | 3008 |
| archive-service | 3009 |
| economy-service | 3010 |

---

## CI/CD 備考（将来的に）

- GitHub Actions による自動テスト・ビルド・本番デプロイ可
- 各サービス単位での独立デプロイ対応
- `.github/workflows/deploy.yml` などを配置予定

---

## 注意事項

- 本番環境では `.env` を Secrets Manager 等で管理してください
- DBスキーマは Prisma または TypeORM 等で別途管理することを推奨します
- 複数サービスが同一 DB を共有する場合はマイグレーション競合に注意してください