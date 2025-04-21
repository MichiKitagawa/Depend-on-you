## 作品一覧画面仕様書（Pattern A ― 縦フロー＋クラスタタブ）

### 1. 目的・対象
- **目的** : 読者がクラスタ（嗜好カテゴリ）を切替えながら高速に作品を発掘し、即座にアクション（Boost／保存／コメント／共有）を行える UI を提供する。
- **対象ユーザー** : 読者（一般ユーザー）。
- **対応サービス** : feed‑service, reader‑action‑service, content‑service, score‑service, ranking‑service, user‑service.

---

### 2. 画面構成（ワイヤーフレーム）
```
┌──────────────────────────────┐
│  Header                                                   │
│  ├─ Logo   ──────────┬─ Cluster Tabs ──────────┬─ 🔍 │
└──────────────────────────────┘
│                                                          │
│          ┌────────────────────────────┐                 │
│          │     作品カード（9:16）        │   ← Swipe ↑↓   │
│          │                            │                 │
│          │  ▼ Title / Author overlay  │                 │
│          └────────────────────────────┘                 │
│                                                          │
│  Action Bar (vertical right)                             │
│   👍  💾  💬  ↗️                                         │
│                                                          │
│  Score Meter (small left‑bottom)                         │
└──────────────────────────────┬──────────────────────────┘
                                ↑  Swipe Hint             
```
- **Header**
  - *Logo* : 初期クラスタ「ALL」へのリセット。
  - *Cluster Tabs* : ALL / SF / Romance … （ranking‑service が定義するクラスタ）。
  - *Search Icon* : 検索画面への遷移。
- **作品カード** : feed‑service からストリーミングされた `ContentId` / `EpisodeId` 単位のサムネイル。
- **Overlay** : タイトル・作者名・最新話数。
- **Action Bar** : 👍 Boost, 💾 Save, 💬 Comment, ↗️ Share。
- **Score Meter** : score‑service の総合スコアを 5 段階バーで可視。

---

### 3. UI 要素 → データマッピング
| UI 要素 | schema.ts 型 / フィールド | API Source (Service) |
|---------|---------------------------|----------------------|
| 作品カード | `ContentId`, `EpisodeId`, `contentStatus`, thumbnailUrl | feed‑service `/feeds` |
| タイトル | `title: string` (content metadata) | content‑service `/contents/{id}` |
| 作者名 | `author.userName`  (内部で `UserId` 参照) | user‑service → content‑service join |
| Action Boost | `ActionType = 'boost'` | reader‑action‑service `/actions` |
| Action Save | `ActionType = 'save'` | reader‑action‑service `/actions` |
| Action Comment | `ActionType = 'comment'` + `CommentPayload` | reader‑action‑service |
| スコア値 | `score: number` (0‑100) | score‑service (push) |
| クラスタ Tab | `clusterId: string` | ranking‑service → feed‑service |
| 通知 Badge | `NotificationId` | user‑service `/notifications` |

---

### 4. インタラクション & 画面遷移
| # | ユーザー操作 | フロント処理 | API 呼び出し | 遷移 / 更新 |
|---|--------------|--------------|--------------|--------------|
| 1 | クラスタタブ選択 | `selectedCluster` 更新、現フィード破棄 | `GET /feeds?cluster={id}&limit=20` | 新フィード描画 |
| 2 | 作品カード単タップ | 詳細画面へ `router.push('/content/{ContentId}/episode/{EpisodeId}')` | `GET /contents/{id}/episodes/{eid}` | エピソードリーダー |
| 3 | タイトル / 作者タップ | 作品詳細へ | `GET /contents/{id}` | 作品概要 + 連載リスト |
| 4 | Boost ボタン | 楽観的カウント +1 | `POST /actions (boost)` | スコア push 更新 |
| 5 | 保存ボタン | Saved state トグル | `POST /actions (save)` | — |
| 6 | コメントボタン | コメントシート open | `GET /comments?episodeId=` | コメント閲覧／入力 |
| 7 | コメント送信 | 即時挿入 | `POST /actions (comment)` | — |
| 8 | 共有ボタン | DeepLink 作成 → OS Share | — | 外部起動時は `/?contentId=` ルーティング |
| 9 | 縦スワイプ終端 | 次バッチプリフェッチ | `GET /feeds?cursor=` | カード追加 |

---

### 5. 使用 API エンドポイント（簡易定義）
| Service | Method & Path | 説明 | 主要レスポンス |
|----------|---------------|------|----------------|
| feed‑service | `GET /feeds?cluster&limit&cursor` | クラスタ別フィード取得 | `[ { feedId, contentId, episodeId, score } ]` |
| content‑service | `GET /contents/{id}` | 作品メタデータ | `{ title, authorId, status, synopsis, tags }` |
| content‑service | `GET /contents/{id}/episodes/{eid}` | エピソード本文 | `{ pages: [...], nextEpisodeId? }` |
| reader‑action‑service | `POST /actions` | Boost/Save/Comment 送信 | `201 Created` |
| reader‑action‑service | `GET /comments?episodeId` | コメント一覧 | `[ { actionId, userId, commentText, createdAt } ]` |
| score‑service | `WS /scores/subscribe` | Boost後のスコア push | `{ contentId, newScore }` |
| user‑service | `GET /notifications` | 通知一覧 | `[ { notificationId, type, data, createdAt } ]` |

---

### 6. 状態管理 / キャッシュ
- **クラスタごとの feed キャッシュ** : 1 クラスター 30 話保持。タブ切替で既存キャッシュを再利用。
- **Boost/Save 楽観更新** : UI 更新 → API 戻りエラー時のみロールバック。
- **画像プリロード** : 次カード +1 枚まで先読み。
- **WebSocket** : スコア, コメント追加, 通知をリアルタイム反映。

---

### 7. UI デザインガイド
- **カード比率** : 9:16（端末幅を基準）
- **アクションバー** : 56 px 高ボタン・64 px 間隔。タップ領域 48 px 以上。
- **スコアバー** : 高さ 48 px、色 gradient :red→green、段階表示。
- **ブースト成功トースト** : 1.5s 表示 “Boosted! +1”.
- **全体テーマ** : ダーク／ライト自動切替。

---

### 8. 非機能メモ
- 初回ロード < 2 s / 3G 回線基準。
- アクセシビリティ : 文字サイズ変更への追従、ボタン ARIA ラベル付与。
- テスト : cypress E2E — クラスタ切替・Boost 成功・コメント送信。

---

