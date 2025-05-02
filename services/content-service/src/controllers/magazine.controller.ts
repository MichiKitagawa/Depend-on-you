import { Request, Response } from 'express';
import { MagazineService } from '@src/services/magazine.service';

export class MagazineController {
  private magazineService: MagazineService;

  constructor() {
    this.magazineService = new MagazineService();
  }

  // 認証ミドルウェアなどで req.user.id にユーザーIDが設定される想定
  private getAuthorId(req: Request): string {
      // return req.user.id; // 本来の実装
      // return 'dummy-author-id'; // テスト用ダミーID
      if (!(req as any).userId) throw new Error('userId not found in request');
      return (req as any).userId;
  }

  async createMagazine(req: Request, res: Response): Promise<void> {
    try {
      const authorId = this.getAuthorId(req);
      const { title, description } = req.body;
      if (!title) {
        res.status(400).json({ error: 'Title is required' });
        return;
      }
      const magazine = await this.magazineService.createMagazine({ title, description, authorId });
      res.status(201).json(magazine);
    } catch (error) {
      console.error('Error creating magazine:', error);
      res.status(500).json({ error: 'Failed to create magazine' });
    }
  }

  async getMagazineById(req: Request, res: Response): Promise<void> {
    try {
      const { magazineId } = req.params;
      const magazine = await this.magazineService.getMagazineById(magazineId);
      if (!magazine) {
        res.status(404).json({ error: 'Magazine not found' });
        return;
      }
      res.status(200).json(magazine);
    } catch (error) {
      console.error('Error fetching magazine:', error);
      res.status(500).json({ error: 'Failed to fetch magazine' });
    }
  }

  async updateMagazine(req: Request, res: Response): Promise<void> {
    try {
      const authorId = this.getAuthorId(req);
      const { magazineId } = req.params;
      const { title, description } = req.body;
      const updatedMagazine = await this.magazineService.updateMagazine(magazineId, { title, description }, authorId);
      if (!updatedMagazine) {
        // 404 Not Found または 403 Forbidden を返すのが適切か検討
        res.status(404).json({ error: 'Magazine not found or not authorized to update' });
        return;
      }
      res.status(200).json(updatedMagazine);
    } catch (error) {
      console.error('Error updating magazine:', error);
      res.status(500).json({ error: 'Failed to update magazine' });
    }
  }

  async deleteMagazine(req: Request, res: Response): Promise<void> {
    try {
      const authorId = this.getAuthorId(req);
      const { magazineId } = req.params;
      const deleted = await this.magazineService.deleteMagazine(magazineId, authorId);
      if (!deleted) {
        res.status(404).json({ error: 'Magazine not found or not authorized to delete' });
        return;
      }
      res.status(204).send(); // No Content
    } catch (error) {
      console.error('Error deleting magazine:', error);
      res.status(500).json({ error: 'Failed to delete magazine' });
    }
  }

  async getMagazinesByAuthor(req: Request, res: Response): Promise<void> {
      try {
          const { authorId } = req.params; // または req.query など
          const magazines = await this.magazineService.getMagazinesByAuthor(authorId);
          res.status(200).json(magazines);
      } catch (error) {
          console.error('Error fetching magazines by author:', error);
          res.status(500).json({ error: 'Failed to fetch magazines' });
      }
  }
} 