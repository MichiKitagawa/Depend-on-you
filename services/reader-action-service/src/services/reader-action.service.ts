import { PrismaClient, ActionLog, Prisma, ActionType } from '../generated/prisma';
// @ts-ignore Ignore rootDir error for shared schema import
import { UserId, PostID, ReadRecord, BoostRecord, CommentRecord, ShareRecord, MagazineID } from '@shared/schema';

const prisma = new PrismaClient();

export class ReaderActionService {
  /**
   * 読了アクションを記録する
   * @param userId ユーザーID
   * @param postId 投稿ID
   * @param duration 読了時間 (秒)
   * @returns 作成された ActionLog
   */
  async recordRead(userId: UserId, postId: PostID, duration?: number): Promise<ActionLog> {
    return await prisma.actionLog.create({
      data: {
        userId: userId,
        targetType: 'post',
        targetId: postId,
        action: ActionType.READ,
        readDurationSeconds: duration,
      },
    });
  }

  /**
   * ユーザーの読了記録を取得する
   * @param userId ユーザーID
   * @param limit 取得件数
   * @param offset スキップ数
   * @returns ReadRecord の配列
   */
  async getReadsByUserId(userId: UserId, limit: number = 10, offset: number = 0): Promise<ReadRecord[]> {
    const logs = await prisma.actionLog.findMany({
      where: { userId: userId, action: ActionType.READ },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    // ActionLog[] を ReadRecord[] にマッピング
    return logs.map((log): ReadRecord => ({
      userId: log.userId,
      targetType: 'post',
      targetId: log.targetId,
      timestamp: log.createdAt.toISOString(),
      actionType: 'read',
      readDurationSeconds: log.readDurationSeconds ?? undefined,
    }));
  }

  /**
   * いいねアクションを記録する
   * @param userId ユーザーID
   * @param postId 投稿ID
   * @returns 作成された ActionLog または null (既にいいね済みの場合)
   * @throws Error 既にいいね済みの場合 (仕様により null または エラー)
   */
  async recordLike(userId: UserId, postId: PostID): Promise<ActionLog> {
    // 既に Like しているか確認
    const existingLike = await prisma.actionLog.count({
      where: {
        userId,
        targetType: 'post',
        targetId: postId,
        action: ActionType.LIKE,
      },
    });

    if (existingLike > 0) {
      // 既にいいね済みの場合、エラーを投げる (または null を返すなど、仕様による)
      // test.md の RAS-LIKE-04 では 409 Conflict を期待しているのでエラーを投げる
      throw new Error('Already liked'); // エラーメッセージはコントローラーで調整
    }

    // Like を記録
    return await prisma.actionLog.create({
      data: {
        userId,
        targetType: 'post',
        targetId: postId,
        action: ActionType.LIKE,
      },
    });
  }

  /**
   * いいねアクションを削除する
   * @param userId ユーザーID
   * @param postId 投稿ID
   * @returns 削除された件数 (0 または 1)
   */
  async deleteLike(userId: UserId, postId: PostID): Promise<{ count: number }> {
    return await prisma.actionLog.deleteMany({
      where: {
        userId,
        targetType: 'post',
        targetId: postId,
        action: ActionType.LIKE,
      },
    });
  }

  // --- Boost, Comment, Share のメソッドも同様に追加 ---
  /**
   * Boost アクションを記録する
   * @param userId ユーザーID
   * @param postId 投稿ID
   * @param amount Boost 量
   * @returns 作成された ActionLog
   */
  async recordBoost(userId: UserId, postId: PostID, amount: number): Promise<ActionLog> {
    return await prisma.actionLog.create({
      data: {
        userId,
        targetType: 'post',
        targetId: postId,
        action: ActionType.BOOST,
        boostAmount: amount,
      },
    });
  }

  /**
   * ユーザーの Boost 記録を取得する
   * @param userId ユーザーID
   * @param limit 取得件数
   * @param offset スキップ数
   * @returns BoostRecord の配列
   */
  async getBoostsByUserId(userId: UserId, limit: number = 10, offset: number = 0): Promise<BoostRecord[]> {
    const logs = await prisma.actionLog.findMany({
      where: { userId, action: ActionType.BOOST },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    // ActionLog[] を BoostRecord[] にマッピング
    return logs.map((log): BoostRecord => ({
      userId: log.userId,
      targetType: 'post', // Boost は post のみ対象と仮定
      targetId: log.targetId,
      timestamp: log.createdAt.toISOString(),
      actionType: 'boost',
      amount: log.boostAmount ?? 0, // boostAmount が null の場合は 0 を設定 (型に合わせて要調整)
    }));
  }

  /**
   * コメントを作成する
   * @param userId ユーザーID
   * @param postId 投稿ID
   * @param text コメント本文
   * @returns 作成された ActionLog
   */
  async createComment(userId: UserId, postId: PostID, text: string): Promise<ActionLog> {
    return await prisma.actionLog.create({
      data: {
        userId,
        targetType: 'post',
        targetId: postId,
        action: ActionType.COMMENT,
        commentText: text,
      },
    });
  }

  /**
   * 投稿に紐づくコメントを取得する
   * @param postId 投稿ID
   * @param limit 取得件数
   * @param offset スキップ数
   * @returns CommentRecord の配列
   */
  async getCommentsByPostId(postId: PostID, limit: number = 10, offset: number = 0): Promise<CommentRecord[]> {
    const logs = await prisma.actionLog.findMany({
      where: { targetType: 'post', targetId: postId, action: ActionType.COMMENT },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    // ActionLog[] を CommentRecord[] にマッピング
    return logs.map((log): CommentRecord => ({
      userId: log.userId,
      targetType: 'post',
      targetId: log.targetId,
      timestamp: log.createdAt.toISOString(),
      actionType: 'comment',
      commentId: log.id,
      text: log.commentText ?? '',
    }));
  }

  /**
   * シェアアクションを記録する
   * @param userId ユーザーID
   * @param targetType 対象タイプ ('post' | 'magazine')
   * @param targetId 対象ID
   * @param platform シェア先プラットフォーム
   * @param referrerId リファラーユーザーID (Optional)
   * @returns 作成された ActionLog
   */
  async recordShare(
      userId: UserId,
      targetType: 'post' | 'magazine',
      targetId: PostID | MagazineID,
      platform: 'x' | 'facebook' | 'link' | 'other',
      referrerId?: UserId
  ): Promise<ActionLog> {
      return await prisma.actionLog.create({
          data: {
              userId,
              targetType,
              targetId,
              action: ActionType.SHARE,
              sharePlatform: platform,
              referrerUserId: referrerId,
          },
      });
  }

  // --- 古いメソッドは削除 ---
  /*
  async createAction(actionRecord: ActionRecord): Promise<ActionLog> { ... }
  async getActionsByUserId(userId: UserId): Promise<ActionLog[]> { ... }
  async getActionsByTarget(targetType: string, targetId: string): Promise<ActionLog[]> { ... }
  async getActionById(id: string): Promise<ActionLog | null> { ... }
  async getActionsByType(actionType: ReaderActionType): Promise<ActionLog[]> { ... }
  async getActionsByUserAndTarget(userId: UserId, targetType: string, targetId: string): Promise<ActionLog[]> { ... }
  async checkActionExists(userId: UserId, targetType: string, targetId: string, actionType: ReaderActionType): Promise<boolean> { ... }
  */
} 