import { Router } from 'express';
import PurchaseController from '../controllers/PurchaseController';
import { PurchaseService } from '../services/PurchaseService';
import { WalletService } from '../services/WalletService';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { authMiddleware } from '../middleware/auth';

// --- 依存関係のインスタンス化 ---
// アプリケーションのルートなどで一度だけ生成するのが理想
const prismaClient = new PrismaClient();
const walletService = new WalletService(prismaClient);
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2025-04-30.basil' });
const purchaseService = new PurchaseService(prismaClient, stripeInstance, walletService);
const purchaseController = new PurchaseController(purchaseService, stripeInstance);
// --------------------------------

const router = Router();

// POST /purchases - ポイント購入インテント作成 (認証が必要)
// authMiddleware を使用
router.post('/', authMiddleware, purchaseController.createPurchaseIntent.bind(purchaseController));

// Stripe Webhook (認証不要)
// .bind() はアロー関数でラップする場合は不要
router.post('/webhook', (req, res) => purchaseController.handleWebhook(req, res));

export default router; 