import request from 'supertest';
import app from '../src/index';
import { PortfolioService } from '../src/services/portfolio-service';
import { PortfolioModel } from '../src/models/portfolio';

// モックを使用
jest.mock('../src/services/portfolio-service');
jest.mock('../src/models/db', () => {
  return {
    __esModule: true,
    default: {
      query: jest.fn(),
    },
    initializeDatabase: jest.fn().mockResolvedValue(undefined),
  };
});

describe('Portfolio API', () => {
  // 各テスト前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /portfolios/:userId', () => {
    test('正常: 存在するユーザーのポートフォリオを取得できる', async () => {
      // モックの戻り値を設定
      const mockPortfolio = {
        userId: 'user123',
        entries: [
          {
            actionType: 'boost',
            contentId: 'content123',
            timestamp: '2025-04-13T00:00:00Z',
          },
          {
            actionType: 'save',
            contentId: 'content456',
            timestamp: '2025-04-13T01:00:00Z',
          },
        ],
      };

      // PortfolioServiceのgetUserPortfolioメソッドをモック
      (PortfolioService.prototype.getUserPortfolio as jest.Mock).mockResolvedValue(mockPortfolio);

      // APIリクエスト
      const response = await request(app).get('/portfolios/user123');

      // 検証
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPortfolio);
      expect(PortfolioService.prototype.getUserPortfolio).toHaveBeenCalledWith('user123');
    });

    test('異常: 存在しないユーザーの場合は404を返す', async () => {
      // PortfolioServiceのgetUserPortfolioメソッドをモック
      (PortfolioService.prototype.getUserPortfolio as jest.Mock).mockResolvedValue(null);

      // APIリクエスト
      const response = await request(app).get('/portfolios/nonexistent');

      // 検証
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(PortfolioService.prototype.getUserPortfolio).toHaveBeenCalledWith('nonexistent');
    });
  });

  describe('POST /portfolios/:userId/sync', () => {
    test('正常: ユーザーのポートフォリオを同期できる', async () => {
      // エントリーデータ
      const entries = [
        {
          actionType: 'boost',
          contentId: 'content123',
          timestamp: '2025-04-13T00:00:00Z',
        },
      ];

      // PortfolioServiceのsyncUserActionsメソッドをモック
      (PortfolioService.prototype.syncUserActions as jest.Mock).mockResolvedValue(1);

      // APIリクエスト
      const response = await request(app)
        .post('/portfolios/user123/sync')
        .send({ entries });

      // 検証
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        userId: 'user123',
        syncedCount: 1,
      });
      expect(PortfolioService.prototype.syncUserActions).toHaveBeenCalledWith('user123', entries);
    });

    test('異常: 存在しないユーザーの場合でも同期は実行される（新規作成扱い）', async () => {
      // エントリーデータ
      const entries = [
        {
          actionType: 'boost',
          contentId: 'content123',
          timestamp: '2025-04-13T00:00:00Z',
        },
      ];

      // PortfolioServiceのsyncUserActionsメソッドをモック
      (PortfolioService.prototype.syncUserActions as jest.Mock).mockResolvedValue(1);

      // APIリクエスト
      const response = await request(app)
        .post('/portfolios/newuser/sync')
        .send({ entries });

      // 検証
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        userId: 'newuser',
        syncedCount: 1,
      });
      expect(PortfolioService.prototype.syncUserActions).toHaveBeenCalledWith('newuser', entries);
    });

    test('異常: 無効なリクエストボディの場合は400を返す', async () => {
      // APIリクエスト（entries未設定）
      const response = await request(app)
        .post('/portfolios/user123/sync')
        .send({});

      // 検証
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(PortfolioService.prototype.syncUserActions).not.toHaveBeenCalled();
    });
  });
}); 