import { ContentModel } from '../src/models/content.model';
import { Database } from '../src/db/database';

describe('ContentModel', () => {
  let contentModel: ContentModel;

  beforeEach(() => {
    // テスト前にデータベースをクリア
    Database.getInstance().clearAll();
    contentModel = new ContentModel();
  });

  describe('createContent', () => {
    it('should create a new content successfully', async () => {
      const contentData = {
        authorId: 'user-123',
        title: 'Test Content',
        description: 'Test Description',
        genre: 'Fiction',
        tags: ['fantasy', 'adventure'],
        status: 'draft' as const
      };

      const result = await contentModel.createContent(contentData);

      expect(result).toHaveProperty('contentId');
      expect(result.title).toBe(contentData.title);
      expect(result.author_id).toBe(contentData.authorId);
      expect(result.status).toBe(contentData.status);
    });
  });

  describe('getContentById', () => {
    it('should return content when it exists', async () => {
      // コンテンツを作成
      const contentData = {
        authorId: 'user-123',
        title: 'Test Content',
        description: 'Test Description',
        genre: 'Fiction',
        tags: ['fantasy', 'adventure'],
        status: 'draft' as const
      };

      const content = await contentModel.createContent(contentData);
      
      // 作成したコンテンツを取得
      const result = await contentModel.getContentById(content.contentId);
      
      expect(result).not.toBeNull();
      expect(result?.content_id).toBe(content.contentId);
      expect(result?.title).toBe(contentData.title);
    });

    it('should return null when content does not exist', async () => {
      const result = await contentModel.getContentById('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('updateContent', () => {
    it('should update content successfully', async () => {
      // コンテンツを作成
      const contentData = {
        authorId: 'user-123',
        title: 'Original Title',
        description: 'Original Description',
        genre: 'Fiction',
        tags: ['fantasy'],
        status: 'draft' as const
      };

      const content = await contentModel.createContent(contentData);
      
      // コンテンツを更新
      const updateData = {
        title: 'Updated Title',
        status: 'ongoing' as const
      };
      
      const result = await contentModel.updateContent(content.contentId, updateData);
      
      expect(result).not.toBeNull();
      expect(result?.title).toBe(updateData.title);
      expect(result?.status).toBe(updateData.status);
    });

    it('should return null when updating non-existent content', async () => {
      const result = await contentModel.updateContent('non-existent-id', { title: 'New Title' });
      expect(result).toBeNull();
    });
  });

  describe('completeContent', () => {
    it('should mark content as completed', async () => {
      // コンテンツを作成
      const contentData = {
        authorId: 'user-123',
        title: 'Test Content',
        description: 'Test Description',
        genre: 'Fiction',
        tags: ['fantasy'],
        status: 'ongoing' as const
      };

      const content = await contentModel.createContent(contentData);
      
      // コンテンツを完結済みにする
      const result = await contentModel.completeContent(content.contentId);
      
      expect(result).not.toBeNull();
      expect(result?.status).toBe('completed');
      
      // 変更が保存されたか確認
      const updatedContent = await contentModel.getContentById(content.contentId);
      expect(updatedContent?.status).toBe('completed');
    });

    it('should return null when completing non-existent content', async () => {
      const result = await contentModel.completeContent('non-existent-id');
      expect(result).toBeNull();
    });
  });
}); 