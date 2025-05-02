import { Router } from 'express';
import walletRoutes from './walletRoutes';
import purchaseRoutes from './purchaseRoutes';
import withdrawalRoutes from './withdrawalRoutes';

const router = Router();

// 各ルートをマウント
router.use('/wallet', walletRoutes);
router.use('/purchases', purchaseRoutes);
router.use('/withdrawals', withdrawalRoutes);

export default router; 