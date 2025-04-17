import { Router } from 'express';
import { FeedController } from '../controllers/feed.controller';

const router = Router();
const feedController = new FeedController();

// フィード生成API
router.post('/generate', feedController.generateFeed.bind(feedController));

// 最新フィード取得API (/:feedId より先に定義する必要あり)
router.get('/latest', feedController.getLatestFeedByUserId.bind(feedController));

// 指定IDのフィード取得API
router.get('/:feedId', feedController.getFeedById.bind(feedController));

export default router; 