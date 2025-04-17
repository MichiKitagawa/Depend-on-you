import { Router } from 'express';
import revenueRoutes from './revenueRoutes';
import payoutRoutes from './payoutRoutes';

const router = Router();

// 各ルートをマウント
router.use('/economy', revenueRoutes);
router.use('/economy', payoutRoutes);

export default router; 