import request from 'supertest';
import express from 'express';
import scoreRoutes from '../routes/score.routes';
import scoreService from '../services/score.service';
import { v4 as uuidv4 } from 'uuid';

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
    it('有効なcontentIdでスコアが再計算される', async () => {
      // モックデータ
      const contentId = uuidv4();
      const mockScore = {
        scoreId: uuidv4(),
        contentId,
        scoreValue: 75,
        detail: {
          reReadRate: 0.15,
          saveRate: 0.10,
          commentDensity: 0.05,
          userScoreFactor: 1.2
        },
        updatedAt: new Date()
      };

      // モックの戻り値を設定
      mockedScoreService.recalculateScore.mockResolvedValue(mockScore);

      // APIリクエスト
      const response = await request(app)
        .post('/scores/recalculate')
        .send({ contentId })
        .set('Accept', 'application/json');

      // アサーション
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        contentId,
        scoreValue: expect.any(Number)
      }));
      expect(mockedScoreService.recalculateScore).toHaveBeenCalledWith(contentId);
    });

    it('contentIdがない場合は400エラーを返す', async () => {
      const response = await request(app)
        .post('/scores/recalculate')
        .send({})
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /scores/:contentId', () => {
    it('有効なcontentIdでスコア情報を取得できる', async () => {
      const contentId = uuidv4();
      const mockScore = {
        scoreId: uuidv4(),
        contentId,
        scoreValue: 85,
        detail: {
          reReadRate: 0.20,
          saveRate: 0.15,
          commentDensity: 0.07,
          userScoreFactor: 1.3
        },
        updatedAt: new Date()
      };

      mockedScoreService.getScoreByContentId.mockResolvedValue(mockScore);

      const response = await request(app)
        .get(`/scores/${contentId}`)
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        contentId,
        scoreValue: expect.any(Number)
      }));
      expect(mockedScoreService.getScoreByContentId).toHaveBeenCalledWith(contentId);
    });

    it('存在しないcontentIdの場合は404エラーを返す', async () => {
      const contentId = uuidv4();
      
      mockedScoreService.getScoreByContentId.mockResolvedValue(null);

      const response = await request(app)
        .get(`/scores/${contentId}`)
        .set('Accept', 'application/json');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /scores', () => {
    it('全てのスコアリストを取得できる', async () => {
      const mockScores = [
        {
          scoreId: uuidv4(),
          contentId: uuidv4(),
          scoreValue: 75,
          detail: {
            reReadRate: 0.15,
            saveRate: 0.10,
            commentDensity: 0.05,
            userScoreFactor: 1.2
          },
          updatedAt: new Date()
        },
        {
          scoreId: uuidv4(),
          contentId: uuidv4(),
          scoreValue: 85,
          detail: {
            reReadRate: 0.20,
            saveRate: 0.15,
            commentDensity: 0.07,
            userScoreFactor: 1.3
          },
          updatedAt: new Date()
        }
      ];

      mockedScoreService.getAllScores.mockResolvedValue(mockScores);

      const response = await request(app)
        .get('/scores')
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('contentId');
      expect(response.body[0]).toHaveProperty('scoreValue');
      expect(mockedScoreService.getAllScores).toHaveBeenCalled();
    });
  });
}); 