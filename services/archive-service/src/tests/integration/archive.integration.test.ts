import request from 'supertest';
import express from 'express';
import archiveRoutes from '../../routes/archive.routes';
import Archive from '../../models/archive.model';
import { initDatabase } from '../../utils/database';

// モックデータベース
jest.mock('../../utils/database', () => ({
  initDatabase: jest.fn().mockResolvedValue(undefined),
  __esModule: true,
  default: {
    define: jest.fn().mockReturnValue({}),
  },
}));

// モックモデル
jest.mock('../../models/archive.model', () => {
  const mockArchive = {
    archiveId: 'test-archive-id',
    contentId: 'test-content-id',
    archivedAt: new Date('2025-04-01T00:00:00Z'),
    lastTrigger: null,
    save: jest.fn().mockImplementation(function(this: any) {
      this.lastTrigger = new Date('2025-04-15T00:00:00Z');
      return this;
    }),
  };
  
  return {
    findByContentId: jest.fn().mockImplementation((contentId: string) => {
      return contentId === 'test-content-id' ? mockArchive : null;
    }),
    findOne: jest.fn().mockImplementation(({ where }) => {
      return where.archiveId === 'test-archive-id' ? mockArchive : null;
    }),
    create: jest.fn().mockImplementation(({ contentId }) => {
      return {
        archiveId: 'new-archive-id',
        contentId,
        archivedAt: new Date('2025-04-01T00:00:00Z'),
      };
    }),
    __esModule: true,
    default: {
      findByContentId: jest.fn().mockImplementation((contentId: string) => {
        return contentId === 'test-content-id' ? mockArchive : null;
      }),
      findOne: jest.fn().mockImplementation(({ where }) => {
        return where.archiveId === 'test-archive-id' ? mockArchive : null;
      }),
      create: jest.fn().mockImplementation(({ contentId }) => {
        return {
          archiveId: 'new-archive-id',
          contentId,
          archivedAt: new Date('2025-04-01T00:00:00Z'),
        };
      }),
    }
  };
});

// テスト用アプリケーションのセットアップ
const app = express();
app.use(express.json());
app.use('/', archiveRoutes);

describe('Archive API統合テスト', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /archives', () => {
    it('新規アーカイブを作成できること', async () => {
      const response = await request(app)
        .post('/archives')
        .send({ contentId: 'new-content-id' })
        .expect(201);

      expect(response.body).toHaveProperty('archiveId', 'new-archive-id');
      expect(response.body).toHaveProperty('contentId', 'new-content-id');
      expect(response.body).toHaveProperty('archivedAt');
    });

    it('既存のコンテンツIDではアーカイブを重複作成しないこと', async () => {
      const response = await request(app)
        .post('/archives')
        .send({ contentId: 'test-content-id' })
        .expect(201);

      expect(response.body).toHaveProperty('archiveId', 'test-archive-id');
      expect(Archive.create).not.toHaveBeenCalled();
    });

    it('contentIdなしでリクエストすると400エラーを返すこと', async () => {
      const response = await request(app)
        .post('/archives')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error', 'contentIdは必須です');
    });
  });

  describe('GET /archives/:contentId', () => {
    it('存在するコンテンツIDのアーカイブ情報を取得できること', async () => {
      const response = await request(app)
        .get('/archives/test-content-id')
        .expect(200);

      expect(response.body).toHaveProperty('archiveId', 'test-archive-id');
      expect(response.body).toHaveProperty('contentId', 'test-content-id');
      expect(response.body).toHaveProperty('archivedAt');
    });

    it('存在しないコンテンツIDでは404エラーを返すこと', async () => {
      const response = await request(app)
        .get('/archives/non-existent-id')
        .expect(404);

      expect(response.body).toHaveProperty('error', '指定されたコンテンツのアーカイブが見つかりません');
    });
  });

  describe('POST /archives/:archiveId/trigger', () => {
    it('再配信トリガーを発行できること', async () => {
      const response = await request(app)
        .post('/archives/test-archive-id/trigger')
        .expect(200);

      expect(response.body).toHaveProperty('archiveId', 'test-archive-id');
      expect(response.body).toHaveProperty('contentId', 'test-content-id');
      expect(response.body).toHaveProperty('triggeredAt');
    });

    it('存在しないアーカイブIDでは404エラーを返すこと', async () => {
      const response = await request(app)
        .post('/archives/non-existent-id/trigger')
        .expect(404);

      expect(response.body).toHaveProperty('error', '指定されたアーカイブが見つかりません');
    });
  });
}); 