import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

interface ProfileUpdates {
  username?: string;
  email?: string;
}

export class UserService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      host: 'localhost',
      port: 5432,
    });
  }

  async register(username: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await this.pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );

    return result.rows[0];
  }

  async login(email: string, password: string) {
    const result = await this.pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    const user = result.rows[0];
    if (!user) {
      throw new Error('User not found');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.GLOBAL_JWT_SECRET || 'development_secret',
      { expiresIn: '24h' }
    );

    return token;
  }

  async getProfile(userId: string) {
    const result = await this.pool.query(
      'SELECT id, username, email FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    return result.rows[0];
  }

  async updateProfile(userId: string, updates: ProfileUpdates) {
    const validUpdates = Object.entries(updates)
      .filter(([_, value]) => value !== undefined)
      .map(([key]) => key as keyof ProfileUpdates);

    if (validUpdates.length === 0) {
      throw new Error('No valid updates provided');
    }

    const setClause = validUpdates
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const values = [userId, ...validUpdates.map(key => updates[key])];

    const result = await this.pool.query(
      `UPDATE users SET ${setClause} WHERE id = $1 RETURNING id, username, email`,
      values
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    return result.rows[0];
  }
} 