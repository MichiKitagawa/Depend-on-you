import { EpisodeModel } from '../src/models/episode.model';
import { Database } from '../src/db/database';

describe('EpisodeModel', () => {
  let episodeModel: EpisodeModel;

  beforeEach(() => {
    // テスト前にデータベースをクリア
    Database.getInstance().clearAll();
    episodeModel = new EpisodeModel();
  });

  describe('createEpisode', () => {
    it('should create a new episode successfully', async () => {
      const episodeData = {
        contentId: 'content-123',
        title: 'Test Episode',
        body: 'Episode content goes here...',
        orderIndex: 1
      };

      const result = await episodeModel.createEpisode(episodeData);

      expect(result).toHaveProperty('episode_id');
      expect(result.title).toBe(episodeData.title);
      expect(result.content_id).toBe(episodeData.contentId);
      expect(result.order_index).toBe(episodeData.orderIndex);
    });
  });

  describe('getEpisodesByContentId', () => {
    it('should return episodes for a content in order', async () => {
      const contentId = 'content-123';
      
      // 複数のエピソードを作成（順番バラバラで）
      await episodeModel.createEpisode({
        contentId,
        title: 'Episode 2',
        body: 'Content 2',
        orderIndex: 2
      });
      
      await episodeModel.createEpisode({
        contentId,
        title: 'Episode 1',
        body: 'Content 1',
        orderIndex: 1
      });
      
      await episodeModel.createEpisode({
        contentId,
        title: 'Episode 3',
        body: 'Content 3',
        orderIndex: 3
      });
      
      // エピソードを取得
      const episodes = await episodeModel.getEpisodesByContentId(contentId);
      
      expect(episodes.length).toEqual(3);
      expect(episodes[0].title).toBe('Episode 1');
      expect(episodes[1].title).toBe('Episode 2');
      expect(episodes[2].title).toBe('Episode 3');
    });

    it('should return empty array for non-existent content', async () => {
      const episodes = await episodeModel.getEpisodesByContentId('non-existent-id');
      expect(episodes).toEqual([]);
    });
  });

  describe('getEpisodeById', () => {
    it('should return episode when it exists', async () => {
      // エピソードを作成
      const episodeData = {
        contentId: 'content-123',
        title: 'Test Episode',
        body: 'Episode content',
        orderIndex: 1
      };

      const episode = await episodeModel.createEpisode(episodeData);
      
      // 作成したエピソードを取得
      const result = await episodeModel.getEpisodeById(episode.episode_id);
      
      expect(result).not.toBeNull();
      expect(result?.episode_id).toBe(episode.episode_id);
      expect(result?.title).toBe(episodeData.title);
      expect(result?.body).toBe(episodeData.body);
    });

    it('should return null when episode does not exist', async () => {
      const result = await episodeModel.getEpisodeById('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('updateEpisode', () => {
    it('should update episode successfully', async () => {
      // エピソードを作成
      const episodeData = {
        contentId: 'content-123',
        title: 'Original Title',
        body: 'Original Body',
        orderIndex: 1
      };

      const episode = await episodeModel.createEpisode(episodeData);
      
      // エピソードを更新
      const updateData = {
        title: 'Updated Title',
        body: 'Updated Body'
      };
      
      const success = await episodeModel.updateEpisode(episode.episode_id, updateData);
      
      expect(success).toBe(true);
      
      // 更新内容を確認
      const updatedEpisode = await episodeModel.getEpisodeById(episode.episode_id);
      expect(updatedEpisode?.title).toBe(updateData.title);
      expect(updatedEpisode?.body).toBe(updateData.body);
    });

    it('should return false when updating non-existent episode', async () => {
      const success = await episodeModel.updateEpisode('non-existent-id', { title: 'New Title' });
      expect(success).toBe(false);
    });
  });
}); 