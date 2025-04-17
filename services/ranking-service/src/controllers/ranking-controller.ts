import { Request, Response } from 'express';
import RankingService from '../services/ranking-service';

class RankingController {
  private rankingService: RankingService;

  constructor() {
    this.rankingService = new RankingService();
  }

  /**
   * Rebuild rankings for a specific cluster type
   */
  public rebuildRankings = async (req: Request, res: Response): Promise<void> => {
    try {
      const { clusterType } = req.body;

      if (!clusterType) {
        res.status(400).json({ error: 'clusterType is required' });
        return;
      }

      const updatedCount = await this.rankingService.rebuildRankings(clusterType);
      
      res.status(200).json({
        clusterType,
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
      
      if (rankings.length === 0) {
        res.status(404).json({ error: 'No rankings found' });
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