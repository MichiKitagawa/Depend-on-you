# spec.md – archive-service 1.0

# [spec.md](http://spec.md/) – archive-service

## 概要

完結済み作品をアーカイブし、再評価トリガーを監視、feed-service の再配信を起動するAPI仕様。

---

## データモデル

### テーブル: `archives`

| カラム名 | 型 | 説明 |
| --- | --- | --- |
| archive_id | string | アーカイブID |
| content_id | string | 完結作品ID |
| archived_at | DateTime | 保存された日時 |
| last_trigger | DateTime | 最後の再配信トリガー日時 |

---

## API エンドポイント

### 1. POST `/archives`

完結作品をアーカイブに登録

### Request Body

```json
{
  "contentId": "string"
}

```

### Response

- `201 Created`

```json
{
  "archiveId": "string",
  "contentId": "string",
  "archivedAt": "2025-04-13T00:00:00Z"
}

```

---

### 2. GET `/archives/:contentId`

特定作品のアーカイブ情報取得

### Response

- `200 OK`

```json
{
  "archiveId": "string",
  "contentId": "string",
  "archivedAt": "2025-04-13T00:00:00Z",
  "lastTrigger": "2025-04-13T00:00:00Z"
}

```

- `404 Not Found`

---

### 3. POST `/archives/:archiveId/trigger`

再配信トリガーの発行

### Response

- `200 OK`

```json
{
  "archiveId": "string",
  "contentId": "string",
  "triggeredAt": "2025-04-13T00:00:00Z"
}

```

- `404 Not Found`