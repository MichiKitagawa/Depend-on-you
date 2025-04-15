import { UserService } from '../services/user.service';
import { Pool, QueryResult } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// pgのPoolをモック
jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

describe('UserService', () => {
  let userService: UserService;
  let mockPool: jest.Mocked<Pool>;

  beforeEach(() => {
    // モックをリセット
    jest.clearAllMocks();
    
    // 環境変数を設定
    process.env.POSTGRES_USER = 'postgres';
    process.env.POSTGRES_PASSWORD = 'password';
    process.env.POSTGRES_DB = 'depend_db';
    process.env.GLOBAL_JWT_SECRET = 'test_secret';
    
    // UserServiceのインスタンスを作成
    userService = new UserService();
    
    // モックPoolを取得
    mockPool = (userService as any).pool;
  });

  describe('register', () => {
    it('正常: ユーザーを登録できる', async () => {
      // モックの設定
      const mockUser = { id: '1', username: 'testuser', email: 'test@example.com' };
      const mockQueryResult: QueryResult = {
        rows: [mockUser],
        rowCount: 1,
        command: '',
        oid: 0,
        fields: []
      };
      (mockPool.query as jest.Mock).mockResolvedValueOnce(mockQueryResult);
      
      // bcryptのハッシュ関数をモック
      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashed_password' as never);
      
      // テスト実行
      const result = await userService.register('testuser', 'test@example.com', 'password123');
      
      // 検証
      expect(mockPool.query).toHaveBeenCalledWith(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
        ['testuser', 'test@example.com', 'hashed_password']
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('login', () => {
    it('正常: 正しい情報でログインできる', async () => {
      // モックの設定
      const mockUser = { 
        id: '1', 
        username: 'testuser', 
        email: 'test@example.com',
        password: 'hashed_password'
      };
      const mockQueryResult: QueryResult = {
        rows: [mockUser],
        rowCount: 1,
        command: '',
        oid: 0,
        fields: []
      };
      (mockPool.query as jest.Mock).mockResolvedValueOnce(mockQueryResult);
      
      // bcryptの比較関数をモック
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true as never);
      
      // jwtの署名関数をモック
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => 'mock_token');
      
      // テスト実行
      const result = await userService.login('test@example.com', 'password123');
      
      // 検証
      expect(mockPool.query).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE email = $1',
        ['test@example.com']
      );
      expect(result).toBe('mock_token');
    });

    it('異常: 存在しないユーザー -> エラー', async () => {
      // モックの設定
      const mockQueryResult: QueryResult = {
        rows: [],
        rowCount: 0,
        command: '',
        oid: 0,
        fields: []
      };
      (mockPool.query as jest.Mock).mockResolvedValueOnce(mockQueryResult);
      
      // テスト実行と検証
      await expect(userService.login('nonexistent@example.com', 'password123'))
        .rejects.toThrow('User not found');
    });

    it('異常: 間違ったパスワード -> エラー', async () => {
      // モックの設定
      const mockUser = { 
        id: '1', 
        username: 'testuser', 
        email: 'test@example.com',
        password: 'hashed_password'
      };
      const mockQueryResult: QueryResult = {
        rows: [mockUser],
        rowCount: 1,
        command: '',
        oid: 0,
        fields: []
      };
      (mockPool.query as jest.Mock).mockResolvedValueOnce(mockQueryResult);
      
      // bcryptの比較関数をモック
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false as never);
      
      // テスト実行と検証
      await expect(userService.login('test@example.com', 'wrong_password'))
        .rejects.toThrow('Invalid password');
    });
  });

  describe('getProfile', () => {
    it('正常: 存在するユーザーを取得できる', async () => {
      // モックの設定
      const mockUser = { id: '1', username: 'testuser', email: 'test@example.com' };
      const mockQueryResult: QueryResult = {
        rows: [mockUser],
        rowCount: 1,
        command: '',
        oid: 0,
        fields: []
      };
      (mockPool.query as jest.Mock).mockResolvedValueOnce(mockQueryResult);
      
      // テスト実行
      const result = await userService.getProfile('1');
      
      // 検証
      expect(mockPool.query).toHaveBeenCalledWith(
        'SELECT id, username, email FROM users WHERE id = $1',
        ['1']
      );
      expect(result).toEqual(mockUser);
    });

    it('異常: 存在しないユーザー -> エラー', async () => {
      // モックの設定
      const mockQueryResult: QueryResult = {
        rows: [],
        rowCount: 0,
        command: '',
        oid: 0,
        fields: []
      };
      (mockPool.query as jest.Mock).mockResolvedValueOnce(mockQueryResult);
      
      // テスト実行と検証
      await expect(userService.getProfile('999'))
        .rejects.toThrow('User not found');
    });
  });

  describe('updateProfile', () => {
    it('正常: プロフィールを更新できる', async () => {
      // モックの設定
      const mockUpdatedUser = { id: '1', username: 'updateduser', email: 'test@example.com' };
      const mockQueryResult: QueryResult = {
        rows: [mockUpdatedUser],
        rowCount: 1,
        command: '',
        oid: 0,
        fields: []
      };
      (mockPool.query as jest.Mock).mockResolvedValueOnce(mockQueryResult);
      
      // テスト実行
      const result = await userService.updateProfile('1', { username: 'updateduser' });
      
      // 検証
      expect(mockPool.query).toHaveBeenCalledWith(
        'UPDATE users SET username = $2 WHERE id = $1 RETURNING id, username, email',
        ['1', 'updateduser']
      );
      expect(result).toEqual(mockUpdatedUser);
    });

    it('異常: 存在しないユーザー -> エラー', async () => {
      // モックの設定
      const mockQueryResult: QueryResult = {
        rows: [],
        rowCount: 0,
        command: '',
        oid: 0,
        fields: []
      };
      (mockPool.query as jest.Mock).mockResolvedValueOnce(mockQueryResult);
      
      // テスト実行と検証
      await expect(userService.updateProfile('999', { username: 'updateduser' }))
        .rejects.toThrow('User not found');
    });

    it('異常: 更新内容がない -> エラー', async () => {
      // テスト実行と検証
      await expect(userService.updateProfile('1', {}))
        .rejects.toThrow('No valid updates provided');
    });
  });
}); 