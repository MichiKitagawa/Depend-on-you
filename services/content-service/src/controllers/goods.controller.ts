import { Request, Response } from 'express';
import { GoodsService } from '../services/goods.service';

export class GoodsController {
  private goodsService: GoodsService;

  constructor() {
    this.goodsService = new GoodsService();
  }

  // 認証ミドルウェアなどで req.user.id にユーザーIDが設定される想定
  private getAuthorId(req: Request): string {
      // return req.user.id; // 本来の実装
      // return 'dummy-author-id'; // テスト用ダミーID
      if (!(req as any).userId) throw new Error('userId not found in request');
      return (req as any).userId;
  }

  async createGoods(req: Request, res: Response): Promise<void> {
    try {
      const authorId = this.getAuthorId(req);
      const { magazineId } = req.params;
      const { name, description, price, stock } = req.body;
      if (!name || price === undefined) {
        res.status(400).json({ error: 'Name and price are required' });
        return;
      }
      const goods = await this.goodsService.createGoods({ magazineId, name, description, price, stock }, authorId);
       if (!goods) {
          res.status(403).json({ error: 'Not authorized to create goods in this magazine' });
          return;
      }
      res.status(201).json(goods);
    } catch (error) {
      console.error('Error creating goods:', error);
      res.status(500).json({ error: 'Failed to create goods' });
    }
  }

  async getGoodsById(req: Request, res: Response): Promise<void> {
    try {
      const { goodsId } = req.params;
      const goods = await this.goodsService.getGoodsById(goodsId);
      if (!goods) {
        res.status(404).json({ error: 'Goods not found' });
        return;
      }
      res.status(200).json(goods);
    } catch (error) {
      console.error('Error fetching goods:', error);
      res.status(500).json({ error: 'Failed to fetch goods' });
    }
  }

  async getGoodsByMagazineId(req: Request, res: Response): Promise<void> {
    try {
      const { magazineId } = req.params;
      const goods = await this.goodsService.getGoodsByMagazineId(magazineId);
      res.status(200).json(goods);
    } catch (error) {
      console.error('Error fetching goods by magazine:', error);
      res.status(500).json({ error: 'Failed to fetch goods' });
    }
  }

  async updateGoods(req: Request, res: Response): Promise<void> {
    try {
      const authorId = this.getAuthorId(req);
      const { goodsId } = req.params;
      const { name, description, price, stock } = req.body;
      const updatedGoods = await this.goodsService.updateGoods(goodsId, { name, description, price, stock }, authorId);
      if (!updatedGoods) {
        res.status(404).json({ error: 'Goods not found or not authorized to update' });
        return;
      }
      res.status(200).json(updatedGoods);
    } catch (error) {
      console.error('Error updating goods:', error);
      res.status(500).json({ error: 'Failed to update goods' });
    }
  }

  async deleteGoods(req: Request, res: Response): Promise<void> {
    try {
      const authorId = this.getAuthorId(req);
      const { goodsId } = req.params;
      const deleted = await this.goodsService.deleteGoods(goodsId, authorId);
      if (!deleted) {
        res.status(404).json({ error: 'Goods not found or not authorized to delete' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting goods:', error);
      res.status(500).json({ error: 'Failed to delete goods' });
    }
  }
} 