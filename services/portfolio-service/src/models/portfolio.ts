import { Pool } from 'pg';
import { UserId, ReaderActionType, PostID, MagazineID, CommentId } from '../schema';

export interface PortfolioEntry {
  actionType: ReaderActionType;
  contentId: string;
  timestamp: Date;
}

export interface Portfolio {
  userId: UserId;
  entries: PortfolioEntry[];
}

export class PortfolioModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  // ユーザーのポートフォリオを取得
  async getPortfolioByUserId(userId: UserId): Promise<Portfolio | null> {
    try {
      const result = await this.pool.query(
        'SELECT portfolio_id, user_id, entries, updated_at FROM portfolios WHERE user_id = $1',
        [userId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return {
        userId: result.rows[0].user_id,
        entries: result.rows[0].entries || []
      };
    } catch (error) {
      console.error('ポートフォリオ取得エラー:', error);
      throw error;
    }
  }

  // ポートフォリオの同期（更新）
  async syncPortfolio(userId: UserId, newEntries: PortfolioEntry[]): Promise<number> {
    try {
      // ユーザーのポートフォリオが存在するか確認
      const existingPortfolio = await this.getPortfolioByUserId(userId);
      
      if (!existingPortfolio) {
        // 新規作成
        await this.pool.query(
          'INSERT INTO portfolios (user_id, entries, updated_at) VALUES ($1, $2, NOW())',
          [userId, JSON.stringify(newEntries)]
        );
        return newEntries.length;
      } else {
        // 更新 - 新しいエントリーをマージして、重複を排除
        const currentEntries = existingPortfolio.entries || [];
        
        // コンテンツIDとアクションタイプの組み合わせで重複を判定し、新しいタイムスタンプで上書き
        const entryMap = new Map<string, PortfolioEntry>();
        
        // 既存のエントリーをマップに追加
        currentEntries.forEach(entry => {
          const key = `${entry.contentId}-${entry.actionType}`;
          entryMap.set(key, entry);
        });
        
        // 新しいエントリーをマージ
        let newEntriesCount = 0;
        newEntries.forEach(entry => {
          const key = `${entry.contentId}-${entry.actionType}`;
          if (!entryMap.has(key) || entryMap.get(key)!.timestamp.getTime() < entry.timestamp.getTime()) {
            entryMap.set(key, entry);
            newEntriesCount++;
          }
        });
        
        // マップから配列に戻す
        const mergedEntries = Array.from(entryMap.values());
        
        // 日付順に並べ替え
        mergedEntries.sort((a, b) => 
          b.timestamp.getTime() - a.timestamp.getTime()
        );
        
        // データベースを更新
        await this.pool.query(
          'UPDATE portfolios SET entries = $1, updated_at = NOW() WHERE user_id = $2',
          [JSON.stringify(mergedEntries), userId]
        );
        
        return newEntriesCount;
      }
    } catch (error) {
      console.error('ポートフォリオ同期エラー:', error);
      throw error;
    }
  }
} 