import { ContentId, UserId, ContentStatus } from '../../../../shared/schema';
import { v4 as uuidv4 } from 'uuid';
import { Database } from '../db/database';

export interface Content {
  content_id: ContentId;
  author_id: UserId;
  title: string;
  description: string;
  genre: string;
  tags: string[];
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

export class ContentModel {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async createContent(data: {
    authorId: UserId;
    title: string;
    description: string;
    genre: string;
    tags: string[];
    status: ContentStatus;
  }): Promise<{ contentId: ContentId; author_id: UserId; title: string; description: string; genre: string; tags: string[]; status: ContentStatus }> {
    const now = new Date().toISOString();
    const contentId = uuidv4();

    const newContent: Content = {
      content_id: contentId,
      author_id: data.authorId,
      title: data.title,
      description: data.description,
      genre: data.genre,
      tags: data.tags,
      status: data.status,
      created_at: now,
      updated_at: now
    };

    this.db.addContent(newContent);

    return {
      contentId,
      author_id: data.authorId,
      title: data.title,
      description: data.description,
      genre: data.genre,
      tags: data.tags,
      status: data.status
    };
  }

  async getContentById(contentId: ContentId): Promise<Content | null> {
    const content = this.db.getContents().find(c => c.content_id === contentId);
    return content || null;
  }

  async updateContent(
    contentId: ContentId,
    data: Partial<{
      title: string;
      description: string;
      genre: string;
      tags: string[];
      status: ContentStatus;
    }>
  ): Promise<Omit<Content, 'created_at' | 'updated_at' | 'author_id' | 'description' | 'genre' | 'tags'> | null> {
    const content = await this.getContentById(contentId);
    
    if (!content) {
      return null;
    }
    
    const updatedContent: Content = {
      ...content,
      ...data,
      updated_at: new Date().toISOString()
    };

    const updated = this.db.updateContent(contentId, updatedContent);
    
    if (!updated) {
      return null;
    }

    return {
      content_id: updatedContent.content_id,
      title: updatedContent.title,
      status: updatedContent.status
    };
  }

  async completeContent(contentId: ContentId): Promise<{ status: ContentStatus } | null> {
    const content = await this.getContentById(contentId);
    
    if (!content) {
      return null;
    }

    const updatedContent: Content = {
      ...content,
      status: 'completed',
      updated_at: new Date().toISOString()
    };

    const updated = this.db.updateContent(contentId, updatedContent);
    
    if (!updated) {
      return null;
    }

    return { status: 'completed' };
  }
} 