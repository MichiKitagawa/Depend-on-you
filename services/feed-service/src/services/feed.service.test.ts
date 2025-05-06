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
  let errorSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;
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
    'post-followed-1': { id: 'post-followed-1', title: 'Followed Post 1', authorId: 'user-author-2' },
    'post-ignored': { id: 'post-ignored', title: 'Ignored Post', authorId: 'user-other' }
  };
  // TODO: フォローしているユーザーの投稿データモック

  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mocks before each test
    feedService = new FeedService();
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

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

  afterEach(() => {
    errorSpy.mockRestore();
    warnSpy.mockRestore();
  });

  describe('generateFeed', () => {
    it.skip('ランキング、コンテンツ、フォロー情報を元にフィードを生成できること', async () => {
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

       // フォローしているユーザーの投稿が含まれているか確認
       // TODO: generateFeed の実装がフォローユーザー投稿に対応したらコメントアウト解除
       /*
       const followedItem = result.items.find(item => item.postId === 'post-followed-1');
       expect(followedItem).toBeDefined();
       expect(followedItem?.title).toBe('Followed Post 1');
       expect(followedItem?.authorId).toBe('user-author-2');
       expect(followedItem?.reason).toBe('following'); // 理由は 'following' になる想定
       */

       // 関係ない投稿が含まれていないか確認
       const ignoredItem = result.items.find(item => item.postId === 'post-ignored');
       expect(ignoredItem).toBeUndefined();

       // TODO: フォローしているユーザーの投稿が適切に含まれるかのテストを追加
       // TODO: エラーケースのテストを追加 (各API呼び出し失敗時など)
    });

    it('依存サービスでエラーが発生した場合、エラーをスローすること', async () => {
        mockAxios.get.mockRejectedValueOnce(new Error('Ranking service down'));
        await expect(feedService.generateFeed(mockUserId)).rejects.toThrow();
    });

    it('ランキングサービスへの接続に失敗した場合、エラーをスローすること', async () => {
        mockAxios.get.mockImplementation(async (url: string) => {
            if (url.includes('/rankings')) throw new Error('Ranking Service Unavailable');
            if (url.includes('/following')) return { data: { following: mockFollowingData } };
            if (url.includes('/posts')) return { data: [] };
            throw new Error('Unexpected URL');
        });
        await expect(feedService.generateFeed(mockUserId)).rejects.toThrow('Ranking Service Unavailable');
    });

    it.skip('ユーザーサービス(following)への接続に失敗した場合、エラーをスローすること', async () => {
        mockAxios.get.mockImplementation(async (url: string) => {
            if (url.includes('/rankings')) return { data: mockRankingData };
            if (url.includes('/following')) throw new Error('User Service Unavailable');
            if (url.includes('/posts')) return { data: [] };
            throw new Error('Unexpected URL');
        });
        await expect(feedService.generateFeed(mockUserId)).rejects.toThrow('User Service Unavailable');
    });

    it.skip('コンテンツサービスへの接続に失敗した場合、エラーをスローすること', async () => {
        mockAxios.get.mockImplementation(async (url: string) => {
            if (url.includes('/rankings')) return { data: mockRankingData };
            if (url.includes('/following')) return { data: { following: mockFollowingData } };
            if (url.includes('/posts')) throw new Error('Content Service Unavailable');
            throw new Error('Unexpected URL');
        });
        await expect(feedService.generateFeed(mockUserId)).rejects.toThrow('Content Service Unavailable');
    });

  });

  // getFeedById, getLatestFeedByUserId のテストは削除
}); 