import { Request, Response } from 'express';
import { WalletService } from '../services/WalletService';
import { AuthenticatedRequest } from '../middleware/auth';

export default class WalletController {
  private walletService: WalletService;

  constructor(walletServiceInstance: WalletService) {
    this.walletService = walletServiceInstance;
  }

  async getWalletBalance(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const userId = req.user.id;

    try {
      const balance = await this.walletService.getWalletBalance(userId);
      res.status(200).json({ userId, balance });
    } catch (error: any) {
      console.error(`Error fetching wallet balance for user ${userId}:`, error);
      res.status(500).json({ message: error.message || 'Internal server error' });
    }
  }

  async debitPoints(req: AuthenticatedRequest, res: Response): Promise<void> {
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
      const result = await this.walletService.debitPoints(
        userId,
        amount,
        reason,
        relatedId
      );

      if (result) {
        const balance = await this.walletService.getWalletBalance(userId);
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