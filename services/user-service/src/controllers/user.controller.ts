import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

// カスタムリクエスト型の定義
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  register = async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;
      const user = await this.userService.register(username, email, password);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const token = await this.userService.login(email, password);
      res.json({ token });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  };

  getProfile = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const profile = await this.userService.getProfile(userId);
      res.json(profile);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };

  updateProfile = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const updates = req.body;
      const profile = await this.userService.updateProfile(userId, updates);
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
} 