import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';

const router = Router();
const userService = new UserService();
const userController = new UserController(userService);

// User routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

// Notification Preferences routes (認証が必要)
router.get('/notifications', /* authMiddleware, */ userController.getNotificationPreferences);
router.patch('/notifications', /* authMiddleware, */ userController.updateNotificationPreferences); // PUT or PATCH?

// Follow routes (認証が必要)
router.post('/users/:userId/follow', /* authMiddleware, */ userController.followUser);
router.delete('/users/:userId/follow', /* authMiddleware, */ userController.unfollowUser);

// Get Following/Followers routes (認証不要 or 必要に応じて)
router.get('/users/:userId/following', userController.getFollowing);
router.get('/users/:userId/followers', userController.getFollowers);

export const userRouter = router; 