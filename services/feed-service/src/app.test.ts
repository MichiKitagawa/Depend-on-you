import request from 'supertest';
import app from './app';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { UserId, PostID } from '@shared/schema';

// axios をモック化
jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

describe('Feed API Endpoints', () => {
  const mockUserId: UserId = 'user-test-123';

  // axios が返す想定のモックデータ
  const mockRankingData = [{ postId: 'post-api-1', score: 99, rank: 1 }];
  const mockFollowingData: UserId[] = [];
  const mockPostDetailsData: Record<string, any> = {
      'post-api-1': { id: 'post-api-1', title: 'API Test Post 1', authorId: 'author-api-test' }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // axios のモック実装 (成功ケース)
    mockAxios.get.mockImplementation(async (url: string, config?: any) => {
        if (url.includes('/rankings')) return { data: mockRankingData };
        if (url.includes('/following')) return { data: { following: mockFollowingData } };
        if (url.includes('/posts') && config?.params?.postIds) {
            const requestedIds = config.params.postIds.split(',');
            const responseData = requestedIds.map((id: string) => mockPostDetailsData[id]).filter(Boolean);
            return { data: responseData };
        }
        throw new Error(`Unexpected axios GET request to ${url}`);
    });
  });

  describe('POST /feeds/user', () => {
    it('正常: 有効なユーザーIDでフィードが生成され、200 OK とフィードアイテムが返される', async () => {
      const response = await request(app)
        .post('/feeds/user')
        .send({ userId: mockUserId })
        .expect('Content-Type', /json/)
        .expect(200);

      // レスポンスの内容を検証 (axios のモックに基づく期待値)
      expect(response.body).toHaveProperty('feedId');
      expect(response.body).toHaveProperty('items');
      expect(Array.isArray(response.body.items)).toBe(true);
      expect(response.body.items.length).toBeGreaterThan(0);
      expect(response.body.items[0]).toMatchObject({
          postId: 'post-api-1',
          title: 'API Test Post 1',
          score: 99,
          authorId: 'author-api-test'
      });
      // axios が呼ばれたことを確認
      expect(mockAxios.get).toHaveBeenCalledTimes(3); // rankings, following, posts
    });

    it('異常: ユーザーIDなしでリクエスト -> 400エラー', async () => {
      const response = await request(app)
        .post('/feeds/user')
        .send({})
        .expect('Content-Type', /json/)
        .expect(400);
      expect(response.body).toEqual({ error: 'ユーザーID (userId) が必要です' });
      expect(mockAxios.get).not.toHaveBeenCalled();
    });

    it('異常: 依存サービスエラー時 (axios reject) -> 500エラー', async () => {
        // axios.get が reject するように設定
        mockAxios.get.mockRejectedValueOnce(new Error('Internal Service Error'));

        const response = await request(app)
            .post('/feeds/user')
            .send({ userId: mockUserId })
            .expect('Content-Type', /json/)
            .expect(500);

        expect(response.body).toEqual({ error: 'フィード生成中にエラーが発生しました' });
        // axios.get が少なくとも1回は呼ばれるはず
        expect(mockAxios.get).toHaveBeenCalled();
    });
  });
}); 