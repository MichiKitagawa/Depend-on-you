import { Router } from 'express';
import { ReaderActionController } from '../controllers/reader-action.controller';

const router = Router();
const readerActionController = new ReaderActionController();

// アクション登録
router.post('/actions', readerActionController.createAction);

// アクション検索（クエリパラメータに基づく）
router.get('/actions', (req, res) => {
  const { userId, contentId } = req.query;
  
  if (userId) {
    return readerActionController.getActionsByUserId(req, res);
  }
  
  if (contentId) {
    return readerActionController.getActionsByContentId(req, res);
  }
  
  return res.status(400).json({ error: 'userId または contentId が必要です' });
});

// アクションIDに基づく特定のアクション取得
router.get('/actions/:actionId', readerActionController.getActionById);

export default router; 