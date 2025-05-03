import { Request, Response } from 'express';
import RankingService from '../services/ranking-service';

class RankingController {
  private rankingService: RankingService;

  constructor(rankingServiceInstance?: RankingService) {
    this.rankingService = rankingServiceInstance || new RankingService();
  }

  /**
   * Rebuild rankings for a specific cluster type (or overall)
   */
  public rebuildRankings = async (req: Request, res: Response): Promise<void> => {
    try {
      const clusterType = req.body.clusterType as string | undefined;
      const updatedCount = await this.rankingService.rebuildRankings(clusterType);
      res.status(200).json({
        message: `Rankings rebuilt successfully for cluster: ${clusterType || 'overall'}`,
        updatedCount
      });
    } catch (error) {
      console.error('Error rebuilding rankings:', error);
      res.status(500).json({ error: 'Failed to rebuild rankings' });
    }
  };

  /**
   * Get rankings, optionally filtered by cluster type and limited
   */
  public getRankings = async (req: Request, res: Response): Promise<void> => {
    try {
      const clusterType = req.query.clusterType as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const rankings = await this.rankingService.getRankings(clusterType, limit);

      if (!rankings) {
           // サービスから undefined が返るケースも考慮 (本来はエラーか空配列が返るべき)
           console.error('Service returned undefined rankings');
           res.status(500).json({ error: 'Failed to fetch rankings data' });
           return;
      }

      if (rankings.length === 0) {
        res.status(200).json([]);
        return;
      }

      res.status(200).json(rankings);
    } catch (error) {
      console.error('Error fetching rankings:', error);
      res.status(500).json({ error: 'Failed to fetch rankings' });
    }
  };
}

export default RankingController;