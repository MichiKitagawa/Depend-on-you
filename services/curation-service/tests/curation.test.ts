import request from 'supertest';
import express from 'express';
import curationRoutes from '../src/routes/curation.routes';
import Curation from '../src/models/curation.model';
import { v4 as uuidv4 } from 'uuid';

// Mock the curation model
jest.mock('../src/models/curation.model', () => {
  const mockCuration = {
    create: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn(),
  };
  return mockCuration;
});

// Create a test app
const app = express();
app.use(express.json());
app.use('/curations', curationRoutes);

// Set up test data
const testCuration = {
  userId: 'test-user-123',
  title: 'Test Playlist',
  items: ['content-1', 'content-2', 'content-3'],
  reviewBody: 'This is a great collection'
};

const mockCurationId = uuidv4();

describe('Curation API Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  // Test POST /curations
  describe('POST /curations', () => {
    it('should create a new curation', async () => {
      // Mock the create method to return a curation
      const mockCreatedCuration = {
        curation_id: mockCurationId,
        user_id: testCuration.userId,
        title: testCuration.title,
        items: testCuration.items,
        review_body: testCuration.reviewBody,
        created_at: new Date(),
        updated_at: new Date(),
        get: jest.fn().mockReturnValue({
          curation_id: mockCurationId,
          user_id: testCuration.userId,
          title: testCuration.title,
          items: testCuration.items,
          review_body: testCuration.reviewBody,
          created_at: new Date(),
          updated_at: new Date(),
        })
      };
      
      (Curation.create as jest.Mock).mockResolvedValue(mockCreatedCuration);

      const response = await request(app)
        .post('/curations')
        .send(testCuration);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(testCuration.title);
      expect(response.body.user_id).toBe(testCuration.userId);
      expect(response.body.items).toEqual(testCuration.items);
      expect(response.body.review_body).toBe(testCuration.reviewBody);
      expect(response.body.curation_id).toBeDefined();
    });

    it('should return 400 if required fields are missing', async () => {
      const invalidPayload = {
        title: 'Test without userId',
        items: ['content-1']
      };

      const response = await request(app)
        .post('/curations')
        .send(invalidPayload);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });

  // Test GET /curations/:curationId
  describe('GET /curations/:curationId', () => {
    it('should get a curation by ID', async () => {
      // Mock the findByPk method to return a curation
      const mockCuration = {
        curation_id: mockCurationId,
        user_id: 'test-user-123',
        title: 'Test Playlist',
        items: ['content-1', 'content-2'],
        review_body: 'Test review',
        created_at: new Date(),
        updated_at: new Date(),
        get: jest.fn().mockReturnValue({
          curation_id: mockCurationId,
          user_id: 'test-user-123',
          title: 'Test Playlist',
          items: ['content-1', 'content-2'],
          review_body: 'Test review',
          created_at: new Date(),
          updated_at: new Date(),
        })
      };
      
      (Curation.findByPk as jest.Mock).mockResolvedValue(mockCuration);

      const response = await request(app)
        .get(`/curations/${mockCurationId}`);

      expect(response.status).toBe(200);
      expect(response.body.curation_id).toBe(mockCurationId);
    });

    it('should return 404 for non-existent curation ID', async () => {
      // Mock findByPk to return null (not found)
      (Curation.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .get('/curations/00000000-0000-0000-0000-000000000000');

      expect(response.status).toBe(404);
    });
  });

  // Test PATCH /curations/:curationId
  describe('PATCH /curations/:curationId', () => {
    it('should update a curation', async () => {
      const updateData = {
        userId: 'test-user-123', // Original user
        title: 'Updated Title',
        items: ['content-1', 'content-4']
      };

      // Mock findOne to return a curation that belongs to the user
      const mockCuration = {
        curation_id: mockCurationId,
        user_id: 'test-user-123',
        title: 'Original Title',
        items: ['content-1', 'content-2'],
        review_body: 'Test review',
        created_at: new Date(),
        updated_at: new Date(),
        update: jest.fn().mockResolvedValue(true),
        get: jest.fn().mockReturnValue({
          curation_id: mockCurationId,
          user_id: 'test-user-123',
          title: 'Updated Title',
          items: ['content-1', 'content-4'],
          review_body: 'Test review',
          created_at: new Date(),
          updated_at: new Date(),
        })
      };
      
      (Curation.findOne as jest.Mock).mockResolvedValue(mockCuration);

      const response = await request(app)
        .patch(`/curations/${mockCurationId}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updateData.title);
      expect(response.body.items).toEqual(updateData.items);
    });

    it('should return 403 for unauthorized update attempt', async () => {
      const updateData = {
        userId: 'different-user',
        title: 'Unauthorized Update'
      };

      // Mock findOne to return null (not found or not authorized)
      (Curation.findOne as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .patch(`/curations/${mockCurationId}`)
        .send(updateData);

      expect(response.status).toBe(403);
    });
  });

  // Test GET /curations/user/:userId
  describe('GET /curations/user/:userId', () => {
    it('should get all curations for a user', async () => {
      // Mock findAll to return an array of curations
      const mockCurations = [
        {
          get: jest.fn().mockReturnValue({
            curation_id: mockCurationId,
            user_id: 'test-user-123',
            title: 'Playlist 1',
            items: ['content-1', 'content-2'],
            created_at: new Date(),
            updated_at: new Date(),
          })
        },
        {
          get: jest.fn().mockReturnValue({
            curation_id: uuidv4(),
            user_id: 'test-user-123',
            title: 'Playlist 2',
            items: ['content-3', 'content-4'],
            created_at: new Date(),
            updated_at: new Date(),
          })
        }
      ];
      
      (Curation.findAll as jest.Mock).mockResolvedValue(mockCurations);

      const response = await request(app)
        .get('/curations/user/test-user-123');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });
  });

  // Test DELETE /curations/:curationId
  describe('DELETE /curations/:curationId', () => {
    it('should return 403 for unauthorized delete attempt', async () => {
      // Mock destroy to return 0 (not found or not authorized)
      (Curation.destroy as jest.Mock).mockResolvedValue(0);

      const response = await request(app)
        .delete(`/curations/${mockCurationId}`)
        .send({ userId: 'different-user' });

      expect(response.status).toBe(403);
    });

    it('should delete a curation', async () => {
      // Mock destroy to return 1 (successfully deleted)
      (Curation.destroy as jest.Mock).mockResolvedValue(1);

      const response = await request(app)
        .delete(`/curations/${mockCurationId}`)
        .send({ userId: 'test-user-123' });

      expect(response.status).toBe(204);
    });
  });
}); 