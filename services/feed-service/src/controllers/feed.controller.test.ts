import { Request, Response } from 'express';
import { FeedController } from './feed.controller';
import { FeedService } from '../services/feed.service';
import { UserId } from '@shared/schema';

// FeedService のモック化をやめる
// const mockGenerateFeed = jest.fn();
// jest.mock('../services/feed.service', ...);

describe('FeedController', () => {
  let feedController: FeedController;
  let mockFeedServiceInstance: FeedService; // 実際のインスタンス
  let generateFeedSpy: jest.SpyInstance; // スパイ
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;
  let errorSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;

  const mockFeedResult = {
    feedId: 'feed-ctrl-test',
    items: [{ postId: 'post-ctrl-1', title: 'Ctrl Test Post', score: 101 }]
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // 実際の FeedService インスタンスを作成
    mockFeedServiceInstance = new FeedService();
    // generateFeed メソッドをスパイしてモック化
    generateFeedSpy = jest.spyOn(mockFeedServiceInstance, 'generateFeed')
                          .mockResolvedValue(mockFeedResult);

    // Express モック
    responseJson = jest.fn().mockReturnValue({});
    responseStatus = jest.fn().mockReturnThis();
    mockResponse = {
      json: responseJson,
      status: responseStatus
    };

    // モックサービスを注入してコントローラーをインスタンス化
    feedController = new FeedController(mockFeedServiceInstance);

    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

   afterEach(() => {
      // スパイをリストア
      generateFeedSpy.mockRestore();
      errorSpy.mockRestore();
      warnSpy.mockRestore();
  });

  describe('generateFeedForUser', () => {
    it('有効なユーザーIDでフィードを生成できること', async () => {
      const userId: UserId = 'user-123';
      mockRequest = { body: { userId: userId } };
      await feedController.generateFeedForUser(mockRequest as Request, mockResponse as Response);
      // スパイが呼ばれたか確認
      expect(generateFeedSpy).toHaveBeenCalledWith(userId);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(mockFeedResult);
    });

    it('ユーザーIDがない場合は400エラーを返すこと', async () => {
      mockRequest = { body: {} };
      await feedController.generateFeedForUser(mockRequest as Request, mockResponse as Response);
      // スパイが呼ばれないことを確認
      expect(generateFeedSpy).not.toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ error: expect.stringContaining('ユーザーID (userId) が必要') });
    });

    it('サービスでエラーが発生した場合、500エラーを返すこと', async () => {
      const userId: UserId = 'user-error';
      mockRequest = { body: { userId: userId } };
      const errorMessage = 'Service internal error';
      // スパイがエラーを reject するように設定
      generateFeedSpy.mockRejectedValueOnce(new Error(errorMessage));
      await feedController.generateFeedForUser(mockRequest as Request, mockResponse as Response);
      expect(generateFeedSpy).toHaveBeenCalledWith(userId);
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: expect.stringContaining('フィード生成中にエラーが発生') });
    });
  });
});
