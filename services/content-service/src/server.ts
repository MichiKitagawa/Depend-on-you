import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import contentRoutes from './routes/content.routes';

const app = express();
const PORT = process.env.PORT || 3002;

// ミドルウェアの設定
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ルーティング
app.use('/contents', contentRoutes);

// ヘルスチェックエンドポイント
app.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok' });
});

// サーバー起動
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Content service is running on port ${PORT}`);
  });
}

export default app; 