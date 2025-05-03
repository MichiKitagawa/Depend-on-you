import { Router } from 'express';
import { FeedController } from '../controllers/feed.controller';

const router = Router();
const feedController = new FeedController();

// ユーザーフィード生成API (例: POST /user)
// POST / リクエストボディで userId を受け取る想定
router.post('/user', feedController.generateFeedForUser.bind(feedController));

// 旧エンドポイントは削除
// router.get('/latest', feedController.getLatestFeedByUserId.bind(feedController));
// router.get('/:feedId', feedController.getFeedById.bind(feedController));

export default router; 