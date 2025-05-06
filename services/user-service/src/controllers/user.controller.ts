import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { ServiceError } from '../errors/service.error';
import { Prisma } from '@prisma/client'; // Prisma 型をインポート

// カスタムリクエスト型の定義
interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

// ページネーション用クエリパラメータ型
interface PaginationQuery {
    page?: string;
    limit?: string;
}

// 通知設定の型定義
interface NotificationSettings {
  subscriptionNewPost: boolean;
  rankingChange: boolean;
}

export class UserController {
  // private userService: UserService; // 直接インスタンス化しない

  // コンストラクタで UserService のインスタンスを受け取る
  constructor(private userService: UserService) {}

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { displayName, email, password } = req.body;
      if (!displayName || !email || !password) {
        throw new ServiceError('Missing required fields', 400);
      }
      const result = await this.userService.register(displayName, email, password);
      res.status(201).json(result);
    } catch (error: any) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new ServiceError('Missing email or password', 400);
      }
      const result = await this.userService.login(email, password);
      res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  }

  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    const userId = req.params.userId;
    if (!userId) {
        return next(new ServiceError('User ID is required in path', 400));
    }
    try {
      const profile = await this.userService.getProfile(userId);
      if (!profile) {
        throw new ServiceError('Profile not found', 404);
      }
      res.status(200).json(profile);
    } catch (error: any) {
      next(error);
    }
  }

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    const userId = req.params.userId;
    if (!req.user || req.user.id !== userId) {
      return next(new ServiceError('Unauthorized to update this profile', 403));
    }
    const { displayName, bio, profileImageUrl } = req.body;
    const updates = { displayName, bio, profileImageUrl };

    try {
      if (Object.keys(updates).length === 0 || Object.values(updates).every(v => v === undefined)) {
         throw new ServiceError('Request body cannot be empty', 400);
      }
      const updatedProfile = await this.userService.updateProfile(userId, updates);
      res.status(200).json(updatedProfile);
    } catch (error: any) {
      next(error);
    }
  }

  async getNotificationSettings(req: AuthRequest, res: Response, next: NextFunction) {
    const userId = req.params.userId;
    if (!req.user || req.user.id !== userId) {
        return next(new ServiceError('Unauthorized', 403));
    }
    try {
      const settings = await this.userService.getNotificationSettings(userId);
      res.status(200).json(settings);
    } catch (error: any) {
      next(error);
    }
  }

  async updateNotificationSettings(req: AuthRequest, res: Response, next: NextFunction) {
    const userId = req.params.userId;
    if (!req.user || req.user.id !== userId) {
       return next(new ServiceError('Unauthorized', 403));
    }
    const preferences = req.body as NotificationSettings;
    try {
      if (typeof preferences.subscriptionNewPost !== 'boolean' || typeof preferences.rankingChange !== 'boolean') {
        throw new ServiceError('Invalid request body format', 400);
      }
      const updatedSettings = await this.userService.updateNotificationSettings(userId, preferences);
      res.status(200).json(updatedSettings);
    } catch (error: any) {
      next(error);
    }
  }

  async updateEmail(req: AuthRequest, res: Response, next: NextFunction) {
      const userId = req.params.userId;
      if (!req.user || req.user.id !== userId) {
          return next(new ServiceError('Unauthorized', 403));
      }
      const { newEmail } = req.body;
      if (!newEmail) {
          return next(new ServiceError('newEmail is required', 400));
      }
      try {
          await this.userService.updateEmail(userId, newEmail);
          res.sendStatus(200);
      } catch (error: any) {
          next(error);
      }
  }

  async updatePassword(req: AuthRequest, res: Response, next: NextFunction) {
      const userId = req.params.userId;
      if (!req.user || req.user.id !== userId) {
          return next(new ServiceError('Unauthorized', 403));
      }
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
          return next(new ServiceError('currentPassword and newPassword are required', 400));
      }
      try {
          await this.userService.updatePassword(userId, currentPassword, newPassword);
          res.sendStatus(200);
      } catch (error: any) {
          next(error);
      }
  }

  async deleteAccount(req: AuthRequest, res: Response, next: NextFunction) {
    const userId = req.params.userId;
    if (!req.user || req.user.id !== userId) {
      return next(new ServiceError('Unauthorized', 403));
    }
    try {
      await this.userService.deleteAccount(userId);
      res.sendStatus(204);
    } catch (error: any) {
      next(error);
    }
  }

  async follow(req: AuthRequest, res: Response, next: NextFunction) {
    if (!req.user?.id) {
      return next(new ServiceError('Authentication required', 401));
    }
    const followerId = req.user.id;
    const { targetType, targetId } = req.body;

    if (targetType !== 'user') {
        return next(new ServiceError('Invalid target type', 400));
    }
    if (!targetId) {
      return next(new ServiceError('targetId is required', 400));
    }

    try {
      await this.userService.follow(followerId, targetType, targetId);
      res.sendStatus(200);
    } catch (error: any) {
      next(error);
    }
  }

  async unfollow(req: AuthRequest, res: Response, next: NextFunction) {
     if (!req.user?.id) {
       return next(new ServiceError('Authentication required', 401));
     }
     const followerId = req.user.id;
     const { targetType, targetId } = req.body;

     if (targetType !== 'user') {
         return next(new ServiceError('Invalid target type', 400));
     }
     if (!targetId) {
       return next(new ServiceError('targetId is required', 400));
     }

    try {
      await this.userService.unfollow(followerId, targetType, targetId);
      res.sendStatus(200);
    } catch (error: any) {
      next(error);
    }
  }
} 