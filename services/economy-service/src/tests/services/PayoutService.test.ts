import PayoutService from '../../services/PayoutService';
import { Payout } from '../../models';

// モックの設定
jest.mock('../../models', () => {
  const mockPayout = {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn()
  };
  return {
    Payout: mockPayout,
    sequelize: {
      transaction: jest.fn(callback => callback())
    }
  };
});

describe('PayoutService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPayout', () => {
    it('should create a new payout record', async () => {
      // モックの実装
      const mockPayoutData = {
        payout_id: 'test-id',
        user_id: 'user123',
        content_id: 'content456',
        payout_reason: 'rankingReward',
        points: 100,
        created_at: new Date()
      };
      
      (Payout.create as jest.Mock).mockResolvedValue(mockPayoutData);

      // テストデータ
      const payoutData = {
        userId: 'user123',
        contentId: 'content456',
        payoutReason: 'rankingReward' as const,
        points: 100
      };

      // サービスメソッド実行
      const result = await PayoutService.createPayout(payoutData);

      // 検証
      expect(Payout.create).toHaveBeenCalledWith({
        user_id: payoutData.userId,
        content_id: payoutData.contentId,
        payout_reason: payoutData.payoutReason,
        points: payoutData.points
      });
      expect(result).toEqual({
        payoutId: mockPayoutData.payout_id,
        userId: mockPayoutData.user_id,
        contentId: mockPayoutData.content_id,
        points: mockPayoutData.points,
        payoutReason: mockPayoutData.payout_reason
      });
    });

    it('should throw an error if points is invalid', async () => {
      const invalidData = {
        userId: 'user123',
        contentId: 'content456',
        payoutReason: 'contribution' as const,
        points: -10 // 無効なポイント
      };

      // エラーを投げることを期待
      await expect(PayoutService.createPayout(invalidData)).rejects.toThrow();
      
      // create関数が呼ばれていないこと
      expect(Payout.create).not.toHaveBeenCalled();
    });
  });

  describe('getPayoutsByUserId', () => {
    it('should retrieve payouts by userId', async () => {
      // モックの実装
      const userId = 'user123';
      const mockPayoutsData = [
        {
          payout_id: 'payout1',
          user_id: userId,
          content_id: 'content1',
          payout_reason: 'rankingReward',
          points: 100,
          created_at: new Date()
        },
        {
          payout_id: 'payout2',
          user_id: userId,
          content_id: 'content2',
          payout_reason: 'contribution',
          points: 200,
          created_at: new Date()
        }
      ];
      
      (Payout.findAll as jest.Mock).mockResolvedValue(mockPayoutsData);

      // サービスメソッド実行
      const results = await PayoutService.getPayoutsByUserId(userId);

      // 検証
      expect(Payout.findAll).toHaveBeenCalledWith({
        where: { user_id: userId },
        order: [['created_at', 'DESC']]
      });
      expect(results).toHaveLength(2);
      expect(results[0].userId).toBe(userId);
      expect(results[1].userId).toBe(userId);
    });
  });

  describe('getPayoutsByContentId', () => {
    it('should retrieve payouts by contentId', async () => {
      // モックの実装
      const contentId = 'content789';
      const mockPayoutsData = [
        {
          payout_id: 'payout1',
          user_id: 'user1',
          content_id: contentId,
          payout_reason: 'rankingReward',
          points: 100,
          created_at: new Date()
        },
        {
          payout_id: 'payout2',
          user_id: 'user2',
          content_id: contentId,
          payout_reason: 'contribution',
          points: 150,
          created_at: new Date()
        }
      ];
      
      (Payout.findAll as jest.Mock).mockResolvedValue(mockPayoutsData);

      // サービスメソッド実行
      const results = await PayoutService.getPayoutsByContentId(contentId);

      // 検証
      expect(Payout.findAll).toHaveBeenCalledWith({
        where: { content_id: contentId },
        order: [['created_at', 'DESC']]
      });
      expect(results).toHaveLength(2);
      expect(results[0].contentId).toBe(contentId);
      expect(results[1].contentId).toBe(contentId);
    });
  });
}); 