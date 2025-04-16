import { Request, Response } from 'express';
import { EpisodeModel } from '../models/episode.model';
import { ContentModel } from '../models/content.model';

export class EpisodeController {
  private episodeModel: EpisodeModel;
  private contentModel: ContentModel;

  constructor() {
    this.episodeModel = new EpisodeModel();
    this.contentModel = new ContentModel();
  }

  async createEpisode(req: Request, res: Response): Promise<void> {
    try {
      const { contentId } = req.params;
      const { title, body, orderIndex } = req.body;

      // コンテンツの存在確認
      const content = await this.contentModel.getContentById(contentId);
      if (!content) {
        res.status(404).json({ error: '指定された作品が見つかりません' });
        return;
      }

      // バリデーション
      if (!title || body === undefined) {
        res.status(400).json({ error: 'タイトルと本文は必須です' });
        return;
      }

      const episode = await this.episodeModel.createEpisode({
        contentId,
        title,
        body,
        orderIndex: orderIndex || 1
      });

      res.status(201).json({
        episodeId: episode.episode_id,
        contentId: episode.content_id,
        title: episode.title,
        orderIndex: episode.order_index
      });
    } catch (error) {
      console.error('Error creating episode:', error);
      res.status(500).json({ error: '話の作成中にエラーが発生しました' });
    }
  }

  async getEpisodesByContentId(req: Request, res: Response): Promise<void> {
    try {
      const { contentId } = req.params;

      // コンテンツの存在確認
      const content = await this.contentModel.getContentById(contentId);
      if (!content) {
        res.status(404).json({ error: '指定された作品が見つかりません' });
        return;
      }

      const episodes = await this.episodeModel.getEpisodesByContentId(contentId);
      
      res.status(200).json(episodes.map(episode => ({
        episodeId: episode.episode_id,
        title: episode.title,
        orderIndex: episode.order_index
      })));
    } catch (error) {
      console.error('Error fetching episodes:', error);
      res.status(500).json({ error: '話の一覧取得中にエラーが発生しました' });
    }
  }

  async updateEpisode(req: Request, res: Response): Promise<void> {
    try {
      const { contentId, episodeId } = req.params;
      const { title, body } = req.body;

      // エピソードの存在確認
      const episode = await this.episodeModel.getEpisodeById(episodeId);
      if (!episode) {
        res.status(404).json({ error: '指定された話が見つかりません' });
        return;
      }

      // エピソードが指定されたコンテンツに属しているか確認
      if (episode.content_id !== contentId) {
        res.status(403).json({ error: 'この話を更新する権限がありません' });
        return;
      }

      // ここで本来はJWTなどから取得したユーザーIDと作品の著者IDを比較する認可処理を入れる
      // 簡易的な実装として省略

      const updated = await this.episodeModel.updateEpisode(episodeId, {
        title,
        body
      });

      if (!updated) {
        res.status(500).json({ error: '話の更新に失敗しました' });
        return;
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error updating episode:', error);
      res.status(500).json({ error: '話の更新中にエラーが発生しました' });
    }
  }
} 