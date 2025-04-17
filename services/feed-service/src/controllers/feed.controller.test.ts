import { Request, Response } from 'express';
import { FeedController } from './feed.controller';
import { FeedService } from '../services/feed.service';

// FeedServiceのモック
jest.mock('../services/feed.service');

describe('FeedController', () => {
  let feedController: FeedController;
  let mockFeedService: jest.Mocked<FeedService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  const mockFeedData = {
    feedId: 'feed-123',
    userId: 'user-123',
    contentList: [{ contentId: 'content-1', scoreValue: 95 }],
    generatedAt: new Date('2025-01-01')
  };

  beforeEach(() => {
    // モックのリセット
    jest.clearAllMocks();
    
    // FeedServiceのモックインスタンス
    mockFeedService = {
      generateFeed: jest.fn(),
      getFeedById: jest.fn(),
      getLatestFeedByUserId: jest.fn()
    } as unknown as jest.Mocked<FeedService>;

    // コンストラクタ内で生成されるFeedServiceをモックに置き換える
    jest.spyOn(FeedService.prototype, 'generateFeed').mockImplementation(mockFeedService.generateFeed);
    jest.spyOn(FeedService.prototype, 'getFeedById').mockImplementation(mockFeedService.getFeedById);
    jest.spyOn(FeedService.prototype, 'getLatestFeedByUserId').mockImplementation(mockFeedService.getLatestFeedByUserId);

    // Expressのリクエスト/レスポンスモック
    responseJson = jest.fn().mockReturnValue({});
    responseStatus = jest.fn().mockReturnThis();
    
    mockResponse = {
      json: responseJson,
      status: responseStatus
    };
    
    // コントローラーの初期化
    feedController = new FeedController();
  });

  describe('generateFeed', () => {
    it('有効なユーザーIDでフィードを生成できること', async () => {
      mockRequest = {
        body: { userId: 'user-123' }
      };

      mockFeedService.generateFeed.mockResolvedValueOnce(mockFeedData);

      await feedController.generateFeed(mockRequest as Request, mockResponse as Response);

      expect(mockFeedService.generateFeed).toHaveBeenCalledWith('user-123');
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(mockFeedData);
    });

    it('ユーザーIDがない場合は400エラーを返すこと', async () => {
      mockRequest = {
        body: {}
      };

      await feedController.generateFeed(mockRequest as Request, mockResponse as Response);

      expect(mockFeedService.generateFeed).not.toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ error: expect.any(String) });
    });
  });

  describe('getFeedById', () => {
    it('有効なフィードIDでフィードを取得できること', async () => {
      mockRequest = {
        params: { feedId: 'feed-123' }
      };

      mockFeedService.getFeedById.mockResolvedValueOnce(mockFeedData);

      await feedController.getFeedById(mockRequest as Request, mockResponse as Response);

      expect(mockFeedService.getFeedById).toHaveBeenCalledWith('feed-123');
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(mockFeedData);
    });

    it('存在しないフィードIDの場合は404エラーを返すこと', async () => {
      mockRequest = {
        params: { feedId: 'non-existent' }
      };

      mockFeedService.getFeedById.mockRejectedValueOnce(new Error('指定されたフィードが見つかりません'));

      await feedController.getFeedById(mockRequest as Request, mockResponse as Response);

      expect(mockFeedService.getFeedById).toHaveBeenCalledWith('non-existent');
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ error: expect.any(String) });
    });
  });

  describe('getLatestFeedByUserId', () => {
    it('有効なユーザーIDで最新フィードを取得できること', async () => {
      mockRequest = {
        query: { userId: 'user-123' }
      };

      mockFeedService.getLatestFeedByUserId.mockResolvedValueOnce(mockFeedData);

      await feedController.getLatestFeedByUserId(mockRequest as Request, mockResponse as Response);

      expect(mockFeedService.getLatestFeedByUserId).toHaveBeenCalledWith('user-123');
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(mockFeedData);
    });

    it('ユーザーIDがない場合は400エラーを返すこと', async () => {
      mockRequest = {
        query: {}
      };

      await feedController.getLatestFeedByUserId(mockRequest as Request, mockResponse as Response);

      expect(mockFeedService.getLatestFeedByUserId).not.toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ error: expect.any(String) });
    });

    it('ユーザーのフィードが存在しない場合は404エラーを返すこと', async () => {
      mockRequest = {
        query: { userId: 'user-123' }
      };

      mockFeedService.getLatestFeedByUserId.mockRejectedValueOnce(new Error('ユーザーのフィードが見つかりません'));

      await feedController.getLatestFeedByUserId(mockRequest as Request, mockResponse as Response);

      expect(mockFeedService.getLatestFeedByUserId).toHaveBeenCalledWith('user-123');
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ error: expect.any(String) });
    });
  });
}); 