import { Router } from 'express';
import { ReaderActionController } from '../controllers/reader-action.controller';
// import { authenticate } from '../middleware/auth'; // 認証ミドルウェアをインポート

const router = Router();
const controller = new ReaderActionController(); // インスタンス名を変更

// --- Read Actions ---
// POST /user/:userId/reads
router.post(
    '/user/:userId/reads',
    // authenticate, // 認証ミドルウェア適用
    controller.recordReadAction // 対応するコントローラーメソッド
);
// GET /user/:userId/reads
router.get(
    '/user/:userId/reads',
    // authenticate,
    controller.getReadActions // 対応するコントローラーメソッド
);

// --- Like Actions ---
// POST /posts/:postId/like
router.post(
    '/posts/:postId/like',
    // authenticate,
    controller.recordLikeAction // 対応するコントローラーメソッド
);
// DELETE /posts/:postId/like
router.delete(
    '/posts/:postId/like',
    // authenticate,
    controller.deleteLikeAction // 対応するコントローラーメソッド
);

// --- Boost Actions ---
// POST /posts/:postId/boost
router.post(
    '/posts/:postId/boost',
    // authenticate,
    controller.recordBoostAction // 対応するコントローラーメソッド
);
// GET /user/:userId/boosts
router.get(
    '/user/:userId/boosts',
    // authenticate,
    controller.getBoostActions // 対応するコントローラーメソッド
);

// --- Comment Actions ---
// POST /posts/:postId/comments
router.post(
    '/posts/:postId/comments',
    // authenticate,
    controller.createCommentAction // 対応するコントローラーメソッド
);
// GET /posts/:postId/comments
router.get(
    '/posts/:postId/comments',
    // コメント取得は認証不要の場合もある？ 仕様による
    controller.getCommentActions // 対応するコントローラーメソッド
);

// --- Share Actions ---
// POST /shares
router.post(
    '/shares',
    // authenticate,
    controller.recordShareAction // 対応するコントローラーメソッド
);


// 古いルートは削除
// router.post('/actions', ...);
// router.get('/users/:userId/actions', ...);
// router.get('/posts/:targetId/actions', ...);
// router.get('/actions/:id', ...);


export default router; 