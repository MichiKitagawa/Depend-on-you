import request from 'supertest';
import express from 'express';
import scoreRoutes from '../routes/score.routes';
import scoreService from '../services/score.service';
import { v4 as uuidv4 } from 'uuid';
import { PostID } from '../../../../shared/schema';

// モックの設定
jest.mock('../services/score.service');
const mockedScoreService = scoreService as jest.Mocked<typeof scoreService>;

// テスト用Expressアプリケーション
const app = express();
app.use(express.json());
app.use('/', scoreRoutes);

describe('スコアサービス API テスト', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /scores/recalculate', () => {
    it('有効なpostIdでスコアが再計算される', async () => {
      // モックデータ (Prisma PostScore 形式)
      const postId: PostID = uuidv4();
      const mockPostScore = {
        id: uuidv4(),
        postId: postId,
        score: 1234, // 仮のスコア
        calculatedAt: new Date(),
      };

      // モックの戻り値を設定
      mockedScoreService.recalculateScore.mockResolvedValue(mockPostScore);

      // APIリクエスト
      const response = await request(app)
        .post('/scores/recalculate')
        .send({ postId })
        .set('Accept', 'application/json');

      // アサーション
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        postId: postId,
        score: expect.any(Number)
      }));
      expect(response.body).toHaveProperty('calculatedAt');
      expect(mockedScoreService.recalculateScore).toHaveBeenCalledWith(postId);
    });

    it('postIdがない場合は400エラーを返す', async () => {
      const response = await request(app)
        .post('/scores/recalculate')
        .send({})
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('postId');
    });
  });

  describe('GET /scores/:postId', () => {
    it('有効なpostIdでスコア情報を取得できる', async () => {
      const postId: PostID = uuidv4();
      const mockPostScore = {
        id: uuidv4(),
        postId: postId,
        score: 5678,
        calculatedAt: new Date(),
      };
      mockedScoreService.getScoreByPostId.mockResolvedValue(mockPostScore);

      const response = await request(app)
        .get(`/scores/${postId}`)
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        postId: postId,
        score: expect.any(Number)
      }));
      expect(response.body).toHaveProperty('calculatedAt');
      expect(mockedScoreService.getScoreByPostId).toHaveBeenCalledWith(postId);
    });

    it('存在しないpostIdの場合は404エラーを返す', async () => {
      const postId: PostID = uuidv4();
      
      mockedScoreService.getScoreByPostId.mockResolvedValue(null);

      const response = await request(app)
        .get(`/scores/${postId}`)
        .set('Accept', 'application/json');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /scores', () => {
    it('全てのスコアリストを取得できる', async () => {
      const mockPostScores = [
        {
          id: uuidv4(),
          postId: uuidv4(),
          score: 1111,
          calculatedAt: new Date()
        },
        {
          id: uuidv4(),
          postId: uuidv4(),
          score: 2222,
          calculatedAt: new Date()
        }
      ];

      mockedScoreService.getAllScores.mockResolvedValue(mockPostScores);

      const response = await request(app)
        .get('/scores')
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('postId');
      expect(response.body[0]).toHaveProperty('score');
      expect(response.body[0]).toHaveProperty('calculatedAt');
      expect(mockedScoreService.getAllScores).toHaveBeenCalled();
    });
  });
}); 