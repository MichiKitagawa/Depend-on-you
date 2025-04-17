import dotenv from 'dotenv';
import app from './app';
import sequelize from './config/db';

// 環境変数の読み込み
dotenv.config();

const PORT = process.env.PORT || 3006;

// サーバー起動
const startServer = async () => {
  try {
    // データベース接続確認
    await sequelize.authenticate();
    console.log('データベース接続成功');

    // モデルの同期
    await sequelize.sync();
    console.log('モデル同期完了');

    // サーバー起動
    app.listen(PORT, () => {
      console.log(`サーバー起動: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('サーバー起動エラー:', error);
    process.exit(1);
  }
};

startServer(); 