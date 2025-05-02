# test.md – portfolio-service

# [test.md](http://test.md/) – portfolio-service

## 概要

`portfolio-service` は、読者の行動履歴をポートフォリオとして表示、管理するサービスです。

---

## ユニットテスト

### 1. `GET /portfolios/:userId`

- 正常: 存在する userId の行動履歴を取得
- 異常: 存在しない userId -> 404

### 2. `POST /portfolios/:userId/sync`

- 正常: reader-action-service からの情報を合成して更新
- 異常: 未登録 userId -> 404

---

## テスト補説

- entries の配列が、最新の boost/save/reaction/comment を反映
- timestamp が日付順に並び替えられていること
- Jest + Supertest
- test DB か in-memory 環境