import { Request, Response } from 'express';
import { ReaderActionService } from '../services/reader-action.service';
import { ActionType } from '../models/reader-action.model';

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
      const { userId, contentId, actionType, payload } = req.body;

      // 必須パラメータの検証
      if (!userId || !contentId || !actionType) {
        res.status(400).json({ error: '必須パラメータが不足しています' });
        return;
      }

      // アクションタイプの検証
      const validActionTypes: ActionType[] = ['boost', 'save', 'comment', 'reaction'];
      if (!validActionTypes.includes(actionType)) {
        res.status(400).json({ error: '無効なアクションタイプです' });
        return;
      }

      // アクションの作成
      const action = await this.readerActionService.createAction({
        userId,
        contentId,
        actionType,
        payload: payload || {},
      });

      res.status(201).json(action);
    } catch (error) {
      console.error('アクション作成エラー:', error);
      res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
  };

  /**
   * ユーザーIDに基づいてアクションを取得する
   * @param req リクエスト
   * @param res レスポンス
   */
  getActionsByUserId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.query;

      if (!userId || typeof userId !== 'string') {
        res.status(400).json({ error: 'ユーザーIDが必要です' });
        return;
      }

      const actions = await this.readerActionService.getActionsByUserId(userId);
      res.status(200).json(actions);
    } catch (error) {
      console.error('アクション取得エラー:', error);
      res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
  };

  /**
   * コンテンツIDに基づいてアクションを取得する
   * @param req リクエスト
   * @param res レスポンス
   */
  getActionsByContentId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { contentId } = req.query;

      if (!contentId || typeof contentId !== 'string') {
        res.status(400).json({ error: 'コンテンツIDが必要です' });
        return;
      }

      const actions = await this.readerActionService.getActionsByContentId(contentId);
      res.status(200).json(actions);
    } catch (error) {
      console.error('アクション取得エラー:', error);
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
      const { actionId } = req.params;

      if (!actionId) {
        res.status(400).json({ error: 'アクションIDが必要です' });
        return;
      }

      const action = await this.readerActionService.getActionById(actionId);

      if (!action) {
        res.status(404).json({ error: 'アクションが見つかりません' });
        return;
      }

      res.status(200).json(action);
    } catch (error) {
      console.error('アクション取得エラー:', error);
      res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
  };
} 