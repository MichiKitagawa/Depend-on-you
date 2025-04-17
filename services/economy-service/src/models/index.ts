import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { initRevenueModel } from './Revenue';
import { initPayoutModel } from './Payout';

// 環境変数の読み込み
dotenv.config();

// 環境変数からDB接続情報を取得
const dbName = process.env.DB_NAME || 'depend_db';
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || 'rkrkspaspa55';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || '5432';

// Sequelizeインスタンスの作成
const sequelize = new Sequelize({
  database: dbName,
  username: dbUser,
  password: dbPassword,
  host: dbHost,
  port: parseInt(dbPort, 10),
  dialect: 'postgres',
  logging: false,
});

// モデルの初期化
const Revenue = initRevenueModel(sequelize);
const Payout = initPayoutModel(sequelize);

// データベース接続のテスト
const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export { sequelize, Revenue, Payout, testDbConnection }; 