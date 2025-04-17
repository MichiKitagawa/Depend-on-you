import archiveService from '../../services/archive.service';
import Archive from '../../models/archive.model';

// Archiveモデルのモック
jest.mock('../../models/archive.model', () => {
  return {
    findByContentId: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    __esModule: true,
    default: {
      findByContentId: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
    }
  };
});

describe('ArchiveService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createArchive', () => {
    it('新規アーカイブを作成できること', async () => {
      const contentId = 'test-content-id';
      const mockArchive = {
        archiveId: 'test-archive-id',
        contentId,
        archivedAt: new Date(),
      };

      (Archive.findByContentId as jest.Mock).mockResolvedValue(null);
      (Archive.create as jest.Mock).mockResolvedValue(mockArchive);

      const result = await archiveService.createArchive(contentId);

      expect(Archive.findByContentId).toHaveBeenCalledWith(contentId);
      expect(Archive.create).toHaveBeenCalledWith({
        contentId,
        archivedAt: expect.any(Date),
      });
      expect(result).toEqual(mockArchive);
    });

    it('既存のアーカイブがある場合は新規作成せずに既存を返すこと', async () => {
      const contentId = 'test-content-id';
      const mockArchive = {
        archiveId: 'test-archive-id',
        contentId,
        archivedAt: new Date(),
      };

      (Archive.findByContentId as jest.Mock).mockResolvedValue(mockArchive);

      const result = await archiveService.createArchive(contentId);

      expect(Archive.findByContentId).toHaveBeenCalledWith(contentId);
      expect(Archive.create).not.toHaveBeenCalled();
      expect(result).toEqual(mockArchive);
    });
  });

  describe('getArchiveByContentId', () => {
    it('コンテンツIDからアーカイブを取得できること', async () => {
      const contentId = 'test-content-id';
      const mockArchive = {
        archiveId: 'test-archive-id',
        contentId,
        archivedAt: new Date(),
      };

      (Archive.findByContentId as jest.Mock).mockResolvedValue(mockArchive);

      const result = await archiveService.getArchiveByContentId(contentId);

      expect(Archive.findByContentId).toHaveBeenCalledWith(contentId);
      expect(result).toEqual(mockArchive);
    });

    it('アーカイブが存在しない場合はnullを返すこと', async () => {
      const contentId = 'non-existent-id';

      (Archive.findByContentId as jest.Mock).mockResolvedValue(null);

      const result = await archiveService.getArchiveByContentId(contentId);

      expect(Archive.findByContentId).toHaveBeenCalledWith(contentId);
      expect(result).toBeNull();
    });
  });

  describe('getArchiveById', () => {
    it('アーカイブIDからアーカイブを取得できること', async () => {
      const archiveId = 'test-archive-id';
      const mockArchive = {
        archiveId,
        contentId: 'test-content-id',
        archivedAt: new Date(),
      };

      (Archive.findOne as jest.Mock).mockResolvedValue(mockArchive);

      const result = await archiveService.getArchiveById(archiveId);

      expect(Archive.findOne).toHaveBeenCalledWith({
        where: { archiveId }
      });
      expect(result).toEqual(mockArchive);
    });
  });

  describe('triggerRedistribution', () => {
    it('再配信トリガーを発行できること', async () => {
      const archiveId = 'test-archive-id';
      const mockArchive = {
        archiveId,
        contentId: 'test-content-id',
        archivedAt: new Date(),
        lastTrigger: null,
        save: jest.fn(),
      };

      (Archive.findOne as jest.Mock).mockResolvedValue(mockArchive);

      const result = await archiveService.triggerRedistribution(archiveId);

      expect(Archive.findOne).toHaveBeenCalledWith({
        where: { archiveId }
      });
      expect(mockArchive.lastTrigger).toBeInstanceOf(Date);
      expect(mockArchive.save).toHaveBeenCalled();
      expect(result).toEqual(mockArchive);
    });

    it('アーカイブが存在しない場合はnullを返すこと', async () => {
      const archiveId = 'non-existent-id';

      (Archive.findOne as jest.Mock).mockResolvedValue(null);

      const result = await archiveService.triggerRedistribution(archiveId);

      expect(Archive.findOne).toHaveBeenCalledWith({
        where: { archiveId }
      });
      expect(result).toBeNull();
    });
  });
}); 