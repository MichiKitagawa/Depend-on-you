import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import feedRoutes from './routes/feed.routes';
import { FeedService } from './services/feed.service';
import { FeedController } from './controllers/feed.controller';

// アプリケーションの作成
const app = express();

// ミドルウェアの設定
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// サービスとコントローラーのインスタンス化
const feedService = new FeedService();
const feedController = new FeedController(feedService);

// ルートの設定
app.post('/feeds/user', feedController.generateFeedForUser);

// ヘルスチェックエンドポイント
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'feed-service' });
});

export default app; 