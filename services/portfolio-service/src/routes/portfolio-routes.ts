import { Router } from 'express';
import { PortfolioController } from '../controllers/portfolio-controller';

const router = Router();
const portfolioController = new PortfolioController();

// GET /portfolios/:userId - ユーザーのポートフォリオを取得
router.get('/:userId', portfolioController.getUserPortfolio);

// POST /portfolios/:userId/sync - ユーザーのアクションを同期
router.post('/:userId/sync', portfolioController.syncUserActions);

export default router; 