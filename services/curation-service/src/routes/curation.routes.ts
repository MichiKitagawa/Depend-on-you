import { Router } from 'express';
import curationController from '../controllers/curation.controller';

const router = Router();

// POST /curations - Create a new curation
router.post('/', curationController.createCuration.bind(curationController));

// GET /curations/:curationId - Get a curation by ID
router.get('/:curationId', curationController.getCurationById.bind(curationController));

// PATCH /curations/:curationId - Update a curation
router.patch('/:curationId', curationController.updateCuration.bind(curationController));

// DELETE /curations/:curationId - Delete a curation
router.delete('/:curationId', curationController.deleteCuration.bind(curationController));

// GET /curations/user/:userId - Get curations by user ID
router.get('/user/:userId', curationController.getCurationsByUserId.bind(curationController));

export default router; 