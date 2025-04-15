# spec.md – content-service １.0

# [spec.md](http://spec.md/) – content-service

## 概要

作品・連載・話単位の投稿・更新・取得・完結ステータス管理のAPI仕様。

---

## データモデル

### テーブル: `contents`

| カラム名 | 型 | 説明 |
| --- | --- | --- |
| content_id | string | 作品ID (UUID) |
| author_id | string | 作者ID (`users.user_id`) |
| title | string | 作品・連載タイトル |
| description | string | 簡単な概要 |
| genre | string | ジャンル |
| tags | JSON/text | タグ列 (配列形式) |
| status | string | "draft", "ongoing", "completed" |
| created_at | DateTime | 登録日時 |
| updated_at | DateTime | 更新日時 |

### テーブル: `episodes`

| カラム名 | 型 | 説明 |
| --- | --- | --- |
| episode_id | string | 話ID (UUID) |
| content_id | string | 対応作品ID |
| title | string | 話タイトル |
| body | text/JSON | 本文 |
| order_index | number | 連載順番 |
| created_at | DateTime | 登録日時 |
| updated_at | DateTime | 更新日時 |

---

## API エンドポイント

### 1. POST `/contents`

新規作品投稿

### Request Body

```json
{
  "authorId": "string",
  "title": "string",
  "description": "string",
  "genre": "string",
  "tags": ["tag1", "tag2"],
  "status": "draft"
}

```

### Response

- `201 Created`

```json
{
  "contentId": "string",
  "title": "string",
  "authorId": "string",
  "status": "draft"
}

```

- `400 Bad Request`

---

### 2. GET `/contents/:contentId`

作品情報取得

### Response

- `200 OK`

```json
{
  "contentId": "string",
  "authorId": "string",
  "title": "string",
  "description": "string",
  "genre": "string",
  "tags": ["tag1", "tag2"],
  "status": "ongoing"
}

```

- `404 Not Found`

---

### 3. PATCH `/contents/:contentId`

作品情報更新

### Request Body

```json
{
  "title": "string",
  "description": "string",
  "genre": "string",
  "tags": ["string"],
  "status": "ongoing"
}

```

### Response

- `200 OK`

```json
{
  "contentId": "string",
  "title": "string",
  "status": "ongoing"
}

```

- `400 Bad Request`
- `403 Forbidden`

---

### 4. POST `/contents/:contentId/episodes`

話投稿

### Request Body

```json
{
  "title": "string",
  "body": "string",
  "orderIndex": 1
}

```

### Response

- `201 Created`

```json
{
  "episodeId": "string",
  "contentId": "string",
  "title": "string",
  "orderIndex": 1
}

```

- `400 Bad Request`

---

### 5. GET `/contents/:contentId/episodes`

話一覧取得

### Response

- `200 OK`

```json
[
  {
    "episodeId": "string",
    "title": "string",
    "orderIndex": 1
  }
]

```

- `404 Not Found`

---

### 6. PATCH `/contents/:contentId/episodes/:episodeId`

話更新

### Request Body

```json
{
  "title": "updated title",
  "body": "updated body"
}

```

### Response

- `200 OK`
- `404 Not Found`
- `403 Forbidden`

---

### 7. POST `/contents/:contentId/complete`

作品完結

### Response

- `200 OK`

```json
{
  "status": "completed"
}

```

- `404 Not Found`