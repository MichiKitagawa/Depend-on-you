import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const isTest = process.env.NODE_ENV === 'test';

// Use appropriate environment file
if (isTest) {
  dotenv.config({ path: '.env.test' });
}

const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbPassword = process.env.DB_PASSWORD as string;
const dbHost = process.env.DB_HOST as string;
const dbPort = process.env.DB_PORT as string;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: parseInt(dbPort, 10),
  dialect: 'postgres',
  logging: false,
});

export default sequelize; 