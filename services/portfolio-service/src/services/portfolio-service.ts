import { UserId } from '../../../../shared/schema';
import { PortfolioModel, PortfolioEntry, Portfolio } from '../models/portfolio';
import pool from '../models/db';

export class PortfolioService {
  private portfolioModel: PortfolioModel;

  constructor() {
    this.portfolioModel = new PortfolioModel(pool);
  }

  /**
   * ユーザーのポートフォリオを取得
   */
  async getUserPortfolio(userId: UserId): Promise<Portfolio | null> {
    try {
      return await this.portfolioModel.getPortfolioByUserId(userId);
    } catch (error) {
      console.error('ポートフォリオ取得サービスエラー:', error);
      throw error;
    }
  }

  /**
   * reader-action-serviceから最新の行動履歴を同期
   * 実際の実装では、reader-action-serviceのAPIを呼び出してデータを取得する
   * このサンプル実装では、直接渡されたデータを使用
   */
  async syncUserActions(userId: UserId, newEntries: PortfolioEntry[]): Promise<number> {
    try {
      // ここで実際には reader-action-service から最新データを取得する
      // const newActions = await fetchFromReaderActionService(userId);
      
      // 本実装ではnewActionsを使用するが、今回はテスト用にnewEntriesを直接使用
      return await this.portfolioModel.syncPortfolio(userId, newEntries);
    } catch (error) {
      console.error('ポートフォリオ同期サービスエラー:', error);
      throw error;
    }
  }
} 