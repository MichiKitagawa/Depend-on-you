import { Router } from 'express';
import WithdrawalController from '../controllers/WithdrawalController';

const router = Router();

// POST /withdrawals - 出金申請
router.post('/', WithdrawalController.requestWithdrawal);

// GET /withdrawals - 出金履歴取得
router.get('/', WithdrawalController.getWithdrawals);

export default router; 