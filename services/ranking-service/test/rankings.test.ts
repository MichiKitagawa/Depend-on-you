import request from 'supertest';
import express from 'express';
import rankingRoutes from '../src/routes/ranking-routes';
import Ranking from '../src/models/ranking';
import sequelize from '../src/config/database';

// Mock the database models
jest.mock('../src/models/ranking', () => {
  return {
    destroy: jest.fn().mockResolvedValue(5),
    create: jest.fn().mockResolvedValue({}),
    findAll: jest.fn().mockResolvedValue([
      {
        content_id: 'content-1',
        rank_position: 1,
        score_value: 95
      },
      {
        content_id: 'content-3',
        rank_position: 2,
        score_value: 92
      }
    ])
  };
});

// Mock the database connection
jest.mock('../src/config/database', () => {
  return {
    authenticate: jest.fn().mockResolvedValue(true),
    sync: jest.fn().mockResolvedValue(true)
  };
});

// Setup test app
const app = express();
app.use(express.json());
app.use('/', rankingRoutes);

describe('Ranking Service Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /rankings/rebuild', () => {
    it('should successfully rebuild rankings for a valid cluster type', async () => {
      const response = await request(app)
        .post('/rankings/rebuild')
        .send({ clusterType: 'general' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('clusterType', 'general');
      expect(response.body).toHaveProperty('updatedCount');
      expect(Ranking.destroy).toHaveBeenCalled();
      expect(Ranking.create).toHaveBeenCalled();
    });

    it('should return 400 if cluster type is missing', async () => {
      const response = await request(app)
        .post('/rankings/rebuild')
        .send({});

      expect(response.status).toBe(400);
      expect(Ranking.destroy).not.toHaveBeenCalled();
    });
  });

  describe('GET /rankings', () => {
    it('should get rankings with optional filters', async () => {
      const response = await request(app)
        .get('/rankings')
        .query({ clusterType: 'general', limit: '10' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('contentId');
      expect(response.body[0]).toHaveProperty('rankPosition');
      expect(response.body[0]).toHaveProperty('scoreValue');
      expect(Ranking.findAll).toHaveBeenCalled();
    });

    it('should return rankings without filters', async () => {
      const response = await request(app)
        .get('/rankings');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
}); 