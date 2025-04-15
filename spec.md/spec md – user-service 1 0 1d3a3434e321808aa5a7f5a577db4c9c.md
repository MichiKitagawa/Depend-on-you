# spec.md – user-service 1.0

# [spec.md](http://spec.md/) – user-service

## 概要

ユーザー登録、ログイン認証、プロフィール管理、信用スコア保持のAPI仕様。

---

## データモデル（抽象）

### テーブル: `users`

| カラム名 | 型 | 説明 |
| --- | --- | --- |
| user_id | string(UUIDなど) | ユーザーを一意に識別するID |
| email | string | メールアドレス(ユニーク) |
| password_hash | string | パスワードのハッシュ |
| display_name | string | 表示名 |
| profile_image | string | プロフィール画像URL等 |
| bio | string | 自己紹介 |
| created_at | DateTime | 登録日時 |
| updated_at | DateTime | 更新日時 |

### テーブル: `user_scores`

| カラム名 | 型 | 説明 |
| --- | --- | --- |
| user_id | string | `users.user_id` への外部キー |
| score_value | number | 信用スコア本体 |
| score_history | JSON / text | スコア変動履歴（必要なら配列で管理） |
| updated_at | DateTime | 最終更新日 |

---

## API エンドポイント

### 1. POST `/users`

ユーザー登録

### Request Body

```json
{
  "email": "string",
  "password": "string",
  "displayName": "string"
}

```

### Response

- `201 Created`

```json
{
  "userId": "string",
  "displayName": "string",
  "email": "string"
}

```

- `400 Bad Request`
- `409 Conflict`

---

### 2. POST `/users/login`

ログイン処理

### Request Body

```json
{
  "email": "string",
  "password": "string"
}

```

### Response

- `200 OK`

```json
{
  "userId": "string",
  "token": "string-jwt-or-other",
  "displayName": "string"
}

```

- `401 Unauthorized`

---

### 3. GET `/users/:userId`

ユーザー情報取得

### Response

- `200 OK`

```json
{
  "userId": "string",
  "displayName": "string",
  "email": "string",
  "profileImage": "string",
  "bio": "string"
}

```

- `404 Not Found`

---

### 4. PATCH `/users/:userId`

プロフィール更新

### Request Body

```json
{
  "displayName": "string",
  "profileImage": "string",
  "bio": "string"
}

```

### Response

- `200 OK`

```json
{
  "userId": "string",
  "displayName": "string",
  "profileImage": "string",
  "bio": "string"
}

```

- `400 Bad Request`

---

### 5. GET `/users/:userId/score`

信用スコア取得

### Response

- `200 OK`

```json
{
  "userId": "string",
  "scoreValue": 80
}

```

- `404 Not Found`

---

### 6. POST `/users/:userId/score`

信用スコア更新（内部API情報情報）

### Request Body

```json
{
  "newScoreValue": 85
}

```

### Response

- `200 OK`

```json
{
  "userId": "string",
  "scoreValue": 85
}

```

- `400 Bad Request`
- `403 Forbidden`

```

}

```