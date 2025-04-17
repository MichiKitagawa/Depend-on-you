import RevenueService from '../../services/RevenueService';
import { Revenue } from '../../models';

// モックの設定
jest.mock('../../models', () => {
  const mockRevenue = {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn()
  };
  return {
    Revenue: mockRevenue,
    sequelize: {
      transaction: jest.fn(callback => callback())
    }
  };
});

describe('RevenueService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createRevenue', () => {
    it('should create a new revenue record', async () => {
      // モックの実装
      const mockRevenueData = {
        revenue_id: 'test-id',
        revenue_type: 'subscription',
        amount: 500,
        created_at: new Date()
      };
      
      (Revenue.create as jest.Mock).mockResolvedValue(mockRevenueData);

      // テストデータ
      const revenueData = {
        revenueType: 'subscription' as const,
        amount: 500
      };

      // サービスメソッド実行
      const result = await RevenueService.createRevenue(revenueData);

      // 検証
      expect(Revenue.create).toHaveBeenCalledWith({
        revenue_type: revenueData.revenueType,
        amount: revenueData.amount
      });
      expect(result).toEqual({
        revenueId: mockRevenueData.revenue_id,
        revenueType: mockRevenueData.revenue_type,
        amount: mockRevenueData.amount
      });
    });

    it('should throw an error if amount is invalid', async () => {
      const invalidData = {
        revenueType: 'subscription' as const,
        amount: -100 // 無効な金額
      };

      // エラーを投げることを期待
      await expect(RevenueService.createRevenue(invalidData)).rejects.toThrow();
      
      // create関数が呼ばれていないこと
      expect(Revenue.create).not.toHaveBeenCalled();
    });
  });

  describe('getRevenuesByType', () => {
    it('should retrieve revenues by type', async () => {
      // モックの実装
      const mockRevenuesData = [
        {
          revenue_id: 'test-id-1',
          revenue_type: 'subscription',
          amount: 1000,
          created_at: new Date()
        },
        {
          revenue_id: 'test-id-2',
          revenue_type: 'subscription',
          amount: 2000,
          created_at: new Date()
        }
      ];
      
      (Revenue.findAll as jest.Mock).mockResolvedValue(mockRevenuesData);

      // サービスメソッド実行
      const results = await RevenueService.getRevenuesByType('subscription');

      // 検証
      expect(Revenue.findAll).toHaveBeenCalledWith({
        where: { revenue_type: 'subscription' }
      });
      expect(results).toHaveLength(2);
      expect(results[0].revenueType).toBe('subscription');
      expect(results[1].revenueType).toBe('subscription');
    });
  });
}); 