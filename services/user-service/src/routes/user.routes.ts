import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
// import authMiddleware from '../middleware/auth.middleware'; // 必要に応じて認証ミドルウェアをインポート

const router = Router();
const userService = new UserService();
const userController = new UserController(userService);

// --- Auth --- 
// spec.md: /auth/signup, /auth/login
router.post('/auth/signup', userController.register);
router.post('/auth/login', userController.login);

// --- User Profile & Account --- 
// spec.md: /user/{userId}/profile (GET, PATCH)
// spec.md: /user/{userId}/credentials (PATCH - email/password)
// spec.md: /user/{userId} (DELETE)
router.get('/users/:userId/profile', /* authMiddleware, */ userController.getProfile);
router.patch('/users/:userId/profile', /* authMiddleware, */ userController.updateProfile);
// Credentials (split into email and password updates)
router.patch('/users/:userId/email', /* authMiddleware, */ userController.updateEmail);
router.patch('/users/:userId/password', /* authMiddleware, */ userController.updatePassword);
router.delete('/users/:userId', /* authMiddleware, */ userController.deleteAccount); // deleteUser -> deleteAccount

// --- Notification Settings --- 
// spec.md: /user/{userId}/settings/notifications (GET, PATCH)
router.get('/users/:userId/settings/notifications', /* authMiddleware, */ userController.getNotificationSettings); // getNotificationPreferences -> getNotificationSettings
router.patch('/users/:userId/settings/notifications', /* authMiddleware, */ userController.updateNotificationSettings); // updateNotificationPreferences -> updateNotificationSettings

// --- Follow --- 
// spec.md: /follow (POST, DELETE)
router.post('/follow', /* authMiddleware, */ userController.follow); // followUser -> follow, path変更
router.delete('/follow', /* authMiddleware, */ userController.unfollow); // unfollowUser -> unfollow, path変更

// --- Get Following/Followers --- 
// spec.md: /users/:userId/followers, /users/:userId/following (GET)
// router.get('/users/:userId/following', userController.getFollowing); // TODO: 実装後に有効化
// router.get('/users/:userId/followers', userController.getFollowers); // TODO: 実装後に有効化

export const userRouter = router; 