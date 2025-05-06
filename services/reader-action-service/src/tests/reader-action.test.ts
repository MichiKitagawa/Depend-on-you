import request from 'supertest';
import express from 'express';
import readerActionRoutes from '../routes/reader-action.routes';
import { PrismaClient, ActionType } from '../generated/prisma';
// @ts-ignore Ignore rootDir error for shared schema import
// import { UserId, PostID, ReadRecord, BoostRecord, CommentRecord, ShareRecord } from '@shared/schema';
import { UserId, PostID, ReadRecord, BoostRecord, CommentRecord, ShareRecord } from '../../../shared/schema'; // 相対パスに変更

// jest.mock で PrismaClient 全体をモック
jest.mock('../generated/prisma', () => {
  const mockActionLogFuncs = {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    count: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  };
  return {
    __esModule: true,
    PrismaClient: jest.fn().mockImplementation(() => ({
      actionLog: mockActionLogFuncs,
    })),
    ActionType: {
      READ: 'READ',
      LIKE: 'LIKE',
      BOOST: 'BOOST',
      COMMENT: 'COMMENT',
      SHARE: 'SHARE',
    }
  };
});

// モック関数への参照を取得
const mockPrisma = new (require('../generated/prisma').PrismaClient)();
const mockActionLogDb = mockPrisma.actionLog;

// テスト用 Express アプリ
const app = express();
app.use(express.json());
app.use('/', readerActionRoutes);

