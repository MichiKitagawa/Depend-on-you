import { Op } from 'sequelize';
import Ranking from '../models/ranking';

interface RankingResponse {
  contentId: string;
  rankPosition: number;
  scoreValue: number;
}

class RankingService {
  /**
   * Rebuild rankings for a specific cluster type
   * @param clusterType The cluster type to rebuild rankings for
   * @returns Number of rankings updated
   */
  public async rebuildRankings(clusterType: string): Promise<number> {
    try {
      // This would typically call the score-service to get scores
      // For now, we'll simulate with mock data
      const mockContentScores = [
        { contentId: 'content-1', scoreValue: 95 },
        { contentId: 'content-2', scoreValue: 87 },
        { contentId: 'content-3', scoreValue: 92 },
        { contentId: 'content-4', scoreValue: 76 },
        { contentId: 'content-5', scoreValue: 88 },
      ];
      
      // Sort scores in descending order
      const sortedScores = mockContentScores.sort((a, b) => b.scoreValue - a.scoreValue);
      
      // Clear existing rankings for this cluster
      await Ranking.destroy({
        where: { cluster_type: clusterType }
      });
      
      // Create new rankings
      for (let i = 0; i < sortedScores.length; i++) {
        await Ranking.create({
          content_id: sortedScores[i].contentId,
          rank_position: i + 1,
          cluster_type: clusterType,
          score_value: sortedScores[i].scoreValue,
          updated_at: new Date()
        });
      }
      
      return sortedScores.length;
    } catch (error) {
      console.error('Error in rebuildRankings:', error);
      throw error;
    }
  }
  
  /**
   * Get rankings, optionally filtered by cluster type and limited
   * @param clusterType Optional cluster type to filter by
   * @param limit Optional limit on the number of rankings to return
   * @returns Array of rankings
   */
  public async getRankings(clusterType?: string, limit?: number): Promise<RankingResponse[]> {
    try {
      const whereClause = clusterType ? { cluster_type: clusterType } : {};
      
      const rankings = await Ranking.findAll({
        where: whereClause,
        order: [
          ['cluster_type', 'ASC'],
          ['rank_position', 'ASC']
        ],
        limit: limit || undefined
      });
      
      return rankings.map(ranking => ({
        contentId: ranking.content_id,
        rankPosition: ranking.rank_position,
        scoreValue: ranking.score_value
      }));
    } catch (error) {
      console.error('Error in getRankings:', error);
      throw error;
    }
  }
}

export default RankingService; 