import axios from 'axios';
import Feed from '../models/feed.model';
import { v4 as uuidv4 } from 'uuid';

// 他のサービスのURL
const RANKING_SERVICE_URL = process.env.RANKING_SERVICE_URL || 'http://localhost:3005';
const CONTENT_SERVICE_URL = process.env.CONTENT_SERVICE_URL || 'http://localhost:3002';

export class FeedService {
  /**
   * ユーザー向けのフィードを生成
   * @param userId ユーザーID
   */
  async generateFeed(userId: string) {
    try {
      // ランキングサービスからトップコンテンツを取得
      const rankingResponse = await axios.get(`${RANKING_SERVICE_URL}/rankings/latest`);
      
      // 簡易的なフィルタリングを行う (実際の実装ではユーザー嗜好情報からパーソナライズ)
      const contentList = rankingResponse.data.items.slice(0, 10).map((item: any) => ({
        contentId: item.contentId,
        scoreValue: item.score
      }));

      // 新しいフィードを作成
      const newFeed = await Feed.create({
        user_id: userId,
        content_list: contentList,
      });

      return {
        feedId: newFeed.feed_id,
        userId: newFeed.user_id,
        contentList: newFeed.content_list,
        generatedAt: newFeed.generated_at
      };
    } catch (error) {
      console.error('フィード生成エラー:', error);
      throw new Error('フィード生成中にエラーが発生しました');
    }
  }

  /**
   * 指定IDのフィードを取得
   * @param feedId フィードID
   */
  async getFeedById(feedId: string) {
    try {
      const feed = await Feed.findOne({
        where: { feed_id: feedId }
      });

      if (!feed) {
        throw new Error('指定されたフィードが見つかりません');
      }

      return {
        feedId: feed.feed_id,
        userId: feed.user_id,
        contentList: feed.content_list,
        generatedAt: feed.generated_at
      };
    } catch (error) {
      console.error('フィード取得エラー:', error);
      throw error;
    }
  }

  /**
   * ユーザーの最新フィードを取得
   * @param userId ユーザーID
   */
  async getLatestFeedByUserId(userId: string) {
    try {
      const feed = await Feed.findOne({
        where: { user_id: userId },
        order: [['generated_at', 'DESC']]
      });

      if (!feed) {
        // ユーザーのフィードがない場合は新規生成
        return this.generateFeed(userId);
      }

      return {
        feedId: feed.feed_id,
        userId: feed.user_id,
        contentList: feed.content_list,
        generatedAt: feed.generated_at
      };
    } catch (error) {
      console.error('最新フィード取得エラー:', error);
      throw error;
    }
  }
} 