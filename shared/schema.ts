// schema.ts - 共通スキーマ定義 (v2.0)

// --- 基本ID ---
export type UserId = string;
export type MagazineID = string;
export type PostID = string;
export type GoodsID = string;
// export type ContentId = string; // v1.0 - 削除
// export type EpisodeId = string; // v1.0 - 削除

// --- 関連ID ---
// export type ActionId = string; // v1.0 - 削除 (より具体的な型へ)
// export type ScoreId = string; // v1.0 - 削除
// export type RankingId = string; // v1.0 - 削除
// export type FeedId = string; // v1.0 - 削除
// export type PortfolioId = string; // v1.0 - 削除
// export type CurationId = string; // v1.0 - 削除
// export type ArchiveId = string; // v1.0 - 削除
// export type RevenueId = string; // v1.0 - 削除 (より具体的な型へ)
// export type PayoutId = string; // v1.0 - 削除 (より具体的な型へ)
export type CommentId = string; // 追加
export type PurchaseId = string; // 追加
export type SubscriptionId = string; // 追加
export type WithdrawalId = string; // 追加

// --- ユーザー関連 ---
export type Email = string; // 追加
export type PasswordHash = string; // 追加
export type AuthToken = string; // 追加

export interface UserProfile { // 追加
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  // notificationPreferences?: NotificationPreferences; // user-service で詳細定義
}

// --- マガジン・投稿・グッズ ---
export interface Magazine { // 追加
  magazineId: MagazineID;
  ownerUserId: UserId;
  title: string;
  description?: string;
  coverImageUrl?: string;
  price?: number; // 月額購読料 (無料の場合は null or 0)
  createdAt: string; // ISO8601
  updatedAt: string; // ISO8601
}

export interface Post { // 追加
  postId: PostID;
  magazineId: MagazineID;
  authorUserId: UserId;
  title: string;
  content: string; // 本文 (Markdown or HTML?)
  publishedAt?: string; // ISO8601 (公開日時)
  status: 'draft' | 'published' | 'archived'; // 更新
  // freeAccess: boolean; // 無料公開範囲など必要なら追加
  createdAt: string; // ISO8601
  updatedAt: string; // ISO8601
}

export interface Goods { // 追加
  goodsId: GoodsID;
  magazineId: MagazineID; // どのマガジンに紐づくか
  sellerUserId: UserId;
  name: string;
  description: string;
  price: number;
  stock?: number; // 在庫数 (null は無限)
  imageUrl?: string;
  createdAt: string; // ISO8601
  updatedAt: string; // ISO8601
}


// --- リーダーアクション ---
// export type ActionType = 'boost' | 'save' | 'comment' | 'reaction'; // v1.0 - 変更
export type ReaderActionType = 'read' | 'like' | 'boost' | 'comment' | 'share'; // v2.0

interface BaseActionRecord { // 追加
  userId: UserId;
  targetType: 'post' | 'magazine' | 'comment'; // アクション対象
  targetId: PostID | MagazineID | CommentId;
  timestamp: string; // ISO8601
}

export interface ReadRecord extends BaseActionRecord { // 追加
  actionType: 'read';
  targetType: 'post';
  targetId: PostID;
  readDurationSeconds?: number; // 滞在時間など
}

export interface LikeRecord extends BaseActionRecord { // 追加
  actionType: 'like';
  // targetType: 'post' | 'comment'; // 必要に応じて
}

export interface BoostRecord extends BaseActionRecord { // 追加
  actionType: 'boost';
  targetType: 'post';
  targetId: PostID;
  amount: number; // Boost したポイント量
}

export interface CommentRecord extends BaseActionRecord { // 追加
  actionType: 'comment';
  targetType: 'post';
  targetId: PostID;
  commentId: CommentId;
  commentText: string;
}

export interface ShareRecord extends BaseActionRecord { // 追加
  actionType: 'share';
  targetType: 'post' | 'magazine';
  platform: 'x' | 'facebook' | 'link' | 'other'; // 共有先
}

export type ActionRecord = ReadRecord | LikeRecord | BoostRecord | CommentRecord | ShareRecord; // 更新

// export interface ReactionPayload { // v1.0 - 削除 (LikeRecord に統合)
//   emotion: 'cry' | 'wow' | 'heart' | 'smile' | 'angry';
// }

// export interface CommentPayload { // v1.0 - 削除 (CommentRecord に統合)
//   commentText: string;
// }

// export type ActionPayload = ReactionPayload | CommentPayload | Record<string, any>; // v1.0 - 削除

// --- 経済圏 ---
export interface Wallet { // 追加
  userId: UserId;
  balance: number; // ポイント残高
  lastTransactionDate?: string; // ISO8601
  updatedAt: string; // ISO8601
}

export interface Purchase { // 追加
  purchaseId: PurchaseId;
  userId: UserId;
  amount: number; // 購入ポイント数
  currency: 'JPY' | 'USD'; // 決済通貨
  paymentMethod: 'stripe' | 'other'; // 決済手段
  transactionId: string; // 決済サービス側のID
  purchasedAt: string; // ISO8601
  status: 'pending' | 'succeeded' | 'failed';
}

export interface Subscription { // 追加
  subscriptionId: SubscriptionId;
  userId: UserId;
  magazineId: MagazineID;
  startDate: string; // ISO8601
  endDate?: string; // ISO8601 (解約日)
  status: 'active' | 'canceled' | 'past_due';
  paymentProviderSubscriptionId: string; // Stripe等のID
  lastPaymentDate?: string; // ISO8601
}

export interface Withdrawal { // 追加
  withdrawalId: WithdrawalId;
  userId: UserId;
  amount: number; // 出金ポイント数
  requestedAt: string; // ISO8601
  status: 'pending' | 'processing' | 'completed' | 'failed';
  transferInfo: any; // 振込先情報など (要検討)
  processedAt?: string; // ISO8601
}

// export type RevenueType = 'ad' | 'subscription' | 'goods'; // v1.0 - 削除 (より詳細なモデルへ)
// export type PayoutReason = 'rankingReward' | 'contribution'; // v1.0 - 削除 (より詳細なモデルへ)

// --- 共通ユーティリティ ---
export interface PaginationParams { // 追加
  page?: number; // 1-indexed
  limit?: number;
}

export interface PaginatedResponse<T> { // 追加
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

// export type ContentStatus = 'draft' | 'ongoing' | 'completed'; // v1.0 - 削除 (Post.status に変更)

export interface Timestamp {
  createdAt: string; // ISO8601
  updatedAt: string; // ISO8601 (Optional でなく必須に)
} 