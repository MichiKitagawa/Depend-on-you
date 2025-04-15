# spec.md – curation-service 1.0

# [spec.md](http://spec.md/) – curation-service

## 概要

読者が作成するプレイリスト、レビュー、推薦情報などを管理するAPI仕様。

---

## データモデル

### テーブル: `curations`

| カラム名 | 型 | 説明 |
| --- | --- | --- |
| curation_id | string | キュレーションID |
| user_id | string | 作成者 |
| title | string | プレイリスト / レビューのタイトル |
| items | JSON | 対象作品IDの配列（またはレビュー本文） |
| created_at | DateTime | 作成日時 |
| updated_at | DateTime | 更新日時 |

---

## API エンドポイント

### 1. POST `/curations`

新規キュレーション作成

### Request Body

```json
{
  "userId": "string",
  "title": "string",
  "items": ["contentId1", "contentId2"],
  "reviewBody": "optional text..."
}

```

### Response

- `201 Created`

```json
{
  "curationId": "string",
  "userId": "string",
  "title": "string",
  "items": ["contentId1", "contentId2"],
  "createdAt": "2025-04-13T00:00:00Z"
}

```

---

### 2. GET `/curations/:curationId`

キュレーション詳細取得

### Response

- `200 OK`

```json
{
  "curationId": "string",
  "userId": "string",
  "title": "string",
  "items": ["contentId1", "contentId2"],
  "createdAt": "2025-04-13T00:00:00Z"
}

```

- `404 Not Found`

---

### 3. PATCH `/curations/:curationId`

キュレーションの更新

### Request Body

```json
{
  "title": "Updated Title",
  "items": ["contentId3", "contentId4"]
}

```

### Response

- `200 OK`
- `404 Not Found`
- `403 Forbidden`