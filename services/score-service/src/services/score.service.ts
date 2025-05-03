import { PrismaClient } from '../generated/prisma';
import { PostID } from '../../../../shared/schema'; // 共通スキーマから PostID をインポート

const prisma = new PrismaClient();

export class ScoreService {
  /**
   * 投稿のスコアを再計算して更新
   * 実際の実装では、reader-action-serviceからアクションデータを取得して計算
   */
  async recalculateScore(postId: PostID): Promise<any> { // 戻り値の型を Prisma の PostScore に合わせる必要あり (一旦 any)
    // 本来はreader-action-serviceからデータを取得して計算
    // ここでは新アクションタイプのモックデータを仮定
    const actions = {
      readCount: Math.floor(Math.random() * 1000),    // 0-999
      likeCount: Math.floor(Math.random() * 500),     // 0-499
      boostCount: Math.floor(Math.random() * 100),    // 0-99
      commentCount: Math.floor(Math.random() * 200),  // 0-199
      shareCount: Math.floor(Math.random() * 50)      // 0-49 (仮)
    };

    // 新しいスコア計算ロジック（仮）
    const scoreValue =
      actions.readCount * 1 +
      actions.likeCount * 3 +
      actions.boostCount * 10 +
      actions.commentCount * 5 +
      actions.shareCount * 2;

    // 既存のスコアレコードを検索して更新、または新規作成 (upsert)
    const postScore = await prisma.postScore.upsert({
      where: { postId: postId },
      update: {
        score: scoreValue,
        // calculatedAt は Prisma が自動更新 ( @updatedAt )
        // 必要であればアクション数を保存するフィールドを追加
      },
      create: {
        postId: postId,
        score: scoreValue,
      },
    });

    return postScore;
  }

  /**
   * 特定の投稿のスコアを取得
   */
  async getScoreByPostId(postId: PostID): Promise<any | null> { // 戻り値の型を Prisma の PostScore に合わせる必要あり
    const postScore = await prisma.postScore.findUnique({
      where: { postId: postId },
    });
    return postScore;
  }

  /**
   * 全ての投稿のスコアを取得
   */
  async getAllScores(): Promise<any[]> { // 戻り値の型を Prisma の PostScore に合わせる必要あり
    const postScores = await prisma.postScore.findMany({
        orderBy: {
            score: 'desc' // 例: スコアの高い順
        }
    });
    return postScores;
  }
}

// シングルトンとしてエクスポート
export default new ScoreService(); 