import { PrismaClient, ActionLog, Prisma, ActionType } from '../generated/prisma';
import { ActionRecord, ReaderActionType, UserId, PostID, MagazineID, CommentId } from '@shared/schema';

const prisma = new PrismaClient();

export class ReaderActionService {
  /**
   * 新しいアクションログを作成する
   * @param actionRecord アクションデータ (shared/schema.ts の ActionRecord 型)
   * @returns 作成されたアクションログ
   */
  async createAction(actionRecord: ActionRecord): Promise<ActionLog> {
    const data: Prisma.ActionLogCreateInput = {
      userId: actionRecord.userId,
      targetType: actionRecord.targetType,
      targetId: actionRecord.targetId,
      action: actionRecord.actionType.toUpperCase() as ActionType,
      boostAmount: actionRecord.actionType === 'boost' ? actionRecord.amount : undefined,
      commentText: actionRecord.actionType === 'comment' ? actionRecord.commentText : undefined,
      sharePlatform: actionRecord.actionType === 'share' ? actionRecord.platform : undefined,
      readDurationSeconds: actionRecord.actionType === 'read' ? actionRecord.readDurationSeconds : undefined,
    };

    return await prisma.actionLog.create({ data });
  }

  /**
   * ユーザーIDに基づいてアクションログを取得する
   * @param userId ユーザーID
   * @returns アクションログの配列
   */
  async getActionsByUserId(userId: UserId): Promise<ActionLog[]> {
    return await prisma.actionLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * ターゲットに基づいてアクションログを取得する
   * @param targetType ターゲットタイプ ('post', 'magazine', 'comment')
   * @param targetId ターゲットID
   * @returns アクションログの配列
   */
  async getActionsByTarget(targetType: string, targetId: string): Promise<ActionLog[]> {
    return await prisma.actionLog.findMany({
      where: { targetType, targetId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * IDに基づいて特定のアクションログを取得する
   * @param id アクションログID
   * @returns アクションログまたはnull
   */
  async getActionById(id: string): Promise<ActionLog | null> {
    return await prisma.actionLog.findUnique({
      where: { id },
    });
  }

  /**
   * アクションタイプに基づいてアクションログを取得する
   * @param actionType アクションタイプ (shared/schema の ReaderActionType)
   * @returns アクションログの配列
   */
  async getActionsByType(actionType: ReaderActionType): Promise<ActionLog[]> {
    const prismaActionType = actionType.toUpperCase() as ActionType;
    return await prisma.actionLog.findMany({
      where: { action: prismaActionType },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * ユーザーとターゲットの組み合わせに基づいてアクションログを取得する
   * @param userId ユーザーID
   * @param targetType ターゲットタイプ
   * @param targetId ターゲットID
   * @returns アクションログの配列
   */
  async getActionsByUserAndTarget(userId: UserId, targetType: string, targetId: string): Promise<ActionLog[]> {
    return await prisma.actionLog.findMany({
      where: { userId, targetType, targetId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * 特定のアクションが存在するか確認する (例: Like の重複防止など)
   * @param userId ユーザーID
   * @param targetType ターゲットタイプ
   * @param targetId ターゲットID
   * @param actionType アクションタイプ (shared/schema の ReaderActionType)
   * @returns 存在すれば true, しなければ false
   */
  async checkActionExists(userId: UserId, targetType: string, targetId: string, actionType: ReaderActionType): Promise<boolean> {
    const prismaActionType = actionType.toUpperCase() as ActionType;
    const count = await prisma.actionLog.count({
      where: {
        userId,
        targetType,
        targetId,
        action: prismaActionType,
      },
    });
    return count > 0;
  }
} 