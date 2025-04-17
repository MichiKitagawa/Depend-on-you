import dotenv from 'dotenv';

// Use test environment
process.env.NODE_ENV = 'test';
dotenv.config({ path: '.env.test' });

// Increase test timeout
jest.setTimeout(30000); 