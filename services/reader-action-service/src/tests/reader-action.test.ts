import request from 'supertest';
import express from 'express';
import readerActionRoutes from '../routes/reader-action.routes';
import { PrismaClient } from '../generated/prisma';

// jest.mock の中でモックオブジェクトを生成する
jest.mock('../generated/prisma', () => {
  // モック関数群をここで定義
  const mockActionLogFuncs = {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    count: jest.fn(),
  };
  return {
    __esModule: true,
    PrismaClient: jest.fn().mockImplementation(() => ({
      actionLog: mockActionLogFuncs, // 関数群を持つオブジェクトを返す
    })),
    // 必要なら Prisma Namespace や Enum もここに
  };
});

// テストケースでモック関数を参照できるように、上で定義したモック関数群を変数に保持
// (jest.mock の後でインポートする必要があるため、require を使う)
const mockActionLog = require('../generated/prisma').PrismaClient().actionLog;

// テスト用の Express アプリケーション設定 (変更なし)
const app = express();
app.use(express.json());
app.use('/', readerActionRoutes);

describe('Reader Action Service API', () => {
  // テストケースごとにモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // POST /actions のテスト
  describe('POST /actions', () => {
    it('有効なブーストアクションで登録できること', async () => {
      const mockCreatedAction = {
        id: 'test-action-id-boost',
        userId: 'user123',
        targetType: 'post',
        targetId: 'post456',
        action: 'BOOST', // Prisma Enum or String
        boostAmount: 100,
        commentText: null,
        sharePlatform: null,
        readDurationSeconds: null,
        createdAt: new Date(),
      };
      mockActionLog.create.mockResolvedValue(mockCreatedAction);
      mockActionLog.count.mockResolvedValue(0);

      const response = await request(app)
        .post('/actions')
        .send({
          userId: 'user123',
          targetType: 'post', // contentId -> targetType, targetId
          targetId: 'post456',
          actionType: 'boost', // ReaderActionType (小文字)
          amount: 100 // payload -> amount
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining({
        id: 'test-action-id-boost',
        userId: 'user123',
        targetType: 'post',
        targetId: 'post456',
        action: 'BOOST',
        boostAmount: 100,
      }));
      // createdAt は toISOString で比較するのが安全
      expect(response.body.createdAt).toBe(mockCreatedAction.createdAt.toISOString());
      expect(mockActionLog.create).toHaveBeenCalledTimes(1);
      expect(mockActionLog.create).toHaveBeenCalledWith({
        data: {
          userId: 'user123',
          targetType: 'post',
          targetId: 'post456',
          action: 'BOOST',
          boostAmount: 100,
          commentText: undefined,
          sharePlatform: undefined,
          readDurationSeconds: undefined,
        },
      });
      expect(mockActionLog.count).not.toHaveBeenCalled(); // Like以外は重複チェックしない
    });

    it('有効なコメントアクションで登録できること', async () => {
      const mockCreatedAction = {
        id: 'test-action-id-comment',
        userId: 'user123',
        targetType: 'post',
        targetId: 'post789',
        action: 'COMMENT',
        boostAmount: null,
        commentText: '素晴らしい作品です！',
        sharePlatform: null,
        readDurationSeconds: null,
        createdAt: new Date(),
      };
      mockActionLog.create.mockResolvedValue(mockCreatedAction);
      mockActionLog.count.mockResolvedValue(0); // 重複チェック用

      const response = await request(app)
        .post('/actions')
        .send({
          userId: 'user123',
          targetType: 'post',
          targetId: 'post789',
          actionType: 'comment', // ReaderActionType (小文字)
          commentText: '素晴らしい作品です！' // payload -> commentText
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining({
        id: 'test-action-id-comment',
        userId: 'user123',
        targetType: 'post',
        targetId: 'post789',
        action: 'COMMENT',
        commentText: '素晴らしい作品です！',
      }));
      expect(response.body.createdAt).toBe(mockCreatedAction.createdAt.toISOString());
      expect(mockActionLog.create).toHaveBeenCalledTimes(1);
      expect(mockActionLog.create).toHaveBeenCalledWith({
        data: {
          userId: 'user123',
          targetType: 'post',
          targetId: 'post789',
          action: 'COMMENT',
          boostAmount: undefined,
          commentText: '素晴らしい作品です！',
          sharePlatform: undefined,
          readDurationSeconds: undefined,
        },
      });
       expect(mockActionLog.count).not.toHaveBeenCalled(); // Like以外は重複チェックしない
    });

    // 旧 Reaction テストは削除または Like テストに修正
    it('有効な Like アクションで登録できること (初回)', async () => {
      const mockCreatedAction = {
        id: 'test-action-id-like',
        userId: 'user123',
        targetType: 'post',
        targetId: 'post101',
        action: 'LIKE',
        boostAmount: null,
        commentText: null,
        sharePlatform: null,
        readDurationSeconds: null,
        createdAt: new Date(),
      };
      mockActionLog.create.mockResolvedValue(mockCreatedAction);
      // Like の重複チェック -> 存在しない (count = 0)
      mockActionLog.count.mockResolvedValue(0);

      const response = await request(app)
        .post('/actions')
        .send({
          userId: 'user123',
          targetType: 'post',
          targetId: 'post101',
          actionType: 'like', // ReaderActionType (小文字)
          // Like には追加フィールドなし
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining({
        id: 'test-action-id-like',
        action: 'LIKE',
      }));
      expect(mockActionLog.count).toHaveBeenCalledTimes(1); // 重複チェックが呼ばれる
      expect(mockActionLog.count).toHaveBeenCalledWith({
        where: {
          userId: 'user123',
          targetType: 'post',
          targetId: 'post101',
          action: 'LIKE',
        },
      });
      expect(mockActionLog.create).toHaveBeenCalledTimes(1); // create も呼ばれる
    });

    it('既に Like されている場合は 409 エラーを返すこと', async () => {
      // Like の重複チェック -> 存在する (count = 1)
      mockActionLog.count.mockResolvedValue(1);

      const response = await request(app)
        .post('/actions')
        .send({
          userId: 'user123',
          targetType: 'post',
          targetId: 'post101',
          actionType: 'like', // ReaderActionType (小文字)
        });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error', '既に Like されています');
      expect(mockActionLog.count).toHaveBeenCalledTimes(1);
      expect(mockActionLog.create).not.toHaveBeenCalled(); // create は呼ばれない
    });


    it('無効なアクションタイプの場合は400エラーを返すこと', async () => {
      const response = await request(app)
        .post('/actions')
        .send({
          userId: 'user123',
          targetType: 'post',
          targetId: 'post456',
          actionType: 'invalid',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', '無効なアクションタイプです');
      expect(mockActionLog.create).not.toHaveBeenCalled();
    });

    it('必須パラメータ (targetId) が不足している場合は400エラーを返すこと', async () => {
      const response = await request(app)
        .post('/actions')
        .send({
          userId: 'user123',
          targetType: 'post',
          // targetId が不足
          actionType: 'boost',
          amount: 100
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', '必須パラメータ (userId, targetType, targetId, actionType) が不足しています');
       expect(mockActionLog.create).not.toHaveBeenCalled();
    });

    it('Boost アクションで amount が不足している場合は 400 エラーを返すこと', async () => {
        const response = await request(app)
          .post('/actions')
          .send({
            userId: 'user123',
            targetType: 'post',
            targetId: 'post456',
            actionType: 'boost',
            // amount がない
          });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Boostアクションには amount (数値) が必要です');
        expect(mockActionLog.create).not.toHaveBeenCalled();
    });

    // TODO: comment, share の必須フィールド不足テストも追加
  });

  // GET /users/:userId/actions のテスト (旧 GET /actions?userId=...)
  describe('GET /users/:userId/actions', () => {
    it('指定したユーザーのアクション一覧を取得できること', async () => {
      const mockActions = [
        { id: 'a1', userId: 'user123', targetType: 'post', targetId: 'p1', action: 'LIKE', createdAt: new Date() },
        { id: 'a2', userId: 'user123', targetType: 'post', targetId: 'p2', action: 'READ', createdAt: new Date(Date.now() - 10000) },
      ];
      mockActionLog.findMany.mockResolvedValue(mockActions);

      const response = await request(app)
        .get('/users/user123/actions'); // パスパラメータに変更

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0].id).toBe('a1');
      expect(response.body[1].userId).toBe('user123');
      expect(mockActionLog.findMany).toHaveBeenCalledTimes(1);
      expect(mockActionLog.findMany).toHaveBeenCalledWith({
        where: { userId: 'user123' },
        orderBy: { createdAt: 'desc' },
      });
    });

    // TODO: ユーザーが存在しない場合などのテスト
  });

  // GET /posts/:targetId/actions のテスト (旧 GET /actions?contentId=...)
  describe('GET /posts/:targetId/actions', () => {
    it('指定した投稿のアクション一覧を取得できること', async () => {
      const mockActions = [
        { id: 'a3', userId: 'user123', targetType: 'post', targetId: 'post456', action: 'BOOST', createdAt: new Date(), boostAmount: 50 },
        { id: 'a4', userId: 'user777', targetType: 'post', targetId: 'post456', action: 'COMMENT', createdAt: new Date(Date.now() - 5000), commentText: 'いいね！' },
      ];
      mockActionLog.findMany.mockResolvedValue(mockActions);

      const response = await request(app)
        .get('/posts/post456/actions'); // パスパラメータに変更

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0].targetId).toBe('post456');
      expect(response.body[1].targetType).toBe('post');
      expect(mockActionLog.findMany).toHaveBeenCalledTimes(1);
      expect(mockActionLog.findMany).toHaveBeenCalledWith({
        where: { targetType: 'post', targetId: 'post456' },
        orderBy: { createdAt: 'desc' },
      });
    });
     // TODO: ターゲットが存在しない場合などのテスト
  });


  // GET /actions/:id のテスト (旧 GET /actions/:actionId)
  describe('GET /actions/:id', () => {
    it('存在するアクションIDでアクションを取得できること', async () => {
      const mockAction = {
        id: 'test-action-unique',
        userId: 'user123',
        targetType: 'post',
        targetId: 'post456',
        action: 'LIKE',
        createdAt: new Date(),
      };
      mockActionLog.findUnique.mockResolvedValue(mockAction);

      const response = await request(app)
        .get(`/actions/test-action-unique`); // パスを /:id に変更

      expect(response.status).toBe(200);
      expect(response.body.id).toBe('test-action-unique'); // actionId -> id
      expect(response.body.userId).toBe('user123');
      expect(mockActionLog.findUnique).toHaveBeenCalledTimes(1);
      expect(mockActionLog.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-action-unique' },
      });
    });

    it('存在しないアクションIDの場合は404エラーを返すこと', async () => {
      mockActionLog.findUnique.mockResolvedValue(null); // 存在しない場合は null を返す

      const response = await request(app)
        .get('/actions/nonexistent-id');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'アクションが見つかりません');
      expect(mockActionLog.findUnique).toHaveBeenCalledTimes(1);
      expect(mockActionLog.findUnique).toHaveBeenCalledWith({
        where: { id: 'nonexistent-id' },
      });
    });
  });
}); 