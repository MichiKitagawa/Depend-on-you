import { Request, Response } from 'express';
import { ReaderActionService } from '../services/reader-action.service';
import { ActionRecord, ReaderActionType } from '@shared/schema';
import type { ActionType } from '../generated/prisma';

export class ReaderActionController {
  private readerActionService: ReaderActionService;

  constructor() {
    this.readerActionService = new ReaderActionService();
  }

  /**
   * 新しいアクションを作成する
   * @param req リクエスト
   * @param res レスポンス
   */
  createAction = async (req: Request, res: Response): Promise<void> => {
    try {
      const actionRecord = req.body as Partial<ActionRecord>;
      const { userId, targetType, targetId, actionType } = actionRecord;

      if (!userId || !targetType || !targetId || !actionType) {
        res.status(400).json({ error: '必須パラメータ (userId, targetType, targetId, actionType) が不足しています' });
        return;
      }

      const validActionTypes: ReaderActionType[] = ['read', 'like', 'boost', 'comment', 'share'];
      if (!validActionTypes.includes(actionType)) {
        res.status(400).json({ error: '無効なアクションタイプです' });
        return;
      }

      if (actionType === 'boost' && typeof actionRecord.amount !== 'number') {
        res.status(400).json({ error: 'Boostアクションには amount (数値) が必要です' });
        return;
      }
      if (actionType === 'comment' && typeof actionRecord.commentText !== 'string') {
        res.status(400).json({ error: 'Commentアクションには commentText (文字列) が必要です' });
        return;
      }
      if (actionType === 'share' && typeof actionRecord.platform !== 'string') {
        res.status(400).json({ error: 'Shareアクションには platform (文字列) が必要です' });
        return;
      }

      if (actionType === 'like') {
        const exists = await this.readerActionService.checkActionExists(
          userId,
          targetType,
          targetId,
          actionType
        );
        if (exists) {
          res.status(409).json({ error: '既に Like されています' });
          return;
        }
      }

      const createdAction = await this.readerActionService.createAction(actionRecord as ActionRecord);

      res.status(201).json(createdAction);
    } catch (error) {
      console.error('アクション作成エラー:', error);
      res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
  };

  /**
   * ユーザーIDに基づいてアクションを取得する
   * @param req リクエスト (userId は req.params から取得)
   * @param res レスポンス
   */
  getActionsByUserId = async (req: Request<{ userId: string }>, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;

      if (!userId || typeof userId !== 'string') {
        res.status(400).json({ error: 'ユーザーIDが必要です' });
        return;
      }

      const actions = await this.readerActionService.getActionsByUserId(userId);
      res.status(200).json(actions);
    } catch (error) {
      console.error('アクション取得エラー (ユーザーID別):', error);
      res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
  };

  /**
   * ターゲットに基づいてアクションを取得する
   * @param req リクエスト (targetId は req.params, targetType は req.targetType (カスタムプロパティ))
   * @param res レスポンス
   */
  getActionsByTarget = async (req: Request<{ targetId: string }>, res: Response): Promise<void> => {
    try {
      // ルートハンドラーで設定されたカスタムプロパティを参照
      const targetType = (req as any).targetType;
      const { targetId } = req.params;

      if (!targetType || !targetId) {
        res.status(400).json({ error: 'ターゲットタイプとIDが必要です' });
        return;
      }

      const actions = await this.readerActionService.getActionsByTarget(targetType, targetId);
      res.status(200).json(actions);
    } catch (error) {
      console.error('アクション取得エラー (ターゲット別):', error);
      res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
  };

  /**
   * アクションIDに基づいて特定のアクションを取得する
   * @param req リクエスト
   * @param res レスポンス
   */
  getActionById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: 'アクションIDが必要です' });
        return;
      }

      const action = await this.readerActionService.getActionById(id);

      if (!action) {
        res.status(404).json({ error: 'アクションが見つかりません' });
        return;
      }

      res.status(200).json(action);
    } catch (error) {
      console.error('アクション取得エラー (ID別):', error);
      res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
  };
} 