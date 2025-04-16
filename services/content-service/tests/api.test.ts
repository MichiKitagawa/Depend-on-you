import request from 'supertest';
import app from '../src/server';

describe('Content API', () => {
  // POST /contents - 新規作品登録
  describe('POST /contents', () => {
    it('should create a new content successfully', async () => {
      const contentData = {
        authorId: 'user-123',
        title: 'Test Content',
        description: 'Test Description',
        genre: 'Fiction',
        tags: ['fantasy', 'adventure'],
        status: 'draft'
      };

      const response = await request(app)
        .post('/contents')
        .send(contentData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('contentId');
      expect(response.body.title).toBe(contentData.title);
      expect(response.body.authorId).toBe(contentData.authorId);
      expect(response.body.status).toBe(contentData.status);
    });

    it('should return 400 when missing required fields', async () => {
      const response = await request(app)
        .post('/contents')
        .send({ description: 'Missing required fields' });

      expect(response.status).toBe(400);
    });
  });

  // GET /contents/:contentId - 作品情報取得
  describe('GET /contents/:contentId', () => {
    it('should retrieve content by ID', async () => {
      // まず作品を作成
      const contentData = {
        authorId: 'user-123',
        title: 'Test Retrieve',
        description: 'Test Description',
        genre: 'Fiction',
        tags: ['scifi'],
        status: 'draft'
      };

      const createResponse = await request(app)
        .post('/contents')
        .send(contentData);

      const contentId = createResponse.body.contentId;

      // 作成した作品を取得
      const getResponse = await request(app)
        .get(`/contents/${contentId}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.contentId).toBe(contentId);
      expect(getResponse.body.title).toBe(contentData.title);
    });

    it('should return 404 for non-existent content', async () => {
      const response = await request(app)
        .get('/contents/non-existent-id');

      expect(response.status).toBe(404);
    });
  });

  // PATCH /contents/:contentId - 作品情報更新
  describe('PATCH /contents/:contentId', () => {
    it('should update content successfully', async () => {
      // まず作品を作成
      const contentData = {
        authorId: 'user-123',
        title: 'Original Title',
        description: 'Original Description',
        genre: 'Fiction',
        tags: ['fantasy'],
        status: 'draft'
      };

      const createResponse = await request(app)
        .post('/contents')
        .send(contentData);

      const contentId = createResponse.body.contentId;

      // 作品を更新
      const updateData = {
        title: 'Updated Title',
        status: 'ongoing'
      };

      const updateResponse = await request(app)
        .patch(`/contents/${contentId}`)
        .send(updateData);

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.title).toBe(updateData.title);
      expect(updateResponse.body.status).toBe(updateData.status);
    });

    it('should return 404 when updating non-existent content', async () => {
      const response = await request(app)
        .patch('/contents/non-existent-id')
        .send({ title: 'New Title' });

      expect(response.status).toBe(404);
    });
  });

  // POST /contents/:contentId/complete - 作品完結
  describe('POST /contents/:contentId/complete', () => {
    it('should mark content as completed', async () => {
      // まず作品を作成
      const contentData = {
        authorId: 'user-123',
        title: 'Test Content',
        description: 'Test Description',
        genre: 'Fiction',
        tags: ['fantasy'],
        status: 'ongoing'
      };

      const createResponse = await request(app)
        .post('/contents')
        .send(contentData);

      const contentId = createResponse.body.contentId;

      // 作品を完結済みにする
      const completeResponse = await request(app)
        .post(`/contents/${contentId}/complete`);

      expect(completeResponse.status).toBe(200);
      expect(completeResponse.body.status).toBe('completed');
    });

    it('should return 404 when completing non-existent content', async () => {
      const response = await request(app)
        .post('/contents/non-existent-id/complete');

      expect(response.status).toBe(404);
    });
  });
});

describe('Episode API', () => {
  // POST /contents/:contentId/episodes - 話投稿
  describe('POST /contents/:contentId/episodes', () => {
    it('should create a new episode successfully', async () => {
      // テスト用の作品を作成
      const contentData = {
        authorId: 'user-123',
        title: 'Test Content for Episodes',
        description: 'Test Description',
        genre: 'Fiction',
        tags: ['fantasy'],
        status: 'ongoing'
      };

      const contentResponse = await request(app)
        .post('/contents')
        .send(contentData);
      
      const contentId = contentResponse.body.contentId;

      const episodeData = {
        title: 'Test Episode',
        body: 'Episode content goes here...',
        orderIndex: 1
      };

      const response = await request(app)
        .post(`/contents/${contentId}/episodes`)
        .send(episodeData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('episodeId');
      expect(response.body.title).toBe(episodeData.title);
      expect(response.body.contentId).toBe(contentId);
      expect(response.body.orderIndex).toBe(episodeData.orderIndex);
    });

    it('should return 400 when missing required fields', async () => {
      // テスト用の作品を作成
      const contentData = {
        authorId: 'user-123',
        title: 'Test Content for Episodes',
        description: 'Test Description',
        genre: 'Fiction',
        tags: ['fantasy'],
        status: 'ongoing'
      };

      const contentResponse = await request(app)
        .post('/contents')
        .send(contentData);
      
      const contentId = contentResponse.body.contentId;

      const response = await request(app)
        .post(`/contents/${contentId}/episodes`)
        .send({ orderIndex: 2 });

      expect(response.status).toBe(400);
    });

    it('should return 404 for non-existent content', async () => {
      const response = await request(app)
        .post('/contents/non-existent-id/episodes')
        .send({
          title: 'Test Episode',
          body: 'Content',
          orderIndex: 1
        });

      expect(response.status).toBe(404);
    });
  });

  // GET /contents/:contentId/episodes - 話一覧取得
  describe('GET /contents/:contentId/episodes', () => {
    it('should retrieve episodes by content ID', async () => {
      // テスト用の作品を作成
      const contentData = {
        authorId: 'user-123',
        title: 'Test Content for Episodes List',
        description: 'Test Description',
        genre: 'Fiction',
        tags: ['fantasy'],
        status: 'ongoing'
      };

      const contentResponse = await request(app)
        .post('/contents')
        .send(contentData);
      
      const contentId = contentResponse.body.contentId;

      // まず複数の話を作成
      await request(app)
        .post(`/contents/${contentId}/episodes`)
        .send({
          title: 'Episode 1',
          body: 'Content 1',
          orderIndex: 1
        });

      await request(app)
        .post(`/contents/${contentId}/episodes`)
        .send({
          title: 'Episode 2',
          body: 'Content 2',
          orderIndex: 2
        });

      // 話一覧を取得
      const response = await request(app)
        .get(`/contents/${contentId}/episodes`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
      expect(response.body[0]).toHaveProperty('episodeId');
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('orderIndex');
    });

    it('should return 404 for non-existent content', async () => {
      const response = await request(app)
        .get('/contents/non-existent-id/episodes');

      expect(response.status).toBe(404);
    });
  });

  // PATCH /contents/:contentId/episodes/:episodeId - 話更新
  describe('PATCH /contents/:contentId/episodes/:episodeId', () => {
    it('should update an episode successfully', async () => {
      // テスト用の作品を作成
      const contentData = {
        authorId: 'user-123',
        title: 'Test Content for Episode Update',
        description: 'Test Description',
        genre: 'Fiction',
        tags: ['fantasy'],
        status: 'ongoing'
      };

      const contentResponse = await request(app)
        .post('/contents')
        .send(contentData);
      
      const contentId = contentResponse.body.contentId;

      // まず話を作成
      const createResponse = await request(app)
        .post(`/contents/${contentId}/episodes`)
        .send({
          title: 'Original Episode Title',
          body: 'Original Episode Body',
          orderIndex: 3
        });

      const episodeId = createResponse.body.episodeId;

      // 話を更新
      const updateData = {
        title: 'Updated Episode Title',
        body: 'Updated Episode Body'
      };

      const updateResponse = await request(app)
        .patch(`/contents/${contentId}/episodes/${episodeId}`)
        .send(updateData);

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.success).toBe(true);
    });

    it('should return 404 when updating non-existent episode', async () => {
      // テスト用の作品を作成
      const contentData = {
        authorId: 'user-123',
        title: 'Test Content for Episode Error',
        description: 'Test Description',
        genre: 'Fiction',
        tags: ['fantasy'],
        status: 'ongoing'
      };

      const contentResponse = await request(app)
        .post('/contents')
        .send(contentData);
      
      const contentId = contentResponse.body.contentId;

      const response = await request(app)
        .patch(`/contents/${contentId}/episodes/non-existent-id`)
        .send({ title: 'New Title' });

      expect(response.status).toBe(404);
    });

    it('should return 403 when episode belongs to different content', async () => {
      // 1つ目のコンテンツを作成
      const firstContentResponse = await request(app)
        .post('/contents')
        .send({
          authorId: 'user-123',
          title: 'First Content',
          description: 'First description',
          genre: 'Fiction',
          tags: ['fantasy'],
          status: 'ongoing'
        });

      const firstContentId = firstContentResponse.body.contentId;

      // 2つ目のコンテンツを作成
      const secondContentResponse = await request(app)
        .post('/contents')
        .send({
          authorId: 'user-123',
          title: 'Second Content',
          description: 'Second description',
          genre: 'Fiction',
          tags: ['fantasy'],
          status: 'ongoing'
        });

      const secondContentId = secondContentResponse.body.contentId;

      // 1つ目のコンテンツに話を追加
      const episodeResponse = await request(app)
        .post(`/contents/${firstContentId}/episodes`)
        .send({
          title: 'Test Episode',
          body: 'Content',
          orderIndex: 1
        });

      const episodeId = episodeResponse.body.episodeId;

      // 2つ目のコンテンツIDで話を更新しようとする（別コンテンツの話）
      const response = await request(app)
        .patch(`/contents/${secondContentId}/episodes/${episodeId}`)
        .send({ title: 'New Title' });

      expect(response.status).toBe(403);
    });
  });
}); 