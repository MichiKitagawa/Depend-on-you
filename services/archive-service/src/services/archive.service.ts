import Archive from '../models/archive.model';
// ArchiveId, ContentId を削除し、インポートを空にする (必要なら UserId などを追加)
import { } from '../schema';

// アーカイブサービスクラス
class ArchiveService {
  // 新しいアーカイブを作成
  // contentId の型を string に変更 (本来は PostId or MagazineID)
  async createArchive(contentId: string): Promise<Archive> {
    try {
      // 既存のアーカイブを確認
      const existingArchive = await Archive.findByContentId(contentId);
      if (existingArchive) {
        return existingArchive;
      }

      // 新しいアーカイブを作成
      return await Archive.create({
        contentId, // モデル定義に合わせてカラム名を確認
        archivedAt: new Date()
      });
    } catch (error) {
      console.error('アーカイブ作成エラー:', error);
      throw error;
    }
  }

  // コンテンツIDによるアーカイブの取得
  // contentId の型を string に変更
  async getArchiveByContentId(contentId: string): Promise<Archive | null> {
    try {
      return await Archive.findByContentId(contentId);
    } catch (error) {
      console.error('アーカイブ取得エラー:', error);
      throw error;
    }
  }

  // アーカイブIDによるアーカイブの取得
  // archiveId の型を string に変更
  async getArchiveById(archiveId: string): Promise<Archive | null> {
    try {
      return await Archive.findOne({
        where: { archiveId } // モデル定義に合わせてカラム名を確認
      });
    } catch (error) {
      console.error('アーカイブ取得エラー:', error);
      throw error;
    }
  }

  // 再配信トリガーの発行
  // archiveId の型を string に変更
  async triggerRedistribution(archiveId: string): Promise<Archive | null> {
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