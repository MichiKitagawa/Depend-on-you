import request from 'supertest';
import app from '@src/server'; // デフォルトインポートに変更し、ファイル名を修正
import { PrismaClient } from '@generated/prisma';

const prisma = new PrismaClient();

// テスト用の認証ヘッダー（仮）
const authHeader = { 'x-user-id': 'test-author-id-123' };
const BASE_PATH = '/contents'; // ベースパスを定義

describe('Content Service API', () => {
  let createdMagazineId: string;
  let createdPostId: string;
  let createdGoodsId: string;

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
    it('should create a new magazine', async () => {
      const res = await request(app)
        .post(`${BASE_PATH}/magazines`)
        .set(authHeader) // 認証ヘッダーを設定
        .send({ title: 'API Test Magazine', description: 'Desc' });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe('API Test Magazine');
      createdMagazineId = res.body.id;
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

  // PATCH, DELETE のテストケースも同様に追加

}); 