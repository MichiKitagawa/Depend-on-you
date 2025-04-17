import request from 'supertest';
import app from './app';
import Feed from './models/feed.model';

// Feedモデルをモック
jest.mock('./models/feed.model');
const mockFeed = Feed as jest.Mocked<any>;

// ランキングサービスのモック（axios）
jest.mock('axios', () => ({
  get: jest.fn().mockResolvedValue({
    data: {
      items: [
        { contentId: 'content-1', score: 95 },
        { contentId: 'content-2', score: 85 }
      ]
    }
  })
}));

describe('Feed API Integration Tests', () => {
  const mockUserId = 'user-123';
  const mockFeedId = 'feed-123';
  const mockContentList = [
    { contentId: 'content-1', scoreValue: 95 },
    { contentId: 'content-2', scoreValue: 85 }
  ];
  const mockDate = new Date('2025-01-01');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /feeds/generate', () => {
    it('正常: 有効なユーザーIDでフィード生成', async () => {
      // Feedモデルのcreateのモック
      mockFeed.create.mockResolvedValueOnce({
        feed_id: mockFeedId,
        user_id: mockUserId,
        content_list: mockContentList,
        generated_at: mockDate
      });

      const response = await request(app)
        .post('/feeds/generate')
        .send({ userId: mockUserId })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('feedId', mockFeedId);
      expect(response.body).toHaveProperty('userId', mockUserId);
      expect(response.body).toHaveProperty('contentList');
      expect(response.body).toHaveProperty('generatedAt');
    });

    it('異常: ユーザーIDなしでリクエスト -> 400エラー', async () => {
      const response = await request(app)
        .post('/feeds/generate')
        .send({})
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /feeds/:feedId', () => {
    it('正常: 指定フィードIDのフィード取得', async () => {
      mockFeed.findOne.mockResolvedValueOnce({
        feed_id: mockFeedId,
        user_id: mockUserId,
        content_list: mockContentList,
        generated_at: mockDate
      });

      const response = await request(app)
        .get(`/feeds/${mockFeedId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('feedId', mockFeedId);
      expect(response.body).toHaveProperty('userId', mockUserId);
      expect(response.body).toHaveProperty('contentList');
      expect(response.body).toHaveProperty('generatedAt');
    });

    it('異常: 存在しないフィードID -> 404エラー', async () => {
      mockFeed.findOne.mockResolvedValueOnce(null);

      await request(app)
        .get('/feeds/non-existent')
        .expect('Content-Type', /json/)
        .expect(404);
    });
  });

  describe('GET /feeds/latest?userId=xxx', () => {
    it('正常: 指定ユーザーIDの最新フィード取得', async () => {
      mockFeed.findOne.mockResolvedValueOnce({
        feed_id: mockFeedId,
        user_id: mockUserId,
        content_list: mockContentList,
        generated_at: mockDate
      });

      const response = await request(app)
        .get(`/feeds/latest?userId=${mockUserId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('feedId', mockFeedId);
      expect(response.body).toHaveProperty('userId', mockUserId);
      expect(response.body).toHaveProperty('contentList');
      expect(response.body).toHaveProperty('generatedAt');
    });

    it('異常: ユーザーIDなしでリクエスト -> 400エラー', async () => {
      await request(app)
        .get('/feeds/latest')
        .expect('Content-Type', /json/)
        .expect(400);
    });

    it('異常: 存在しないユーザーID -> 新規フィードを生成', async () => {
      // 検索時はnullを返し、createでは新しいフィードを返す
      mockFeed.findOne.mockResolvedValueOnce(null);
      mockFeed.create.mockResolvedValueOnce({
        feed_id: mockFeedId,
        user_id: mockUserId,
        content_list: mockContentList,
        generated_at: mockDate
      });

      const response = await request(app)
        .get(`/feeds/latest?userId=${mockUserId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('feedId', mockFeedId);
      expect(response.body).toHaveProperty('userId', mockUserId);
    });
  });
}); 