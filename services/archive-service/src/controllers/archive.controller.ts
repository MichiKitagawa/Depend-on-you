import { Request, Response } from 'express';
import archiveService from '../services/archive.service';
import { ContentId, ArchiveId } from '../schema';

class ArchiveController {
  // 新しいアーカイブを作成
  async createArchive(req: Request, res: Response): Promise<void> {
    try {
      const { contentId } = req.body;

      if (!contentId) {
        res.status(400).json({ error: 'contentIdは必須です' });
        return;
      }

      const archive = await archiveService.createArchive(contentId as ContentId);
      res.status(201).json({
        archiveId: archive.archiveId,
        contentId: archive.contentId,
        archivedAt: archive.archivedAt
      });
    } catch (error) {
      console.error('アーカイブ作成エラー:', error);
      res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
  }

  // コンテンツIDによるアーカイブの取得
  async getArchiveByContentId(req: Request, res: Response): Promise<void> {
    try {
      const contentId = req.params.contentId as ContentId;
      const archive = await archiveService.getArchiveByContentId(contentId);

      if (!archive) {
        res.status(404).json({ error: '指定されたコンテンツのアーカイブが見つかりません' });
        return;
      }

      res.status(200).json({
        archiveId: archive.archiveId,
        contentId: archive.contentId,
        archivedAt: archive.archivedAt,
        lastTrigger: archive.lastTrigger
      });
    } catch (error) {
      console.error('アーカイブ取得エラー:', error);
      res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
  }

  // 再配信トリガーの発行
  async triggerRedistribution(req: Request, res: Response): Promise<void> {
    try {
      const archiveId = req.params.archiveId as ArchiveId;
      const updatedArchive = await archiveService.triggerRedistribution(archiveId);

      if (!updatedArchive) {
        res.status(404).json({ error: '指定されたアーカイブが見つかりません' });
        return;
      }

      res.status(200).json({
        archiveId: updatedArchive.archiveId,
        contentId: updatedArchive.contentId,
        triggeredAt: updatedArchive.lastTrigger
      });
    } catch (error) {
      console.error('再配信トリガーエラー:', error);
      res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
  }
}

export default new ArchiveController(); 