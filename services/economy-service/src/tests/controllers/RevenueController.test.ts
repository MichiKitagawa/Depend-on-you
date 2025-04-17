import { Request, Response } from 'express';
import RevenueController from '../../controllers/RevenueController';
import RevenueService from '../../services/RevenueService';

// モックの設定
jest.mock('../../services/RevenueService', () => ({
  createRevenue: jest.fn(),
  getRevenuesByType: jest.fn()
}));

describe('RevenueController', () => {
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

  describe('createRevenue', () => {
    it('should create a new revenue record', async () => {
      // テストデータ
      const revenueData = {
        revenueType: 'subscription',
        amount: 500
      };
      
      // リクエストボディの設定
      mockRequest.body = revenueData;
      
      // サービス関数のモック実装
      const mockRevenueResponse = {
        revenueId: 'test-id',
        revenueType: 'subscription',
        amount: 500
      };
      
      (RevenueService.createRevenue as jest.Mock).mockResolvedValue(mockRevenueResponse);

      // コントローラーメソッド実行
      await RevenueController.createRevenue(mockRequest as Request, mockResponse as Response);

      // 検証
      expect(RevenueService.createRevenue).toHaveBeenCalledWith(revenueData);
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith(mockRevenueResponse);
    });

    it('should return 400 if amount is invalid', async () => {
      // 不正なデータ
      mockRequest.body = {
        revenueType: 'subscription',
        amount: -100
      };

      // コントローラーメソッド実行
      await RevenueController.createRevenue(mockRequest as Request, mockResponse as Response);

      // 検証
      expect(RevenueService.createRevenue).not.toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ error: 'Amount must be a positive number' });
    });

    it('should return 400 if revenue type is invalid', async () => {
      // 不正なデータ
      mockRequest.body = {
        revenueType: 'invalid-type',
        amount: 100
      };

      // コントローラーメソッド実行
      await RevenueController.createRevenue(mockRequest as Request, mockResponse as Response);

      // 検証
      expect(RevenueService.createRevenue).not.toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ error: 'Invalid revenue type' });
    });
  });

  describe('getRevenuesByType', () => {
    it('should get revenues by type', async () => {
      // クエリパラメータの設定
      mockRequest.query = { type: 'subscription' };
      
      // サービス関数のモック実装
      const mockRevenuesResponse = [
        {
          revenueId: 'test-id-1',
          revenueType: 'subscription',
          amount: 500
        },
        {
          revenueId: 'test-id-2',
          revenueType: 'subscription',
          amount: 1000
        }
      ];
      
      (RevenueService.getRevenuesByType as jest.Mock).mockResolvedValue(mockRevenuesResponse);

      // コントローラーメソッド実行
      await RevenueController.getRevenuesByType(mockRequest as Request, mockResponse as Response);

      // 検証
      expect(RevenueService.getRevenuesByType).toHaveBeenCalledWith('subscription');
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(mockRevenuesResponse);
    });

    it('should return 400 if type is invalid', async () => {
      // 不正なクエリパラメータ
      mockRequest.query = { type: 'invalid-type' };

      // コントローラーメソッド実行
      await RevenueController.getRevenuesByType(mockRequest as Request, mockResponse as Response);

      // 検証
      expect(RevenueService.getRevenuesByType).not.toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ error: 'Invalid revenue type' });
    });
  });
}); 