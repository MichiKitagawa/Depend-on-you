import { Router } from 'express';
import WithdrawalController from '../controllers/WithdrawalController';
import { WithdrawalService } from '../services/WithdrawalService';
import { WalletService } from '../services/WalletService';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

// --- 依存関係のインスタンス化 ---
const prismaClient = new PrismaClient();
const walletService = new WalletService(prismaClient);
const withdrawalService = new WithdrawalService(prismaClient, walletService);
const withdrawalController = new WithdrawalController(withdrawalService);
// --------------------------------

const router = Router();

// POST /withdrawals - 出金申請 (認証が必要)
router.post('/', authMiddleware, withdrawalController.requestWithdrawal.bind(withdrawalController));

// GET /withdrawals - 出金履歴取得 (認証が必要)
router.get('/', authMiddleware, withdrawalController.getWithdrawals.bind(withdrawalController));

export default router; 