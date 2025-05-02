# test.md – curation-service

# [test.md](http://test.md/) – curation-service

## 概要

`curation-service` は、プレイリストやレビューなどを読者が自由に作成して公開できる機能を管理します。

---

## ユニットテスト

### 1. `POST /curations`

- 正常: 有効なデータでプレイリストを作成
- 異常: userId や items が缺けている -> 400

### 2. `GET /curations/:curationId`

- 正常: 存在するキュレーションの情報を取得
- 異常: 存在しないID -> 404

### 3. `PATCH /curations/:curationId`

- 正常: title や items を更新可
- 異常: 未許可ユーザー -> 403

---

## テスト補説

- items は contentId の配列であることを検証
- reviewBody なしでも有効
- Jest + Supertest
- test DB は truncate + seed 対応