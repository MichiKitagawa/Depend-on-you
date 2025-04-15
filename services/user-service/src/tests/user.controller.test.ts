import request from 'supertest';
import express from 'express';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';

// UserServiceのモック
jest.mock('../services/user.service');

describe('UserController', () => {
  let app: express.Application;
  let userController: UserController;
  let userService: jest.Mocked<UserService>;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    // UserServiceのモックインスタンスを取得
    userService = new UserService() as jest.Mocked<UserService>;
    
    // コントローラーを作成し、モックサービスを注入
    userController = new UserController();
    (userController as any).userService = userService;
    
    // ルートを設定
    app.post('/api/users/register', userController.register);
    app.post('/api/users/login', userController.login);
    app.get('/api/users/profile', userController.getProfile);
    app.put('/api/users/profile', userController.updateProfile);
  });

  describe('POST /api/users/register', () => {
    it('正常: 有効なデータで登録できる', async () => {
      const mockUser = { id: '1', username: 'testuser', email: 'test@example.com' };
      userService.register.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/users/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockUser);
    });

    it('異常: パスワードが空 -> 400', async () => {
      userService.register.mockRejectedValue(new Error('Password is required'));

      const response = await request(app)
        .post('/api/users/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: ''
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Password is required');
    });
  });

  describe('POST /api/users/login', () => {
    it('正常: 正しい情報でログイン -> JWTを取得', async () => {
      const mockToken = 'mock-jwt-token';
      userService.login.mockResolvedValue(mockToken);

      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.token).toBe(mockToken);
    });

    it('異常: 存在しないユーザー -> 401', async () => {
      userService.login.mockRejectedValue(new Error('User not found'));

      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('User not found');
    });
  });

  describe('GET /api/users/profile', () => {
    it('正常: 存在するユーザーを取得', async () => {
      const mockUser = { id: '1', username: 'testuser', email: 'test@example.com' };
      userService.getProfile.mockResolvedValue(mockUser);

      // リクエストにuserプロパティを追加
      const mockReq = { user: { id: '1' } } as any;
      const mockRes = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      } as any;

      await userController.getProfile(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(mockUser);
    });

    it('異常: 未認証ユーザー -> エラー', async () => {
      // リクエストにuserプロパティがない
      const mockReq = {} as any;
      const mockRes = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      } as any;

      await userController.getProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'User not authenticated' });
    });
  });

  describe('PUT /api/users/profile', () => {
    it('正常: プロフィールを更新', async () => {
      const mockUpdatedUser = { id: '1', username: 'updateduser', email: 'updated@example.com' };
      userService.updateProfile.mockResolvedValue(mockUpdatedUser);

      // リクエストにuserプロパティを追加
      const mockReq = { 
        user: { id: '1' },
        body: { username: 'updateduser' }
      } as any;
      const mockRes = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      } as any;

      await userController.updateProfile(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(mockUpdatedUser);
    });

    it('異常: 未認証ユーザー -> エラー', async () => {
      // リクエストにuserプロパティがない
      const mockReq = { body: { username: 'updateduser' } } as any;
      const mockRes = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      } as any;

      await userController.updateProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'User not authenticated' });
    });
  });
}); 