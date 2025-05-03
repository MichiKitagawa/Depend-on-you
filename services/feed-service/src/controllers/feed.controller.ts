import { Request, Response } from 'express';
import { FeedService } from '../services/feed.service';
import { UserId } from '@shared/schema';

// const feedService = new FeedService(); // トップレベルでのインスタンス化をやめる

export class FeedController {
  private feedService: FeedService;

  // コンストラクタで FeedService インスタンスを受け取る
  constructor(feedServiceInstance?: FeedService) {
      this.feedService = feedServiceInstance || new FeedService();
  }

  /**
   * ユーザーIDに基づいてフィードを生成するエンドポイント
   */
  generateFeedForUser = async (req: Request, res: Response) => {
    try {
      const userId = req.body.userId as UserId | undefined;

      if (!userId) {
        return res.status(400).json({ error: 'ユーザーID (userId) が必要です' });
      }

      const feedResult = await this.feedService.generateFeed(userId);

      return res.status(200).json(feedResult);
    } catch (error) {
      console.error('フィード生成コントローラーエラー:', error);
      return res.status(500).json({ error: 'フィード生成中にエラーが発生しました' });
    }
  }
} 