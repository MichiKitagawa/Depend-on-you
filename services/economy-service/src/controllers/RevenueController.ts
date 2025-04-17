import { Request, Response } from 'express';
import RevenueService from '../services/RevenueService';
import { RevenueType } from '../../../../shared/schema';

class RevenueController {
  /**
   * 収益レコードを登録する
   * POST /economy/revenues
   */
  async createRevenue(req: Request, res: Response): Promise<void> {
    try {
      const { revenueType, amount } = req.body;

      // バリデーション
      if (!revenueType || !['ad', 'subscription', 'goods'].includes(revenueType)) {
        res.status(400).json({ error: 'Invalid revenue type' });
        return;
      }

      if (typeof amount !== 'number' || amount <= 0) {
        res.status(400).json({ error: 'Amount must be a positive number' });
        return;
      }

      // サービスを呼び出して収益データを作成
      const revenue = await RevenueService.createRevenue({
        revenueType: revenueType as RevenueType,
        amount
      });

      res.status(201).json(revenue);
    } catch (error) {
      console.error('Error in createRevenue controller:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * 収益タイプに基づいて収益データを取得
   * GET /economy/revenues?type=subscription
   */
  async getRevenuesByType(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.query;

      if (!type || !['ad', 'subscription', 'goods'].includes(type as string)) {
        res.status(400).json({ error: 'Invalid revenue type' });
        return;
      }

      const revenues = await RevenueService.getRevenuesByType(type as RevenueType);
      res.status(200).json(revenues);
    } catch (error) {
      console.error('Error in getRevenuesByType controller:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new RevenueController(); 