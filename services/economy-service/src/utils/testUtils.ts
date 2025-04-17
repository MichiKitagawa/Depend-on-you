import { Sequelize } from 'sequelize';
import { sequelize } from '../models';

/**
 * テストケース実行前にテーブルをクリアする
 */
export const clearTables = async (): Promise<void> => {
  try {
    // トランザクションを使用して一貫性を保つ
    await sequelize.transaction(async (transaction) => {
      await sequelize.query('TRUNCATE TABLE revenues CASCADE', { transaction });
      await sequelize.query('TRUNCATE TABLE payouts CASCADE', { transaction });
    });
  } catch (error) {
    console.error('Error clearing tables:', error);
    throw error;
  }
};

/**
 * テスト用のSequelizeインスタンス取得
 */
export const getTestSequelize = (): Sequelize => {
  return sequelize;
}; 