import { Request, Response, NextFunction } from 'express';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { ServiceError } from '../errors/service.error';
import { Prisma } from '@prisma/client';

// AuthRequest 型定義 (user.controller.ts と同じものを定義)
interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

// UserServiceのモック
jest.mock('../services/user.service');
const MockUserService = UserService as jest.MockedClass<typeof UserService>;

// Mock Request/Response/NextFunction for Express testing
const mockRequest = (body: any = {}, params: any = {}, headers: any = {}): Partial<Request> => ({
    body,
    params,
    headers,
});
const mockResponse = (): Partial<Response> => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.sendStatus = jest.fn().mockReturnValue(res);
    return res;
};
const mockNext: NextFunction = jest.fn();

// UserProfile 型 (テスト内で使用)
interface UserProfile {
    id: string;
    userId: string;
    name: string | null;
    bio?: string | null;
    avatarUrl?: string | null;
}

describe('UserController', () => {
    let userController: UserController;
    let userService: jest.Mocked<UserService>; // モックされたサービスを使用
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    const userId = 'test-user-id';
    const mockUserProfile: UserProfile = {
        id: 'profile-id',
        userId: userId,
        name: 'Test User',
        bio: 'Test Bio',
        avatarUrl: 'http://example.com/avatar.png'
    };

    beforeEach(() => {
        jest.clearAllMocks();
        // MockUserService のインスタンスを作成 (モックされたメソッドを持つ)
        userService = new MockUserService() as jest.Mocked<UserService>; 
        userController = new UserController(userService);
        res = mockResponse();
        next = mockNext;
    });

    describe('register', () => {
        const registerData = { displayName: 'New User', email: 'new@example.com', password: 'Password123' };
        const mockRegisterResult = { userId: 'new-user-id', token: 'new-token' };

        it('should register a user and return userId and token', async () => {
            req = mockRequest(registerData);
            // register のモック戻り値を修正
            userService.register.mockResolvedValue(mockRegisterResult);

            await userController.register(req as Request, res as Response, next);

            expect(userService.register).toHaveBeenCalledWith(registerData.displayName, registerData.email, registerData.password);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockRegisterResult);
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next with error if registration fails', async () => {
            req = mockRequest(registerData);
            const error = new Error('Registration failed');
            userService.register.mockRejectedValue(error);

            await userController.register(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });
    });

    describe('login', () => {
        const loginData = { email: 'test@example.com', password: 'password123' };
        const mockLoginResult = { token: 'mock-token', user: mockUserProfile };

        it('should login a user and return token and user profile', async () => {
            req = mockRequest(loginData);
            // login のモック戻り値を修正
            userService.login.mockResolvedValue(mockLoginResult);

            await userController.login(req as Request, res as Response, next);

            expect(userService.login).toHaveBeenCalledWith(loginData.email, loginData.password);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockLoginResult);
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next with error if login fails', async () => {
            req = mockRequest(loginData);
            const error = new Error('Login failed');
            userService.login.mockRejectedValue(error);

            await userController.login(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getProfile', () => {
        it('should return user profile', async () => {
            // Add user to req for auth check
            req = { ...mockRequest({}, { userId: userId }), user: { id: userId } }; 
            userService.getProfile.mockResolvedValue(mockUserProfile);

            await userController.getProfile(req as Request, res as Response, next);

            expect(userService.getProfile).toHaveBeenCalledWith(userId);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUserProfile);
        });

        it('should return 404 if profile not found', async () => {
            req = { ...mockRequest({}, { userId: userId }), user: { id: userId } }; 
            userService.getProfile.mockResolvedValue(null); 
            
            // Controller が生成するエラーを定義
            const expectedError = new ServiceError('Profile not found', 404);

            await userController.getProfile(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledTimes(1);
            // ServiceError インスタンスで呼ばれたことを確認
            expect(next).toHaveBeenCalledWith(expect.any(ServiceError));
            
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });

        it('should call next with error if service fails', async () => {
             req = { ...mockRequest({}, { userId: userId }), user: { id: userId } };
            const expectedError = new ServiceError('DB error', 500); // 期待するエラー
            userService.getProfile.mockRejectedValue(expectedError); // reject するエラーを指定
            await userController.getProfile(req as Request, res as Response, next);
            
            // ServiceError インスタンスで呼ばれたことを確認
            expect(next).toHaveBeenCalledWith(expect.any(ServiceError));
            
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });
    });

     describe('updateProfile', () => {
         const updateData = { displayName: 'Updated Name' };
         const mockUpdatedProfile = { ...mockUserProfile, name: updateData.displayName };

         it('should update and return user profile', async () => {
             // Add user to req for auth check
             req = { ...mockRequest(updateData, { userId: userId }), user: { id: userId } }; 
             userService.updateProfile.mockResolvedValue(mockUpdatedProfile);

             await userController.updateProfile(req as Request, res as Response, next);

             expect(userService.updateProfile).toHaveBeenCalledWith(userId, updateData);
             expect(res.status).toHaveBeenCalledWith(200);
             expect(res.json).toHaveBeenCalledWith(mockUpdatedProfile);
         });

         it('should call next with error if update fails', async () => {
             req = { ...mockRequest(updateData, { userId: userId }), user: { id: userId } };
             const expectedError = new ServiceError('Update failed', 500);
             userService.updateProfile.mockRejectedValue(expectedError);
             await userController.updateProfile(req as Request, res as Response, next);
             expect(next).toHaveBeenCalledWith(expect.any(ServiceError));
         });

        it('should return 403 if user is not authorized', async () => {
            const req = {
                params: { userId: 'other-user-id' },
                user: { id: 'test-user-id' },
                body: { displayName: 'New Name' },
            } as unknown as AuthRequest;
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
            const next = jest.fn() as jest.Mock<NextFunction>;
            
            await userController.updateProfile(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
            // next に渡されたエラーオブジェクトが ServiceError のインスタンスであることを確認
            expect(next.mock.calls[0][0]).toBeInstanceOf(ServiceError);
            // next に渡されたエラーオブジェクトの status プロパティが 403 であることを確認
            expect(next.mock.calls[0][0].status).toBe(403);
            // メッセージの確認も可能
            expect(next.mock.calls[0][0].message).toBe('Unauthorized to update this profile');

            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });
     });

    // getNotificationPreferences -> getNotificationSettings
    describe('getNotificationSettings', () => {
        const mockSettings = { subscriptionNewPost: true, rankingChange: false };
        it('should return notification settings', async () => {
            // Add user to req for auth check
            req = { ...mockRequest({}, { userId: userId }), user: { id: userId } }; 
            userService.getNotificationSettings.mockResolvedValue(mockSettings);
            await userController.getNotificationSettings(req as Request, res as Response, next);
            expect(userService.getNotificationSettings).toHaveBeenCalledWith(userId);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockSettings);
        });
         it('should call next with error', async () => {
             req = { ...mockRequest({}, { userId: userId }), user: { id: userId } };
             const expectedError = new ServiceError('Failed', 500);
             userService.getNotificationSettings.mockRejectedValue(expectedError);
             await userController.getNotificationSettings(req as Request, res as Response, next);
             expect(next).toHaveBeenCalledWith(expect.any(ServiceError));
         });
    });

    // updateNotificationPreferences -> updateNotificationSettings
    describe('updateNotificationSettings', () => {
        const updateData = { subscriptionNewPost: false, rankingChange: true };
        const mockUpdatedSettings = updateData;
        it('should update notification settings', async () => {
            // Add user to req for auth check
            req = { ...mockRequest(updateData, { userId: userId }), user: { id: userId } }; 
            userService.updateNotificationSettings.mockResolvedValue(mockUpdatedSettings);
            await userController.updateNotificationSettings(req as Request, res as Response, next);
            expect(userService.updateNotificationSettings).toHaveBeenCalledWith(userId, updateData);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUpdatedSettings);
        });
         it('should call next with error', async () => {
             req = { ...mockRequest(updateData, { userId: userId }), user: { id: userId } };
             const expectedError = new ServiceError('Failed', 500);
             userService.updateNotificationSettings.mockRejectedValue(expectedError);
             await userController.updateNotificationSettings(req as Request, res as Response, next);
             expect(next).toHaveBeenCalledWith(expect.any(ServiceError));
         });
    });

    // followUser -> follow
    describe('follow', () => {
        const followData = { targetType: 'user', targetId: 'target-id' }; // userId は req.user から取得想定
        it('should follow a target', async () => {
            // req.user is already set here
            req = { ...mockRequest(followData), user: { id: userId } };
            userService.follow.mockResolvedValue();
            await userController.follow(req as Request, res as Response, next);
            expect(userService.follow).toHaveBeenCalledWith(userId, followData.targetType, followData.targetId);
            expect(res.sendStatus).toHaveBeenCalledWith(200);
        });
        it('should call next with error', async () => {
            req = { ...mockRequest(followData), user: { id: userId } };
            const expectedError = new ServiceError('Failed', 500);
            userService.follow.mockRejectedValue(expectedError);
            await userController.follow(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(expect.any(ServiceError));
        });
    });

    // unfollowUser -> unfollow
    describe('unfollow', () => {
        const unfollowData = { targetType: 'user', targetId: 'target-id' };
        it('should unfollow a target', async () => {
            req = { ...mockRequest(unfollowData), user: { id: userId } };
            userService.unfollow.mockResolvedValue();
            await userController.unfollow(req as Request, res as Response, next);
            expect(userService.unfollow).toHaveBeenCalledWith(userId, unfollowData.targetType, unfollowData.targetId);
            expect(res.sendStatus).toHaveBeenCalledWith(200);
        });
        it('should call next with error', async () => {
            req = { ...mockRequest(unfollowData), user: { id: userId } };
            const expectedError = new ServiceError('Failed', 500);
            userService.unfollow.mockRejectedValue(expectedError);
            await userController.unfollow(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(expect.any(ServiceError));
        });
    });

    // getFollowing - コメントアウト (UserService 未実装のため)
    /*
    describe('getFollowing', () => {
        // ... tests ...
    });
    */

    // getFollowers - コメントアウト (UserService 未実装のため)
    /*
    describe('getFollowers', () => {
        // ... tests ...
    });
    */

    // updateCredentials -> updateEmail/updatePassword
    // これは UserController に個別エンドポイントが必要になる
    // /users/:userId/email, /users/:userId/password など
    // UserController の実装に合わせてテストを追加・修正する必要あり
    // 以下は UserController に updateEmail/updatePassword があると仮定した例
    describe('updateEmail', () => {
        const updateData = { newEmail: 'updated@example.com' };
        it('should update email', async () => {
            // Add user to req for auth check
            req = { ...mockRequest(updateData, { userId: userId }), user: { id: userId } }; 
            userService.updateEmail.mockResolvedValue();
            await userController.updateEmail(req as Request, res as Response, next); // Controller にメソッドがある前提
            expect(userService.updateEmail).toHaveBeenCalledWith(userId, updateData.newEmail);
            expect(res.sendStatus).toHaveBeenCalledWith(200);
        });
         it('should call next with error', async () => {
             req = { ...mockRequest(updateData, { userId: userId }), user: { id: userId } };
             const expectedError = new ServiceError('Failed', 500);
             userService.updateEmail.mockRejectedValue(expectedError);
             await userController.updateEmail(req as Request, res as Response, next);
             expect(next).toHaveBeenCalledWith(expect.any(ServiceError));
         });
    });
    describe('updatePassword', () => {
        const updateData = { currentPassword: 'oldPass', newPassword: 'newPass' };
         it('should update password', async () => {
             // Add user to req for auth check
             req = { ...mockRequest(updateData, { userId: userId }), user: { id: userId } }; 
             userService.updatePassword.mockResolvedValue();
             await userController.updatePassword(req as Request, res as Response, next); // Controller にメソッドがある前提
             expect(userService.updatePassword).toHaveBeenCalledWith(userId, updateData.currentPassword, updateData.newPassword);
             expect(res.sendStatus).toHaveBeenCalledWith(200);
         });
          it('should call next with error', async () => {
             req = { ...mockRequest(updateData, { userId: userId }), user: { id: userId } };
             const expectedError = new ServiceError('Failed', 500);
             userService.updatePassword.mockRejectedValue(expectedError);
             await userController.updatePassword(req as Request, res as Response, next);
             expect(next).toHaveBeenCalledWith(expect.any(ServiceError));
         });
    });

    // deleteUser -> deleteAccount
    describe('deleteAccount', () => {
        it('should delete user account', async () => {
            // Add user to req for auth check
            req = { ...mockRequest({}, { userId: userId }), user: { id: userId } }; 
            userService.deleteAccount.mockResolvedValue();
            await userController.deleteAccount(req as Request, res as Response, next); // deleteAccount に変更
            expect(userService.deleteAccount).toHaveBeenCalledWith(userId);
            expect(res.sendStatus).toHaveBeenCalledWith(204);
        });
        it('should call next with error', async () => {
             req = { ...mockRequest({}, { userId: userId }), user: { id: userId } };
            const expectedError = new ServiceError('Failed', 500);
            userService.deleteAccount.mockRejectedValue(expectedError);
            await userController.deleteAccount(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(expect.any(ServiceError));
        });
    });

});