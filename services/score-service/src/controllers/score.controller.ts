import { Request, Response } from 'express';
import scoreService from '../services/score.service';
import { ContentId } from '../../../../shared/schema';

/**
 * スコアを再計算するコントローラー
 */
export const recalculateScore = async (req: Request, res: Response): Promise<void> => {
  try {
    const { contentId } = req.body as { contentId: ContentId };
    
    if (!contentId) {
      res.status(400).json({ error: 'contentIdは必須です' });
      return;
    }
    
    const score = await scoreService.recalculateScore(contentId);
    res.status(200).json(score);
  } catch (error) {
    console.error('スコア再計算エラー:', error);
    res.status(500).json({ error: 'スコア再計算中にエラーが発生しました' });
  }
};

/**
 * 特定の作品のスコアを取得するコントローラー
 */
export const getScoreByContentId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { contentId } = req.params as { contentId: ContentId };
    
    const score = await scoreService.getScoreByContentId(contentId);
    
    if (!score) {
      res.status(404).json({ error: '指定されたコンテンツのスコアが見つかりません' });
      return;
    }
    
    res.status(200).json(score);
  } catch (error) {
    console.error('スコア取得エラー:', error);
    res.status(500).json({ error: 'スコア取得中にエラーが発生しました' });
  }
};

/**
 * 全ての作品のスコアリストを取得するコントローラー
 */
export const getAllScores = async (_req: Request, res: Response): Promise<void> => {
  try {
    const scores = await scoreService.getAllScores();
    res.status(200).json(scores);
  } catch (error) {
    console.error('スコア取得エラー:', error);
    res.status(500).json({ error: 'スコア取得中にエラーが発生しました' });
  }
}; 