import axios from 'axios';
import { UserId } from '../schema';
import { PortfolioModel, PortfolioEntry, Portfolio } from '../models/portfolio';
import pool from '../models/db';

// reader-action-service のベース URL (環境変数などから取得するのが望ましい)
const READER_ACTION_SERVICE_URL = process.env.READER_ACTION_SERVICE_URL || 'http://localhost:3004'; // ポートは仮

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
   */
  async syncUserActions(userId: UserId): Promise<number> {
    try {
      // reader-action-service から最新データを取得
      const response = await axios.get<{ actions: any[] }>( // レスポンス型は仮
        `${READER_ACTION_SERVICE_URL}/actions`,
        { params: { userId } }
      );

      // API レスポンスを PortfolioEntry[] 形式に変換 (レスポンス形式に合わせて要調整)
      const newEntries: PortfolioEntry[] = response.data.actions.map(action => ({
        // PortfolioEntry に必要なプロパティを action オブジェクトからマッピング
        // 例: actionType, targetId (postId/magazineId 등), timestamp など
        // 以下は仮のマッピング
        actionType: action.type, // API のプロパティ名に合わせる
        contentId: action.targetId, // API レスポンスの targetId を contentId にマップ
        targetId: action.targetId, // targetId も保持 (もし必要なら)
        timestamp: new Date(action.createdAt), // API のプロパティ名に合わせる
        // ... PortfolioEntry に必要な他のプロパティがあれば追加
      }));

      return await this.portfolioModel.syncPortfolio(userId, newEntries);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Reader Action Service API 呼び出しエラー:', error.response?.data || error.message);
      } else {
        console.error('ポートフォリオ同期サービスエラー:', error);
      }
      throw error;
    }
  }
} 