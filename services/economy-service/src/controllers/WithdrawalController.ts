import { Response } from 'express';
import WithdrawalService from '../services/WithdrawalService';
import { AuthenticatedRequest } from '../middleware/auth';

class WithdrawalController {
  async requestWithdrawal(req: AuthenticatedRequest, res: Response): Promise<void> {
    // 認証ミドルウェアから userId を取得
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const { amount /*, bankName, branchName, ... */ } = req.body;
    // TODO: Extract and validate bank account details from req.body
    if (!amount /* || !bankDetailsAreValid(req.body) */) {
      res.status(400).json({ message: 'Missing or invalid amount or bank details' });
      return;
    }
    if (typeof amount !== 'number' || amount <= 0) {
        res.status(400).json({ message: 'Invalid amount' });
        return;
    }
    // TODO: 振込先情報のバリデーション

    try {
      const result = await WithdrawalService.requestWithdrawal({
        userId,
        amount,
        // TODO: Pass bank account details to service
        // bankName: req.body.bankName, ...
      });
      res.status(201).json(result);
    } catch (error: any) {
      console.error('Error requesting withdrawal:', error);
      if (error.message === 'Insufficient balance for withdrawal request') {
          res.status(400).json({ message: error.message });
      } else {
          res.status(500).json({ message: error.message || 'Internal server error' });
      }
    }
  }

  async getWithdrawals(req: AuthenticatedRequest, res: Response): Promise<void> {
    // 認証ミドルウェアから userId を取得
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    try {
      const withdrawals = await WithdrawalService.getWithdrawalsByUserId(userId);
      res.status(200).json(withdrawals);
    } catch (error) {
      console.error('Error getting withdrawals:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default new WithdrawalController(); 