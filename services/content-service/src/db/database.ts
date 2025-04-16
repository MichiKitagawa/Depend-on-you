import { Content } from '../models/content.model';
import { Episode } from '../models/episode.model';

/**
 * データベース接続をシミュレートするインメモリシングルトン
 * テスト間でデータを共有するために使用
 */
export class Database {
  private static instance: Database;
  private contents: Content[] = [];
  private episodes: Episode[] = [];

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  // Contents操作メソッド
  getContents(): Content[] {
    return this.contents;
  }

  addContent(content: Content): void {
    this.contents.push(content);
  }

  updateContent(contentId: string, updatedContent: Content): boolean {
    const index = this.contents.findIndex(c => c.content_id === contentId);
    if (index === -1) return false;
    this.contents[index] = updatedContent;
    return true;
  }

  // Episodes操作メソッド
  getEpisodes(): Episode[] {
    return this.episodes;
  }

  addEpisode(episode: Episode): void {
    this.episodes.push(episode);
  }

  updateEpisode(episodeId: string, updatedEpisode: Episode): boolean {
    const index = this.episodes.findIndex(e => e.episode_id === episodeId);
    if (index === -1) return false;
    this.episodes[index] = updatedEpisode;
    return true;
  }

  // デバッグ用
  clearAll(): void {
    this.contents = [];
    this.episodes = [];
  }
} 