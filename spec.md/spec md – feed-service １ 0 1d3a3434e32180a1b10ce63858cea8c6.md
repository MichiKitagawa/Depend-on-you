# spec.md – feed-service １.0

# [spec.md](http://spec.md/) – feed-service

## 概要

ランキング結果やユーザー嗜好情報を利用して、パーソナライズされたフィードを提供するAPI仕様。

---

## データモデル

### テーブル: `feeds`

| カラム名 | 型 | 説明 |
| --- | --- | --- |
| feed_id | string | フィードID |
| user_id | string | ユーザーID |
| content_list | JSON | 推奨作品のID列 |
| generated_at | DateTime | 生成日時 |

---

## API エンドポイント

### 1. POST `/feeds/generate`

ユーザーごとのフィード生成

### Request Body

```json
{
  "userId": "string"
}

```

### Response

- `200 OK`

```json
{
  "feedId": "string",
  "userId": "string",
  "contentList": [
    {
      "contentId": "string",
      "scoreValue": 92
    },
    {
      "contentId": "string",
      "scoreValue": 88
    }
  ],
  "generatedAt": "2025-04-13T00:00:00Z"
}

```

---

### 2. GET `/feeds/:feedId`

生成済みフィードの取得

### Response

- `200 OK`

```json
{
  "feedId": "string",
  "userId": "string",
  "contentList": [
    {
      "contentId": "string",
      "scoreValue": 92
    }
  ],
  "generatedAt": "2025-04-13T00:00:00Z"
}

```

- `404 Not Found`

---

### 3. GET `/feeds/latest?userId=xxx`

最新のフィードを取得

### Response

- `200 OK`

```json
{
  "feedId": "string",
  "userId": "string",
  "contentList": [
    {
      "contentId": "string",
      "scoreValue": 95
    }
  ]
}

```

- `404 Not Found`