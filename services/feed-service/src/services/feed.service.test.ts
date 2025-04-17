import axios from 'axios';
import { FeedService } from './feed.service';
import Feed from '../models/feed.model';

// モックの設定
jest.mock('axios');
jest.mock('../models/feed.model');

const mockAxios = axios as jest.Mocked<typeof axios>;
const mockFeed = Feed as jest.Mocked<any>;

describe('FeedService', () => {
  let feedService: FeedService;
  const mockUserId = 'user-123';
  const mockFeedId = 'feed-123';
  const mockContentList = [
    { contentId: 'content-1', scoreValue: 95 },
    { contentId: 'content-2', scoreValue: 85 }
  ];
  const mockDate = new Date('2025-01-01');

  beforeEach(() => {
    feedService = new FeedService();
    jest.clearAllMocks();
  });

  describe('generateFeed', () => {
    it('ユーザーIDからフィードを生成できること', async () => {
      // ランキングサービスのモック
      mockAxios.get.mockResolvedValueOnce({
        data: {
          items: [
            { contentId: 'content-1', score: 95 },
            { contentId: 'content-2', score: 85 }
          ]
        }
      });

      // Feedモデルのcreateのモック
      mockFeed.create.mockResolvedValueOnce({
        feed_id: mockFeedId,
        user_id: mockUserId,
        content_list: mockContentList,
        generated_at: mockDate
      });

      const result = await feedService.generateFeed(mockUserId);

      expect(mockAxios.get).toHaveBeenCalledWith(expect.stringContaining('/rankings/latest'));
      expect(mockFeed.create).toHaveBeenCalledWith({
        user_id: mockUserId,
        content_list: expect.any(Array)
      });
      expect(result).toEqual({
        feedId: mockFeedId,
        userId: mockUserId,
        contentList: mockContentList,
        generatedAt: mockDate
      });
    });

    it('ランキングサービスでエラーが発生した場合、例外をスローすること', async () => {
      mockAxios.get.mockRejectedValueOnce(new Error('ランキングサービスエラー'));
      
      await expect(feedService.generateFeed(mockUserId)).rejects.toThrow();
    });
  });

  describe('getFeedById', () => {
    it('指定IDのフィードを取得できること', async () => {
      mockFeed.findOne.mockResolvedValueOnce({
        feed_id: mockFeedId,
        user_id: mockUserId,
        content_list: mockContentList,
        generated_at: mockDate
      });

      const result = await feedService.getFeedById(mockFeedId);

      expect(mockFeed.findOne).toHaveBeenCalledWith({
        where: { feed_id: mockFeedId }
      });
      expect(result).toEqual({
        feedId: mockFeedId,
        userId: mockUserId,
        contentList: mockContentList,
        generatedAt: mockDate
      });
    });

    it('存在しないフィードIDの場合、例外をスローすること', async () => {
      mockFeed.findOne.mockResolvedValueOnce(null);
      
      await expect(feedService.getFeedById('non-existent')).rejects.toThrow('指定されたフィードが見つかりません');
    });
  });

  describe('getLatestFeedByUserId', () => {
    it('ユーザーの最新フィードを取得できること', async () => {
      mockFeed.findOne.mockResolvedValueOnce({
        feed_id: mockFeedId,
        user_id: mockUserId,
        content_list: mockContentList,
        generated_at: mockDate
      });

      const result = await feedService.getLatestFeedByUserId(mockUserId);

      expect(mockFeed.findOne).toHaveBeenCalledWith({
        where: { user_id: mockUserId },
        order: [['generated_at', 'DESC']]
      });
      expect(result).toEqual({
        feedId: mockFeedId,
        userId: mockUserId,
        contentList: mockContentList,
        generatedAt: mockDate
      });
    });

    it('フィードが存在しない場合は新しいフィードを生成すること', async () => {
      // フィード検索で結果がない
      mockFeed.findOne.mockResolvedValueOnce(null);
      
      // ランキングサービスのモック
      mockAxios.get.mockResolvedValueOnce({
        data: {
          items: [
            { contentId: 'content-1', score: 95 },
            { contentId: 'content-2', score: 85 }
          ]
        }
      });

      // 新しいフィード作成のモック
      mockFeed.create.mockResolvedValueOnce({
        feed_id: mockFeedId,
        user_id: mockUserId,
        content_list: mockContentList,
        generated_at: mockDate
      });

      const result = await feedService.getLatestFeedByUserId(mockUserId);

      expect(mockFeed.findOne).toHaveBeenCalled();
      expect(mockAxios.get).toHaveBeenCalled();
      expect(mockFeed.create).toHaveBeenCalled();
      expect(result).toEqual({
        feedId: mockFeedId,
        userId: mockUserId,
        contentList: mockContentList,
        generatedAt: mockDate
      });
    });
  });
}); 