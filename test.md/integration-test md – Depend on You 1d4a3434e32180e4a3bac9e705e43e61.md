# integration-test.md – Depend on You

# [integration-test.md](http://integration-test.md/) – Depend on You

## 概要

本ドキュメントは、「Depend on You」のマイクロサービス構成における、最低限必要な統合テストケースを記述します。
ユーザー登録／証明／行動記録／スコア算出／ランキング／フィード生成までの一連のフローを検証します。

---

## シナリオ 1: 新規登録~ランキング生成

### 流れ

1. `POST /users` でユーザー登録
2. `POST /users/login` で証明
3. `POST /contents` で作品登録
4. `POST /contents/:contentId/episodes` で話投稿
5. `POST /actions` でブースト行動記録
6. `POST /scores/recalculate` でスコア算出
7. `POST /rankings/rebuild` でランキング更新
8. `POST /feeds/generate` でフィード生成

### 検証項目

- 各APIがステータスコード 200/201 を返すこと
- 正しい情報の連携が継続していること
- ranking, feed が対応する contentId を含む

---

## シナリオ 2: 行動からポートフォリオ表示

1. `POST /actions` (boost/save)
2. `POST /portfolios/:userId/sync`
3. `GET /portfolios/:userId`

### 検証

- 行動がポートフォリオ entries に反映
- 行動タイプ/時刻が正しい

---

## シナリオ 3: 作品完結~アーカイブ、再配信

1. `POST /contents/:contentId/complete`
2. `POST /archives` で登録
3. `POST /archives/:archiveId/trigger`
4. `GET /feeds/latest?userId=xxx`

### 検証

- archive に archivedAt/lastTrigger が登録される
- feed に contentId が含まれる

---

## 実行環境

- Jest + Supertest
- docker-compose などの統合空間
- CI編集パイプライン上での繰り返して実行