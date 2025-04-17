import { Router } from 'express';
import PayoutController from '../controllers/PayoutController';

const router = Router();

// 報酬レコードを作成
router.post('/payouts', PayoutController.createPayout);

// ユーザーIDで報酬履歴取得
router.get('/payouts', PayoutController.getPayoutsByUserId);

// コンテンツIDで報酬履歴取得
router.get('/payouts/content', PayoutController.getPayoutsByContentId);

export default router; 