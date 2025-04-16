import { Sequelize } from 'sequelize';

// SQLiteインメモリデータベースを使用
export const sequelize = new Sequelize('sqlite::memory:', {
  logging: false
});

export const initDatabase = async (): Promise<void> => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
}; 