import { Request, Response } from 'express';
import PayoutService from '../services/PayoutService';
import { PayoutReason } from '../../../../shared/schema';

class PayoutController {
  /**
   * 報酬配分を作成する
   * POST /economy/payouts
   */
  async createPayout(req: Request, res: Response): Promise<void> {
    try {
      const { userId, contentId, payoutReason, points } = req.body;
      
      // バリデーション
      if (!userId || typeof userId !== 'string') {
        res.status(400).json({ error: 'Invalid or missing userId' });
        return;
      }
      
      if (!contentId || typeof contentId !== 'string') {
        res.status(400).json({ error: 'Invalid or missing contentId' });
        return;
      }
      
      if (!payoutReason || !['rankingReward', 'contribution'].includes(payoutReason)) {
        res.status(400).json({ error: 'Invalid payout reason' });
        return;
      }
      
      if (typeof points !== 'number' || points <= 0) {
        res.status(400).json({ error: 'Points must be a positive number' });
        return;
      }

      // サービスを呼び出して報酬データを作成
      const payout = await PayoutService.createPayout({
        userId,
        contentId,
        payoutReason: payoutReason as PayoutReason,
        points
      });

      res.status(201).json(payout);
    } catch (error) {
      console.error('Error in createPayout controller:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * ユーザーIDに基づいて報酬履歴を取得
   * GET /economy/payouts?userId=xxx
   */
  async getPayoutsByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.query;

      if (!userId || typeof userId !== 'string') {
        res.status(400).json({ error: 'Invalid or missing userId' });
        return;
      }

      const payouts = await PayoutService.getPayoutsByUserId(userId);
      
      if (payouts.length === 0) {
        res.status(200).json([]);
        return;
      }
      
      res.status(200).json(payouts);
    } catch (error) {
      console.error('Error in getPayoutsByUserId controller:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * コンテンツIDに基づいて報酬履歴を取得
   * GET /economy/payouts/content?contentId=xxx
   */
  async getPayoutsByContentId(req: Request, res: Response): Promise<void> {
    try {
      const { contentId } = req.query;

      if (!contentId || typeof contentId !== 'string') {
        res.status(400).json({ error: 'Invalid or missing contentId' });
        return;
      }

      const payouts = await PayoutService.getPayoutsByContentId(contentId);
      
      if (payouts.length === 0) {
        res.status(200).json([]);
        return;
      }
      
      res.status(200).json(payouts);
    } catch (error) {
      console.error('Error in getPayoutsByContentId controller:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new PayoutController(); 