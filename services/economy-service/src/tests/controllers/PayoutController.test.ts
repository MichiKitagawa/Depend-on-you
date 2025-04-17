import { Request, Response } from 'express';
import PayoutController from '../../controllers/PayoutController';
import PayoutService from '../../services/PayoutService';

// モックの設定
jest.mock('../../services/PayoutService', () => ({
  createPayout: jest.fn(),
  getPayoutsByUserId: jest.fn(),
  getPayoutsByContentId: jest.fn()
}));

describe('PayoutController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    // リクエストとレスポンスのモック設定
    responseJson = jest.fn().mockReturnThis();
    responseStatus = jest.fn().mockReturnValue({ json: responseJson });
    
    mockRequest = {};
    mockResponse = {
      status: responseStatus,
      json: responseJson
    };

    jest.clearAllMocks();
  });

  describe('createPayout', () => {
    it('should create a new payout record', async () => {
      // テストデータ
      const payoutData = {
        userId: 'user123',
        contentId: 'content456',
        payoutReason: 'rankingReward',
        points: 100
      };
      
      // リクエストボディの設定
      mockRequest.body = payoutData;
      
      // サービス関数のモック実装
      const mockPayoutResponse = {
        payoutId: 'test-id',
        userId: 'user123',
        contentId: 'content456',
        payoutReason: 'rankingReward',
        points: 100
      };
      
      (PayoutService.createPayout as jest.Mock).mockResolvedValue(mockPayoutResponse);

      // コントローラーメソッド実行
      await PayoutController.createPayout(mockRequest as Request, mockResponse as Response);

      // 検証
      expect(PayoutService.createPayout).toHaveBeenCalledWith(payoutData);
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith(mockPayoutResponse);
    });

    it('should return 400 if userId is missing', async () => {
      // 不正なデータ
      mockRequest.body = {
        contentId: 'content456',
        payoutReason: 'rankingReward',
        points: 100
      };

      // コントローラーメソッド実行
      await PayoutController.createPayout(mockRequest as Request, mockResponse as Response);

      // 検証
      expect(PayoutService.createPayout).not.toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ error: 'Invalid or missing userId' });
    });

    it('should return 400 if points is invalid', async () => {
      // 不正なデータ
      mockRequest.body = {
        userId: 'user123',
        contentId: 'content456',
        payoutReason: 'rankingReward',
        points: -50
      };

      // コントローラーメソッド実行
      await PayoutController.createPayout(mockRequest as Request, mockResponse as Response);

      // 検証
      expect(PayoutService.createPayout).not.toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ error: 'Points must be a positive number' });
    });
  });

  describe('getPayoutsByUserId', () => {
    it('should get payouts by userId', async () => {
      // クエリパラメータの設定
      const userId = 'user123';
      mockRequest.query = { userId };
      
      // サービス関数のモック実装
      const mockPayoutsResponse = [
        {
          payoutId: 'payout1',
          userId,
          contentId: 'content1',
          payoutReason: 'rankingReward',
          points: 100
        },
        {
          payoutId: 'payout2',
          userId,
          contentId: 'content2',
          payoutReason: 'contribution',
          points: 200
        }
      ];
      
      (PayoutService.getPayoutsByUserId as jest.Mock).mockResolvedValue(mockPayoutsResponse);

      // コントローラーメソッド実行
      await PayoutController.getPayoutsByUserId(mockRequest as Request, mockResponse as Response);

      // 検証
      expect(PayoutService.getPayoutsByUserId).toHaveBeenCalledWith(userId);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(mockPayoutsResponse);
    });

    it('should return empty array if no payouts found', async () => {
      // クエリパラメータの設定
      const userId = 'nonexistentUser';
      mockRequest.query = { userId };
      
      // サービス関数のモック実装
      (PayoutService.getPayoutsByUserId as jest.Mock).mockResolvedValue([]);

      // コントローラーメソッド実行
      await PayoutController.getPayoutsByUserId(mockRequest as Request, mockResponse as Response);

      // 検証
      expect(PayoutService.getPayoutsByUserId).toHaveBeenCalledWith(userId);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith([]);
    });

    it('should return 400 if userId is missing', async () => {
      // 不正なクエリパラメータ
      mockRequest.query = {};

      // コントローラーメソッド実行
      await PayoutController.getPayoutsByUserId(mockRequest as Request, mockResponse as Response);

      // 検証
      expect(PayoutService.getPayoutsByUserId).not.toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ error: 'Invalid or missing userId' });
    });
  });

  describe('getPayoutsByContentId', () => {
    it('should get payouts by contentId', async () => {
      // クエリパラメータの設定
      const contentId = 'content789';
      mockRequest.query = { contentId };
      
      // サービス関数のモック実装
      const mockPayoutsResponse = [
        {
          payoutId: 'payout1',
          userId: 'user1',
          contentId,
          payoutReason: 'rankingReward',
          points: 100
        },
        {
          payoutId: 'payout2',
          userId: 'user2',
          contentId,
          payoutReason: 'contribution',
          points: 150
        }
      ];
      
      (PayoutService.getPayoutsByContentId as jest.Mock).mockResolvedValue(mockPayoutsResponse);

      // コントローラーメソッド実行
      await PayoutController.getPayoutsByContentId(mockRequest as Request, mockResponse as Response);

      // 検証
      expect(PayoutService.getPayoutsByContentId).toHaveBeenCalledWith(contentId);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(mockPayoutsResponse);
    });

    it('should return 400 if contentId is missing', async () => {
      // 不正なクエリパラメータ
      mockRequest.query = {};

      // コントローラーメソッド実行
      await PayoutController.getPayoutsByContentId(mockRequest as Request, mockResponse as Response);

      // 検証
      expect(PayoutService.getPayoutsByContentId).not.toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ error: 'Invalid or missing contentId' });
    });
  });
}); 