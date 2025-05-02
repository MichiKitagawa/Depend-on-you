# test.md – feed-service

# [test.md](http://test.md/) – feed-service

## 概要

`feed-service` は、ranking-service や user情報を基に、ユーザーごとにパーソナライズされたフィードを生成し、描画するサービスです。

---

## ユニットテスト

### 1. `POST /feeds/generate`

- 正常: 有効な userId でフィード生成
- 異常: 未登録ユーザー -> 404

### 2. `GET /feeds/:feedId`

- 正常: 指定 feedId の内容を取得
- 異常: 未登録ID -> 404

### 3. `GET /feeds/latest?userId=xxx`

- 正常: 指定ユーザーの最新フィードを取得
- 異常: 存在しない userId -> 404

---

## テスト補説

- contentList は、ranking-service からの情報に基づき、最新の状態を反映
- generatedAt は ISO8601 形式
- Jest + Supertest を使用
- test DB or in-memory DB でテスト実行