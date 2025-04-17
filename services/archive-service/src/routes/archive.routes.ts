import { Router } from 'express';
import archiveController from '../controllers/archive.controller';

const router = Router();

// アーカイブの作成
router.post('/archives', archiveController.createArchive.bind(archiveController));

// コンテンツIDによるアーカイブの取得
router.get('/archives/:contentId', archiveController.getArchiveByContentId.bind(archiveController));

// 再配信トリガーの発行
router.post('/archives/:archiveId/trigger', archiveController.triggerRedistribution.bind(archiveController));

export default router; 