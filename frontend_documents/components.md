# components.md 2.0

For: Depend on you

再利用可能な UI 部品（コンポーネント）を定義しています。

各コンポーネント名／目的／主要プロパティ／発火イベントをまとめています。

---

## 1. PostCard

- **目的**
投稿一覧（Feed）や履歴画面でサムネイル＋タイトル＋補足情報を表示
- **Props**
    - `postId: string`
    - `thumbnailUrl: string`
    - `title: string`
    - `score?: number`
    - `readAt?: string`
    - `boostAt?: string`
    - `pointsConsumed?: number`
- **Events**
    - `onClick(postId)` → 投稿詳細画面遷移

---

## 2. SubscribeButton

- **目的**
1投稿10pt購読／24h読放題の状態管理＋UI表示
- **Props**
    - `postId: string`
    - `status: 'UNSUBSCRIBED' | 'SUBSCRIBED' | 'EXPIRED'`
    - `remainingHours?: number`
- **Events**
    - `onSubscribe(postId)` → 購読処理
    - `onExpireNotice(postId)`（オプション）

---

## 3. LikeButton

- **目的**
無料いいねのトグル表示＋操作
- **Props**
    - `postId: string`
    - `liked: boolean`
- **Events**
    - `onToggle(postId, newLikedState)` → いいね／取消 API 呼び出し

---

## 4. BoostButton

- **目的**
有料 Boost 操作＋消費確認ダイアログ
- **Props**
    - `postId: string`
    - `boosted: boolean`
    - `pointsRequired: number` (例: 30)
- **Events**
    - `onBoost(postId)` → Boost 処理

---

## 5. CommentList

- **目的**
コメント一覧の表示＋コメント投稿フォーム統合
- **Props**
    - `postId: string`
    - `comments: { commentId, userName, text, createdAt }[]`
- **Events**
    - `onPostComment(postId, text)` → コメント投稿 API 呼び出し

---

## 6. ShareButton

- **目的**
SNS 共有／クリップボードコピー操作
- **Props**
    - `postId: string`
- **Events**
    - `onShare(postId)` → シェア記録 API 呼び出し + Web Share API

---

## 7. GoodsCard

- **目的**
グッズ一覧・マーケット画面でのアイテム表示
- **Props**
    - `goodsId: string`
    - `imageUrl: string`
    - `title: string`
    - `price: number`
- **Events**
    - `onClick(goodsId)` → グッズ詳細画面遷移

---

## 8. Navbar

- **目的**
画面上部のナビゲーションバー
- **Props**
    - `currentUser?: UserProfile`
    - `onLogout()`
- **Slots／Children**
    - メニューアイテム（Feed, MyPage, Dashboard など）

---

## 9. ModalDialog

- **目的**
確認ダイアログや汎用モーダル表示
- **Props**
    - `title: string`
    - `message: string`
    - `confirmText?: string` (デフォルト: “はい”)
    - `cancelText?: string` (デフォルト: “キャンセル”)
- **Events**
    - `onConfirm()`
    - `onCancel()`

---

## 10. DataTable

- **目的**
テーブル形式で収益・履歴・ランキングなどを表示
- **Props**
    - `columns: { key: string; label: string }[]`
    - `data: object[]`
    - `sortable?: boolean`
- **Events**
    - `onSort(columnKey, direction)`

---

## 11. Pagination

- **目的**
リスト画面のページネーション UI
- **Props**
    - `currentPage: number`
    - `totalPages: number`
- **Events**
    - `onPageChange(newPage)`

---

## 12. LoadingSpinner

- **目的**
データロード中インジケーター
- **Props**
    - `size?: 'small' | 'medium' | 'large'`

---

## 13. ErrorAlert

- **目的**
API エラーやバリデーションエラーをユーザーに通知
- **Props**
    - `message: string`
- **Events**
    - `onClose()`

---

以上が主要な再利用 UI 部品です。必要に応じて追加・拡張してください。```