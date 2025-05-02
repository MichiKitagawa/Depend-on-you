# screens.md 2.0

For: Depend on you

# [screens.md](http://screens.md/)

各画面の目的・主要要素・使用 API をまとめています。

---

## 1. Landing

- **目的**
    - 初回訪問ユーザーにログイン／サインアップを促す
- **主要要素**
    - アプリロゴ・キャッチコピー
    - 「ログイン」「サインアップ」ボタン
- **使用 API**
    - なし

---

## 2. Login

- **目的**
    - 既存ユーザーの認証
- **主要要素**
    - メールアドレス入力欄
    - パスワード入力欄
    - 「ログイン」ボタン
    - ログイン失敗時のエラーメッセージ
- **使用 API**
    - `POST /auth/login`

---

## 3. Signup

- **目的**
    - 新規ユーザー登録
- **主要要素**
    - メールアドレス入力欄
    - パスワード入力欄
    - 表示名入力欄
    - 「サインアップ」ボタン
    - 入力バリデーションメッセージ
- **使用 API**
    - `POST /auth/signup`

---

## 4. Feed

- **目的**
    - パーソナライズされた投稿一覧を閲覧する
- **主要要素**
    - 投稿カード（サムネ・タイトル・スコア）
    - 無限スクロール
    - 読了自動判定
- **使用 API**
    - `GET /feeds?userId={userId}&cursor={cursor}&limit={n}`
    - `POST /user/{userId}/reads`

---

## 5. PostDetail

- **目的**
    - 投稿の詳細表示と各種アクションを実行する
- **主要要素**
    - 投稿画像・タイトル・本文
    - アクションボタン：購読／いいね／Boost／コメント／シェア／グッズ購入
    - コメント一覧
- **使用 API**
    - `GET /posts/{postId}`
    - 購読： `POST /economy/consume`
    - いいね： `POST /posts/{postId}/like` / `DELETE /posts/{postId}/like`
    - Boost：
        - `POST /economy/consume`
        - `POST /boosts`
    - コメント投稿： `POST /posts/{postId}/comments`
    - コメント取得： `GET /posts/{postId}/comments`
    - シェア記録： `POST /shares`

---

## 6. MyPage

- **目的**
    - ユーザーの各種個人操作画面へのハブ
- **主要要素**
    - プロフィールサマリー
    - メニュー：プロフィール編集／通知設定／読了履歴／Boost履歴／ダッシュボード／ログアウト
- **使用 API**
    - プロフィール表示： `GET /user/{userId}/profile`

---

## 7. ProfileEdit

- **目的**
    - プロフィール情報を更新する
- **主要要素**
    - 表示名／自己紹介文／アイコン画像アップロード欄
    - 「保存」ボタン
- **使用 API**
    - `PATCH /user/{userId}/profile`

---

## 8. Settings

- **目的**
    - 通知設定およびアカウント設定へ誘導する
- **主要要素**
    - 通知トグル：購読更新／ランキング変動
    - メール・パスワード変更リンク
- **使用 API**
    - 設定取得： `GET /user/{userId}/settings/notifications`
    - 設定更新： `PATCH /user/{userId}/settings/notifications`

---

## 9. ReadHistory

- **目的**
    - 過去の読了履歴を一覧する
- **主要要素**
    - 読了投稿カード（サムネ・タイトル・読了日時）
- **使用 API**
    - `GET /user/{userId}/reads?limit={n}&offset={m}`

---

## 10. BoostHistory

- **目的**
    - 自分が行った Boost の履歴を確認する
- **主要要素**
    - Boost投稿カード（サムネ・タイトル・Boost日時・消費ポイント）
    - 合計消費ポイントサマリー
- **使用 API**
    - `GET /user/{userId}/boosts?limit={n}&offset={m}`

---

## 11. Dashboard

### 11.1 UserRewardsTab

- **目的**
    - ユーザーとしての Boost報酬を確認し、出金申請する
- **主要要素**
    - 総収益ポイント表示
    - 明細テーブル（投稿ID・分配日時・獲得ポイント）
    - 「出金申請」ボタン
- **使用 API**
    - 収益取得： `GET /user/{userId}/rewards?type=boost&period={period}`
    - 出金申請： `POST /economy/withdraw`

### 11.2 CreatorTab

- **目的**
    - クリエイターとしての投げ銭・Boost分配・グッズ売上を確認する
- **主要要素**
    - 収益サマリー
    - 収益内訳グラフ／テーブル
- **使用 API**
    - （クリエイターダッシュボード用APIは要定義）

### 11.3 GoodsTab

- **目的**
    - グッズ売上収益を確認する
- **主要要素**
    - 販売数・売上金額
- **使用 API**
    - `GET /user/{userId}/goods-revenue?period={period}`

---

## 12. SubscriptionPage

- **目的**
    - サブスクリプションの契約・解約を行う
- **主要要素**
    - 月額／年額プラン比較表
    - 「契約する」「解約する」ボタン
- **使用 API**
    - 契約： `POST /economy/subscribe`
    - 解約： （TBD）

---

## 13. GoodsMarketplace

- **目的**
    - プラットフォーム内グッズを一覧閲覧・検索する
- **主要要素**
    - 商品カード（画像・タイトル・価格）
    - 検索・フィルタ機能
- **使用 API**
    - 商品一覧取得： （TBD: `GET /goods?…`）

---

## 14. GoodsDetail

- **目的**
    - グッズの詳細を確認し、カートに追加する
- **主要要素**
    - 商品画像ギャラリー
    - タイトル・説明・価格
    - 「カートに追加」ボタン
- **使用 API**
    - `GET /goods/{goodsId}`

---

## 15. Checkout

- **目的**
    - カート内商品を購入する
- **主要要素**
    - カート一覧（商品・数量・小計）
    - 配送先フォーム
    - 支払方法選択
    - 「購入確定」ボタン
- **使用 API**
    - `POST /orders` （TBD）

---