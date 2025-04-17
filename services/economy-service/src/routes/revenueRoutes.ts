import { Router } from 'express';
import RevenueController from '../controllers/RevenueController';

const router = Router();

// 収益レコードを作成
router.post('/revenues', RevenueController.createRevenue);

// 収益タイプでレコード取得
router.get('/revenues', RevenueController.getRevenuesByType);

export default router; 