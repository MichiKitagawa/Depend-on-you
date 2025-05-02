# test.md – user-service

# [test.md](http://test.md/) – user-service

## 概要

このドキュメントは `user-service` のユニットテストと統合テストのケースを定義します。
Jest や Supertest などを用いた HTTP API テストを実行することを想定します。

---

## ユニットテスト

### 1. `POST /users`

- 正常: 有効なデータで登録できる
- 異常: 重複メールは409で失敗
- 異常: パスワードが空 -> 400

### 2. `POST /users/login`

- 正常: 正しい情報でログイン -> JWTを取得
- 異常: 存在しないユーザー -> 401
- 異常: 間違ったパスワード -> 401

### 3. `GET /users/:userId`

- 正常: 存在するユーザーを取得
- 異常: 存在しない ID -> 404

### 4. `PATCH /users/:userId`

- 正常: 表示名や自己紹介を更新
- 異常: 未許可のユーザー -> 403

### 5. `GET /users/:userId/score`

- 正常: スコアを取得
- 異常: 未登録 ID -> 404

### 6. `POST /users/:userId/score`

- 正常: 新しいスコアで更新
- 異常: 不正値 -> 400
- 異常: 未許可アクセス -> 403

---

## テスト補説

- JWTの検証: ログイン結果の token が有効な形式か
- パスワードハッシュ: モックで適切に対応
- スコア更新: 許可管理を前提
- DB清撤: テストごとに削除 + データ再登録

---

## テスト実行環境

- Jest
- Supertest (Express API)
- モックサーバー / in-memory PostgreSQL (optional)
- .env.test を使用