# spec.md – ranking-service １.0

# [spec.md](http://spec.md/) – ranking-service

## 概要

score-service で算出されたスコアを基に、各クラスタ別にランキングを生成し、掲示するAPI仕様。

---

## データモデル

### テーブル: `rankings`

| カラム名 | 型 | 説明 |
| --- | --- | --- |
| ranking_id | string | ランキングID |
| content_id | string | 作品ID |
| rank_position | number | 順位 |
| cluster_type | string | クラスタ区分 (ex: "cry") |
| score_value | number | 適用されたスコア |
| updated_at | DateTime | 更新日時 |

---

## API エンドポイント

### 1. POST `/rankings/rebuild`

ランキング再構築 (1つのクラスタに対して)

### Request Body

```json
{
  "clusterType": "cry"
}

```

### Response

- `200 OK`

```json
{
  "clusterType": "cry",
  "updatedCount": 50
}

```

- `400 Bad Request`

---

### 2. GET `/rankings`

ランキング取得

### Query (Optional)

- `clusterType`: 対象クラスタ
- `limit`: 取得数

### Response

- `200 OK`

```json
[
  {
    "contentId": "string",
    "rankPosition": 1,
    "scoreValue": 90
  },
  {
    "contentId": "string",
    "rankPosition": 2,
    "scoreValue": 85
  }
]

```

- `404 Not Found`