import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { Request, Response } from 'express';
import { PaginationQuery } from '../types/pagination';

// UserServiceのモック
jest.mock('../services/user.service');

// Express.Requestのモック用ヘルパー関数
function createMockRequest<T = any, U = any>(params: any = {}, query: any = {}, body: any = {}): Partial<Request<T, any, U, PaginationQuery>> {
  return {
    params,
    query,
    body,
    get: jest.fn((name: string) => undefined),
    header: jest.fn(),
    accepts: jest.fn(),
    acceptsCharsets: jest.fn(),
    acceptsEncodings: jest.fn(),
    acceptsLanguages: jest.fn(),
    range: jest.fn(),
    param: jest.fn(),
    is: jest.fn(),
    protocol: 'http',
    secure: false,
    ip: '::1',
    ips: [],
    subdomains: [],
    path: '/',
    hostname: 'localhost',
    host: 'localhost',
    fresh: false,
    stale: true,
    xhr: false,
    cookies: {},
    method: 'GET',
    url: '/',
    originalUrl: '/',
    baseUrl: '/',
    app: {} as any,
    res: {} as any,
    next: jest.fn()
  };
}

describe('UserController (Unit Style)', () => {
  let userController: UserController;
  let userService: jest.Mocked<UserService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockSend: jest.Mock;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    userService = new UserService() as jest.Mocked<UserService>;
    userController = new UserController(userService);

    mockSend = jest.fn();
    mockJson = jest.fn();
    mockStatus = jest.fn(() => ({ json: mockJson, send: mockSend }));
    mockResponse = {
      status: mockStatus,
      json: mockJson,
      send: mockSend,
    };
  });

  describe('register', () => {
    const userData = { username: 'testuser', email: 'test@example.com', password: 'password123' };

    it('正常: 有効なデータで登録 -> 201 とユーザー情報を返す', async () => {
      const mockRegisteredUser = { id: '1', email: 'test@example.com' };
      userService.register.mockResolvedValue(mockRegisteredUser);
      mockRequest = { body: userData };

      await userController.register(mockRequest as Request, mockResponse as Response);

      expect(userService.register).toHaveBeenCalledWith(userData.username, userData.email, userData.password);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockRegisteredUser);
    });

    it('異常: 登録サービスでエラー -> 400 とエラーメッセージを返す', async () => {
      const error = new Error('Registration failed');
      userService.register.mockRejectedValue(error);
      mockRequest = { body: userData };

      await userController.register(mockRequest as Request, mockResponse as Response);

      expect(userService.register).toHaveBeenCalledWith(userData.username, userData.email, userData.password);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('login', () => {
    const loginData = { email: 'test@example.com', password: 'password123' };

    it('正常: 正しい情報でログイン -> 200 と JWT を返す', async () => {
      const mockToken = 'mock-jwt-token';
      userService.login.mockResolvedValue(mockToken);
      mockRequest = { body: loginData };

      await userController.login(mockRequest as Request, mockResponse as Response);

      expect(userService.login).toHaveBeenCalledWith(loginData.email, loginData.password);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({ token: mockToken });
    });

    it('異常: ログインサービスでエラー -> 401 とエラーメッセージを返す', async () => {
      const error = new Error('Invalid credentials');
      userService.login.mockRejectedValue(error);
      mockRequest = { body: loginData };

      await userController.login(mockRequest as Request, mockResponse as Response);

      expect(userService.login).toHaveBeenCalledWith(loginData.email, loginData.password);
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getProfile', () => {
    const userId = 'user-1';
    const mockProfile = { id: 'prof-1', userId: userId, name: 'Test User' };

    it('正常: プロフィールを取得 -> 200 とプロフィール情報を返す', async () => {
      userService.getProfile.mockResolvedValue(mockProfile);
      mockRequest = { user: { id: userId, email: 'test@example.com' } }; // 認証済みユーザーを設定

      await userController.getProfile(mockRequest as Request, mockResponse as Response);

      expect(userService.getProfile).toHaveBeenCalledWith(userId);
      expect(mockResponse.status).not.toHaveBeenCalled(); // 正常時は status なしで json
      expect(mockResponse.json).toHaveBeenCalledWith(mockProfile);
    });

    it('異常: 未認証 -> 401 エラー (認証ミドルウェアで弾かれるはず)', async () => {
      mockRequest = {}; // req.user がない状態

      await userController.getProfile(mockRequest as Request, mockResponse as Response);

      expect(userService.getProfile).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });

    it('異常: プロフィールが見つからない -> 404 エラー', async () => {
      const error = new Error('Profile not found');
      userService.getProfile.mockRejectedValue(error);
      mockRequest = { user: { id: userId } };

      await userController.getProfile(mockRequest as Request, mockResponse as Response);

      expect(userService.getProfile).toHaveBeenCalledWith(userId);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('updateProfile', () => {
    const userId = 'user-1';
    const updateData = { name: 'Updated Name' };
    const mockUpdatedProfile = { id: 'prof-1', userId: userId, name: 'Updated Name' };

    it('正常: プロフィールを更新 -> 200 と更新後プロフィールを返す', async () => {
      userService.updateProfile.mockResolvedValue(mockUpdatedProfile);
      mockRequest = { user: { id: userId, email: 'test@example.com' }, body: updateData };

      await userController.updateProfile(mockRequest as Request, mockResponse as Response);

      expect(userService.updateProfile).toHaveBeenCalledWith(userId, updateData);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedProfile);
    });

    it('異常: 未認証 -> 401 エラー', async () => {
      mockRequest = { body: updateData }; // req.user なし
      await userController.updateProfile(mockRequest as Request, mockResponse as Response);
      expect(userService.updateProfile).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });

    it('異常: プロフィール更新に失敗 -> 400 エラー', async () => {
      const error = new Error('Update failed');
      userService.updateProfile.mockRejectedValue(error);
      mockRequest = { user: { id: userId }, body: updateData };

      await userController.updateProfile(mockRequest as Request, mockResponse as Response);

      expect(userService.updateProfile).toHaveBeenCalledWith(userId, updateData);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getNotificationPreferences', () => {
    const userId = 'user-1';
    const mockPrefs = { email: true };

    it('正常: 通知設定を取得 -> 200 と設定情報を返す', async () => {
      userService.getNotificationPreferences.mockResolvedValue(mockPrefs);
      mockRequest = { user: { id: userId, email: 'test@example.com' } };

      await userController.getNotificationPreferences(mockRequest as Request, mockResponse as Response);

      expect(userService.getNotificationPreferences).toHaveBeenCalledWith(userId);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockPrefs);
    });

    it('正常: 通知設定が未設定 -> 200 と空オブジェクト {} を返す', async () => {
      userService.getNotificationPreferences.mockResolvedValue(null);
      mockRequest = { user: { id: userId } };

      await userController.getNotificationPreferences(mockRequest as Request, mockResponse as Response);

      expect(userService.getNotificationPreferences).toHaveBeenCalledWith(userId);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({});
    });

    it('異常: 未認証 -> 401 エラー', async () => {
      mockRequest = {}; // req.user なし
      await userController.getNotificationPreferences(mockRequest as Request, mockResponse as Response);
      expect(userService.getNotificationPreferences).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });

    it('異常: 通知設定の取得に失敗 -> 404 エラー', async () => {
      const error = new Error('Not Found');
      userService.getNotificationPreferences.mockRejectedValue(error);
      mockRequest = { user: { id: userId } };

      await userController.getNotificationPreferences(mockRequest as Request, mockResponse as Response);

      expect(userService.getNotificationPreferences).toHaveBeenCalledWith(userId);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('updateNotificationPreferences', () => {
    const userId = 'user-1';
    const prefData = { push: true };
    const mockUpdatedPrefs = { email: false, push: true };

    it('正常: 通知設定を更新 -> 200 と更新後設定を返す', async () => {
      userService.updateNotificationPreferences.mockResolvedValue(mockUpdatedPrefs);
      mockRequest = { user: { id: userId, email: 'test@example.com' }, body: prefData };

      await userController.updateNotificationPreferences(mockRequest as Request, mockResponse as Response);

      expect(userService.updateNotificationPreferences).toHaveBeenCalledWith(userId, prefData);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedPrefs);
    });

    it('異常: 未認証 -> 401 エラー', async () => {
      mockRequest = { body: prefData }; // req.user なし
      await userController.updateNotificationPreferences(mockRequest as Request, mockResponse as Response);
      expect(userService.updateNotificationPreferences).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });

    it('異常: 通知設定の更新に失敗 -> 400 エラー', async () => {
      const error = new Error('Update failed');
      userService.updateNotificationPreferences.mockRejectedValue(error);
      mockRequest = { user: { id: userId }, body: prefData };

      await userController.updateNotificationPreferences(mockRequest as Request, mockResponse as Response);

      expect(userService.updateNotificationPreferences).toHaveBeenCalledWith(userId, prefData);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('followUser', () => {
    const followerId = 'user-1';
    const followingId = 'user-2';

    it('正常: フォロー成功 -> 204 No Content を返す', async () => {
      userService.followUser.mockResolvedValue();
      mockRequest = { user: { id: followerId }, params: { userId: followingId } };

      await userController.followUser(mockRequest as Request, mockResponse as Response);

      expect(userService.followUser).toHaveBeenCalledWith(followerId, followingId);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('異常: 未認証 -> 401 エラー', async () => {
      mockRequest = { params: { userId: followingId } }; // req.user なし
      await userController.followUser(mockRequest as Request, mockResponse as Response);
      expect(userService.followUser).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });

    it('異常: 対象 ID なし -> 400 エラー', async () => {
      mockRequest = { user: { id: followerId }, params: {} }; // params.userId なし
      await userController.followUser(mockRequest as Request, mockResponse as Response);
      expect(userService.followUser).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Target user ID is required' });
    });

    it('異常: サービスエラー -> 400 とエラーメッセージを返す', async () => {
      const error = new Error('Cannot follow');
      userService.followUser.mockRejectedValue(error);
      mockRequest = { user: { id: followerId }, params: { userId: followingId } };

      await userController.followUser(mockRequest as Request, mockResponse as Response);

      expect(userService.followUser).toHaveBeenCalledWith(followerId, followingId);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('unfollowUser', () => {
    const followerId = 'user-1';
    const followingId = 'user-2';

    it('正常: アンフォロー成功 -> 204 No Content を返す', async () => {
      userService.unfollowUser.mockResolvedValue();
      mockRequest = { user: { id: followerId }, params: { userId: followingId } };

      await userController.unfollowUser(mockRequest as Request, mockResponse as Response);

      expect(userService.unfollowUser).toHaveBeenCalledWith(followerId, followingId);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('異常: 未認証 -> 401 エラー', async () => {
      mockRequest = { params: { userId: followingId } }; // req.user なし
      await userController.unfollowUser(mockRequest as Request, mockResponse as Response);
      expect(userService.unfollowUser).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });

    it('異常: 対象 ID なし -> 400 エラー', async () => {
      mockRequest = { user: { id: followerId }, params: {} }; // params.userId なし
      await userController.unfollowUser(mockRequest as Request, mockResponse as Response);
      expect(userService.unfollowUser).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Target user ID is required' });
    });

    it('異常: サービスエラー -> 400 とエラーメッセージを返す', async () => {
      const error = new Error('Cannot unfollow');
      userService.unfollowUser.mockRejectedValue(error);
      mockRequest = { user: { id: followerId }, params: { userId: followingId } };

      await userController.unfollowUser(mockRequest as Request, mockResponse as Response);

      expect(userService.unfollowUser).toHaveBeenCalledWith(followerId, followingId);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getFollowing', () => {
    const targetUserId = 'user-1';
    const mockFollowing = [
      { id: 'following1', email: 'following1@example.com' },
      { id: 'following2', email: 'following2@example.com' }
    ];

    it('正常: フォロー中一覧を取得 -> 200 とフォロー中情報を返す', async () => {
      userService.getFollowing.mockResolvedValue(mockFollowing);
      mockRequest = { params: { userId: targetUserId } };

      await userController.getFollowing(mockRequest as Request, mockResponse as Response);

      expect(userService.getFollowing).toHaveBeenCalledWith(targetUserId);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockFollowing);
    });

    it('異常: ユーザーが見つからない -> 404 エラー', async () => {
      const error = new Error('User not found');
      userService.getFollowing.mockRejectedValue(error);
      mockRequest = { params: { userId: targetUserId } };

      await userController.getFollowing(mockRequest as Request, mockResponse as Response);

      expect(userService.getFollowing).toHaveBeenCalledWith(targetUserId);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getFollowers', () => {
    const targetUserId = 'user-1';
    const mockFollowers = [
      { id: 'follower1', email: 'follower1@example.com' },
      { id: 'follower2', email: 'follower2@example.com' }
    ];

    it('正常: フォロワー一覧を取得 -> 200 とフォロワー情報を返す', async () => {
      userService.getFollowers.mockResolvedValue(mockFollowers);
      mockRequest = { params: { userId: targetUserId } };

      await userController.getFollowers(mockRequest as Request, mockResponse as Response);

      expect(userService.getFollowers).toHaveBeenCalledWith(targetUserId);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockFollowers);
    });

    it('異常: ユーザーが見つからない -> 404 エラー', async () => {
      const error = new Error('User not found');
      userService.getFollowers.mockRejectedValue(error);
      mockRequest = { params: { userId: targetUserId } };

      await userController.getFollowers(mockRequest as Request, mockResponse as Response);

      expect(userService.getFollowers).toHaveBeenCalledWith(targetUserId);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});