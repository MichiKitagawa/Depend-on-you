# spec.md – reader-action-service 1.0

# [spec.md](http://spec.md/) – reader-action-service

## 概要

読者が実施するアクション、例えばブースト、保存、コメント、感情リアクションなどを記録・取得するAPI仕様。

---

## データモデル

### テーブル: `reader_actions`

| カラム名 | 型 | 説明 |
| --- | --- | --- |
| action_id | string | アクションID (UUID) |
| user_id | string | 行動を起こしたユーザー |
| content_id | string | 対象作品ID |
| action_type | string | "boost", "save", "comment", "reaction"など |
| payload | text / JSON | 註釋本文, リアクション種別など |
| created_at | DateTime | 行動時刻 |

---

## API エンドポイント

### 1. POST `/actions`

アクション登録

### Request Body

```json
{
  "userId": "string",
  "contentId": "string",
  "actionType": "boost",
  "payload": {
    "commentText": "Great work!",
    "emotion": "cry"
  }
}

```

### Response

- `201 Created`

```json
{
  "actionId": "string",
  "userId": "string",
  "contentId": "string",
  "actionType": "boost",
  "payload": {
    "commentText": "Great work!",
    "emotion": "cry"
  },
  "createdAt": "2025-04-13T00:00:00Z"
}

```

- `400 Bad Request`

---

### 2. GET `/actions`

アクション検索 (userId または contentId)

### Example: `/actions?userId=abc123`

### Response

- `200 OK`

```json
[
  {
    "actionId": "string",
    "userId": "string",
    "contentId": "string",
    "actionType": "comment",
    "payload": {
      "commentText": "Amazing read!"
    },
    "createdAt": "2025-04-13T00:00:00Z"
  }
]

```

- `400 Bad Request`
- `404 Not Found`

---

### 3. GET `/actions/:actionId`

特定のアクション詳細取得

### Response

- `200 OK`

```json
{
  "actionId": "string",
  "userId": "string",
  "contentId": "string",
  "actionType": "reaction",
  "payload": {
    "emotion": "wow"
  },
  "createdAt": "2025-04-13T00:00:00Z"
}

```

- `404 Not Found`