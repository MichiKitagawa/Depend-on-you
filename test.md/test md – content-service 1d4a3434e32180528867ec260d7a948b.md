# test.md – content-service

# [test.md](http://test.md/) – content-service

## 概要

`content-service` のユニットテストを指定します。
未来的には統合テストも追加しますが、現段階は各APIの単体機能の検証を主目的とします。

---

## ユニットテスト

### 1. `POST /contents` 新規作品登録

- 正常: 有効な情報で作成される
- 異常: 必須項目が缺けていると400

### 2. `GET /contents/:contentId` 作品情報取得

- 正常: 存在するIDで取得可
- 異常: 未登録ID -> 404

### 3. `PATCH /contents/:contentId` 作品更新

- 正常: タイトルや説明を更新
- 異常: 他人の作品 -> 403

### 4. `POST /contents/:contentId/episodes` 話投稿

- 正常: 作品に話を追加
- 異常: 不正な contentId -> 404

### 5. `GET /contents/:contentId/episodes` 話一覧取得

- 正常: 連続順で話を取得
- 異常: 話がない場合は空配列

### 6. `PATCH /contents/:contentId/episodes/:episodeId` 話更新

- 正常: 本文やタイトルを更新
- 異常: 未登録ID -> 404
- 異常: 許可なし -> 403

### 7. `POST /contents/:contentId/complete` 作品完結変更

- 正常: status = "completed" に更替
- 異常: 未登録ID -> 404

---

## テスト補説

- DBは毎テスト前に truncate & seed
- authorId の管理は JWT からの抽出を想定
- 話の順序 (orderIndex) を保持するロジック
- テストフレームワーク: Jest + Supertest