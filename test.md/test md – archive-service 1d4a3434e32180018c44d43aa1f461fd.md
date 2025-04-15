# test.md – archive-service

# [test.md](http://test.md/) – archive-service

## 概要

`archive-service` は、完結した作品をアーカイブとして管理し、再評価トリガーを発行する機能を担当します。

---

## ユニットテスト

### 1. `POST /archives`

- 正常: contentId を指定してアーカイブ登録が成功
- 異常: 必須項目缺如 -> 400

### 2. `GET /archives/:contentId`

- 正常: 存在する作品のアーカイブ情報を取得
- 異常: 未登録 ID -> 404

### 3. `POST /archives/:archiveId/trigger`

- 正常: 再配信トリガー発行が成功
- 異常: archiveId が無効 -> 404

---

## テスト補説

- archivedAt は現在日時
- lastTrigger は trigger API 呼出しで一致
- Jest + Supertest 利用
- DB: in-memory or test DB