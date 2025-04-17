import { Router } from 'express';
import RankingController from '../controllers/ranking-controller';

const router = Router();
const rankingController = new RankingController();

// POST /rankings/rebuild - Rebuild rankings for a cluster
router.post('/rankings/rebuild', rankingController.rebuildRankings);

// GET /rankings - Get rankings with optional filters
router.get('/rankings', rankingController.getRankings);

export default router; 