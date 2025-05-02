import { PrismaClient, Prisma } from '@prisma/client'; // User, UserProfile を削除
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import { Pool } from 'pg'; // pg を削除

// ProfileUpdates 型は Prisma.UserProfileUpdateInput を利用できるか検討
// interface ProfileUpdates {
//   username?: string;
//   email?: string;
// }

export class UserService {
  // private pool: Pool; // pg を削除
  private prisma: PrismaClient;

  constructor() {
    // this.pool = new Pool({ ... }); // pg を削除
    this.prisma = new PrismaClient();
  }

  async register(username: string, email: string, password: string): Promise<Pick<any, 'id' | 'email'>> { // User を any に変更
    const hashedPassword = await bcrypt.hash(password, 10);

    // ユーザー登録と同時にプロフィールも作成 (必要に応じて調整)
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        profile: {
          create: {
            name: username, // username を profile の name に格納
          },
        },
      },
      select: { // パスワードハッシュは返さない
        id: true,
        email: true,
      },
    });

    return user;
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.GLOBAL_JWT_SECRET || 'development_secret',
      { expiresIn: '24h' }
    );

    return token;
  }

  async getProfile(userId: string): Promise<any | null> { // UserProfile を any に変更
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
      // include: { user: { select: { email: true } } } // 必要ならユーザー情報も取得
    });

    if (!profile) {
      // プロファイルが存在しない場合、ユーザーは存在するがプロファイル未作成の可能性もある
      // 必要に応じてユーザー存在チェックを追加
      throw new Error('Profile not found');
    }

    return profile;
  }

  async updateProfile(userId: string, updates: any): Promise<any> { // Prisma.UserProfileUpdateInput と UserProfile を any に変更
    // updates のバリデーションが必要な場合、ここで行う

    try {
      const updatedProfile = await this.prisma.userProfile.update({
        where: { userId },
        data: updates,
      });
      return updatedProfile;
    } catch (error: any) {
      // エラーハンドリング修正: instanceof を避ける
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
        throw new Error('Profile not found');
      }
      throw new Error('Failed to update profile');
    }
  }

  // --- ここから新しいメソッドを追加 ---

  async getNotificationPreferences(userId: string): Promise<any | null> { // Prisma.JsonValue を any に変更
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { notificationPreferences: true },
    });
    if (!user) {
      throw new Error('User not found');
    }
    // notificationPreferences が null の場合の考慮が必要 (デフォルト値を返すなど)
    return user.notificationPreferences;
  }

  async updateNotificationPreferences(userId: string, preferences: any): Promise<any> { // Prisma.JsonValue を any に変更
    // preferences のバリデーション (スキーマ定義に基づく)
    // ... バリデーションロジック ...

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: { notificationPreferences: preferences },
        select: { notificationPreferences: true },
      });
      // null チェック (update が失敗することは考えにくいが念のため)
      if (updatedUser.notificationPreferences === null) {
        throw new Error('Failed to update notification preferences');
      }
      return updatedUser.notificationPreferences;
    } catch (error: any) {
        // エラーハンドリング修正
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
            throw new Error('User not found');
        }
        throw new Error('Failed to update notification preferences');
    }
  }

  async followUser(followerId: string, followingId: string): Promise<void> {
    if (followerId === followingId) {
      throw new Error('Cannot follow yourself');
    }
    try {
      await this.prisma.follow.create({
        data: {
          followerId,
          followingId,
        },
      });
    } catch (error: any) {
      // エラーハンドリング修正
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
        console.warn(`User ${followerId} already follows ${followingId}`);
        return;
      }
      // エラーハンドリング修正
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2003') {
          throw new Error('User not found');
      }
      throw new Error('Failed to follow user');
    }
  }

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    try {
      await this.prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      });
    } catch (error: any) {
      // エラーハンドリング修正
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
        console.warn(`User ${followerId} was not following ${followingId}`);
        return;
      }
      throw new Error('Failed to unfollow user');
    }
  }

  // フォローしているユーザー一覧を取得
  async getFollowing(userId: string, page: number = 1, limit: number = 20): Promise<any[]> { // User を any に変更
    const skip = (page - 1) * limit;
    const followingRelations = await this.prisma.follow.findMany({
      where: { followerId: userId },
      select: { following: true }, // フォローしている相手のUser情報を取得
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return followingRelations.map((rel: { following: any }) => rel.following); // User を any に変更
  }

  // フォロワー一覧を取得
  async getFollowers(userId: string, page: number = 1, limit: number = 20): Promise<any[]> { // User を any に変更
    const skip = (page - 1) * limit;
    const followerRelations = await this.prisma.follow.findMany({
      where: { followingId: userId },
      select: { follower: true }, // フォローされている相手のUser情報を取得
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return followerRelations.map((rel: { follower: any }) => rel.follower); // User を any に変更
  }
} 