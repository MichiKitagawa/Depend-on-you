import express from 'express';
import cors from 'cors';
import feedRoutes from './routes/feed.routes';

// アプリケーションの作成
const app = express();

// ミドルウェアの設定
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ルートの設定
app.use('/feeds', feedRoutes);

// ヘルスチェックエンドポイント
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'feed-service' });
});

export default app; 