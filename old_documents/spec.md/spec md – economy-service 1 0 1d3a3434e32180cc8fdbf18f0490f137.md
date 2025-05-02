# spec.md – economy-service 1.0

# [spec.md](http://spec.md/) – economy-service

## 概要

平台全体の収益管理（広告、課金、グッズ販売等）と、作者・読者・運営への報酬配分を担当するAPI仕様。

---

## データモデル

### テーブル: `revenues`

| カラム名 | 型 | 説明 |
| --- | --- | --- |
| revenue_id | string | 収益レコードID |
| revenue_type | string | "ad", "subscription", "goods" など |
| amount | number | 収益金額 |
| created_at | DateTime | 登録日時 |

### テーブル: `payouts`

| カラム名 | 型 | 説明 |
| --- | --- | --- |
| payout_id | string | 報酬レコードID |
| user_id | string | 報酬先ユーザー |
| content_id | string | 報酬対象作品ID |
| points | number | 仕組み内ポイント |
| payout_reason | string | "rankingReward", "contribution" など |
| created_at | DateTime | 仕切日 |

---

## API エンドポイント

### 1. POST `/economy/revenues`

収益レコード登録

### Request Body

```json
{
  "revenueType": "subscription",
  "amount": 500
}

```

### Response

- `201 Created`

```json
{
  "revenueId": "string",
  "revenueType": "subscription",
  "amount": 500
}

```

---

### 2. POST `/economy/payouts`

報酬配分

### Request Body

```json
{
  "userId": "string",
  "contentId": "string",
  "payoutReason": "rankingReward",
  "points": 100
}

```

### Response

- `201 Created`

```json
{
  "payoutId": "string",
  "userId": "string",
  "contentId": "string",
  "points": 100,
  "payoutReason": "rankingReward"
}

```

---

### 3. GET `/economy/payouts?userId=xxx`

ユーザーの報酬履歴取得

### Response

- `200 OK`

```json
[
  {
    "payoutId": "string",
    "userId": "string",
    "contentId": "string",
    "points": 100,
    "payoutReason": "rankingReward"
  },
  {
    "payoutId": "string",
    "userId": "string",
    "contentId": "string",
    "points": 80,
    "payoutReason": "contribution"
  }
]

```