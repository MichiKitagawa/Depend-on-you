import { Request, Response } from 'express';
import { FeedService } from '../services/feed.service';

const feedService = new FeedService();

export class FeedController {
  /**
   * フィードを生成するエンドポイント
   */
  async generateFeed(req: Request, res: Response) {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'ユーザーIDが必要です' });
      }

      const feed = await feedService.generateFeed(userId);
      return res.status(200).json(feed);
    } catch (error) {
      console.error('フィード生成コントローラーエラー:', error);
      return res.status(500).json({ error: '内部サーバーエラー' });
    }
  }

  /**
   * 指定IDのフィードを取得するエンドポイント
   */
  async getFeedById(req: Request, res: Response) {
    try {
      const { feedId } = req.params;

      if (!feedId) {
        return res.status(400).json({ error: 'フィードIDが必要です' });
      }

      try {
        const feed = await feedService.getFeedById(feedId);
        return res.status(200).json(feed);
      } catch (error: any) {
        if (error.message === '指定されたフィードが見つかりません') {
          return res.status(404).json({ error: error.message });
        }
        throw error;
      }
    } catch (error) {
      console.error('フィード取得コントローラーエラー:', error);
      return res.status(500).json({ error: '内部サーバーエラー' });
    }
  }

  /**
   * ユーザーの最新フィードを取得するエンドポイント
   */
  async getLatestFeedByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.query;

      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: 'ユーザーIDが必要です' });
      }

      try {
        const feed = await feedService.getLatestFeedByUserId(userId);
        return res.status(200).json(feed);
      } catch (error) {
        return res.status(404).json({ error: 'ユーザーのフィードが見つかりません' });
      }
    } catch (error) {
      console.error('最新フィード取得コントローラーエラー:', error);
      return res.status(500).json({ error: '内部サーバーエラー' });
    }
  }
} 