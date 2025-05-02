import { Router } from 'express';
import PurchaseController from '../controllers/PurchaseController';

const router = Router();

// POST /purchases - ポイント購入インテント作成
router.post('/', PurchaseController.createPurchaseIntent);

// ここに Stripe Webhook 用のエンドポイントも追加する想定
router.post('/webhook', PurchaseController.handleWebhook);

export default router; 