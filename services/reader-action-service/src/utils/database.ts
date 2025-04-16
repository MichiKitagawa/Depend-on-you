import { Sequelize } from 'sequelize';
import path from 'path';
import dotenv from 'dotenv';

// 環境変数がまだ読み込まれていない場合のみ読み込む
if (!process.env.DB_NAME) {
  const envPath = process.env.NODE_ENV === 'test' 
    ? path.resolve(process.cwd(), '.env.test')
    : path.resolve(__dirname, '../../.env');
  
  console.log('環境変数ファイルパス:', envPath);
  dotenv.config({ path: envPath });
}

console.log('データベース設定:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  nodeEnv: process.env.NODE_ENV
});

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
  },
});

export const initDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('データベース接続に成功しました。');
    
    // 開発環境の場合のみテーブルを同期
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('データベーステーブルを同期しました。');
    }
  } catch (error) {
    console.error('データベース接続に失敗しました:', error);
    process.exit(1);
  }
}; 