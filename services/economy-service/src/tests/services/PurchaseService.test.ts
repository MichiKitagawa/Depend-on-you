import PurchaseService, { PURCHASE_STATUS } from '../../services/PurchaseService';
import WalletService, { POINT_HISTORY_TYPE } from '../../services/WalletService';
import { PrismaClient, Prisma } from '@prisma/client';
import Stripe from 'stripe';

// Prisma Client のモック
jest.mock('@prisma/client', () => {
  const mockPrisma: any = {
    wallet: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
    purchase: { create: jest.fn(), update: jest.fn(), findFirst: jest.fn() },
    pointHistory: { create: jest.fn() },
    $transaction: jest.fn(),
  };
  mockPrisma.$transaction = jest.fn(async (callback) => callback(mockPrisma));

  return {
    PrismaClient: jest.fn(() => mockPrisma),
    Prisma: { TransactionClient: jest.fn() }
  };
});

// Stripe SDK のモック
jest.mock('stripe', () => {
  const mockPaymentIntentCreate = jest.fn();
  
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: mockPaymentIntentCreate,
    },
  }));
});

// mockPaymentIntentCreate を別途エクスポートして参照できるようにする
const mockPaymentIntentCreate = jest.requireMock('stripe')().paymentIntents.create;

// WalletService のモック
jest.mock('../../services/WalletService');
const mockWalletService = WalletService as jest.Mocked<typeof WalletService>;

const prismaMock = new PrismaClient() as any;

describe('PurchaseService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWalletService.getOrCreateWallet.mockResolvedValue({ id: 'wallet-1', balance: 100 });
    mockWalletService.creditPoints.mockResolvedValue();
  });

  describe('createPurchaseIntent', () => {
    const input = { userId: 'user-1', amount: 100, currency: 'jpy' };

    it('正常に PaymentIntent を作成し、Purchase レコードを更新する', async () => {
      const purchaseRecord = { id: 'purchase-1' };
      const paymentIntent = { id: 'pi_123', client_secret: 'pi_123_secret' };
      prismaMock.purchase.create.mockResolvedValue(purchaseRecord);
      mockPaymentIntentCreate.mockResolvedValue(paymentIntent as any);

      const result = await PurchaseService.createPurchaseIntent(input);

      expect(result.purchaseId).toBe(purchaseRecord.id);
      expect(result.status).toBe(PURCHASE_STATUS.PENDING);
      expect(result.clientSecret).toBe(paymentIntent.client_secret);
      expect(prismaMock.purchase.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ userId: input.userId, amount: input.amount, status: PURCHASE_STATUS.PENDING })
      }));
      expect(mockPaymentIntentCreate).toHaveBeenCalledWith(expect.objectContaining({
        amount: input.amount,
        currency: input.currency,
        metadata: { purchaseId: purchaseRecord.id, userId: input.userId },
      }));
      expect(prismaMock.purchase.update).toHaveBeenCalledWith({
        where: { id: purchaseRecord.id },
        data: { providerTxId: paymentIntent.id }
      });
    });

    it('Stripe API 呼び出しに失敗した場合、Purchase レコードを FAILED に更新しエラーを投げる', async () => {
      const purchaseRecord = { id: 'purchase-fail' };
      const stripeError = new Error('Stripe Error');
      prismaMock.purchase.create.mockResolvedValue(purchaseRecord);
      mockPaymentIntentCreate.mockRejectedValue(stripeError);

      await expect(PurchaseService.createPurchaseIntent(input)).rejects.toThrow('Failed to create payment intent: Stripe Error');

      expect(prismaMock.purchase.update).toHaveBeenCalledWith({
        where: { id: purchaseRecord.id },
        data: { status: PURCHASE_STATUS.FAILED }
      });
    });
  });

  describe('handlePurchaseSuccess', () => {
    const providerTxId = 'pi_123';
    const purchaseData = { id: 'purchase-1', userId: 'user-1', amount: 100 };

    it('PENDING の Purchase が見つかった場合、ステータスを更新しポイントを付与する', async () => {
      prismaMock.purchase.findFirst.mockResolvedValue(purchaseData);

      await PurchaseService.handlePurchaseSuccess(providerTxId);

      expect(prismaMock.$transaction).toHaveBeenCalled();
      expect(prismaMock.purchase.update).toHaveBeenCalledWith({
        where: { id: purchaseData.id },
        data: { status: PURCHASE_STATUS.COMPLETED }
      });
      expect(mockWalletService.creditPoints).toHaveBeenCalledWith(
        purchaseData.userId,
        purchaseData.amount,
        expect.stringContaining('Purchase completion'),
        purchaseData.id,
        expect.anything()
      );
    });

    it('Purchase が見つからないか PENDING でない場合は何もしない', async () => {
      // テスト間で呼び出し履歴をリセット
      jest.clearAllMocks();
      
      prismaMock.purchase.findFirst.mockResolvedValue(null);
      await PurchaseService.handlePurchaseSuccess(providerTxId);
      expect(prismaMock.$transaction).not.toHaveBeenCalled();
      expect(mockWalletService.creditPoints).not.toHaveBeenCalled();
    });
  });
}); 