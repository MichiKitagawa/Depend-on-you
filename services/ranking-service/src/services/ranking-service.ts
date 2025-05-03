import { PrismaClient } from '../generated/prisma'; // RankingEntry 用
// import { PrismaClient as ScorePrismaClient } from '../../../score-service/src/generated/prisma'; // 直接インポートをやめる
import { PostID } from '@shared/schema';
// PostScore 型のインポートパスも修正が必要だが、一旦コメントアウト。fetchScoresFromScoreService 内の require で対応
// import { PostScore } from '../../../score-service/src/generated/prisma'; // PostScore 型のみインポート (パス要確認)

const DECAY_FACTOR = 0.01; // 時間減衰係数 (調整が必要)

interface RankingResponse {
  postId: PostID;
  rankPosition: number;
  scoreValue: number; // 減衰後のスコア
  originalScore: number; // 元のスコア (参考)
  calculatedAt: Date; // スコア計算日時 (参考)
}

class RankingService {
  private prisma: PrismaClient; // PrismaClient インスタンスを保持

  // コンストラクタで PrismaClient インスタンスを受け取る
  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient || new PrismaClient();
  }

  // score-service からスコアを取得する protected メソッド
  protected async _fetchScoresFromScoreService(): Promise<any[]> {
    const scorePrisma = new (require('../score-service/src/generated/prisma').PrismaClient)();
    try {
       const scores = await scorePrisma.postScore.findMany({});
       return scores;
    } finally {
        await scorePrisma.$disconnect();
    }
     // ---- モックしやすい実装例 (API呼び出し) ----
     // const response = await fetch('http://score-service:300x/scores');
     // if (!response.ok) {
     //   throw new Error('Failed to fetch scores from score-service');
     // }
     // const scores: PostScore[] = await response.json();
     // return scores;
     // ----------------------------------------
  }

  /**
   * Rebuild rankings for a specific cluster type (or overall)
   * @param clusterType Optional cluster type to rebuild rankings for
   * @returns Number of rankings updated
   */
  public async rebuildRankings(clusterType?: string): Promise<number> {
    try {
      // 1. score-service から PostScore データを取得 (クラスメソッド経由で)
      const postScores = await this._fetchScoresFromScoreService();

      if (!postScores || postScores.length === 0) {
        console.log('No scores found to build ranking.');
        return 0;
      }

      // 2. 時間減衰ロジックを適用
      const now = new Date();
      const decayedScores = postScores.map(score => {
        const hoursElapsed = (now.getTime() - score.calculatedAt.getTime()) / (1000 * 60 * 60);
        const decayMultiplier = Math.exp(-DECAY_FACTOR * Math.max(0, hoursElapsed)); // 経過時間は非負
        const decayedScoreValue = score.score * decayMultiplier;
        return {
          postId: score.postId as PostID,
          decayedScore: decayedScoreValue,
          originalScore: score.score,
          calculatedAt: score.calculatedAt
        };
      });

      // 3. 減衰後スコアで降順ソート
      const sortedScores = decayedScores.sort((a, b) => b.decayedScore - a.decayedScore);

      // 4. 既存のランキングを削除 (this.prisma を使用)
      await this.prisma.rankingEntry.deleteMany({
        where: { cluster: clusterType || null }
      });

      // 5. 新しいランキングを保存 (this.prisma を使用)
      const rankingEntries = sortedScores.map((score, index) => ({
        postId: score.postId,
        rank: index + 1,
        score: score.decayedScore,
        cluster: clusterType || null,
        // calculatedAt は default(now())
      }));

      await this.prisma.rankingEntry.createMany({
        data: rankingEntries,
      });

      return sortedScores.length;
    } catch (error) {
      console.error(`Error in rebuildRankings (cluster: ${clusterType}):`, error);
      throw error;
    }
  }

  /**
   * Get rankings, optionally filtered by cluster type and limited
   * @param clusterType Optional cluster type to filter by
   * @param limit Optional limit on the number of rankings to return
   * @returns Array of rankings
   */
  public async getRankings(clusterType?: string, limit?: number): Promise<any[]> { // 戻り値の型を修正
    try {
      const rankings = await this.prisma.rankingEntry.findMany({
        where: {
          cluster: clusterType || null
        },
        orderBy: {
          rank: 'asc'
        },
        take: limit || undefined
      });

      // 必要であれば score-service から元のスコア情報などを付与する
      // ここでは RankingEntry の情報をそのまま返す
      return rankings;

    } catch (error) {
      console.error(`Error in getRankings (cluster: ${clusterType}):`, error);
      throw error;
    }
  }
}

export default RankingService; 