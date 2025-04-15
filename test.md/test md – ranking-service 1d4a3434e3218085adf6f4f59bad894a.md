# test.md – ranking-service

# [test.md](http://test.md/) – ranking-service

## 概要

`ranking-service` は、score-service からのスコアを元に、各クラスタ別のランキングを算出する。

---

## ユニットテスト

### 1. `POST /rankings/rebuild`

- 正常: clusterType="general"など指定して成功する
- 異常: 無効な clusterType -> 400

### 2. `GET /rankings`

- 正常: clusterType & limit 指定でランキング一覧を取得
- 正常: 指定なしの場合、全クラスタをレスポンス
- 異常: 無効なクエリ -> 400

---

## テスト補説

- 各作品に rankPosition が付与されていること
- 同じクラスタ内の順序が scoreValue で正しいこと
- Jest + Supertest 使用
- DBは in-memory 、モックデータ使用可