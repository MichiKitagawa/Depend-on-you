import { Request, Response } from 'express';
import { PortfolioService } from '../services/portfolio-service';
import { PortfolioEntry } from '../models/portfolio';

export class PortfolioController {
  private portfolioService: PortfolioService;

  constructor() {
    this.portfolioService = new PortfolioService();
  }

  /**
   * ユーザーのポートフォリオを取得
   */
  getUserPortfolio = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId;
      
      if (!userId) {
        res.status(400).json({ error: 'ユーザーIDが必要です' });
        return;
      }

      const portfolio = await this.portfolioService.getUserPortfolio(userId);
      
      if (!portfolio) {
        res.status(404).json({ error: 'ポートフォリオが見つかりません' });
        return;
      }

      res.status(200).json(portfolio);
    } catch (error) {
      console.error('ポートフォリオ取得エラー:', error);
      res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
  };

  /**
   * ユーザーの行動履歴を同期
   */
  syncUserActions = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId;

      if (!userId) {
        res.status(400).json({ error: 'ユーザーIDが必要です' });
        return;
      }

      const syncedCount = await this.portfolioService.syncUserActions(userId);

      res.status(200).json({
        userId,
        syncedCount
      });
    } catch (error) {
      console.error('ポートフォリオ同期エラー:', error);
      res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
  };
} 