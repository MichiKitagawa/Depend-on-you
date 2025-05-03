import axios from 'axios';
import { FeedService } from './feed.service';
import { v4 as uuidv4 } from 'uuid';
import { PostID, UserId } from '@shared/schema';

// axios をモック化
jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

// Sequelize Feed モデルのモックは不要
// jest.mock('../models/feed.model');
// const mockFeed = Feed as jest.Mocked<any>;

describe('FeedService', () => {
  let feedService: FeedService;
  const mockUserId: UserId = 'user-123';

  // モックデータの準備
  const mockRankingData = [
    { postId: 'post-ranked-1', score: 95.5, rank: 1 },
    { postId: 'post-ranked-2', score: 88.1, rank: 2 },
  ];
  const mockFollowingData = ['user-author-1', 'user-author-2'];
  const mockPostDetailsData: Record<string, any> = {
    'post-ranked-1': { id: 'post-ranked-1', title: 'Ranked Post 1', authorId: 'user-author-3' },
    'post-ranked-2': { id: 'post-ranked-2', title: 'Ranked Post 2', authorId: 'user-author-1' },
    // フォローしているユーザーの投稿なども含める想定
  };
  // TODO: フォローしているユーザーの投稿データモック

  beforeEach(() => {
    feedService = new FeedService();
    jest.clearAllMocks();

    // axios.get のデフォルトモックを設定 (各テストで上書き可能)
    mockAxios.get.mockImplementation(async (url: string, config?: any) => {
      if (url.includes('/rankings')) {
        return { data: mockRankingData };
      }
      if (url.includes('/following')) {
        return { data: { following: mockFollowingData } };
      }
      if (url.includes('/posts') && config?.params?.postIds) {
         // リクエストされた postIds に基づいてモックデータをフィルタリングして返す
         const requestedIds = config.params.postIds.split(',');
         const responseData = requestedIds.map((id: string) => mockPostDetailsData[id]).filter(Boolean);
        return { data: responseData };
      }
      // 他の予期しないリクエストはエラーを返す
      throw new Error(`Unexpected axios GET request to ${url}`);
    });
  });

  describe('generateFeed', () => {
    it('ランキング、コンテンツ、フォロー情報を元にフィードを生成できること', async () => {
      const result = await feedService.generateFeed(mockUserId);

      // 各サービスへの API コールが行われたか確認
      expect(mockAxios.get).toHaveBeenCalledWith(expect.stringContaining('/rankings'), expect.any(Object));
      expect(mockAxios.get).toHaveBeenCalledWith(expect.stringContaining(`/users/${mockUserId}/following`));
      // 取得した postId リストで /posts が呼ばれるか確認
      const expectedPostIds = mockRankingData.map(r => r.postId).join(',');
      expect(mockAxios.get).toHaveBeenCalledWith(expect.stringContaining('/posts'), {
          params: { postIds: expectedPostIds }
      });

      // 結果の検証
      expect(result).toHaveProperty('feedId');
      expect(result).toHaveProperty('items');
      expect(Array.isArray(result.items)).toBe(true);
      // ランキング上位の投稿が含まれているか (詳細情報とマージされているか)
      const rankedItem1 = result.items.find(item => item.postId === 'post-ranked-1');
      expect(rankedItem1).toBeDefined();
      expect(rankedItem1?.title).toBe('Ranked Post 1');
      expect(rankedItem1?.authorId).toBe('user-author-3');
      expect(rankedItem1?.score).toBe(95.5);
      expect(rankedItem1?.reason).toBe('ranking');

      const rankedItem2 = result.items.find(item => item.postId === 'post-ranked-2');
       expect(rankedItem2).toBeDefined();
       expect(rankedItem2?.title).toBe('Ranked Post 2');
       expect(rankedItem2?.authorId).toBe('user-author-1'); // フォローしているユーザーの投稿でもある
       expect(rankedItem2?.score).toBe(88.1);
       expect(rankedItem2?.reason).toBe('ranking');

       // TODO: フォローしているユーザーの投稿が適切に含まれるかのテストを追加
       // TODO: エラーケースのテストを追加 (各API呼び出し失敗時など)
    });

    it('依存サービスでエラーが発生した場合、エラーをスローすること', async () => {
        mockAxios.get.mockRejectedValueOnce(new Error('Ranking service down'));
        // generateFeed がエラーをスローすることを期待
        await expect(feedService.generateFeed(mockUserId)).rejects.toThrow();
        // catch ブロックで空を返さなくなったため、以下の検証は不要
        // expect(result).toHaveProperty('feedId');
        // expect(result.items).toEqual([]);
    });
  });

  // getFeedById, getLatestFeedByUserId のテストは削除
}); 