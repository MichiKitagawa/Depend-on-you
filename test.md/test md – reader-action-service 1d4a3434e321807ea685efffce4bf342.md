# test.md – reader-action-service

# [test.md](http://test.md/) – reader-action-service

## 概要

`reader-action-service` のユーザー行動ログに関するユニットテストケースを記述します。

---

## ユニットテスト

### 1. `POST /actions` 行動登録

- 正常: 有効な actionType (boost/save/comment/reaction) で登録可
- 正常: payload に対応するフィールドが含まれる
- 異常: actionType が無効 -> 400
- 異常: contentId or userId が缺けている -> 400

### 2. `GET /actions?userId=xxx`

- 正常: 指定ユーザーの行動を取得
- 異常: userId が存在しない -> 404 または []

### 3. `GET /actions?contentId=yyy`

- 正常: 指定作品の行動を取得
- 異常: contentId が無効 -> 404 または []

### 4. `GET /actions/:actionId`

- 正常: 指定 actionId の行動情報を取得
- 異常: 存在しない ID -> 404

---

## テスト補説

- actionType ごとに payload の中身を検証
- createdAt の格式 ISOチェック
- JWT などの認証は前提としてモック可

---

## テスト実行

- Jest + Supertest
- DB truncate 復元
- test.db もしくは in-memory DB