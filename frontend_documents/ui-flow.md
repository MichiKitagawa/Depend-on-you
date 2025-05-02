# ui-flow.md 2.0

For: Depend on you

```markdown
# ui-flow.md

## 概要

ユーザー視点の主要な動線をまとめています。
メインフローは以下の通りです。

```mermaid
flowchart LR
  subgraph 認証
    A1[Landing] --> A2[Login]
    A1 --> A3[Signup]
    A2 --> B[Feed]
    A3 --> B
  end

  subgraph コンテンツ閲覧／操作
    B[Feed] --> C[PostDetail]
    C --> D1[Subscribe (10pt/24h)]
    C --> D2[Like]
    C --> D3[Boost]
    C --> D4[Comment]
    C --> D5[Share]
    C --> D6[GoodsPurchase]
    D1 --> E[ReadFullText]
  end

  subgraph マイページ
    B --> F[MyPage]
    F --> G1[ProfileEdit]
    F --> G2[Settings]
    F --> G3[ReadHistory]
    F --> G4[BoostHistory]
    F --> G5[Dashboard]
    F --> G6[Logout]
  end

  subgraph ダッシュボード
    G5[Dashboard] --> H1[UserRewardsTab]
    G5 --> H2[CreatorTab]
    G5 --> H3[GoodsTab]
    H1 --> I1[Withdraw]
  end

  subgraph サブスクリプション
    C --> J[SubscriptionPage]
    J --> K[Subscribe/Cancel]
  end

  subgraph グッズマーケット
    B --> L[GoodsMarketplace]
    L --> M[GoodsDetail]
    M --> N[AddToCart]
    N --> O[Checkout]
  end

```

---

## 各フロー詳細

### 1. 認証

1. **Landing**
    - 「ログイン」「サインアップ」ボタンを選択
2. **Login**／**Signup**
    - フォーム送信 → user-service API 呼び出し → トークン取得／ユーザー登録
3. 成功後、**Feed** 画面へ遷移

---

### 2. Feed閲覧

- **画面**：Feed
- **操作**：縦スクロール
- **自動発火**：最下部到達＋1秒 → 読了記録送信
- **画面遷移**：投稿カードタップ → **PostDetail**

---

### 3. 投稿詳細・操作

- **画面**：PostDetail
- **主要要素**：サムネ／タイトル／本文／アクションボタン群
- **アクション**：
    - Subscribe → 10pt消費／24h読放題
    - Like → 無料トグル
    - Boost → 30pt消費／ランキング反映
    - Comment → コメント送信
    - Share → SNS連携
    - GoodsPurchase → グッズ購入フロー起点

---

### 4. マイページ

- **画面**：MyPage
- **ナビゲーション**：
    - プロフィール編集
    - 通知設定
    - 読了履歴
    - Boost履歴
    - ダッシュボード
    - ログアウト

---

### 5. ダッシュボード

- **画面**：Dashboard
- **タブ**：User／Creator／Goods
- **UserRewardsTab** → 出金申請画面へ
- **CreatorTab**, **GoodsTab** はそれぞれの収益詳細

---

### 6. サブスクリプション

- **画面**：SubscriptionPage
- **操作**：プラン選択 → 決済 → サブスク状態更新
- **結果**：以降購読ボタンが無料化

---

### 7. グッズマーケット

- **画面**：GoodsMarketplace → GoodsDetail → Checkout
- **操作**：商品選択 → カート → 配送先・支払 → 注文確定

---