describe('Reader Action Service API v2', () => {
  let errorSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
    warnSpy.mockRestore();
  });

  // --- /user/{userId}/reads ---
  describe('POST /user/:userId/reads', () => {
    const userId: UserId = 'user-read-test';
    const postId: PostID = 'post-to-read';

    it('正常系: 読了記録を正常に作成できる (RAS-READ-01)', async () => {
      const mockCreatedLog = {
        id: 'read-log-1',
        userId,
        targetType: 'post',
        targetId: postId,
        action: ActionType.READ,
        readDurationSeconds: 60,
        createdAt: new Date(),
      };
      mockActionLogDb.create.mockResolvedValue(mockCreatedLog);

      const response = await request(app)
        .post(`/user/${userId}/reads`)
        .send({ postId, duration: 60 });

      expect(response.status).toBe(200);
      expect(mockActionLogDb.create).toHaveBeenCalledTimes(1);
      expect(mockActionLogDb.create).toHaveBeenCalledWith({
        data: {
          userId,
          targetType: 'post',
          targetId: postId,
          action: ActionType.READ,
          readDurationSeconds: 60,
        }
      });
    });

    it('異常系: リクエストボディ不正 (postId なし) - 400 (RAS-READ-03)', async () => {
      const response = await request(app)
        .post(`/user/${userId}/reads`)
        .send({ duration: 60 });

      expect(response.status).toBe(400);
      expect(mockActionLogDb.create).not.toHaveBeenCalled();
    });

    // TODO: RAS-READ-02 (JWT無効), RAS-READ-04 (postId 不在), RAS-READ-05 (userId 不正) のテストケースを追加
    // これらは認証ミドルウェアや、content-service との連携モックが必要になる可能性
  });

  describe('GET /user/:userId/reads', () => {
    const userId: UserId = 'user-get-read-test';
    const mockReadLogs = [
      { id: 'rlog1', userId, targetType: 'post', targetId: 'p1', action: ActionType.READ, createdAt: new Date(Date.now() - 10000), readDurationSeconds: 120 },
      { id: 'rlog2', userId, targetType: 'post', targetId: 'p2', action: ActionType.READ, createdAt: new Date(Date.now() - 5000), readDurationSeconds: 50 },
    ];

    it('正常系: 読了記録を正常に取得できる (RAS-GET-READ-01)', async () => {
      mockActionLogDb.findMany.mockResolvedValue(mockReadLogs);

      const response = await request(app)
        .get(`/user/${userId}/reads?limit=10`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toEqual(expect.objectContaining({
        userId,
        targetType: 'post',
        targetId: 'p1',
        actionType: 'read',
        timestamp: mockReadLogs[0].createdAt.toISOString()
      }));
      expect(response.body[1]).toEqual(expect.objectContaining({
        userId,
        targetType: 'post',
        targetId: 'p2',
        actionType: 'read',
        timestamp: mockReadLogs[1].createdAt.toISOString()
      }));
      expect(mockActionLogDb.findMany).toHaveBeenCalledTimes(1);
      expect(mockActionLogDb.findMany).toHaveBeenCalledWith({
        where: { userId, action: ActionType.READ },
        orderBy: { createdAt: 'desc' },
        take: 10,
        skip: 0,
      });
    });

    it('正常系: 読了記録がない場合は空配列を返す (RAS-GET-READ-02)', async () => {
      mockActionLogDb.findMany.mockResolvedValue([]);
      const response = await request(app)
        .get(`/user/${userId}/reads?limit=5`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
      expect(mockActionLogDb.findMany).toHaveBeenCalledTimes(1);
    });

    it('正常系: ページネーション (offset) (RAS-GET-READ-03)', async () => {
      mockActionLogDb.findMany.mockResolvedValue([mockReadLogs[1]]);
      const response = await request(app)
        .get(`/user/${userId}/reads?limit=1&offset=1`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].targetId).toBe('p2');
      expect(mockActionLogDb.findMany).toHaveBeenCalledWith({
        where: { userId, action: ActionType.READ },
        orderBy: { createdAt: 'desc' },
        take: 1,
        skip: 1,
      });
    });

    // TODO: RAS-GET-READ-04 (JWT無効), RAS-GET-READ-05 (userId 不正) のテストを追加
  });

  // --- /posts/{postId}/like ---
  describe('POST /posts/:postId/like', () => {
    const userId = 'test-user';
    const postId = 'post-to-like';

    beforeEach(() => {
      app.use((req: any, res, next) => {
        req.user = { id: userId };
        next();
      });
    });

    it('正常系: いいねを正常に作成できる (RAS-LIKE-01)', async () => {
      mockActionLogDb.count.mockResolvedValue(0);
      const mockCreatedLog = { id: 'like-1', userId, targetType: 'post', targetId: postId, action: ActionType.LIKE, createdAt: new Date() };
      mockActionLogDb.create.mockResolvedValue(mockCreatedLog);

      const response = await request(app)
        .post(`/posts/${postId}/like`)
        .send();

      expect(response.status).toBe(200);
      expect(mockActionLogDb.count).toHaveBeenCalledWith({ where: { userId, targetId: postId, targetType: 'post', action: ActionType.LIKE } });
      expect(mockActionLogDb.create).toHaveBeenCalledWith({ data: { userId, targetId: postId, targetType: 'post', action: ActionType.LIKE } });
    });

    it('異常系: 既にいいね済みの場合 409 を返す (RAS-LIKE-04)', async () => {
      mockActionLogDb.count.mockResolvedValue(1);

      const response = await request(app)
        .post(`/posts/${postId}/like`)
        .send();

      expect(response.status).toBe(409);
      expect(mockActionLogDb.create).not.toHaveBeenCalled();
    });

    // TODO: RAS-LIKE-02 (JWT無効), RAS-LIKE-03 (postId 不在) テスト追加
  });

  describe('DELETE /posts/:postId/like', () => {
    const userId = 'test-user';
    const postId = 'post-to-unlike';

    beforeEach(() => {
      app.use((req: any, res, next) => { req.user = { id: userId }; next(); });
    });

    it('正常系: いいねを正常に解除できる (RAS-UNLIKE-01)', async () => {
      mockActionLogDb.deleteMany.mockResolvedValue({ count: 1 });

      const response = await request(app)
        .delete(`/posts/${postId}/like`)
        .send();

      expect(response.status).toBe(200);
      expect(mockActionLogDb.deleteMany).toHaveBeenCalledTimes(1);
      expect(mockActionLogDb.deleteMany).toHaveBeenCalledWith({ where: { userId, targetType: 'post', targetId: postId, action: ActionType.LIKE } });
    });

    it('RAS-UNLIKE-02: 存在しないいいねを解除しようとしても 404 を返す', async () => {
      mockActionLogDb.deleteMany.mockResolvedValue({ count: 0 }); // 削除件数が 0
      const response = await request(app).delete(`/posts/${postId}/like`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Like not found');
      expect(mockActionLogDb.deleteMany).toHaveBeenCalledTimes(1);
    });

    // TODO: RAS-UNLIKE-03: JWT 無効 (401)
    // TODO: RAS-UNLIKE-04: postId が存在しない (404)
    // TODO: RAS-UNLIKE-05: サービスエラー (500)
  });

  // --- Boost Endpoints ---
  describe('POST /posts/:postId/boost', () => {
    const userId = 'user-for-boost' as UserId;
    const postId = 'p1' as PostID;
    const amount = 100;
    const mockBoostLog = { id: 'boost-log-1', userId, targetId: postId, action: ActionType.BOOST, boostAmount: amount, createdAt: new Date() };

    it('RAS-BOOST-01: 正常系: Boost 記録を追加できる', async () => {
        mockActionLogDb.create.mockResolvedValue(mockBoostLog as any);
        const response = await request(app)
          .post(`/posts/${postId}/boost`)
          .send({ amount }); // userId はコントローラーで仮設定

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('boostLogId');
        expect(mockActionLogDb.create).toHaveBeenCalledTimes(1);
        expect(mockActionLogDb.create).toHaveBeenCalledWith({
            data: {
                userId: 'test-user', // コントローラーの仮設定に合わせる
                targetType: 'post',
                targetId: postId,
                action: ActionType.BOOST,
                boostAmount: amount,
            },
        });
        // TODO: economy-service のモック呼び出し検証
    });

    it('RAS-BOOST-02: amount が不正な場合は 400 を返す', async () => {
      const response = await request(app)
        .post(`/posts/${postId}/boost`)
        .send({ amount: -10 }); // 不正な amount
      expect(response.status).toBe(400);
      expect(mockActionLogDb.create).not.toHaveBeenCalled();
    });

    it('RAS-BOOST-03: amount がない場合は 400 を返す', async () => {
      const response = await request(app)
        .post(`/posts/${postId}/boost`)
        .send({}); // amount がない
      expect(response.status).toBe(400);
      expect(mockActionLogDb.create).not.toHaveBeenCalled();
    });

    // TODO: RAS-BOOST-04: JWT 無効 (401) - 認証ミドルウェア実装後
    // TODO: RAS-BOOST-05: economy-service ポイント不足 (400) - サービス連携後
    // TODO: RAS-BOOST-06: postId が存在しない (404) - content-service 連携後
    // TODO: RAS-BOOST-07: サービスエラー (500)
  });

  describe('GET /user/:userId/boosts', () => {
    const userId = 'user-for-boost-get' as UserId;
    const mockBoostLogs = [
        { id: 'bl1', userId, targetType: 'post', targetId: 'p1', action: ActionType.BOOST, boostAmount: 100, createdAt: new Date(2024, 0, 2) },
        { id: 'bl2', userId, targetType: 'post', targetId: 'p3', action: ActionType.BOOST, boostAmount: 50, createdAt: new Date(2024, 0, 1) },
    ];
    const expectedBoostRecords = [
      {
        userId,
        targetType: 'post',
        targetId: 'p1',
        timestamp: mockBoostLogs[0].createdAt.toISOString(),
        actionType: 'boost',
        amount: 100,
      },
      {
        userId,
        targetType: 'post',
        targetId: 'p3',
        timestamp: mockBoostLogs[1].createdAt.toISOString(),
        actionType: 'boost',
        amount: 50,
      },
    ];

    it('RAS-GET-BOOST-01: 正常系: Boost 記録を取得できる', async () => {
        mockActionLogDb.findMany.mockResolvedValue(mockBoostLogs as any);
        const response = await request(app).get(`/user/${userId}/boosts`);

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(2);
        expect(response.body).toEqual(expectedBoostRecords);
        expect(mockActionLogDb.findMany).toHaveBeenCalledTimes(1);
        expect(mockActionLogDb.findMany).toHaveBeenCalledWith({
            where: { userId, action: ActionType.BOOST },
            orderBy: { createdAt: 'desc' },
            take: 10,
            skip: 0,
        });
    });

    it('RAS-GET-BOOST-02: クエリパラメータ (limit, offset) が有効', async () => {
      mockActionLogDb.findMany.mockResolvedValue([mockBoostLogs[1]] as any); // 1件のみ返す想定
      const response = await request(app).get(`/user/${userId}/boosts?limit=1&offset=1`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toEqual(expectedBoostRecords[1]);
      expect(mockActionLogDb.findMany).toHaveBeenCalledWith({
          where: { userId, action: ActionType.BOOST },
          orderBy: { createdAt: 'desc' },
          take: 1,
          skip: 1,
      });
    });

    it('RAS-GET-BOOST-03: 不正なクエリパラメータで 400 を返す', async () => {
      const response = await request(app).get(`/user/${userId}/boosts?limit=-1`);
      expect(response.status).toBe(400);
      expect(mockActionLogDb.findMany).not.toHaveBeenCalled();
    });

    // TODO: RAS-GET-BOOST-04: JWT 無効 (401)
    // TODO: RAS-GET-BOOST-05: サービスエラー (500)
  });

  // --- Comment Endpoints ---
  describe('POST /posts/:postId/comments', () => {
    const userId = 'test-user-commenter' as UserId;
    const postId = 'p-for-comment' as PostID;
    const commentText = 'This is a comment';
    const mockCommentLog = { id: 'comment-log-1', userId, targetId: postId, action: ActionType.COMMENT, commentText, createdAt: new Date() };

    it('RAS-COMMENT-01: 正常系: コメントを作成できる', async () => {
      mockActionLogDb.create.mockResolvedValue(mockCommentLog as any);
      const response = await request(app)
        .post(`/posts/${postId}/comments`)
        .send({ text: commentText }); // userId はコントローラーで仮設定

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('commentId', mockCommentLog.id);
      expect(mockActionLogDb.create).toHaveBeenCalledTimes(1);
      expect(mockActionLogDb.create).toHaveBeenCalledWith({
          data: {
              userId: 'test-user-commenter', // コントローラーの仮設定に合わせる
              targetType: 'post',
              targetId: postId,
              action: ActionType.COMMENT,
              commentText,
          },
      });
    });

    it('RAS-COMMENT-02: text が空の場合は 400 を返す', async () => {
      const response = await request(app)
        .post(`/posts/${postId}/comments`)
        .send({ text: '' });
      expect(response.status).toBe(400);
      expect(mockActionLogDb.create).not.toHaveBeenCalled();
    });

    it('RAS-COMMENT-03: text がない場合は 400 を返す', async () => {
      const response = await request(app)
        .post(`/posts/${postId}/comments`)
        .send({});
      expect(response.status).toBe(400);
      expect(mockActionLogDb.create).not.toHaveBeenCalled();
    });

    // TODO: RAS-COMMENT-04: JWT 無効 (401)
    // TODO: RAS-COMMENT-05: postId が存在しない (404)
    // TODO: RAS-COMMENT-06: サービスエラー (500)
  });

  describe('GET /posts/:postId/comments', () => {
    const postId = 'p-with-comments' as PostID;
    const user1 = 'commenter-1' as UserId;
    const user2 = 'commenter-2' as UserId;
    const mockCommentLogs = [
      { id: 'cl1', userId: user1, targetType: 'post', targetId: postId, action: ActionType.COMMENT, commentText: 'First comment', createdAt: new Date(2024, 1, 2) },
      { id: 'cl2', userId: user2, targetType: 'post', targetId: postId, action: ActionType.COMMENT, commentText: 'Second comment', createdAt: new Date(2024, 1, 1) },
    ];
    const expectedCommentRecords: CommentRecord[] = [
      {
        userId: user1,
        targetType: 'post',
        targetId: postId,
        timestamp: mockCommentLogs[0].createdAt.toISOString(),
        actionType: 'comment',
        commentId: 'cl1',
        text: 'First comment',
      },
      {
        userId: user2,
        targetType: 'post',
        targetId: postId,
        timestamp: mockCommentLogs[1].createdAt.toISOString(),
        actionType: 'comment',
        commentId: 'cl2',
        text: 'Second comment',
      },
    ];

    it('RAS-GET-COMMENT-01: 正常系: コメントを取得できる', async () => {
      mockActionLogDb.findMany.mockResolvedValue(mockCommentLogs as any);
      const response = await request(app).get(`/posts/${postId}/comments`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedCommentRecords);
      expect(mockActionLogDb.findMany).toHaveBeenCalledTimes(1);
      expect(mockActionLogDb.findMany).toHaveBeenCalledWith({
        where: { targetType: 'post', targetId: postId, action: ActionType.COMMENT },
        orderBy: { createdAt: 'desc' },
        take: 10,
        skip: 0,
      });
    });

    it('RAS-GET-COMMENT-02: クエリパラメータ (limit, offset) が有効', async () => {
      mockActionLogDb.findMany.mockResolvedValue([mockCommentLogs[1]] as any);
      const response = await request(app).get(`/posts/${postId}/comments?limit=1&offset=1`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([expectedCommentRecords[1]]);
      expect(mockActionLogDb.findMany).toHaveBeenCalledWith({
        where: { targetType: 'post', targetId: postId, action: ActionType.COMMENT },
        orderBy: { createdAt: 'desc' },
        take: 1,
        skip: 1,
      });
    });

    it('RAS-GET-COMMENT-03: 不正なクエリパラメータで 400 を返す', async () => {
      const response = await request(app).get(`/posts/${postId}/comments?limit=abc`);
      expect(response.status).toBe(400);
      expect(mockActionLogDb.findMany).not.toHaveBeenCalled();
    });

    it('RAS-GET-COMMENT-04: コメントがない場合は空配列を返す', async () => {
      mockActionLogDb.findMany.mockResolvedValue([]);
      const response = await request(app).get(`/posts/${postId}/comments`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    // TODO: RAS-GET-COMMENT-05: postId が存在しない (404)
    // TODO: RAS-GET-COMMENT-06: サービスエラー (500)
  });

  // --- Share Endpoints ---
  describe('POST /shares', () => {
    const userId = 'test-user-sharer' as UserId;
    const targetId = 'post-to-share' as PostID;
    const platform = 'x';
    const mockShareLog = { id: 'share-log-1', userId, targetId, targetType: 'post', action: ActionType.SHARE, sharePlatform: platform, createdAt: new Date() };

    const validPayload = { targetType: 'post', targetId, platform };

    it('RAS-SHARE-01: 正常系: シェアを記録できる', async () => {
        mockActionLogDb.create.mockResolvedValue(mockShareLog as any);
        const response = await request(app)
          .post('/shares')
          .send(validPayload);

        expect(response.status).toBe(200);
        expect(mockActionLogDb.create).toHaveBeenCalledTimes(1);
        expect(mockActionLogDb.create).toHaveBeenCalledWith({
            data: {
                userId: 'test-user-sharer',
                targetType: 'post',
                targetId,
                action: ActionType.SHARE,
                sharePlatform: platform,
                referrerUserId: undefined, // referrerId なしの場合
            },
        });
    });

    it('RAS-SHARE-02: referrerId を含めてシェアを記録できる', async () => {
        const referrerId = 'referrer-user' as UserId;
        mockActionLogDb.create.mockResolvedValue({ ...mockShareLog, referrerUserId: referrerId } as any);
        const response = await request(app)
          .post('/shares')
          .send({ ...validPayload, referrerId });

        expect(response.status).toBe(200);
        expect(mockActionLogDb.create).toHaveBeenCalledTimes(1);
        expect(mockActionLogDb.create).toHaveBeenCalledWith({
            data: expect.objectContaining({ referrerUserId: referrerId }),
        });
    });

    it('RAS-SHARE-03: targetType が不正な場合は 400 を返す', async () => {
      const response = await request(app)
        .post('/shares')
        .send({ ...validPayload, targetType: 'invalid' });
      expect(response.status).toBe(400);
      expect(mockActionLogDb.create).not.toHaveBeenCalled();
    });

    it('RAS-SHARE-04: platform が不正な場合は 400 を返す', async () => {
      const response = await request(app)
        .post('/shares')
        .send({ ...validPayload, platform: 'invalid' });
      expect(response.status).toBe(400);
      expect(mockActionLogDb.create).not.toHaveBeenCalled();
    });

    it('RAS-SHARE-05: 必須パラメータ (targetId) が欠けている場合は 400 を返す', async () => {
      const { targetId, ...invalidPayload } = validPayload;
      const response = await request(app)
        .post('/shares')
        .send(invalidPayload);
      expect(response.status).toBe(400);
      expect(mockActionLogDb.create).not.toHaveBeenCalled();
    });

    // TODO: RAS-SHARE-06: JWT 無効 (401)
    // TODO: RAS-SHARE-07: targetId が存在しない (404)
    // TODO: RAS-SHARE-08: サービスエラー (500)

  });

}); 