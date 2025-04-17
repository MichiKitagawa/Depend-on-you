import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// 環境変数から設定を読み込み
const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbPassword = process.env.DB_PASSWORD as string;
const dbHost = process.env.DB_HOST as string;
const dbPort = process.env.DB_PORT as string;

// Sequelizeインスタンスを作成
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: parseInt(dbPort, 10),
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    underscored: true, // スネークケースのカラム名を使用
  }
});

// データベース接続を初期化
export const initDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('データベースに正常に接続されました。');
    
    // 開発環境の場合はSync
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('モデルと同期しました。');
    }
  } catch (error) {
    console.error('データベース接続エラー:', error);
    throw error;
  }
};

export default sequelize; 