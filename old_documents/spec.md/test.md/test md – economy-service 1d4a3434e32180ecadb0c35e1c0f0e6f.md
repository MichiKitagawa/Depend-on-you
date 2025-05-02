# test.md – economy-service

# [test.md](http://test.md/) – economy-service

## 概要

`economy-service` は、得られた放送税、サブスクリプション費用、グッズ販売などからの収益管理と、ユーザーへの報酬配分に関する機能を含みます。

---

## ユニットテスト

### 1. `POST /economy/revenues`

- 正常: 有効な revenueType (例: subscription) で登録可
- 異常: amount が不正 -> 400

### 2. `POST /economy/payouts`

- 正常: userId/contentId/payoutReason/points を指定して配分可
- 異常: userId や contentId が無効 -> 400

### 3. `GET /economy/payouts?userId=xxx`

- 正常: userId で報酬履歴を取得
- 異常: 無効な userId -> 404 または []

---

## テスト補説

- points は定数以上であること
- payoutReason は事前に定義されたオプションに限る
- Jest + Supertest
- DB: test DB truncate ルーチン