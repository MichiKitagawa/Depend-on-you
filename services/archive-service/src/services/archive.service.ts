import Archive from '../models/archive.model';
import { ArchiveId, ContentId } from '../../../../shared/schema';

// アーカイブサービスクラス
class ArchiveService {
  // 新しいアーカイブを作成
  async createArchive(contentId: ContentId): Promise<Archive> {
    try {
      // 既存のアーカイブを確認
      const existingArchive = await Archive.findByContentId(contentId);
      if (existingArchive) {
        return existingArchive;
      }

      // 新しいアーカイブを作成
      return await Archive.create({
        contentId,
        archivedAt: new Date()
      });
    } catch (error) {
      console.error('アーカイブ作成エラー:', error);
      throw error;
    }
  }

  // コンテンツIDによるアーカイブの取得
  async getArchiveByContentId(contentId: ContentId): Promise<Archive | null> {
    try {
      return await Archive.findByContentId(contentId);
    } catch (error) {
      console.error('アーカイブ取得エラー:', error);
      throw error;
    }
  }

  // アーカイブIDによるアーカイブの取得
  async getArchiveById(archiveId: ArchiveId): Promise<Archive | null> {
    try {
      return await Archive.findOne({
        where: { archiveId }
      });
    } catch (error) {
      console.error('アーカイブ取得エラー:', error);
      throw error;
    }
  }

  // 再配信トリガーの発行
  async triggerRedistribution(archiveId: ArchiveId): Promise<Archive | null> {
    try {
      const archive = await this.getArchiveById(archiveId);
      if (!archive) {
        return null;
      }

      // トリガー時間を更新
      archive.lastTrigger = new Date();
      await archive.save();

      return archive;
    } catch (error) {
      console.error('再配信トリガーエラー:', error);
      throw error;
    }
  }
}

export default new ArchiveService(); 