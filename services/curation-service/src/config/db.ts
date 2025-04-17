import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables based on NODE_ENV
dotenv.config({ 
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' 
});

const sequelize = new Sequelize(
  process.env.DB_NAME || 'depend_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'rkrkspaspa55',
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      underscored: true,
      timestamps: true
    }
  }
);

export default sequelize; 