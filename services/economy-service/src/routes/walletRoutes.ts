import { Router } from 'express';
import WalletController from '../controllers/WalletController';

const router = Router();

// GET /wallet - ウォレット情報取得
router.get('/', WalletController.getWallet);

export default router; 