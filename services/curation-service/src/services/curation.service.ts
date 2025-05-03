import Curation, { CurationAttributes } from '../models/curation.model';
import { UserId } from '../schema';

export interface CreateCurationData {
  userId: UserId;
  title: string;
  items: string[];
  reviewBody?: string;
}

export interface UpdateCurationData {
  title?: string;
  items?: string[];
  reviewBody?: string;
}

class CurationService {
  // Create a new curation
  async createCuration(data: CreateCurationData): Promise<CurationAttributes> {
    try {
      const curation = await Curation.create({
        user_id: data.userId,
        title: data.title,
        items: data.items,
        review_body: data.reviewBody,
      } as CurationAttributes);

      return curation.get({ plain: true }) as CurationAttributes;
    } catch (error) {
      console.error('Error creating curation:', error);
      throw error;
    }
  }

  // Get a curation by ID
  async getCurationById(curationId: string): Promise<CurationAttributes | null> {
    try {
      const curation = await Curation.findByPk(curationId);
      return curation ? (curation.get({ plain: true }) as CurationAttributes) : null;
    } catch (error) {
      console.error(`Error getting curation ${curationId}:`, error);
      throw error;
    }
  }

  // Update a curation
  async updateCuration(
    curationId: string,
    userId: UserId,
    data: UpdateCurationData
  ): Promise<CurationAttributes | null> {
    try {
      // First check if curation exists and belongs to user
      const curation = await Curation.findOne({
        where: {
          curation_id: curationId,
          user_id: userId,
        },
      });

      if (!curation) {
        return null; // Not found or unauthorized
      }

      // Update with provided data
      const updateData: Partial<CurationAttributes> = {};
      if (data.title) updateData.title = data.title;
      if (data.items) updateData.items = data.items;
      if (data.reviewBody !== undefined) updateData.review_body = data.reviewBody;

      await curation.update(updateData);
      return curation.get({ plain: true }) as CurationAttributes;
    } catch (error) {
      console.error(`Error updating curation ${curationId}:`, error);
      throw error;
    }
  }

  // Delete a curation
  async deleteCuration(curationId: string, userId: UserId): Promise<boolean> {
    try {
      const deleted = await Curation.destroy({
        where: {
          curation_id: curationId,
          user_id: userId,
        },
      });
      return deleted > 0;
    } catch (error) {
      console.error(`Error deleting curation ${curationId}:`, error);
      throw error;
    }
  }

  // Get curations by user ID
  async getCurationsByUserId(userId: UserId): Promise<CurationAttributes[]> {
    try {
      const curations = await Curation.findAll({
        where: {
          user_id: userId,
        },
        order: [['updated_at', 'DESC']],
      });
      return curations.map(curation => curation.get({ plain: true }) as CurationAttributes);
    } catch (error) {
      console.error(`Error getting curations for user ${userId}:`, error);
      throw error;
    }
  }
}

export default new CurationService(); 