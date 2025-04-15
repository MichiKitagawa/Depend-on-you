# test.md – score-service

# [test.md](http://test.md/) – score-service

## 概要

`score-service` は、reader-action の行動ログを基に、各作品の評価スコアを計算するロジックを描く。
本テストはそれの正常な動作を検証する。

---

## ユニットテスト

### 1. `POST /scores/recalculate`

- 正常: 有効な contentId で再計算される
- 異常: 未登録 contentId -> 404

### 2. `GET /scores/:contentId`

- 正常: 存在する contentId の score 情報を取得
- 異常: 未登録ID -> 404

### 3. `GET /scores`

- 正常: 全作品のスコアをリストで取得

---

## テスト補説

- scoreValue の値が 0 以上、評価規範に改めて対応
- detail.reReadRate / saveRate / commentDensity / userScoreFactor などの内詰まで検証
- Jest でのモックデータ使用
- Supertest で API 端点を作動検証