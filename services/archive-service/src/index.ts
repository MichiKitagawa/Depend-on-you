import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { initDatabase } from './utils/database';
import archiveRoutes from './routes/archive.routes';

// 環境変数の読み込み
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3009;

// ミドルウェアの設定
app.use(helmet());
app.use(cors());
app.use(express.json());

// ルートの設定
app.use('/', archiveRoutes);

// ヘルスチェックエンドポイント
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK' });
});

// エラーハンドリング
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'サーバーエラーが発生しました' });
});

// サーバー起動
const startServer = async () => {
  try {
    // データベース接続
    await initDatabase();
    
    // サーバー起動
    app.listen(PORT, () => {
      console.log(`Archive Serviceが起動しました: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('サーバー起動エラー:', error);
    process.exit(1);
  }
};

startServer(); 