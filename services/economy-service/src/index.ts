import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { sequelize, testDbConnection } from './models';
import routes from './routes';

// 環境変数の読み込み
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3010;

// ミドルウェア
app.use(cors());
app.use(helmet());
app.use(express.json());

// データベース接続確認
testDbConnection();

// モデル同期（開発環境のみ）
if (process.env.NODE_ENV === 'development') {
  sequelize.sync({ force: false }).then(() => {
    console.log('Database synced');
  }).catch((err) => {
    console.error('Error syncing database:', err);
  });
}

// ルーティング
app.use('/api', routes);

// ヘルスチェックエンドポイント
app.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok' });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Economy service running on port ${PORT}`);
});

export default app; 