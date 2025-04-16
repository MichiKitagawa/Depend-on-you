import { ReaderAction, ReaderActionCreationAttributes } from '../models/reader-action.model';
import { ActionType } from '../models/reader-action.model';

export class ReaderActionService {
  /**
   * 新しいアクションを作成する
   * @param actionData アクションデータ
   * @returns 作成されたアクション
   */
  async createAction(actionData: ReaderActionCreationAttributes): Promise<ReaderAction> {
    return await ReaderAction.create(actionData);
  }

  /**
   * ユーザーIDに基づいてアクションを取得する
   * @param userId ユーザーID
   * @returns アクションの配列
   */
  async getActionsByUserId(userId: string): Promise<ReaderAction[]> {
    return await ReaderAction.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * コンテンツIDに基づいてアクションを取得する
   * @param contentId コンテンツID
   * @returns アクションの配列
   */
  async getActionsByContentId(contentId: string): Promise<ReaderAction[]> {
    return await ReaderAction.findAll({
      where: { contentId },
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * アクションIDに基づいて特定のアクションを取得する
   * @param actionId アクションID
   * @returns アクションまたはnull
   */
  async getActionById(actionId: string): Promise<ReaderAction | null> {
    return await ReaderAction.findByPk(actionId);
  }

  /**
   * アクションタイプに基づいてアクションを取得する
   * @param actionType アクションタイプ
   * @returns アクションの配列
   */
  async getActionsByType(actionType: ActionType): Promise<ReaderAction[]> {
    return await ReaderAction.findAll({
      where: { actionType },
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * ユーザーIDとコンテンツIDの組み合わせに基づいてアクションを取得する
   * @param userId ユーザーID
   * @param contentId コンテンツID
   * @returns アクションの配列
   */
  async getActionsByUserAndContent(userId: string, contentId: string): Promise<ReaderAction[]> {
    return await ReaderAction.findAll({
      where: { userId, contentId },
      order: [['createdAt', 'DESC']],
    });
  }
} 