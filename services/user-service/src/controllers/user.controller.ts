import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
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
interface NotificationPreferences {
  email: boolean;
  push: boolean;
}

export class UserController {
  // private userService: UserService; // 直接インスタンス化しない

  // コンストラクタで UserService のインスタンスを受け取る
  constructor(private userService: UserService) {}

  async register(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      const user = await this.userService.register(username, email, password);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const token = await this.userService.login(email, password);
      res.json({ token });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  async getProfile(req: Request, res: Response) {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const profile = await this.userService.getProfile(req.user.id);
      res.json(profile);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateProfile(req: Request, res: Response) {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const updatedProfile = await this.userService.updateProfile(req.user.id, req.body);
      res.json(updatedProfile);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getNotificationPreferences(req: Request, res: Response) {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const prefs = await this.userService.getNotificationPreferences(req.user.id);
      res.json(prefs || {});
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateNotificationPreferences(req: Request, res: Response) {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const updatedPrefs = await this.userService.updateNotificationPreferences(
        req.user.id,
        req.body as NotificationPreferences
      );
      res.json(updatedPrefs);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async followUser(req: Request, res: Response) {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const targetUserId = req.params.userId;
    if (!targetUserId) {
      return res.status(400).json({ error: 'Target user ID is required' });
    }

    try {
      await this.userService.followUser(req.user.id, targetUserId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async unfollowUser(req: Request, res: Response) {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const targetUserId = req.params.userId;
    if (!targetUserId) {
      return res.status(400).json({ error: 'Target user ID is required' });
    }

    try {
      await this.userService.unfollowUser(req.user.id, targetUserId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getFollowers(req: Request, res: Response) {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    try {
      const followers = await this.userService.getFollowers(userId);
      res.json(followers);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async getFollowing(req: Request, res: Response) {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    try {
      const following = await this.userService.getFollowing(userId);
      res.json(following);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
} 