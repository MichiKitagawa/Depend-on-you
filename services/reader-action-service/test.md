# test.md (reader-action-service) 2.0

For: Depend on you

## 1. POST /user/{userId}/reads

| ケースID | 説明 | 前提 | リクエスト | 期待レスポンス |
|---|---|---|---|---|
| RAS-READ-01 | 正常系：読了記録追加 | JWT 有効, userId, postId 存在 | `{ "postId":"p1" }` | `200 OK` |
| RAS-READ-02 | 異常系：JWT 無効 | JWT 期限切れ／改竄 | - | `401 Unauthorized` |
| RAS-READ-03 | 異常系：リクエストボディ不正 (postId なし) | JWT 有効 | `{}` | `400 Bad Request` |
| RAS-READ-04 | 異常系：postId が存在しない | JWT 有効 | `{ "postId":"non-existent-post" }` | `404 Not Found` (content-service 連携が必要なら) または `400 Bad Request` |
| RAS-READ-05 | 異常系：userId が存在しない (パスパラメータ) | JWT は有効だが userId 不正 | `{ "postId":"p1" }` | `401 Unauthorized` または `403 Forbidden` |

## 2. GET /user/{userId}/reads

| ケースID | 説明 | 前提 | リクエスト | 期待レスポンス |
|---|---|---|---|---|
| RAS-GET-READ-01 | 正常系：読了記録取得 | JWT 有効, 読了記録あり | `?limit=10&offset=0` | `200 OK` + `ReadRecord[]` |
| RAS-GET-READ-02 | 正常系：読了記録なし | JWT 有効 | `?limit=10` | `200 OK` + `[]` |
| RAS-GET-READ-03 | 正常系：ページネーション | JWT 有効, 多数の読了記録あり | `?limit=5&offset=5` | `200 OK` + `ReadRecord[]` (6件目から5件) |
| RAS-GET-READ-04 | 異常系：JWT 無効 | - | - | `401 Unauthorized` |
| RAS-GET-READ-05 | 異常系：userId が存在しない | JWT は有効だが userId 不正 | - | `401 Unauthorized` または `403 Forbidden` |

## 3. POST /posts/{postId}/like

| ケースID | 説明 | 前提 | リクエスト | 期待レスポンス |
|---|---|---|---|---|
| RAS-LIKE-01 | 正常系：いいね追加 | JWT 有効, postId 存在 | - | `200 OK` |
| RAS-LIKE-02 | 異常系：JWT 無効 | - | - | `401 Unauthorized` |
| RAS-LIKE-03 | 異常系：postId が存在しない | JWT 有効 | - | `404 Not Found` (content-service 連携) または `400 Bad Request` |
| RAS-LIKE-04 | 異常系：既にいいね済み | JWT 有効, いいね済み | - | `409 Conflict` または `200 OK` (冪等性を考慮) |

## 4. DELETE /posts/{postId}/like

| ケースID | 説明 | 前提 | リクエスト | 期待レスポンス |
|---|---|---|---|---|
| RAS-UNLIKE-01 | 正常系：いいね解除 | JWT 有効, postId 存在, いいね済み | - | `200 OK` |
| RAS-UNLIKE-02 | 異常系：JWT 無効 | - | - | `401 Unauthorized` |
| RAS-UNLIKE-03 | 異常系：postId が存在しない | JWT 有効 | - | `404 Not Found` (content-service 連携) または `400 Bad Request` |
| RAS-UNLIKE-04 | 異常系：いいねしていない | JWT 有効, いいね未登録 | - | `404 Not Found` |

## 5. POST /boosts

| ケースID | 説明 | 前提 | リクエスト | 期待レスポンス |
|---|---|---|---|---|
| RAS-BOOST-01 | 正常系：Boost 記録追加 | JWT 有効, userId, postId 存在, economy-service 連携成功 | `{ "userId":"u1", "postId":"p1" }` | `201 Created` + `{ boostId }` |
| RAS-BOOST-02 | 異常系：JWT 無効 | - | `{ ... }` | `401 Unauthorized` |
| RAS-BOOST-03 | 異常系：リクエストボディ不正 | JWT 有効 | `{}` | `400 Bad Request` |
| RAS-BOOST-04 | 異常系：postId が存在しない | JWT 有効 | `{ "userId":"u1", "postId":"non-existent-post" }` | `404 Not Found` (content-service 連携) または `400 Bad Request` |
| RAS-BOOST-05 | 異常系：economy-service でエラー (ポイント不足など) | JWT 有効 | `{ ... }` | `400 Bad Request` (economy-service 起因) |

## 6. GET /user/{userId}/boosts

| ケースID | 説明 | 前提 | リクエスト | 期待レスポンス |
|---|---|---|---|---|
| RAS-GET-BOOST-01 | 正常系：Boost 記録取得 | JWT 有効, Boost 記録あり | `?limit=10` | `200 OK` + `BoostRecord[]` |
| RAS-GET-BOOST-02 | 正常系：Boost 記録なし | JWT 有効 | `?limit=10` | `200 OK` + `[]` |
| RAS-GET-BOOST-03 | 異常系：JWT 無効 | - | - | `401 Unauthorized` |

## 7. POST /posts/{postId}/comments

| ケースID | 説明 | 前提 | リクエスト | 期待レスポンス |
|---|---|---|---|---|
| RAS-COMMENT-01 | 正常系：コメント追加 | JWT 有効, postId 存在 | `{ "text":"良いですね！" }` | `201 Created` + `{ commentId, createdAt }` |
| RAS-COMMENT-02 | 異常系：JWT 無効 | - | `{ ... }` | `401 Unauthorized` |
| RAS-COMMENT-03 | 異常系：リクエストボディ不正 (text なし) | JWT 有効 | `{}` | `400 Bad Request` |
| RAS-COMMENT-04 | 異常系：postId が存在しない | JWT 有効 | `{ ... }` | `404 Not Found` (content-service 連携) または `400 Bad Request` |

## 8. GET /posts/{postId}/comments

| ケースID | 説明 | 前提 | リクエスト | 期待レスポンス |
|---|---|---|---|---|
| RAS-GET-COMMENT-01 | 正常系：コメント一覧取得 | postId 存在, コメントあり | - | `200 OK` + `Comment[]` |
| RAS-GET-COMMENT-02 | 正常系：コメントなし | postId 存在 | - | `200 OK` + `[]` |
| RAS-GET-COMMENT-03 | 異常系：postId が存在しない | - | - | `404 Not Found` (content-service 連携) または `400 Bad Request` |

## 9. POST /shares

| ケースID | 説明 | 前提 | リクエスト | 期待レスポンス |
|---|---|---|---|---|
| RAS-SHARE-01 | 正常系：シェア記録追加 | JWT 有効, postId 存在 | `{ "postId":"p1", "referrerId":"u2" }` | `200 OK` |
| RAS-SHARE-02 | 異常系：JWT 無効 | - | `{ ... }` | `401 Unauthorized` |
| RAS-SHARE-03 | 異常系：リクエストボディ不正 (postId なし) | JWT 有効 | `{ "referrerId":"u2" }` | `400 Bad Request` |
| RAS-SHARE-04 | 異常系：postId が存在しない | JWT 有効 | `{ "postId":"non-existent-post", ... }` | `404 Not Found` (content-service 連携) または `400 Bad Request` | 