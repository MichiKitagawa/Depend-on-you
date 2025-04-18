import { ContentId, EpisodeId } from '../schema';
import { v4 as uuidv4 } from 'uuid';
import { Database } from '../db/database';

export interface Episode {
  episode_id: EpisodeId;
  content_id: ContentId;
  title: string;
  body: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export class EpisodeModel {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async createEpisode(data: {
    contentId: ContentId;
    title: string;
    body: string;
    orderIndex: number;
  }): Promise<Omit<Episode, 'created_at' | 'updated_at' | 'body'>> {
    const now = new Date().toISOString();
    const episodeId = uuidv4();

    const newEpisode: Episode = {
      episode_id: episodeId,
      content_id: data.contentId,
      title: data.title,
      body: data.body,
      order_index: data.orderIndex,
      created_at: now,
      updated_at: now
    };

    this.db.addEpisode(newEpisode);

    return {
      episode_id: episodeId,
      content_id: data.contentId,
      title: data.title,
      order_index: data.orderIndex
    };
  }

  async getEpisodesByContentId(contentId: ContentId): Promise<Omit<Episode, 'body' | 'created_at' | 'updated_at' | 'content_id'>[]> {
    const episodes = this.db.getEpisodes()
      .filter(e => e.content_id === contentId)
      .sort((a, b) => a.order_index - b.order_index);
    
    return episodes.map(e => ({
      episode_id: e.episode_id,
      title: e.title,
      order_index: e.order_index
    }));
  }

  async getEpisodeById(episodeId: EpisodeId): Promise<Episode | null> {
    const episode = this.db.getEpisodes().find(e => e.episode_id === episodeId);
    return episode || null;
  }

  async updateEpisode(
    episodeId: EpisodeId,
    data: Partial<{
      title: string;
      body: string;
    }>
  ): Promise<boolean> {
    const episode = await this.getEpisodeById(episodeId);
    
    if (!episode) {
      return false;
    }

    const updatedEpisode: Episode = {
      ...episode,
      ...data,
      updated_at: new Date().toISOString()
    };

    return this.db.updateEpisode(episodeId, updatedEpisode);
  }
} 