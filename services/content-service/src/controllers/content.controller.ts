import { Request, Response } from 'express';
import { ContentModel } from '../models/content.model';
import { ContentStatus } from '../../../../shared/schema';

export class ContentController {
  private contentModel: ContentModel;

  constructor() {
    this.contentModel = new ContentModel();
  }

  async createContent(req: Request, res: Response): Promise<void> {
    try {
      const { authorId, title, description, genre, tags, status } = req.body;

      // バリデーション
      if (!authorId || !title) {
        res.status(400).json({ error: '著者IDとタイトルは必須です' });
        return;
      }

      const content = await this.contentModel.createContent({
        authorId,
        title,
        description: description || '',
        genre: genre || '',
        tags: tags || [],
        status: (status as ContentStatus) || 'draft'
      });

      res.status(201).json({
        contentId: content.contentId,
        title: content.title,
        authorId: content.author_id,
        status: content.status
      });
    } catch (error) {
      console.error('Error creating content:', error);
      res.status(500).json({ error: '作品の作成中にエラーが発生しました' });
    }
  }

  async getContentById(req: Request, res: Response): Promise<void> {
    try {
      const { contentId } = req.params;
      const content = await this.contentModel.getContentById(contentId);

      if (!content) {
        res.status(404).json({ error: '作品が見つかりません' });
        return;
      }

      res.status(200).json({
        contentId: content.content_id,
        authorId: content.author_id,
        title: content.title,
        description: content.description,
        genre: content.genre,
        tags: content.tags,
        status: content.status
      });
    } catch (error) {
      console.error('Error fetching content:', error);
      res.status(500).json({ error: '作品の取得中にエラーが発生しました' });
    }
  }

  async updateContent(req: Request, res: Response): Promise<void> {
    try {
      const { contentId } = req.params;
      const { title, description, genre, tags, status } = req.body;

      // ここで本来はJWTなどから取得したユーザーIDと作品の著者IDを比較する認可処理を入れる
      // 簡易的な実装として省略

      const updatedContent = await this.contentModel.updateContent(contentId, {
        title,
        description,
        genre,
        tags,
        status
      });

      if (!updatedContent) {
        res.status(404).json({ error: '作品が見つかりません' });
        return;
      }

      res.status(200).json({
        contentId: updatedContent.content_id,
        title: updatedContent.title,
        status: updatedContent.status
      });
    } catch (error) {
      console.error('Error updating content:', error);
      res.status(500).json({ error: '作品の更新中にエラーが発生しました' });
    }
  }

  async completeContent(req: Request, res: Response): Promise<void> {
    try {
      const { contentId } = req.params;
      
      // ここで本来はJWTなどから取得したユーザーIDと作品の著者IDを比較する認可処理を入れる
      // 簡易的な実装として省略

      const result = await this.contentModel.completeContent(contentId);
      
      if (!result) {
        res.status(404).json({ error: '作品が見つかりません' });
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('Error completing content:', error);
      res.status(500).json({ error: '作品の完結処理中にエラーが発生しました' });
    }
  }
} 