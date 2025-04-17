import { Payout } from '../models';
import { PayoutReason, UserId, ContentId } from '../../../../shared/schema';

export interface PayoutInput {
  userId: UserId;
  contentId: ContentId;
  payoutReason: PayoutReason;
  points: number;
}

export interface PayoutOutput {
  payoutId: string;
  userId: UserId;
  contentId: ContentId;
  points: number;
  payoutReason: PayoutReason;
}

class PayoutService {
  /**
   * 新しい報酬記録を作成する
   */
  async createPayout(data: PayoutInput): Promise<PayoutOutput> {
    try {
      // 報酬データのバリデーション
      if (data.points <= 0) {
        throw new Error('Points must be greater than 0');
      }

      // 報酬レコードの作成
      const payout = await Payout.create({
        user_id: data.userId,
        content_id: data.contentId,
        payout_reason: data.payoutReason,
        points: data.points
      });
      
      // レスポンス形式に変換
      return {
        payoutId: payout.payout_id,
        userId: payout.user_id,
        contentId: payout.content_id,
        points: payout.points,
        payoutReason: payout.payout_reason
      };
    } catch (error) {
      console.error('Error creating payout:', error);
      throw error;
    }
  }

  /**
   * ユーザーIDに基づいて報酬履歴を取得
   */
  async getPayoutsByUserId(userId: UserId): Promise<PayoutOutput[]> {
    try {
      const payouts = await Payout.findAll({
        where: { user_id: userId },
        order: [['created_at', 'DESC']]
      });
      
      return payouts.map(payout => ({
        payoutId: payout.payout_id,
        userId: payout.user_id,
        contentId: payout.content_id,
        points: payout.points,
        payoutReason: payout.payout_reason
      }));
    } catch (error) {
      console.error('Error getting payouts by user:', error);
      throw error;
    }
  }

  /**
   * コンテンツIDに基づいて報酬履歴を取得
   */
  async getPayoutsByContentId(contentId: ContentId): Promise<PayoutOutput[]> {
    try {
      const payouts = await Payout.findAll({
        where: { content_id: contentId },
        order: [['created_at', 'DESC']]
      });
      
      return payouts.map(payout => ({
        payoutId: payout.payout_id,
        userId: payout.user_id,
        contentId: payout.content_id,
        points: payout.points,
        payoutReason: payout.payout_reason
      }));
    } catch (error) {
      console.error('Error getting payouts by content:', error);
      throw error;
    }
  }
}

export default new PayoutService(); 