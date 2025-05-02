import { PrismaClient, Prisma } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { UserService } from '../services/user.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// PrismaClient をモック
jest.mock('@prisma/client', () => ({
  ...jest.requireActual('@prisma/client'),
  PrismaClient: jest.fn(() => mockDeep<PrismaClient>()),
}));

describe('UserService', () => {
  let userService: UserService;
  let mockPrisma: DeepMockProxy<PrismaClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GLOBAL_JWT_SECRET = 'test_secret';

    mockPrisma = mockDeep<PrismaClient>();
    (PrismaClient as jest.Mock).mockReturnValue(mockPrisma);

    userService = new UserService();
  });

  describe('register', () => {
    it('正常: ユーザーを登録できる', async () => {
      const mockUser = { id: 'uuid-1', email: 'test@example.com' };
      (mockPrisma.user.create as jest.Mock).mockResolvedValue(mockUser as any);

      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashed_password' as never);

      const result = await userService.register('testuser', 'test@example.com', 'password123');

      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          passwordHash: 'hashed_password',
          profile: {
            create: {
              name: 'testuser',
            },
          },
        },
        select: {
          id: true,
          email: true,
        },
      });
      expect(result).toEqual(mockUser);
    });

    it('異常: Email が重複している場合エラーをスローする (P2002)', async () => {
      // Prisma のエラーオブジェクトを模倣 (より単純な方法)
      const uniqueConstraintError = Object.assign(new Error('Unique constraint failed'), { code: 'P2002' });
      (mockPrisma.user.create as jest.Mock).mockRejectedValue(uniqueConstraintError);
      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashed_password' as never);

      // サービス実装は P2002 をキャッチしてそのまま rethrow するはず
      await expect(userService.register('testuser2', 'duplicate@example.com', 'password123'))
        .rejects.toThrow(uniqueConstraintError);
    });
  });

  describe('login', () => {
    const email = 'test@example.com';
    const password = 'password123';
    const mockUser = {
      id: 'uuid-1',
      email: email,
      passwordHash: 'hashed_password',
    };

    it('正常: 正しい情報でログインできる', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true as never);
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => 'mock_token');

      const result = await userService.login(email, password);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.passwordHash);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser.id, email: mockUser.email },
        'test_secret',
        { expiresIn: '24h' }
      );
      expect(result).toBe('mock_token');
    });

    it('異常: 存在しないユーザー -> エラー', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(userService.login('nonexistent@example.com', password))
        .rejects.toThrow('User not found');
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'nonexistent@example.com' } });
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('異常: 間違ったパスワード -> エラー', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false as never);

      await expect(userService.login(email, 'wrong_password'))
        .rejects.toThrow('Invalid password');
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
      expect(bcrypt.compare).toHaveBeenCalledWith('wrong_password', mockUser.passwordHash);
      expect(jwt.sign).not.toHaveBeenCalled();
    });
  });

  describe('getProfile', () => {
    const userId = 'user-1';
    // UserProfile のモックデータ (必要に応じて調整)
    const mockProfile: any = {
      id: 'profile-1',
      userId: userId,
      name: 'Test User',
      bio: 'Test bio',
      avatarUrl: 'http://example.com/avatar.png',
    };

    it('正常: 存在するユーザーのプロフィールを取得できる', async () => {
      // userProfile.findUnique が mockProfile を返すように設定
      (mockPrisma.userProfile.findUnique as jest.Mock).mockResolvedValue(mockProfile);

      const result = await userService.getProfile(userId);

      expect(mockPrisma.userProfile.findUnique).toHaveBeenCalledWith({
        where: { userId },
        // include は元のコードにはなかったので省略
      });
      expect(result).toEqual(mockProfile);
    });

    it('異常: プロフィールが存在しない場合エラー', async () => {
      // userProfile.findUnique が null を返すように設定
      (mockPrisma.userProfile.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(userService.getProfile('nonexistent-user')).rejects.toThrow('Profile not found');
    });
  });

  describe('updateProfile', () => {
    const userId = 'user-1';
    const updates: any = { // Prisma.UserProfileUpdateInput の代わりに any
      name: 'Updated Name',
      bio: 'Updated bio',
    };
    const mockUpdatedProfile: any = {
      id: 'profile-1',
      userId: userId,
      name: 'Updated Name',
      bio: 'Updated bio',
      avatarUrl: 'http://example.com/avatar.png',
    };

    it('正常: プロフィールを更新できる', async () => {
      // userProfile.update が mockUpdatedProfile を返すように設定
      (mockPrisma.userProfile.update as jest.Mock).mockResolvedValue(mockUpdatedProfile);

      const result = await userService.updateProfile(userId, updates);

      expect(mockPrisma.userProfile.update).toHaveBeenCalledWith({
        where: { userId },
        data: updates,
        // select は元のコードにはなかったので省略（デフォルトで全フィールド）
      });
      expect(result).toEqual(mockUpdatedProfile);
    });

    it('異常: 存在しないユーザー (プロフィール) の更新 -> エラー (P2025)', async () => {
      const notFoundError = Object.assign(new Error('Record to update not found'), { code: 'P2025' });
      (mockPrisma.userProfile.update as jest.Mock).mockRejectedValue(notFoundError);

      // サービス実装は P2025 をキャッチして 'Profile not found' をスローする
      await expect(userService.updateProfile('nonexistent-user', updates))
          .rejects.toThrow('Profile not found');
    });

    // updateProfile には、 updates が空かどうかのチェックは service 層にはない想定
    // it('異常: 更新内容がない -> エラー', async () => { ... });
  });

  describe('getNotificationPreferences', () => {
    const userId = 'user-1';
    const mockPrefs = { email: true, push: false };

    it('正常: 通知設定を取得', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({ notificationPreferences: mockPrefs });
      const result = await userService.getNotificationPreferences(userId);
      expect(result).toEqual(mockPrefs);
    });

    it('異常: ユーザーが見つからない', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(userService.getNotificationPreferences(userId)).rejects.toThrow('User not found');
    });
  });

  describe('updateNotificationPreferences', () => {
    const userId = 'user-1';
    const mockPrefs = { email: true, push: false };
    const updatedPrefs = { email: false, push: true };

    it('正常: 通知設定を更新', async () => {
      (mockPrisma.user.update as jest.Mock).mockResolvedValue({ notificationPreferences: updatedPrefs });
      const result = await userService.updateNotificationPreferences(userId, mockPrefs);
      expect(result).toEqual(updatedPrefs);
    });

    it('異常: ユーザーが見つからない', async () => {
      (mockPrisma.user.update as jest.Mock).mockRejectedValue({ code: 'P2025' });
      await expect(userService.updateNotificationPreferences(userId, mockPrefs))
        .rejects.toThrow('User not found');
    });

    it('異常: 更新に失敗', async () => {
      (mockPrisma.user.update as jest.Mock).mockRejectedValue(new Error('Update failed'));
      await expect(userService.updateNotificationPreferences(userId, mockPrefs))
        .rejects.toThrow('Failed to update notification preferences');
    });
  });

  describe('followUser', () => {
    const followerId = 'user-1';
    const followingId = 'user-2';

    it('正常: フォロー成功', async () => {
      (mockPrisma.follow.create as jest.Mock).mockResolvedValue({});
      await expect(userService.followUser(followerId, followingId)).resolves.not.toThrow();
    });

    it('異常: 自分自身をフォロー', async () => {
      await expect(userService.followUser(followerId, followerId))
        .rejects.toThrow('Cannot follow yourself');
    });

    it('異常: 既にフォロー済み', async () => {
      (mockPrisma.follow.create as jest.Mock).mockRejectedValue({ code: 'P2002' });
      await expect(userService.followUser(followerId, followingId)).resolves.not.toThrow();
    });

    it('異常: ユーザーが見つからない', async () => {
      (mockPrisma.follow.create as jest.Mock).mockRejectedValue({ code: 'P2003' });
      await expect(userService.followUser(followerId, followingId))
        .rejects.toThrow('User not found');
    });

    it('異常: フォローに失敗', async () => {
      (mockPrisma.follow.create as jest.Mock).mockRejectedValue(new Error('Follow failed'));
      await expect(userService.followUser(followerId, followingId))
        .rejects.toThrow('Failed to follow user');
    });
  });

  describe('unfollowUser', () => {
    const followerId = 'user-1';
    const followingId = 'user-2';

    it('正常: アンフォロー成功', async () => {
      (mockPrisma.follow.delete as jest.Mock).mockResolvedValue({});
      await expect(userService.unfollowUser(followerId, followingId)).resolves.not.toThrow();
    });

    it('異常: フォローしていない', async () => {
      (mockPrisma.follow.delete as jest.Mock).mockRejectedValue({ code: 'P2025' });
      await expect(userService.unfollowUser(followerId, followingId)).resolves.not.toThrow();
    });

    it('異常: アンフォローに失敗', async () => {
      (mockPrisma.follow.delete as jest.Mock).mockRejectedValue(new Error('Unfollow failed'));
      await expect(userService.unfollowUser(followerId, followingId))
        .rejects.toThrow('Failed to unfollow user');
    });
  });

  describe('getFollowing', () => {
    const userId = 'user-1';
    it('正常: フォローしているユーザーリストを取得できる', async () => {
      const mockFollowing = [{ id: 'user-2' }, { id: 'user-3' }];
      const mockRelations = mockFollowing.map(u => ({ following: u })); // select に合わせた形
      (mockPrisma.follow.findMany as jest.Mock).mockResolvedValue(mockRelations as any);

      const result = await userService.getFollowing(userId, 1, 10);

      expect(mockPrisma.follow.findMany).toHaveBeenCalledWith({
        where: { followerId: userId },
        select: { following: true },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockFollowing);
    });
  });

  describe('getFollowers', () => {
    const userId = 'user-1';
    it('正常: フォロワーリストを取得できる', async () => {
        const mockFollowers = [{ id: 'user-4' }, { id: 'user-5' }];
        const mockRelations = mockFollowers.map(u => ({ follower: u }));
        (mockPrisma.follow.findMany as jest.Mock).mockResolvedValue(mockRelations as any);

        const result = await userService.getFollowers(userId, 1, 10);

        expect(mockPrisma.follow.findMany).toHaveBeenCalledWith({
          where: { followingId: userId },
          select: { follower: true },
          skip: 0,
          take: 10,
          orderBy: { createdAt: 'desc' },
        });
        expect(result).toEqual(mockFollowers);
    });
  });
}); 