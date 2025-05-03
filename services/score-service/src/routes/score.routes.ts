import { Router } from 'express';
import { recalculateScore, getScoreByPostId, getAllScores } from '../controllers/score.controller';

const router = Router();

// スコア再計算エンドポイント
router.post('/scores/recalculate', recalculateScore);

// 特定の投稿のスコア取得エンドポイント
router.get('/scores/:postId', getScoreByPostId);

// 全投稿のスコア一覧取得エンドポイント
router.get('/scores', getAllScores);

export default router; 