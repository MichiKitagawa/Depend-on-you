import { Request, Response } from 'express';
import curationService, { CreateCurationData, UpdateCurationData } from '../services/curation.service';
import { CurationId, UserId } from '../../../../shared/schema';

// Helper function to validate payload
const validateCurationPayload = (data: any): { valid: boolean; message?: string } => {
  if (!data.userId) return { valid: false, message: 'userId is required' };
  if (!data.title) return { valid: false, message: 'title is required' };
  if (!data.items || !Array.isArray(data.items)) {
    return { valid: false, message: 'items must be an array of content IDs' };
  }
  return { valid: true };
};

class CurationController {
  // Create a new curation
  async createCuration(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body as CreateCurationData;
      
      // Validate request data
      const validation = validateCurationPayload(data);
      if (!validation.valid) {
        res.status(400).json({ error: validation.message });
        return;
      }
      
      const curation = await curationService.createCuration(data);
      res.status(201).json(curation);
    } catch (error) {
      console.error('Controller error creating curation:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get a curation by ID
  async getCurationById(req: Request, res: Response): Promise<void> {
    try {
      const curationId = req.params.curationId as CurationId;
      const curation = await curationService.getCurationById(curationId);
      
      if (!curation) {
        res.status(404).json({ error: 'Curation not found' });
        return;
      }
      
      res.status(200).json(curation);
    } catch (error) {
      console.error(`Controller error getting curation:`, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update a curation
  async updateCuration(req: Request, res: Response): Promise<void> {
    try {
      const curationId = req.params.curationId as CurationId;
      const userId = req.body.userId as UserId;
      const updateData = req.body as UpdateCurationData;
      
      if (!userId) {
        res.status(400).json({ error: 'userId is required' });
        return;
      }
      
      const updatedCuration = await curationService.updateCuration(
        curationId,
        userId,
        updateData
      );
      
      if (!updatedCuration) {
        res.status(403).json({ error: 'Curation not found or unauthorized' });
        return;
      }
      
      res.status(200).json(updatedCuration);
    } catch (error) {
      console.error(`Controller error updating curation:`, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete a curation
  async deleteCuration(req: Request, res: Response): Promise<void> {
    try {
      const curationId = req.params.curationId as CurationId;
      const userId = req.body.userId as UserId;
      
      if (!userId) {
        res.status(400).json({ error: 'userId is required' });
        return;
      }
      
      const success = await curationService.deleteCuration(curationId, userId);
      
      if (!success) {
        res.status(403).json({ error: 'Curation not found or unauthorized' });
        return;
      }
      
      res.status(204).end();
    } catch (error) {
      console.error(`Controller error deleting curation:`, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get curations by user ID
  async getCurationsByUserId(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId as UserId;
      const curations = await curationService.getCurationsByUserId(userId);
      res.status(200).json(curations);
    } catch (error) {
      console.error(`Controller error getting curations by user:`, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new CurationController(); 