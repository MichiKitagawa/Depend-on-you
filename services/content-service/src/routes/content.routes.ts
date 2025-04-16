import { Router } from 'express';
import { ContentController } from '../controllers/content.controller';
import { EpisodeController } from '../controllers/episode.controller';

const router = Router();
const contentController = new ContentController();
const episodeController = new EpisodeController();

// Content routes
router.post('/', (req, res) => contentController.createContent(req, res));
router.get('/:contentId', (req, res) => contentController.getContentById(req, res));
router.patch('/:contentId', (req, res) => contentController.updateContent(req, res));
router.post('/:contentId/complete', (req, res) => contentController.completeContent(req, res));

// Episode routes
router.post('/:contentId/episodes', (req, res) => episodeController.createEpisode(req, res));
router.get('/:contentId/episodes', (req, res) => episodeController.getEpisodesByContentId(req, res));
router.patch('/:contentId/episodes/:episodeId', (req, res) => episodeController.updateEpisode(req, res));

export default router; 