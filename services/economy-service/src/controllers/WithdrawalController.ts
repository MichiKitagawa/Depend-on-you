import { Request, Response } from 'express';
import { WithdrawalService } from '../services/WithdrawalService';
import { AuthenticatedRequest } from '../middleware/auth';

export default class WithdrawalController {
  private withdrawalService: WithdrawalService;

  constructor(withdrawalServiceInstance: WithdrawalService) {
    this.withdrawalService = withdrawalServiceInstance;
  }

  async requestWithdrawal(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const userId = req.user.id;
    const { amount, bankAccountId } = req.body;

    if (typeof amount !== 'number' || amount <= 0) {
      res.status(400).json({ message: 'Invalid amount' });
      return;
    }
    if (typeof bankAccountId !== 'string' || !bankAccountId) {
      res.status(400).json({ message: 'Missing bankAccountId' });
      return;
    }

    try {
      const result = await this.withdrawalService.requestWithdrawal(userId, amount, bankAccountId);
      res.status(201).json(result);
    } catch (error: any) {
      console.error(`Error requesting withdrawal for user ${userId}:`, error);
      if (error.message === 'Insufficient balance') {
          res.status(400).json({ message: error.message });
      } else {
          res.status(500).json({ message: error.message || 'Internal server error' });
      }
    }
  }

  async getWithdrawals(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const userId = req.user.id;

    try {
      const withdrawals = await this.withdrawalService.getUserWithdrawals(userId);
      res.status(200).json(withdrawals);
    } catch (error: any) {
      console.error(`Error fetching withdrawals for user ${userId}:`, error);
      res.status(500).json({ message: error.message || 'Internal server error' });
    }
  }
} 