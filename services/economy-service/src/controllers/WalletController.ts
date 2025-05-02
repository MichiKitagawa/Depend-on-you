import { Response } from 'express';
import WalletService from '../services/WalletService';
import { AuthenticatedRequest } from '../middleware/auth';

class WalletController {
  async getWallet(req: AuthenticatedRequest, res: Response): Promise<void> {
    // 認証ミドルウェアから userId を取得
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    try {
      const balance = await WalletService.getWalletBalance(userId);
      res.status(200).json({ userId, balance });
    } catch (error) {
      console.error('Error getting wallet balance:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // 他のサービスからのポイント消費リクエスト処理
  async debitPoints(req: AuthenticatedRequest, res: Response): Promise<void> {
    // 認証ミドルウェアから userId を取得
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { amount, reason, relatedId } = req.body;
    
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      res.status(400).json({ message: 'Invalid amount' });
      return;
    }

    if (!reason || typeof reason !== 'string') {
      res.status(400).json({ message: 'Invalid reason' });
      return;
    }

    try {
      const result = await WalletService.debitPoints(
        userId,
        amount,
        reason,
        relatedId
      );

      if (result) {
        const balance = await WalletService.getWalletBalance(userId);
        res.status(200).json({ success: true, balance });
      } else {
        res.status(400).json({ success: false, message: 'Insufficient balance' });
      }
    } catch (error: any) {
      console.error('Error debiting points:', error);
      res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
  }
}

export default new WalletController(); 