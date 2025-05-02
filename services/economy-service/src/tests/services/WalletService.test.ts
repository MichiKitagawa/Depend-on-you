import WalletService from '../../services/WalletService';
import { PrismaClient } from '@prisma/client';

// モックに使用するため、実際の定数をインポート
import { POINT_HISTORY_TYPE } from '../../services/WalletService';

// Prisma Client をモック化
jest.mock('@prisma/client', () => {
  const mockPrisma: {
    wallet: { findUnique: jest.Mock; create: jest.Mock; update: jest.Mock };
    pointHistory: { create: jest.Mock };
    $transaction: jest.Mock;
  } = {
    wallet: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    pointHistory: {
      create: jest.fn(),
    },
    $transaction: jest.fn((callback: (tx: any) => any) => callback(mockPrisma)), // トランザクションをモック
  };
  return {
    PrismaClient: jest.fn(() => mockPrisma),
    Prisma: { // TransactionClient 型のため
      TransactionClient: jest.fn()
    }
  };
});

// モックされた PrismaClient のインスタンスを取得
const prismaMock = new PrismaClient() as any;

describe('WalletService', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    jest.clearAllMocks();
  });

  describe('getOrCreateWallet', () => {
    it('既存のウォレットが見つかる場合はそれを返す', async () => {
      const userId = 'user-1';
      const existingWallet = { id: 'wallet-1', balance: 100 };
      prismaMock.wallet.findUnique.mockResolvedValue(existingWallet);

      const wallet = await WalletService.getOrCreateWallet(userId);

      expect(wallet).toEqual(existingWallet);
      expect(prismaMock.wallet.findUnique).toHaveBeenCalledWith({ where: { userId }, select: { id: true, balance: true } });
      expect(prismaMock.wallet.create).not.toHaveBeenCalled();
    });

    it('既存のウォレットがない場合は作成して返す', async () => {
      const userId = 'user-new';
      const newWallet = { id: 'wallet-new', balance: 0 };
      prismaMock.wallet.findUnique.mockResolvedValue(null);
      prismaMock.wallet.create.mockResolvedValue(newWallet);

      const wallet = await WalletService.getOrCreateWallet(userId);

      expect(wallet).toEqual(newWallet);
      expect(prismaMock.wallet.findUnique).toHaveBeenCalledWith({ where: { userId }, select: { id: true, balance: true } });
      expect(prismaMock.wallet.create).toHaveBeenCalledWith({ data: { userId }, select: { id: true, balance: true } });
    });
  });

  describe('debitPoints', () => {
    it('残高が十分な場合、ポイントを消費し履歴を記録する', async () => {
      const userId = 'user-1';
      const amount = 50;
      const reason = 'Test debit';
      const walletData = { id: 'wallet-1', balance: 100 };
      prismaMock.wallet.findUnique.mockResolvedValue(walletData);

      const result = await WalletService.debitPoints(userId, amount, reason);

      expect(result).toBe(true);
      expect(prismaMock.$transaction).toHaveBeenCalled(); // トランザクションが使われたか
      expect(prismaMock.wallet.update).toHaveBeenCalledWith({
        where: { id: walletData.id },
        data: { balance: { decrement: amount } },
      });
      expect(prismaMock.pointHistory.create).toHaveBeenCalledWith({
        data: {
          userId,
          walletId: walletData.id,
          amount: -amount,
          type: POINT_HISTORY_TYPE.DEBIT,
          reason,
          relatedId: undefined,
        }
      });
    });

    it('残高不足の場合は false を返し、更新しない', async () => {
        const userId = 'user-1';
        const amount = 150;
        const reason = 'Test debit insufficient';
        const walletData = { id: 'wallet-1', balance: 100 };
        prismaMock.wallet.findUnique.mockResolvedValue(walletData);

        const result = await WalletService.debitPoints(userId, amount, reason);

        expect(result).toBe(false);
        expect(prismaMock.$transaction).toHaveBeenCalled(); // トランザクションは開始される
        expect(prismaMock.wallet.update).not.toHaveBeenCalled();
        expect(prismaMock.pointHistory.create).not.toHaveBeenCalled();
    });
  });

   describe('creditPoints', () => {
    it('ポイントを付与し履歴を記録する (トランザクション内で)', async () => {
        const userId = 'user-1';
        const amount = 50;
        const reason = 'Test credit';
        const walletData = { id: 'wallet-1', balance: 100 };
        prismaMock.wallet.findUnique.mockResolvedValue(walletData);

        // トランザクションコンテキストを渡すことをシミュレート
        const mockTx = prismaMock; // $transaction のモックを使用
        await WalletService.creditPoints(userId, amount, reason, undefined, mockTx);

        // creditPoints は tx がないとエラーを投げるので、tx を渡した場合のみテスト
        expect(prismaMock.wallet.update).toHaveBeenCalledWith({
          where: { id: walletData.id },
          data: { balance: { increment: amount } },
        });
        expect(prismaMock.pointHistory.create).toHaveBeenCalledWith({
          data: {
            userId,
            walletId: walletData.id,
            amount: amount,
            type: POINT_HISTORY_TYPE.CREDIT,
            reason,
            relatedId: undefined,
          }
        });
      });
   });
}); 