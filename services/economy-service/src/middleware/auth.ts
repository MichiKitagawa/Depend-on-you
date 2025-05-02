import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserId } from '../../../../shared/schema';

// JWT認証ミドルウェア用に拡張したリクエスト型
export interface AuthenticatedRequest extends Request {
  user?: { id: UserId };
}

// JWT認証ミドルウェア
export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  // Authorization ヘッダーからトークンを取得
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authorization header missing or invalid format' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Token missing' });
    return;
  }

  try {
    // トークン検証
    const JWT_SECRET = process.env.JWT_SECRET || 'development_secret'; // 本番環境では必ず環境変数から取得
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: UserId };
    
    // 検証したユーザーID情報をリクエストオブジェクトに設定
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    if ((error as Error).name === 'TokenExpiredError') {
      res.status(401).json({ message: 'Token expired' });
    } else if ((error as Error).name === 'JsonWebTokenError') {
      res.status(401).json({ message: 'Invalid token' });
    } else {
      console.error('Token verification error:', error);
      res.status(500).json({ message: 'Internal server error during authentication' });
    }
  }
};

// Optionalな認証ミドルウェア（認証なしでもアクセス可能だが、認証があれば情報を使用）
export const optionalAuthMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next();
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    next();
    return;
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'development_secret';
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: UserId };
    req.user = { id: decoded.userId };
  } catch (error) {
    // 認証エラーがあっても処理は続行
    console.warn('Optional auth failed:', error);
  }
  
  next();
}; 