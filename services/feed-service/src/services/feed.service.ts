import axios from 'axios';
// import Feed from '../models/feed.model'; // Sequelize モデルは使わない (直接 DB 操作しない想定)
import { v4 as uuidv4 } from 'uuid';
import { PostID, UserId } from '@shared/schema'; // パスエイリアスを使用

// 他のサービスのベースURL (環境変数から取得)
const RANKING_SERVICE_URL = process.env.RANKING_SERVICE_URL || 'http://ranking-service:3005';
const CONTENT_SERVICE_URL = process.env.CONTENT_SERVICE_URL || 'http://content-service:3002';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:3001';

// フィードに含める投稿の最大数
const FEED_LIMIT = 50;
// ランキングから取得する投稿の数 (多めに取得してフィルタリング)
const RANKING_FETCH_LIMIT = 100;

// Feed アイテムの型 (DB保存用ではない)
interface FeedItem {
  postId: PostID;
  title: string; // content-service から取得
  authorId?: UserId; // UserID を UserId に修正
  authorName?: string; // user-service から取得 (任意)
  score: number; // ranking-service から取得 (減衰後)
  reason?: 'ranking' | 'follow' | 'other'; // なぜフィードに含まれたか (任意)
}

export class FeedService {

  // 複数の投稿情報を Content Service から取得するヘルパー関数
  private async _fetchPostDetails(postIds: PostID[]): Promise<Record<PostID, any>> {
    if (postIds.length === 0) return {};
    try {
      // GET /posts?postIds=id1,id2,...
      const response = await axios.get(`${CONTENT_SERVICE_URL}/posts`, {
        params: { postIds: postIds.join(',') }
      });
      // postId をキーにした Map/Record に変換して返す
      const postDetailsMap: Record<PostID, any> = {};
      if (Array.isArray(response.data)) {
          response.data.forEach(post => {
              if (post && post.id) {
                  postDetailsMap[post.id] = post; // Post 全体 or 必要な情報だけ
              }
          });
      }
      return postDetailsMap;
    } catch (error) {
      console.error('Error fetching post details:', error);
      throw error;
    }
  }

  // ユーザーのフォローリストを取得するヘルパー関数
  private async _fetchFollowingList(userId: UserId): Promise<UserId[]> {
      try {
          const response = await axios.get(`${USER_SERVICE_URL}/users/${userId}/following`);
          // レスポンス形式に合わせて調整 (例: { following: [id1, id2] })
          return response.data?.following || [];
      } catch (error) {
          console.error(`Error fetching following list for user ${userId}:`, error);
          throw error;
      }
  }

  /**
   * ユーザー向けのフィードを生成 (ロジック大幅変更)
   * @param userId ユーザーID
   */
  async generateFeed(userId: UserId): Promise<{ feedId: string; items: FeedItem[] }> {
    try {
      // 1. 依存情報を並行取得
      const [rankingResponse, followingList] = await Promise.all([
        axios.get(`${RANKING_SERVICE_URL}/rankings`, { params: { limit: RANKING_FETCH_LIMIT } }),
        this._fetchFollowingList(userId)
      ]);

      const rankingEntries = rankingResponse.data || []; // API仕様に合わせて調整
      const rankedPostIds = rankingEntries.map((entry: any) => entry.postId as PostID);

      // TODO: フォローしているユーザーの最近の投稿を取得 (content-service に API が必要？)
      // const followedUserPosts = await this._fetchPostsByAuthors(followingList);

      // 2. フィード候補となる postId リストを作成 (ランキング上位 + フォローユーザー投稿など)
      let candidatePostIds: PostID[] = [...rankedPostIds];
      // TODO: フォローユーザーの投稿 ID を追加
      // candidatePostIds = [...new Set([...candidatePostIds, ...followedUserPosts.map(p => p.postId)])];

      // 3. 候補投稿の詳細情報を取得
      const postDetailsMap = await this._fetchPostDetails(candidatePostIds);

      // 4. フィード項目を生成 (ランキング情報と投稿詳細をマージ)
      const feedItems: FeedItem[] = [];
      const addedPostIds = new Set<PostID>();

      for (const entry of rankingEntries) {
         if (feedItems.length >= FEED_LIMIT) break;
         const postId = entry.postId as PostID;
         const postDetail = postDetailsMap[postId];

         if (postDetail && !addedPostIds.has(postId)) {
             // TODO: user-service から著者名を取得する処理を追加 (任意)
             feedItems.push({
                 postId: postId,
                 title: postDetail.title || 'タイトルなし',
                 authorId: postDetail.authorId,
                 score: entry.score,
                 reason: 'ranking'
             });
             addedPostIds.add(postId);
         }
      }

      // TODO: フォローしているユーザーの投稿を追加 (reason: 'follow')
      // for (const post of followedUserPosts) { ... }

      // TODO: 必要なら他のロジック (多様性確保など) で投稿を追加

      // 5. フィード情報を返す (DB 保存は行わない。毎回動的に生成する方針に変更)
      const feedId = uuidv4(); // 一意なIDを生成 (リクエストごとに変わる)
      return {
        feedId: feedId,
        items: feedItems.slice(0, FEED_LIMIT) // 最終的に上限数に切り詰める
      };

    } catch (error) {
      console.error(`フィード生成エラー (User: ${userId}):`, error);
      // エラー時は空のフィードを返す代わりにエラーを再スロー
      // return { feedId: uuidv4(), items: [] };
      throw error;
    }
  }

  // getFeedById, getLatestFeedByUserId は廃止 (DBを使わないため)
} 