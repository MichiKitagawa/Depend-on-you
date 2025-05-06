import { Router } from 'express';
import WalletController from '../controllers/WalletController';
import { WalletService } from '../services/WalletService';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

// --- 依存関係のインスタンス化 ---
const prismaClient = new PrismaClient();
const walletService = new WalletService(prismaClient);
const walletController = new WalletController(walletService);
// --------------------------------

const router = Router();

// GET /wallet - 残高取得 (認証が必要) エンドポイントを /balance に合わせる
// router.get('/', authMiddleware, walletController.getWalletBalance.bind(walletController));

// GET /wallet/balance - 残高取得 (認証が必要)
router.get('/balance', authMiddleware, walletController.getWalletBalance.bind(walletController));

// POST /wallet/debit (内部API? 認証が必要なら追加)
// router.post('/debit', authMiddleware, walletController.debitPoints.bind(walletController));

export default router; 