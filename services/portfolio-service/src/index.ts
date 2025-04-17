import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import portfolioRoutes from './routes/portfolio-routes';
import { initializeDatabase } from './models/db';

// 環境変数の読み込み
dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const app = express();
const PORT = process.env.PORT || 3007;

// ミドルウェア
app.use(express.json());
app.use(cors());

// ルート
app.use('/portfolios', portfolioRoutes);

// ヘルスチェックエンドポイント
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'portfolio-service' });
});

// サーバー起動
const startServer = async () => {
  try {
    // データベースの初期化
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`portfolio-service サーバーがポート ${PORT} で起動しました`);
    });
  } catch (error) {
    console.error('サーバー起動エラー:', error);
    process.exit(1);
  }
};

// サーバー起動（テスト時は自動起動しない）
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app; 