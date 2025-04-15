# spec.md – score-service １.0

# [spec.md](http://spec.md/) – score-service

## 概要

reader-action-service から収集されたデータを基に、作品の評価スコアを算出するAPI仕様。

---

## データモデル

### テーブル: `scores`

| カラム名 | 型 | 説明 |
| --- | --- | --- |
| score_id | string | スコアID (UUID) |
| content_id | string | 対象作品ID |
| score_value | number | 総合スコア |
| detail | JSON | 内訳（再読率、保存率、コメント密度など） |
| updated_at | DateTime | 最新更新日 |

---

## API エンドポイント

### 1. POST `/scores/recalculate`

特定の作品スコアを再算出

### Request Body

```json
{
  "contentId": "string"
}

```

### Response

- `200 OK`

```json
{
  "contentId": "string",
  "scoreValue": 82,
  "detail": {
    "reReadRate": 0.15,
    "saveRate": 0.10,
    "commentDensity": 0.05,
    "userScoreFactor": 1.2
  }
}

```

- `404 Not Found`

---

### 2. GET `/scores/:contentId`

作品スコア取得

### Response

- `200 OK`

```json
{
  "contentId": "string",
  "scoreValue": 82,
  "detail": {
    "reReadRate": 0.15,
    "saveRate": 0.10,
    "commentDensity": 0.05,
    "userScoreFactor": 1.2
  }
}

```

- `404 Not Found`

---

### 3. GET `/scores`

全作品スコア一覧 (内部API用)

### Response

- `200 OK`

```json
[
  {
    "contentId": "string",
    "scoreValue": 82,
    "detail": {
      "reReadRate": 0.15,
      "saveRate": 0.10,
      "commentDensity": 0.05,
      "userScoreFactor": 1.2
    }
  }
]

```