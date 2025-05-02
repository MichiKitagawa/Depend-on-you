// WithdrawalService.test.ts
import WithdrawalService, { WITHDRAWAL_STATUS } from '../../services/WithdrawalService';
import WalletService from '../../services/WalletService';
import { PrismaClient, Prisma } from '@prisma/client';

// Prisma Client のモック
jest.mock('@prisma/client', () => {
  const mockPrisma: any = {
    wallet: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
    withdrawal: { create: jest.fn(), findMany: jest.fn() },
    $transaction: jest.fn(),
  };
  mockPrisma.$transaction = jest.fn(async (callback) => callback(mockPrisma));

  return {
    PrismaClient: jest.fn(() => mockPrisma),
    Prisma: { TransactionClient: jest.fn() }
  };
});

// WalletService のモック
jest.mock('../../services/WalletService');
const mockWalletService = WalletService as jest.Mocked<typeof WalletService>;

const prismaMock = new PrismaClient() as any;

describe('WithdrawalService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWalletService.getOrCreateWallet.mockResolvedValue({ id: 'wallet-1', balance: 1000 });
    mockWalletService.debitPoints.mockResolvedValue(true);
  });

  describe('requestWithdrawal', () => {
    const withdrawalInput = { userId: 'user-1', amount: 500 };
    const withdrawalRecord = { 
      id: 'withdrawal-1', 
      status: WITHDRAWAL_STATUS.REQUESTED, 
      requestedAt: new Date() 
    };

    it('出金申請を正常に作成し、ポイントを消費する', async () => {
      prismaMock.withdrawal.create.mockResolvedValue(withdrawalRecord);

      const result = await WithdrawalService.requestWithdrawal(withdrawalInput);

      // 返り値の確認
      expect(result.withdrawalId).toBe(withdrawalRecord.id);
      expect(result.status).toBe(WITHDRAWAL_STATUS.REQUESTED);
      expect(result.requestedAt).toBe(withdrawalRecord.requestedAt);

      // トランザクションが使用されたか
      expect(prismaMock.$transaction).toHaveBeenCalled();

      // Withdrawal レコードが作成されたか
      expect(prismaMock.withdrawal.create).toHaveBeenCalledWith(expect.objectContaining({
        data: {
          userId: withdrawalInput.userId,
          walletId: 'wallet-1',
          amount: withdrawalInput.amount,
          status: WITHDRAWAL_STATUS.REQUESTED
        },
        select: { id: true, status: true, requestedAt: true }
      }));

      // ポイント消費が呼び出されたか（ポイント消費連携）
      expect(mockWalletService.debitPoints).toHaveBeenCalledWith(
        withdrawalInput.userId,
        withdrawalInput.amount,
        `Withdrawal request: ${withdrawalRecord.id}`,
        withdrawalRecord.id,
        expect.anything() // トランザクションクライアント
      );
    });

    it('残高不足の場合は出金申請を作成せずエラーを投げる', async () => {
      // 残高が少ない状態を設定
      mockWalletService.getOrCreateWallet.mockResolvedValue({ id: 'wallet-1', balance: 300 });

      await expect(WithdrawalService.requestWithdrawal({ userId: 'user-1', amount: 500 }))
        .rejects.toThrow('Insufficient balance for withdrawal request');

      // トランザクションが使用されていないか
      expect(prismaMock.$transaction).not.toHaveBeenCalled();
      // Withdrawal レコードが作成されていないか
      expect(prismaMock.withdrawal.create).not.toHaveBeenCalled();
      // ポイント消費が呼び出されていないか
      expect(mockWalletService.debitPoints).not.toHaveBeenCalled();
    });

    it('ポイント消費に失敗した場合はエラーを投げる', async () => {
      prismaMock.withdrawal.create.mockResolvedValue(withdrawalRecord);
      // debitPoints の失敗を模擬
      mockWalletService.debitPoints.mockResolvedValue(false);

      await expect(WithdrawalService.requestWithdrawal(withdrawalInput))
        .rejects.toThrow('Failed to debit points for withdrawal');

      // Withdrawal レコードは作成されているはず
      expect(prismaMock.withdrawal.create).toHaveBeenCalled();
      // ポイント消費が呼び出されているはず
      expect(mockWalletService.debitPoints).toHaveBeenCalled();
    });
  });

  describe('getWithdrawalsByUserId', () => {
    it('ユーザーの出金履歴を取得する', async () => {
      const userId = 'user-1';
      const withdrawals = [
        { id: 'w1', status: WITHDRAWAL_STATUS.COMPLETED, requestedAt: new Date() },
        { id: 'w2', status: WITHDRAWAL_STATUS.REQUESTED, requestedAt: new Date() }
      ];
      prismaMock.withdrawal.findMany.mockResolvedValue(withdrawals);

      const result = await WithdrawalService.getWithdrawalsByUserId(userId);

      expect(result.length).toBe(2);
      expect(result[0].withdrawalId).toBe('w1');
      expect(result[1].withdrawalId).toBe('w2');
      expect(prismaMock.withdrawal.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { requestedAt: 'desc' },
        select: { id: true, status: true, requestedAt: true }
      });
    });
  });
}); 