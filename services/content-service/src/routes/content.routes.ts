import { Router } from 'express';
import { MagazineController } from '@src/controllers/magazine.controller';
import { PostController } from '@src/controllers/post.controller';
import { GoodsController } from '@src/controllers/goods.controller';

// 仮の認証ミドルウェア (実際には JWT 検証などを行う)
const authenticate = (req: any, res: any, next: any) => {
  // ヘッダーなどからユーザー情報を取得する想定
  // req.userId = req.headers['x-user-id'] || 'dummy-user-id';
  // ここでは仮のIDを設定
  req.userId = 'test-author-id-123';
  next();
};

const router = Router();
const magazineController = new MagazineController();
const postController = new PostController();
const goodsController = new GoodsController();

// === Magazine Routes ===
router.post('/magazines', authenticate, (req, res) => magazineController.createMagazine(req, res));
router.get('/magazines/:magazineId', (req, res) => magazineController.getMagazineById(req, res)); // マガジン取得は認証不要の場合も
router.patch('/magazines/:magazineId', authenticate, (req, res) => magazineController.updateMagazine(req, res));
router.delete('/magazines/:magazineId', authenticate, (req, res) => magazineController.deleteMagazine(req, res));
// router.get('/users/:userId/magazines', (req, res) => magazineController.getMagazinesByAuthor(req, res)); // 別途検討

// === Post Routes ===
router.post('/magazines/:magazineId/posts', authenticate, (req, res) => postController.createPost(req, res));
router.get('/magazines/:magazineId/posts', (req, res) => postController.getPostsByMagazineId(req, res)); // 特定マガジンの投稿一覧
router.get('/posts/:postId', (req, res) => postController.getPostById(req, res)); // 個別投稿取得
router.patch('/posts/:postId', authenticate, (req, res) => postController.updatePost(req, res));
router.delete('/posts/:postId', authenticate, (req, res) => postController.deletePost(req, res));

// === Goods Routes ===
router.post('/magazines/:magazineId/goods', authenticate, (req, res) => goodsController.createGoods(req, res));
router.get('/magazines/:magazineId/goods', (req, res) => goodsController.getGoodsByMagazineId(req, res)); // 特定マガジンのグッズ一覧
router.get('/goods/:goodsId', (req, res) => goodsController.getGoodsById(req, res)); // 個別グッズ取得
router.patch('/goods/:goodsId', authenticate, (req, res) => goodsController.updateGoods(req, res));
router.delete('/goods/:goodsId', authenticate, (req, res) => goodsController.deleteGoods(req, res));

export default router; 