# schema.ts 1.0

// schema.ts - 共通スキーマ定義

// ユーザーID
export type UserId = string;

// コンテンツID（作品ID）
export type ContentId = string;

// エピソードID（話単位）
export type EpisodeId = string;

// アクションID
export type ActionId = string;

// スコアID
export type ScoreId = string;

// ランキングID
export type RankingId = string;

// フィードID
export type FeedId = string;

// ポートフォリオID
export type PortfolioId = string;

// キュレーションID
export type CurationId = string;

// アーカイブID
export type ArchiveId = string;

// 経済関連ID
export type RevenueId = string;
export type PayoutId = string;

// 各種共通 enum / 定義型

export type ActionType = 'boost' | 'save' | 'comment' | 'reaction';

export type ContentStatus = 'draft' | 'ongoing' | 'completed';

export type RevenueType = 'ad' | 'subscription' | 'goods';

export type PayoutReason = 'rankingReward' | 'contribution';

export interface Timestamp {
createdAt: string; // ISO8601
updatedAt?: string;
}

export interface ReactionPayload {
emotion: 'cry' | 'wow' | 'heart' | 'smile' | 'angry';
}

export interface CommentPayload {
commentText: string;
}

export type ActionPayload = ReactionPayload | CommentPayload | Record<string, any>;