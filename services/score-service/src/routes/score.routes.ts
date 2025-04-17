import { Router } from 'express';
import { recalculateScore, getScoreByContentId, getAllScores } from '../controllers/score.controller';

const router = Router();

// スコア再計算エンドポイント
router.post('/scores/recalculate', recalculateScore);

// 特定の作品のスコア取得エンドポイント
router.get('/scores/:contentId', getScoreByContentId);

// 全作品のスコア一覧取得エンドポイント
router.get('/scores', getAllScores);

export default router; 