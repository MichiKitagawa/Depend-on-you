import dotenv from 'dotenv';
import path from 'path';
import { Sequelize } from 'sequelize';
import '@jest/globals';

// テスト用の環境変数を読み込む
const envPath = path.resolve(process.cwd(), '.env.test');
console.log('テスト環境変数パス:', envPath);
dotenv.config({ path: envPath });

// SQLiteインメモリデータベースを使用
export const sequelize = new Sequelize('sqlite::memory:', {
  logging: false
});

// テスト用のデータベースに接続
export const setupDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('テストデータベースに接続しました。');
    
    // テスト用のテーブルを同期
    await sequelize.sync({ force: true });
    console.log('テストテーブルを同期しました。');
    return true;
  } catch (error) {
    console.error('テストデータベースのセットアップに失敗しました:', error);
    return false;
  }
};

// データベース接続を閉じる
export const closeDatabase = async () => {
  try {
    await sequelize.close();
    console.log('テストデータベース接続を閉じました。');
  } catch (error) {
    console.error('テストデータベース接続のクローズに失敗しました:', error);
  }
};

// グローバルセットアップ
beforeAll(async () => {
  await setupDatabase();
});

// グローバルクリーンアップ
afterAll(async () => {
  await closeDatabase();
}); 