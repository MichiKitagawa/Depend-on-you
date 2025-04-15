# spec.md – portfolio-service 1.0

# [spec.md](http://spec.md/) – portfolio-service

## 概要

読者の行動履歴をポートフォリオとして表示・管理するAPI仕様。

---

## データモデル

### テーブル: `portfolios`

| カラム名 | 型 | 説明 |
| --- | --- | --- |
| portfolio_id | string | ポートフォリオID |
| user_id | string | 対象ユーザー |
| entries | JSON | 行動履歴エントリーの配列 |
| updated_at | DateTime | 最新更新日 |

---

## API エンドポイント

### 1. GET `/portfolios/:userId`

ユーザーのポートフォリオ取得

### Response

- `200 OK`

```json
{
  "userId": "string",
  "entries": [
    {
      "actionType": "boost",
      "contentId": "string",
      "timestamp": "2025-04-13T00:00:00Z"
    },
    {
      "actionType": "save",
      "contentId": "string",
      "timestamp": "2025-04-13T01:00:00Z"
    }
  ]
}

```

- `404 Not Found`

---

### 2. POST `/portfolios/:userId/sync`

reader-action-service から最新行動を同期

### Response

- `200 OK`

```json
{
  "userId": "string",
  "syncedCount": 10
}

```

- `404 Not Found`