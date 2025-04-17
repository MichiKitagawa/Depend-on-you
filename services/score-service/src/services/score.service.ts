import Score, { ScoreAttributes } from '../models/score.model';
import { ContentId } from '../../../../shared/schema';

export class ScoreService {
  /**
   * 作品のスコアを再計算して更新
   * 実際の実装では、reader-action-serviceからデータを取得して計算
   */
  async recalculateScore(contentId: ContentId): Promise<ScoreAttributes> {
    // 本来はreader-action-serviceからデータを取得して計算
    // ここではモックデータを使用
    const detail = {
      reReadRate: Math.random() * 0.3,        // 0-30%
      saveRate: Math.random() * 0.2,          // 0-20%
      commentDensity: Math.random() * 0.1,    // 0-10%
      userScoreFactor: 1 + Math.random() * 0.5 // 1.0-1.5
    };
    
    // 総合スコアを計算（0-100）
    const scoreValue = Math.round(
      (detail.reReadRate * 150 + 
      detail.saveRate * 200 + 
      detail.commentDensity * 250) * 
      detail.userScoreFactor
    );
    
    // 既存のスコアレコードを検索
    const existingScore = await Score.findOne({ where: { contentId } });
    
    if (existingScore) {
      // 既存レコードを更新
      await existingScore.update({
        scoreValue,
        detail,
        updatedAt: new Date()
      });
      return existingScore.get();
    } else {
      // 新規レコードを作成
      const newScore = await Score.create({
        contentId,
        scoreValue,
        detail
      });
      return newScore.get();
    }
  }

  /**
   * 特定の作品のスコアを取得
   */
  async getScoreByContentId(contentId: ContentId): Promise<ScoreAttributes | null> {
    const score = await Score.findOne({ where: { contentId } });
    return score ? score.get() : null;
  }

  /**
   * 全ての作品のスコアを取得
   */
  async getAllScores(): Promise<ScoreAttributes[]> {
    const scores = await Score.findAll();
    return scores.map(score => score.get());
  }
}

// シングルトンとしてエクスポート
export default new ScoreService(); 