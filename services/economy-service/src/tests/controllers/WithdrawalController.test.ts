// WithdrawalController.test.ts
import { Request, Response } from 'express';
import WithdrawalController from '../../controllers/WithdrawalController';
import { WithdrawalService } from '../../services/WithdrawalService'; // クラスをインポート
import { AuthenticatedRequest } from '../../middleware/auth';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

// Request/Response のモック
const mockRequest = (body: any = {}, user: any = null): Partial<AuthenticatedRequest> => ({ body, user });
const mockResponse = (): Partial<Response> => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('WithdrawalController', () => {
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;
  let mockWithdrawalService: DeepMockProxy<WithdrawalService>;
  let withdrawalController: WithdrawalController;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    res = mockResponse();
    mockWithdrawalService = mockDeep<WithdrawalService>();
    // Controller インスタンス生成
    withdrawalController = new WithdrawalController(mockWithdrawalService);
    // console 抑制
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  describe('requestWithdrawal', () => {
    const userId = 'user-wd-1';
    const withdrawalData = { amount: 1000, bankAccountId: 'bank-123' };
    const mockResult = { withdrawalId: 'wd-abc', status: 'PENDING' };

    it('正常系: 出金申請を作成し 201 を返す', async () => {
      req = mockRequest(withdrawalData, { id: userId });
      // サービスメソッドのモック
      mockWithdrawalService.requestWithdrawal.mockResolvedValue(mockResult as any);

      // Controller インスタンスのメソッドを呼び出し
      await withdrawalController.requestWithdrawal(req as AuthenticatedRequest, res as Response);

      expect(mockWithdrawalService.requestWithdrawal).toHaveBeenCalledWith(userId, withdrawalData.amount, withdrawalData.bankAccountId);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('異常系: 認証されていない場合 401 を返す', async () => {
      req = mockRequest(withdrawalData, null);
      await withdrawalController.requestWithdrawal(req as AuthenticatedRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(mockWithdrawalService.requestWithdrawal).not.toHaveBeenCalled();
    });

    it('異常系: amount が不正な場合 400 を返す', async () => {
      req = mockRequest({ amount: -100, bankAccountId: 'bank-123' }, { id: userId });
      await withdrawalController.requestWithdrawal(req as AuthenticatedRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid amount' });
      expect(mockWithdrawalService.requestWithdrawal).not.toHaveBeenCalled();
    });

    it('異常系: bankAccountId がない場合 400 を返す', async () => {
        req = mockRequest({ amount: 1000 }, { id: userId });
        await withdrawalController.requestWithdrawal(req as AuthenticatedRequest, res as Response);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Missing bankAccountId' });
        expect(mockWithdrawalService.requestWithdrawal).not.toHaveBeenCalled();
    });

    it('異常系: 残高不足の場合 400 を返す', async () => {
      req = mockRequest(withdrawalData, { id: userId });
      const balanceError = new Error('Insufficient balance');
      mockWithdrawalService.requestWithdrawal.mockRejectedValue(balanceError);

      await withdrawalController.requestWithdrawal(req as AuthenticatedRequest, res as Response);

      expect(mockWithdrawalService.requestWithdrawal).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: balanceError.message });
    });

    it('異常系: その他のサービスエラーの場合 500 を返す', async () => {
        req = mockRequest(withdrawalData, { id: userId });
        const serviceError = new Error('Internal DB Error');
        mockWithdrawalService.requestWithdrawal.mockRejectedValue(serviceError);

        await withdrawalController.requestWithdrawal(req as AuthenticatedRequest, res as Response);

        expect(mockWithdrawalService.requestWithdrawal).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: serviceError.message });
    });
  });

  describe('getWithdrawals', () => {
    const userId = 'user-wd-2';
    const mockWithdrawals = [{ id: 'wd-1', amount: 500, status: 'COMPLETED' }];

    it('正常系: ユーザーの出金履歴を取得して 200 を返す', async () => {
      req = mockRequest({}, { id: userId });
      mockWithdrawalService.getUserWithdrawals.mockResolvedValue(mockWithdrawals as any);

      await withdrawalController.getWithdrawals(req as AuthenticatedRequest, res as Response);

      expect(mockWithdrawalService.getUserWithdrawals).toHaveBeenCalledWith(userId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockWithdrawals);
    });

    it('異常系: 認証されていない場合 401 を返す', async () => {
      req = mockRequest({}, null);
      await withdrawalController.getWithdrawals(req as AuthenticatedRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(mockWithdrawalService.getUserWithdrawals).not.toHaveBeenCalled();
    });

     it('異常系: サービスでエラーが発生した場合 500 を返す', async () => {
      req = mockRequest({}, { id: userId });
      const serviceError = new Error('Server error');
      mockWithdrawalService.getUserWithdrawals.mockRejectedValue(serviceError);

      await withdrawalController.getWithdrawals(req as AuthenticatedRequest, res as Response);

      expect(mockWithdrawalService.getUserWithdrawals).toHaveBeenCalledWith(userId);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: serviceError.message });
    });
  });
}); 