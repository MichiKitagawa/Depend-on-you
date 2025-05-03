import request from 'supertest';
import express, { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { PostID } from '@shared/schema';
import RankingController from '../src/controllers/ranking-controller';
// モック対象のサービスクラスをインポート
import RankingService from '../src/services/ranking-service';

// RankingService クラス全体をモック
const mockRebuildRankings = jest.fn();
const mockGetRankings = jest.fn();
jest.mock('../src/services/ranking-service', () => {
  return jest.fn().mockImplementation(() => {
    return {
      rebuildRankings: mockRebuildRankings,
      getRankings: mockGetRankings
      // _fetchScoresFromScoreService はモック不要
    };
  });
});

// Prisma のモックは不要になる
// jest.mock('../src/generated/prisma', ...);

describe('Ranking Service Endpoints', () => {
  let app: express.Express;
  let rankingController: RankingController;
  // モックデータの定義は残しておく
  let mockScoreData: any[];
  let mockRankingData: any[];

  beforeEach(() => {
    // モック関数のリセット
    mockRebuildRankings.mockClear();
    mockGetRankings.mockClear();
    // RankingService のモックコンストラクタもクリア
    (RankingService as jest.Mock).mockClear();

    // モックデータ
    mockRankingData = [
      { id: uuidv4(), postId: uuidv4() as PostID, rank: 1, score: 98.7, cluster: 'general', calculatedAt: new Date() },
      { id: uuidv4(), postId: uuidv4() as PostID, rank: 2, score: 85.3, cluster: 'general', calculatedAt: new Date() }
    ];

    // サービスのモックメソッドのデフォルト実装を設定
    // rebuildRankings は成功時 updatedCount (例: 5) を返すとする
    mockRebuildRankings.mockResolvedValue(5);
    // getRankings はデフォルトでモックデータを返すとする
    mockGetRankings.mockResolvedValue(mockRankingData);

    // コントローラーをインスタンス化 (内部でモックされた RankingService が使われる)
    rankingController = new RankingController();

    // Express アプリ初期化とルーティング設定
    app = express();
    app.use(express.json());
    const router = Router();
    router.post('/rankings/rebuild', rankingController.rebuildRankings);
    router.get('/rankings', rankingController.getRankings);
    app.use('/', router);
  });

  describe('POST /rankings/rebuild', () => {
    it('should call rankingService.rebuildRankings and return 200', async () => {
      const cluster = 'test-cluster';
      const expectedUpdatedCount = 5; // モックの戻り値
      mockRebuildRankings.mockResolvedValueOnce(expectedUpdatedCount);

      const response = await request(app)
        .post('/rankings/rebuild')
        .send({ clusterType: cluster });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
          message: `Rankings rebuilt successfully for cluster: ${cluster}`,
          updatedCount: expectedUpdatedCount
      });
      // サービスメソッドが正しい引数で呼び出されたか確認
      expect(mockRebuildRankings).toHaveBeenCalledWith(cluster);
      expect(mockRebuildRankings).toHaveBeenCalledTimes(1);
    });

    it('should call rebuildRankings without cluster type', async () => {
        await request(app).post('/rankings/rebuild').send({});
        expect(mockRebuildRankings).toHaveBeenCalledWith(undefined);
        expect(mockRebuildRankings).toHaveBeenCalledTimes(1);
    });

    it('should return 500 if service fails', async () => {
        const errorMessage = 'Service Error';
        mockRebuildRankings.mockRejectedValueOnce(new Error(errorMessage));
        const response = await request(app)
            .post('/rankings/rebuild')
            .send({ clusterType: 'fail' });
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Failed to rebuild rankings' });
    });
  });

  describe('GET /rankings', () => {
    it('should call rankingService.getRankings and return rankings', async () => {
       const cluster = 'general';
       const limit = 5;
       // getRankings のモックデータをこのテスト用に設定
       const specificMockData = [
            { id: uuidv4(), postId: uuidv4(), rank: 1, score: 99, cluster: cluster, calculatedAt: new Date() }
       ];
       mockGetRankings.mockResolvedValueOnce(specificMockData);

       const response = await request(app)
         .get('/rankings')
         .query({ clusterType: cluster, limit: limit.toString() });

       expect(response.status).toBe(200);
       // Date 型がシリアライズされるので toMatchObject で比較
       expect(response.body).toMatchObject(specificMockData.map(d => ({...d, calculatedAt: expect.any(String)})));
       // サービスメソッドが正しい引数で呼び出されたか確認
       expect(mockGetRankings).toHaveBeenCalledWith(cluster, limit);
       expect(mockGetRankings).toHaveBeenCalledTimes(1);
    });

    it('should call getRankings without filters', async () => {
        mockGetRankings.mockResolvedValueOnce(mockRankingData); // デフォルトのモックデータ
        await request(app).get('/rankings');
        expect(mockGetRankings).toHaveBeenCalledWith(undefined, undefined);
        expect(mockGetRankings).toHaveBeenCalledTimes(1);
    });

     it('should return 200 with empty array if service returns empty array', async () => {
        mockGetRankings.mockResolvedValueOnce([]); // 空配列を返すように設定
        const response = await request(app)
            .get('/rankings')
            .query({ clusterType: 'non-existent-cluster' });
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
        expect(mockGetRankings).toHaveBeenCalledWith('non-existent-cluster', undefined);
     });

     it('should return 500 if service fails', async () => {
         const errorMessage = 'Service Error';
         mockGetRankings.mockRejectedValueOnce(new Error(errorMessage));
         const response = await request(app)
            .get('/rankings');
         expect(response.status).toBe(500);
         expect(response.body).toEqual({ error: 'Failed to fetch rankings' });
     });
  });

}); 