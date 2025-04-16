import request from 'supertest';
import express from 'express';
import { ReaderActionController } from '../controllers/reader-action.controller';
import readerActionRoutes from '../routes/reader-action.routes';
import { ActionType } from '../models/reader-action.model';
import { setupDatabase, closeDatabase, sequelize } from './setup';

// データベースモックのセットアップ
jest.mock('../models/reader-action.model', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();
  
  const ReaderAction = dbMock.define('reader_actions', {
    actionId: 'test-action-id',
    userId: 'user123',
    contentId: 'content456',
    actionType: 'boost',
    payload: {},
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  // findAllのモック
  ReaderAction.findAll = jest.fn().mockResolvedValue([]);
  
  // findByPkのモック
  ReaderAction.findByPk = jest.fn().mockImplementation((id) => {
    if (id === 'test-action-id') {
      return Promise.resolve({
        actionId: 'test-action-id',
        userId: 'user123',
        contentId: 'content456',
        actionType: 'boost',
        payload: {},
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    return Promise.resolve(null);
  });
  
  // createのモック
  ReaderAction.create = jest.fn().mockImplementation((data) => {
    return Promise.resolve({
      actionId: 'test-action-id',
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  });
  
  return {
    ReaderAction,
    ReaderActionCreationAttributes: {}
  };
});

// テスト用のアプリケーションを作成
const app = express();
app.use(express.json());
app.use('/', readerActionRoutes);

describe('Reader Action Service API', () => {
  beforeAll(async () => {
    await setupDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  // POST /actions のテスト
  describe('POST /actions', () => {
    it('有効なアクションタイプで登録できること', async () => {
      const response = await request(app)
        .post('/actions')
        .send({
          userId: 'user123',
          contentId: 'content456',
          actionType: 'boost',
          payload: {}
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('actionId');
      expect(response.body.userId).toBe('user123');
      expect(response.body.contentId).toBe('content456');
      expect(response.body.actionType).toBe('boost');
    });

    it('コメントアクションでpayloadにcommentTextが含まれること', async () => {
      const response = await request(app)
        .post('/actions')
        .send({
          userId: 'user123',
          contentId: 'content456',
          actionType: 'comment',
          payload: {
            commentText: '素晴らしい作品です！'
          }
        });

      expect(response.status).toBe(201);
      expect(response.body.payload).toHaveProperty('commentText');
      expect(response.body.payload.commentText).toBe('素晴らしい作品です！');
    });

    it('リアクションアクションでpayloadにemotionが含まれること', async () => {
      const response = await request(app)
        .post('/actions')
        .send({
          userId: 'user123',
          contentId: 'content456',
          actionType: 'reaction',
          payload: {
            emotion: 'wow'
          }
        });

      expect(response.status).toBe(201);
      expect(response.body.payload).toHaveProperty('emotion');
      expect(response.body.payload.emotion).toBe('wow');
    });

    it('無効なアクションタイプの場合は400エラーを返すこと', async () => {
      const response = await request(app)
        .post('/actions')
        .send({
          userId: 'user123',
          contentId: 'content456',
          actionType: 'invalid',
          payload: {}
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('必須パラメータが不足している場合は400エラーを返すこと', async () => {
      const response = await request(app)
        .post('/actions')
        .send({
          userId: 'user123',
          // contentIdが不足
          actionType: 'boost',
          payload: {}
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  // GET /actions のテスト
  describe('GET /actions', () => {
    it('userIdを指定してアクションを取得できること', async () => {
      const response = await request(app)
        .get('/actions')
        .query({ userId: 'user123' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('contentIdを指定してアクションを取得できること', async () => {
      const response = await request(app)
        .get('/actions')
        .query({ contentId: 'content456' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('クエリパラメータがない場合は400エラーを返すこと', async () => {
      const response = await request(app)
        .get('/actions');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  // GET /actions/:actionId のテスト
  describe('GET /actions/:actionId', () => {
    it('存在するアクションIDでアクションを取得できること', async () => {
      const response = await request(app)
        .get(`/actions/test-action-id`);

      expect(response.status).toBe(200);
      expect(response.body.actionId).toBe('test-action-id');
    });

    it('存在しないアクションIDの場合は404エラーを返すこと', async () => {
      const response = await request(app)
        .get('/actions/nonexistent-id');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });
}); 