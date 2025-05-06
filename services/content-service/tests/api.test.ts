import request from 'supertest';
import app from '../src/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// テスト用の認証ヘッダー（仮）
const authorUserId = 'test-author-id-123'; // Define author ID used in authHeader
const otherUserId = 'other-user-id'; // Define other user ID used in otherAuthHeader
const authHeader = { 'x-user-id': authorUserId };
const otherAuthHeader = { 'x-user-id': otherUserId };
const BASE_PATH = '/contents'; // ベースパスを定義

describe('Content Service API', () => {
  let createdMagazineId: string;
  let createdPostId: string;
  let createdGoodsId: string;
  let errorSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks(); // モックの呼び出し履歴をクリア
    // 実際のDB操作はモックされているので、ここではクリアのみ
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
    warnSpy.mockRestore();
  });

  beforeAll(async () => {
    // テスト実行前にDBをクリーンにする (必要に応じて)
    await prisma.post.deleteMany({});
    await prisma.goods.deleteMany({});
    await prisma.magazine.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // === Magazine Tests ===
  describe('POST /contents/magazines', () => {
    it('should create a new magazine with correct authorId', async () => {
      const res = await request(app)
        .post(`${BASE_PATH}/magazines`)
        .set(authHeader)
        .send({ title: 'API Test Magazine', description: 'Desc' });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      createdMagazineId = res.body.id;

      // Verify authorId in DB
      const dbMagazine = await prisma.magazine.findUnique({ where: { id: createdMagazineId } });
      expect(dbMagazine).toBeDefined();
      expect(dbMagazine?.authorId).toBe(authorUserId); // Check if authorId matches the one sent in header
    });
     it('should return 400 if title is missing', async () => {
      const res = await request(app)
        .post(`${BASE_PATH}/magazines`)
        .set(authHeader)
        .send({ description: 'Desc only' });
      expect(res.statusCode).toEqual(400);
    });
    // 認証なしケース (401 Unauthorized を期待する、など)
  });

  describe('GET /contents/magazines/:magazineId', () => {
    it('should get a magazine by id', async () => {
       expect(createdMagazineId).toBeDefined(); // Ensure magazine was created
      const res = await request(app).get(`${BASE_PATH}/magazines/${createdMagazineId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.id).toBe(createdMagazineId);
      expect(res.body.title).toBe('API Test Magazine');
    });
    it('should return 404 for non-existent magazine', async () => {
      const res = await request(app).get(`${BASE_PATH}/magazines/non-existent-id`);
      expect(res.statusCode).toEqual(404);
    });
  });

  // === Post Tests ===
   describe('POST /contents/magazines/:magazineId/posts', () => {
    it('should create a new post for the magazine', async () => {
      expect(createdMagazineId).toBeDefined();
      const res = await request(app)
        .post(`${BASE_PATH}/magazines/${createdMagazineId}/posts`)
        .set(authHeader)
        .send({ title: 'API Test Post', content: 'Post content' });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe('API Test Post');
      expect(res.body.magazineId).toBe(createdMagazineId);
      createdPostId = res.body.id;
    });
     it('should return 400 if title or content is missing', async () => {
      const res = await request(app)
        .post(`${BASE_PATH}/magazines/${createdMagazineId}/posts`)
        .set(authHeader)
        .send({ title: 'Title only' });
      expect(res.statusCode).toEqual(400);
    });
    // 存在しない MagazineID での作成テスト (403 or 404)
    // 認証なしテスト
  });

    describe('GET /contents/posts/:postId', () => {
      it('should get a post by id', async () => {
         expect(createdPostId).toBeDefined();
        const res = await request(app).get(`${BASE_PATH}/posts/${createdPostId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.id).toBe(createdPostId);
      });
      // 404 テスト
    });

    describe('GET /contents/magazines/:magazineId/posts', () => {
      it('should get all posts for a magazine', async () => {
         expect(createdMagazineId).toBeDefined();
        const res = await request(app).get(`${BASE_PATH}/magazines/${createdMagazineId}/posts`);
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].id).toBe(createdPostId);
      });
      // 404 テスト (Magazine が存在しない場合)
    });

  // === Goods Tests ===
  describe('POST /contents/magazines/:magazineId/goods', () => {
    it('should create new goods for the magazine', async () => {
      expect(createdMagazineId).toBeDefined();
      const res = await request(app)
        .post(`${BASE_PATH}/magazines/${createdMagazineId}/goods`)
        .set(authHeader)
        .send({ name: 'API Test Goods', price: 500, stock: 20 });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe('API Test Goods');
      expect(res.body.magazineId).toBe(createdMagazineId);
      createdGoodsId = res.body.id;
    });
    it('should return 400 if name or price is missing', async () => {
      const res = await request(app)
        .post(`${BASE_PATH}/magazines/${createdMagazineId}/goods`)
        .set(authHeader)
        .send({ name: 'Name only' });
      expect(res.statusCode).toEqual(400);
    });
    // 認証なし、存在しない MagazineID など
  });

    describe('GET /contents/goods/:goodsId', () => {
      it('should get goods by id', async () => {
         expect(createdGoodsId).toBeDefined();
        const res = await request(app).get(`${BASE_PATH}/goods/${createdGoodsId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.id).toBe(createdGoodsId);
      });
      // 404
    });

    describe('GET /contents/magazines/:magazineId/goods', () => {
      it('should get all goods for a magazine', async () => {
         expect(createdMagazineId).toBeDefined();
        const res = await request(app).get(`${BASE_PATH}/magazines/${createdMagazineId}/goods`);
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].id).toBe(createdGoodsId);
      });
      // 404 (Magazine)
    });

  // === Update (PATCH) Tests ===
  describe('PATCH /contents/magazines/:magazineId', () => {
    it('should update the magazine title by the author', async () => {
      expect(createdMagazineId).toBeDefined();
      const res = await request(app)
        .patch(`${BASE_PATH}/magazines/${createdMagazineId}`)
        .set(authHeader) // Use author's header
        .send({ title: 'Updated API Test Magazine' });
      expect(res.statusCode).toEqual(200);
      expect(res.body.title).toBe('Updated API Test Magazine');
    });

    it('should return 403 if user is not the author', async () => {
        expect(createdMagazineId).toBeDefined();
        // Optional: Verify the magazine authorId one more time before the test
        const dbMagazine = await prisma.magazine.findUnique({ where: { id: createdMagazineId } });
        expect(dbMagazine?.authorId).toBe(authorUserId); // Ensure it's still the original author

        const res = await request(app)
            .patch(`${BASE_PATH}/magazines/${createdMagazineId}`)
            .set(otherAuthHeader) // Use other user's header
            .send({ title: 'Attempt to Update' });

        // Debug log if fails
        if (res.statusCode !== 403) {
            console.log(`DEBUG: Failed 403 test. Status: ${res.statusCode}, Body: ${JSON.stringify(res.body)}`);
            const updatedDbMagazine = await prisma.magazine.findUnique({ where: { id: createdMagazineId } });
            console.log(`DEBUG: Magazine authorId in DB: ${updatedDbMagazine?.authorId}, Request User ID: ${otherUserId}`);
        }

        expect(res.statusCode).toEqual(403);
    });
    // 404 (Magazine not found), 400 (Invalid data)
  });

  describe('PATCH /contents/posts/:postId', () => {
      it('should update the post content', async () => {
        expect(createdPostId).toBeDefined();
        const res = await request(app)
          .patch(`${BASE_PATH}/posts/${createdPostId}`)
          .set(authHeader)
          .send({ content: 'Updated post content via API' });
        expect(res.statusCode).toEqual(200);
        expect(res.body.content).toBe('Updated post content via API');
      });
      // 403 (Not author), 404 (Post not found), 400 (Invalid data)
  });

   describe('PATCH /contents/goods/:goodsId', () => {
      it('should update the goods price and stock', async () => {
        expect(createdGoodsId).toBeDefined();
        const res = await request(app)
          .patch(`${BASE_PATH}/goods/${createdGoodsId}`)
          .set(authHeader)
          .send({ price: 750, stock: 15 });
        expect(res.statusCode).toEqual(200);
        expect(res.body.price).toBe(750);
        expect(res.body.stock).toBe(15);
      });
      // 403 (Not author), 404 (Goods not found), 400 (Invalid data)
  });

  // === Delete Tests ===
  describe('DELETE /contents/posts/:postId', () => {
    it('should delete the post', async () => {
      expect(createdPostId).toBeDefined();
      const res = await request(app)
        .delete(`${BASE_PATH}/posts/${createdPostId}`)
        .set(authHeader);
      expect(res.statusCode).toEqual(204);

      // Verify it's actually deleted
      const getRes = await request(app).get(`${BASE_PATH}/posts/${createdPostId}`);
      expect(getRes.statusCode).toEqual(404);
    });
    // 403 (Not author), 404 (Post not found)
  });

  describe('DELETE /contents/goods/:goodsId', () => {
      it('should delete the goods', async () => {
        expect(createdGoodsId).toBeDefined();
        const res = await request(app)
          .delete(`${BASE_PATH}/goods/${createdGoodsId}`)
          .set(authHeader);
        expect(res.statusCode).toEqual(204);

        // Verify deletion
        const getRes = await request(app).get(`${BASE_PATH}/goods/${createdGoodsId}`);
        expect(getRes.statusCode).toEqual(404);
      });
      // 403, 404
  });

  describe('DELETE /contents/magazines/:magazineId', () => {
    it('should delete the magazine (and associated posts/goods - depends on cascade)', async () => {
      expect(createdMagazineId).toBeDefined();
      const res = await request(app)
        .delete(`${BASE_PATH}/magazines/${createdMagazineId}`)
        .set(authHeader);
      expect(res.statusCode).toEqual(204);

       // Verify deletion
      const getRes = await request(app).get(`${BASE_PATH}/magazines/${createdMagazineId}`);
      expect(getRes.statusCode).toEqual(404);
      // Potentially check if posts/goods are also deleted if cascade is expected
    });
     // 403, 404
  });

}); 