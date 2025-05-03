import { Request, Response } from 'express';
import scoreService from '../services/score.service';
import { PostID } from '../../../../shared/schema';

/**
 * スコアを再計算するコントローラー
 */
export const recalculateScore = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.body as { postId: PostID };
    
    if (!postId) {
      res.status(400).json({ error: 'postIdは必須です' });
      return;
    }
    
    const score = await scoreService.recalculateScore(postId);
    res.status(200).json(score);
  } catch (error) {
    console.error('スコア再計算エラー:', error);
    res.status(500).json({ error: 'スコア再計算中にエラーが発生しました' });
  }
};

/**
 * 特定の投稿のスコアを取得するコントローラー
 */
export const getScoreByPostId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params as { postId: PostID };
    
    const score = await scoreService.getScoreByPostId(postId);
    
    if (!score) {
      res.status(404).json({ error: '指定された投稿のスコアが見つかりません' });
      return;
    }
    
    res.status(200).json(score);
  } catch (error) {
    console.error('スコア取得エラー:', error);
    res.status(500).json({ error: 'スコア取得中にエラーが発生しました' });
  }
};

/**
 * 全ての投稿のスコアリストを取得するコントローラー
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