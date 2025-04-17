import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// 環境変数の読み込み
dotenv.config();

// 環境に応じて.envファイルを読み込む
if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
}

const dbName = process.env.DB_NAME || 'depend_db';
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || 'password';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || '5432', 10);

// Sequelizeインスタンスを作成
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export default sequelize; 