import { Revenue } from '../models';
import { RevenueType } from '../../../../shared/schema';

export interface RevenueInput {
  revenueType: RevenueType;
  amount: number;
}

export interface RevenueOutput {
  revenueId: string;
  revenueType: RevenueType;
  amount: number;
}

class RevenueService {
  /**
   * 新しい収益レコードを作成する
   */
  async createRevenue(data: RevenueInput): Promise<RevenueOutput> {
    try {
      // 収益データのバリデーション
      if (data.amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      // レコードの作成
      const revenue = await Revenue.create({
        revenue_type: data.revenueType,
        amount: data.amount
      });

      // レスポンス形式に変換して返す
      return {
        revenueId: revenue.revenue_id,
        revenueType: revenue.revenue_type,
        amount: revenue.amount
      };
    } catch (error) {
      console.error('Error creating revenue:', error);
      throw error;
    }
  }

  /**
   * IDで収益データを取得
   */
  async getRevenueById(revenueId: string): Promise<RevenueOutput | null> {
    try {
      const revenue = await Revenue.findByPk(revenueId);
      
      if (!revenue) {
        return null;
      }
      
      return {
        revenueId: revenue.revenue_id,
        revenueType: revenue.revenue_type,
        amount: revenue.amount
      };
    } catch (error) {
      console.error('Error getting revenue:', error);
      throw error;
    }
  }

  /**
   * 収益タイプに基づいて収益データを取得
   */
  async getRevenuesByType(type: RevenueType): Promise<RevenueOutput[]> {
    try {
      const revenues = await Revenue.findAll({
        where: { revenue_type: type }
      });
      
      return revenues.map(revenue => ({
        revenueId: revenue.revenue_id,
        revenueType: revenue.revenue_type,
        amount: revenue.amount
      }));
    } catch (error) {
      console.error('Error getting revenues by type:', error);
      throw error;
    }
  }
}

export default new RevenueService(); 