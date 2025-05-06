// WalletController.test.ts
import { Request, Response } from 'express';
import WalletController from '../../controllers/WalletController';
import { WalletService } from '../../services/WalletService'; // クラスをインポート
import { AuthenticatedRequest } from '../../middleware/auth';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

// Request/Response のモック関数
const mockRequest = (user: any = null): Partial<AuthenticatedRequest> => ({ user });
const mockResponse = (): Partial<Response> => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('WalletController', () => {
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;
  let mockWalletService: DeepMockProxy<WalletService>;
  let walletController: WalletController;
  let errorSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    res = mockResponse();
    mockWalletService = mockDeep<WalletService>();
    // Controller インスタンス生成
    walletController = new WalletController(mockWalletService);
    // console 抑制
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
    warnSpy.mockRestore();
  });

  describe('getWalletBalance', () => {
    it('正常系: ユーザーのウォレット残高を取得して 200 を返す', async () => {
      const userId = 'user-1';
      const expectedBalance = 100;
      req = mockRequest({ id: userId }); // 認証済みユーザーを設定
      // サービスメソッドのモック
      mockWalletService.getWalletBalance.mockResolvedValue(expectedBalance);

      // Controller インスタンスのメソッドを呼び出し
      await walletController.getWalletBalance(req as AuthenticatedRequest, res as Response);

      expect(mockWalletService.getWalletBalance).toHaveBeenCalledWith(userId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ userId, balance: expectedBalance });
    });

    it('異常系: ユーザーが認証されていない場合 401 を返す', async () => {
      req = mockRequest(null); // 認証されていないユーザー
      await walletController.getWalletBalance(req as AuthenticatedRequest, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
      expect(mockWalletService.getWalletBalance).not.toHaveBeenCalled();
    });

    it('異常系: サービスでエラーが発生した場合 500 を返す', async () => {
      const userId = 'user-error';
      req = mockRequest({ id: userId });
      const serviceError = new Error('DB connection error');
      mockWalletService.getWalletBalance.mockRejectedValue(serviceError);

      await walletController.getWalletBalance(req as AuthenticatedRequest, res as Response);

      expect(mockWalletService.getWalletBalance).toHaveBeenCalledWith(userId);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: serviceError.message });
    });
  });

  // debitPoints のテスト (もしコントローラーに残すなら)
  // describe('debitPoints', () => { ... });
}); 