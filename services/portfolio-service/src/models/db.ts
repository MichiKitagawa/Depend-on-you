import { Pool } from 'pg';
import dotenv from 'dotenv';

// 環境変数の読み込み
dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

// データベース接続設定
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

// データベーステーブルの初期化
export const initializeDatabase = async (): Promise<void> => {
  try {
    // portfolios テーブルの作成
    await pool.query(`
      CREATE TABLE IF NOT EXISTS portfolios (
        portfolio_id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL UNIQUE,
        entries JSONB DEFAULT '[]',
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    
    console.log('データベーステーブルの初期化が完了しました');
  } catch (error) {
    console.error('データベーステーブルの初期化に失敗しました:', error);
    throw error;
  }
};

export default pool; 