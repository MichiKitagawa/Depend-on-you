import { Router } from 'express';
import { ReaderActionController } from '../controllers/reader-action.controller';
import { Request, Response } from 'express';

const router = Router();
const readerActionController = new ReaderActionController();

// === アクション登録 ===
// POST /actions
router.post('/actions', readerActionController.createAction);

// === アクション検索 ===

// 特定ユーザーのアクション一覧取得
// GET /users/:userId/actions
router.get('/users/:userId/actions', readerActionController.getActionsByUserId); // userId は req.params から取得されるようにコントローラー側も要調整かも？ 現状はクエリを期待している

// 特定ターゲット (投稿) のアクション一覧取得
// GET /posts/:targetId/actions
router.get('/posts/:targetId/actions', (req: Request<{ targetId: string }>, res: Response) => {
  // targetType を 'post' としてコントローラーに渡す
  // req.params にプロパティを追加するのは型安全でないため、req オブジェクトの別の場所に格納するか、
  // コントローラー側で処理する。
  // ここでは req オブジェクトにカスタムプロパティとして追加 (要 Express.Request の型拡張 or any キャスト)
  (req as any).targetType = 'post'; // any キャストでエラー回避 (非推奨)
  return readerActionController.getActionsByTarget(req, res);
});

// TODO: 必要に応じて magazine, comment ターゲットのルートも追加
// router.get('/magazines/:targetId/actions', ...);
// router.get('/comments/:targetId/actions', ...);

/* // 古い汎用検索ルートはコメントアウトまたは削除
router.get('/actions', (req, res) => {
  const { userId, contentId } = req.query;
  if (userId) {
    return readerActionController.getActionsByUserId(req, res);
  }
  // contentId での検索は専用ルートに移行
  // if (contentId) {
  //   return readerActionController.getActionsByTarget(req, res); // 呼び出し方が変わった
  // }
  return res.status(400).json({ error: 'サポートされていないクエリパラメータです。/users/:userId/actions などを試してください。' });
});
*/

// === 特定アクション取得 ===
// GET /actions/:id
router.get('/actions/:id', readerActionController.getActionById); // パラメータ名を :id に変更

export default router; 