# api-usage.md 2,0

For: Depend on you

各画面で利用する API エンドポイントとその用途を一覧でまとめています。

---

## 1. Landing

- **API**: なし

---

## 2. Login

| API | メソッド | 用途 |
| --- | --- | --- |
| `/auth/login` | POST | ユーザー認証（トークン取得） |

---

## 3. Signup

| API | メソッド | 用途 |
| --- | --- | --- |
| `/auth/signup` | POST | 新規ユーザー登録（トークン取得） |

---

## 4. Feed

| API | メソッド | 用途 |
| --- | --- | --- |
| `/feeds?userId={userId}&cursor={c}&limit={n}` | GET | パーソナライズされた投稿リスト取得 |
| `/user/{userId}/reads` | POST | 読了アクションの記録（最下部到達＋1秒） |
| (読了履歴表示時) `/user/{userId}/reads` | GET | 過去読了履歴の取得 |

---

## 5. PostDetail

| API | メソッド | 用途 |
| --- | --- | --- |
| `/posts/{postId}` | GET | 投稿詳細情報取得 |
| `/economy/consume` | POST | 購読（ポイント消費） |
| `/posts/{postId}/like` | POST | いいね登録 |
| `/posts/{postId}/like` | DELETE | いいね取消 |
| `/economy/consume` | POST | Boost 用ポイント消費 |
| `/boosts` | POST | Boost アクション記録 |
| `/posts/{postId}/comments` | POST | コメント投稿 |
| `/posts/{postId}/comments` | GET | コメントリスト取得 |
| `/shares` | POST | シェア記録 |

---

## 6. MyPage

| API | メソッド | 用途 |
| --- | --- | --- |
| `/user/{userId}/profile` | GET | プロフィール情報取得 |
| `/user/{userId}/settings/notifications` | GET | 通知設定取得 |

---

## 7. ProfileEdit

| API | メソッド | 用途 |
| --- | --- | --- |
| `/user/{userId}/profile` | PATCH | プロフィール更新 |

---

## 8. Settings

| API | メソッド | 用途 |
| --- | --- | --- |
| `/user/{userId}/settings/notifications` | GET | 通知設定取得 |
| `/user/{userId}/settings/notifications` | PATCH | 通知設定更新 |
| `/user/{userId}/credentials` | PATCH | メール／パスワード変更 |

---

## 9. ReadHistory

| API | メソッド | 用途 |
| --- | --- | --- |
| `/user/{userId}/reads?limit={n}` | GET | 読了履歴取得 |

---

## 10. BoostHistory

| API | メソッド | 用途 |
| --- | --- | --- |
| `/user/{userId}/boosts?limit={n}` | GET | Boost履歴取得 |

---

## 11. Dashboard

| API | メソッド | 用途 |
| --- | --- | --- |
| `/user/{userId}/rewards?type=boost&period={period}` | GET | Boost報酬取得（UserRewardsTab） |
| `/economy/withdraw` | POST | 出金申請 |
| **（CreatorTab 用）** クリエイター収益取得 API | GET | クリエイターダッシュボード |
| `/user/{userId}/goods-revenue?period={period}` | GET | グッズ売上取得（GoodsTab） |

---

## 12. SubscriptionPage

| API | メソッド | 用途 |
| --- | --- | --- |
| `/economy/subscribe` | POST | サブスクリプション契約 |
| **（解約）** subscription 解約 API（TBD） | DELETE | サブスク解約 |

---

## 13. GoodsMarketplace

| API | メソッド | 用途 |
| --- | --- | --- |
| **`/goods?filter…`** | GET | グッズ一覧取得 |

---

## 14. GoodsDetail

| API | メソッド | 用途 |
| --- | --- | --- |
| `/goods/{goodsId}` | GET | グッズ詳細取得 |
| `/orders` | POST | 注文作成（Checkout） |

---

## 15. Checkout

| API | メソッド | 用途 |
| --- | --- | --- |
| `/orders` | POST | 注文確定 |

---

※TBD とある箇所は、バックエンドで API 実装が確定次第追記してください。