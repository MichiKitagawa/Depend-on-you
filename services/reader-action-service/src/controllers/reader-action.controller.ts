import { Request, Response } from 'express';
import { ReaderActionService } from '../services/reader-action.service';
// @ts-ignore Ignore rootDir error for shared schema import
import { ActionRecord, ReaderActionType, UserId, PostID, ReadRecord, BoostRecord } from '@shared/schema';
import type { ActionType } from '../generated/prisma';

export class ReaderActionController {
  private readerActionService: ReaderActionService;

  constructor() {
    this.readerActionService = new ReaderActionService();
  }

  recordReadAction = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId as UserId;
      const { postId, duration } = req.body;

      if (!postId || typeof postId !== 'string') {
        res.status(400).json({ message: 'postId is required' });
        return;
      }
      // duration はオプション
      const durationNum = typeof duration === 'number' ? duration : undefined;

      await this.readerActionService.recordRead(userId, postId, durationNum);
      res.status(200).send(); // spec.md に合わせて 200 OK
    } catch (error: any) {
      console.error('Error recording read action:', error);
      // TODO: content-service 連携での 404 など、より詳細なエラーハンドリング
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  getReadActions = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId as UserId;
      // クエリパラメータから limit と offset を取得 (数値に変換、デフォルト値設定)
      const limit = parseInt(req.query.limit as string || '10', 10);
      const offset = parseInt(req.query.offset as string || '0', 10);

      if (isNaN(limit) || isNaN(offset) || limit <= 0 || offset < 0) {
          res.status(400).json({ message: 'Invalid limit or offset parameters' });
          return;
      }

      const readRecords = await this.readerActionService.getReadsByUserId(userId, limit, offset);
      res.status(200).json(readRecords);
    } catch (error: any) {
      console.error('Error getting read actions:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  recordLikeAction = async (req: Request, res: Response): Promise<void> => {
    try {
      // 認証ミドルウェアで設定される想定の req.user から userId を取得
      // const userId = (req as any).user?.id as UserId;
      // if (!userId) {
      //   res.status(401).json({ message: 'Unauthorized' });
      //   return;
      // }
      // TODO: テスト用に一時的に固定 ID を使うか、認証ミドルウェアのモックを導入する
      const userId = 'test-user'; // 仮

      const postId = req.params.postId as PostID;

      await this.readerActionService.recordLike(userId, postId);
      res.status(200).send(); // spec.md に合わせて 200 OK
    } catch (error: any) {
      console.error('Error recording like action:', error);
      if (error.message === 'Already liked') {
          res.status(409).json({ message: 'Already liked' });
      } else {
          // TODO: postId が存在しない場合の 404 など
          res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  deleteLikeAction = async (req: Request, res: Response): Promise<void> => {
     try {
      // const userId = (req as any).user?.id as UserId;
      // if (!userId) {
      //   res.status(401).json({ message: 'Unauthorized' });
      //   return;
      // }
      const userId = 'test-user'; // 仮
      const postId = req.params.postId as PostID;

      const result = await this.readerActionService.deleteLike(userId, postId);

      if (result.count === 0) {
          res.status(404).json({ message: 'Like not found' });
      } else {
          res.status(200).send(); // spec.md に合わせて 200 OK
      }
    } catch (error: any) {
      console.error('Error deleting like action:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  recordBoostAction = async (req: Request, res: Response): Promise<void> => {
    try {
      // 認証ミドルウェアから userId を取得する想定
      // const userId = (req as any).user?.id as UserId;
      // if (!userId) {
      //   res.status(401).json({ message: 'Unauthorized' });
      //   return;
      // }
      const userId = 'test-user'; // 仮
      // postId は req.params から取得
      const postId = req.params.postId as PostID;
      // amount は req.body から取得
      const { amount } = req.body;

      if (!amount || typeof amount !== 'number' || amount <= 0) {
        // postId のチェックは不要になった
        res.status(400).json({ message: 'Positive amount is required' });
        return;
      }

      // TODO: ここで economy-service にポイント消費をリクエストする
      // const consumeResult = await economyService.consumePoints(userId, amount);
      // if (!consumeResult.success) {
      //   res.status(400).json({ message: 'Insufficient points' }); // 例
      //   return;
      // }

      const result = await this.readerActionService.recordBoost(userId, postId, amount);
      // spec.md では { boostId } を返す想定だが、ActionLog に boostId はないのでログ全体か ID を返す
      res.status(201).json({ boostLogId: result.id }); // 仮に ActionLog の ID を返す
    } catch (error: any) {
      console.error('Error recording boost action:', error);
      // TODO: postId 不在などのエラーハンドリング
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  getBoostActions = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId as UserId;
      const limit = parseInt(req.query.limit as string || '10', 10);
      const offset = parseInt(req.query.offset as string || '0', 10);

      if (isNaN(limit) || isNaN(offset) || limit <= 0 || offset < 0) {
          res.status(400).json({ message: 'Invalid limit or offset parameters' });
          return;
      }

      const boostRecords = await this.readerActionService.getBoostsByUserId(userId, limit, offset);
      res.status(200).json(boostRecords);
    } catch (error: any) {
      console.error('Error getting boost actions:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  createCommentAction = async (req: Request, res: Response): Promise<void> => {
    try {
      // const userId = (req as any).user?.id as UserId;
      // if (!userId) {
      //   res.status(401).json({ message: 'Unauthorized' });
      //   return;
      // }
      const userId = 'test-user-commenter'; // 仮
      const postId = req.params.postId as PostID;
      const { text } = req.body;

      if (!text || typeof text !== 'string') {
        res.status(400).json({ message: 'Comment text is required' });
        return;
      }

      const result = await this.readerActionService.createComment(userId, postId, text);
      // spec.md に合わせてコメント ID を含むオブジェクトを返す
      res.status(201).json({ commentId: result.id });
    } catch (error: any) {
      console.error('Error creating comment:', error);
      // TODO: postId 不在などのエラーハンドリング
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  getCommentActions = async (req: Request, res: Response): Promise<void> => {
    try {
      const postId = req.params.postId as PostID;
      const limit = parseInt(req.query.limit as string || '10', 10);
      const offset = parseInt(req.query.offset as string || '0', 10);

      if (isNaN(limit) || isNaN(offset) || limit <= 0 || offset < 0) {
        res.status(400).json({ message: 'Invalid limit or offset parameters' });
        return;
      }

      const commentRecords = await this.readerActionService.getCommentsByPostId(postId, limit, offset);
      res.status(200).json(commentRecords);
    } catch (error: any) {
      console.error('Error getting comments:', error);
      // TODO: postId 不在などのエラーハンドリング
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  recordShareAction = async (req: Request, res: Response): Promise<void> => {
    try {
      // const userId = (req as any).user?.id as UserId;
      // if (!userId) {
      //   res.status(401).json({ message: 'Unauthorized' });
      //   return;
      // }
      const userId = 'test-user-sharer'; // 仮
      const { targetType, targetId, platform, referrerId } = req.body;

      // バリデーション
      if (!targetType || !['post', 'magazine'].includes(targetType)) {
          res.status(400).json({ message: 'Invalid targetType' });
          return;
      }
      if (!targetId || typeof targetId !== 'string') {
          res.status(400).json({ message: 'targetId is required' });
          return;
      }
      if (!platform || !['x', 'facebook', 'link', 'other'].includes(platform)) {
          res.status(400).json({ message: 'Invalid platform' });
          return;
      }
      if (referrerId && typeof referrerId !== 'string') {
          res.status(400).json({ message: 'Invalid referrerId' });
          return;
      }

      // @ts-ignore
      const result = await this.readerActionService.recordShare(
          userId,
          targetType,
          targetId,
          platform,
          referrerId
      );
      // spec.md では 200 OK のみ
      res.status(200).send();
    } catch (error: any) {
      console.error('Error recording share action:', error);
      // TODO: targetId 不在などのエラーハンドリング
      res.status(500).json({ message: 'Internal server error' });
    }
  };
} 