import { Request, Response } from 'express';
import archiveController from '../../controllers/archive.controller';
import archiveService from '../../services/archive.service';

// archiveServiceのモック化
jest.mock('../../services/archive.service', () => ({
  createArchive: jest.fn(),
  getArchiveByContentId: jest.fn(),
  triggerRedistribution: jest.fn(),
}));

describe('ArchiveController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn().mockReturnThis();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockResponse = {
      status: mockStatus,
      json: mockJson,
    };
    jest.clearAllMocks();
  });

  describe('createArchive', () => {
    it('正常にアーカイブを作成できること', async () => {
      const mockArchive = {
        archiveId: 'test-archive-id',
        contentId: 'test-content-id',
        archivedAt: new Date(),
      };

      mockRequest = {
        body: { contentId: 'test-content-id' },
      };

      (archiveService.createArchive as jest.Mock).mockResolvedValue(mockArchive);

      await archiveController.createArchive(mockRequest as Request, mockResponse as Response);

      expect(archiveService.createArchive).toHaveBeenCalledWith('test-content-id');
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        archiveId: mockArchive.archiveId,
        contentId: mockArchive.contentId,
        archivedAt: mockArchive.archivedAt,
      });
    });

    it('contentIdがない場合はエラーを返すこと', async () => {
      mockRequest = {
        body: {},
      };

      await archiveController.createArchive(mockRequest as Request, mockResponse as Response);

      expect(archiveService.createArchive).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'contentIdは必須です' });
    });
  });

  describe('getArchiveByContentId', () => {
    it('正常にアーカイブを取得できること', async () => {
      const mockArchive = {
        archiveId: 'test-archive-id',
        contentId: 'test-content-id',
        archivedAt: new Date(),
        lastTrigger: new Date(),
      };

      mockRequest = {
        params: { contentId: 'test-content-id' },
      };

      (archiveService.getArchiveByContentId as jest.Mock).mockResolvedValue(mockArchive);

      await archiveController.getArchiveByContentId(mockRequest as Request, mockResponse as Response);

      expect(archiveService.getArchiveByContentId).toHaveBeenCalledWith('test-content-id');
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        archiveId: mockArchive.archiveId,
        contentId: mockArchive.contentId,
        archivedAt: mockArchive.archivedAt,
        lastTrigger: mockArchive.lastTrigger,
      });
    });

    it('アーカイブが見つからない場合は404を返すこと', async () => {
      mockRequest = {
        params: { contentId: 'non-existent-id' },
      };

      (archiveService.getArchiveByContentId as jest.Mock).mockResolvedValue(null);

      await archiveController.getArchiveByContentId(mockRequest as Request, mockResponse as Response);

      expect(archiveService.getArchiveByContentId).toHaveBeenCalledWith('non-existent-id');
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: '指定されたコンテンツのアーカイブが見つかりません' });
    });
  });

  describe('triggerRedistribution', () => {
    it('正常に再配信トリガーを発行できること', async () => {
      const mockArchive = {
        archiveId: 'test-archive-id',
        contentId: 'test-content-id',
        lastTrigger: new Date(),
      };

      mockRequest = {
        params: { archiveId: 'test-archive-id' },
      };

      (archiveService.triggerRedistribution as jest.Mock).mockResolvedValue(mockArchive);

      await archiveController.triggerRedistribution(mockRequest as Request, mockResponse as Response);

      expect(archiveService.triggerRedistribution).toHaveBeenCalledWith('test-archive-id');
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        archiveId: mockArchive.archiveId,
        contentId: mockArchive.contentId,
        triggeredAt: mockArchive.lastTrigger,
      });
    });

    it('アーカイブが見つからない場合は404を返すこと', async () => {
      mockRequest = {
        params: { archiveId: 'non-existent-id' },
      };

      (archiveService.triggerRedistribution as jest.Mock).mockResolvedValue(null);

      await archiveController.triggerRedistribution(mockRequest as Request, mockResponse as Response);

      expect(archiveService.triggerRedistribution).toHaveBeenCalledWith('non-existent-id');
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: '指定されたアーカイブが見つかりません' });
    });
  });
}); 