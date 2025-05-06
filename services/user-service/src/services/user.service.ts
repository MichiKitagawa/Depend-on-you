import { PrismaClient, Prisma } from '@prisma/client'; // パスを修正
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ServiceError } from '../errors/service.error'; // ServiceError をインポート
// import { Pool } from 'pg'; // pg を削除

// ProfileUpdates 型は Prisma.UserProfileUpdateInput を利用できるか検討
// interface ProfileUpdates {
//   username?: string;
//   email?: string;
// }

// shared/schema.ts から型をインポート (パスは要確認)
// import { UserID, Email, UserProfile } from '../../shared/schema';

// UserProfile 型 (Prisma の型に近づける)
interface UserProfile {
    id: string;
    userId: string;
    name: string | null; // null 許容に変更
    bio?: string | null;
    avatarUrl?: string | null;
    // createdAt/updatedAt は Prisma の戻り値に依存するため削除
    // createdAt: Date;
    // updatedAt: Date;
}

export class UserService {
  // private pool: Pool; // pg を削除
  private prisma: PrismaClient;

  constructor() {
    // this.pool = new Pool({ ... }); // pg を削除
    this.prisma = new PrismaClient();
  }

  async register(displayName: string, email: string, password: string): Promise<{ userId: string; token: string }> {
    // パスワード強度チェック (test.md US-SIGNUP-03)
    if (password.length < 8) { // 例: 8文字以上
      throw new ServiceError('Password is too weak', 400);
    }
    // メール形式チェック (test.md US-SIGNUP-02)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ServiceError('Invalid email format', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          profile: {
            create: {
              name: displayName,
            },
          },
          // notificationSetting の同時作成は削除
          // notificationSetting: {
          //     create: { /* ... */ }
          // }
        },
        select: {
          id: true,
          email: true,
        },
      });

      const token = this.generateToken(user.id, user.email);
      return { userId: user.id, token };

    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        // email or profile name unique constraint violation (target で判断可能)
        throw new ServiceError('Email already exists', 409); // test.md US-SIGNUP-04
      }
      console.error('Registration failed:', error);
      throw new ServiceError('Registration failed', 500);
    }
  }

  async login(email: string, password: string): Promise<{ token: string; user: UserProfile }> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { profile: true }, // profile も取得
    });

    if (!user || !user.profile) { // ユーザーまたはプロファイルがない
      throw new ServiceError('Invalid credentials', 401); // test.md US-LOGIN-03
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      throw new ServiceError('Invalid credentials', 401); // test.md US-LOGIN-02
    }

    const token = this.generateToken(user.id, user.email);

    // UserProfile 型に整形して返す
    const userProfile: UserProfile = {
        id: user.profile.id,
        userId: user.id,
        name: user.profile.name,
        bio: user.profile.bio,
        avatarUrl: user.profile.avatarUrl,
        // createdAt/updatedAt は UserProfile インターフェースから削除
    };

    return { token, user: userProfile }; // test.md US-LOGIN-01
  }

  private generateToken(userId: string, email: string): string {
    return jwt.sign(
      { id: userId, email: email },
      process.env.GLOBAL_JWT_SECRET || 'development_secret',
      { expiresIn: '24h' }
    );
  }

  async getProfile(userId: string): Promise<UserProfile | null> {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
      // select で必要なフィールドを明示してもよい
      // select: { id: true, userId: true, name: true, bio: true, avatarUrl: true }
    });

    if (!profile) {
      // ユーザー自体が存在しないか確認する方が親切かも
      // const userExists = await this.prisma.user.findUnique({ where: { id: userId } });
      // if (!userExists) throw new ServiceError('User not found', 404);
      throw new ServiceError('Profile not found', 404); // test.md US-PROF-03
    }

    // UserProfile 型に整形
    const userProfile: UserProfile = { ...profile };
    return userProfile; // test.md US-PROF-01
  }

  async updateProfile(userId: string, updates: { displayName?: string; bio?: string; profileImageUrl?: string }): Promise<UserProfile> {
    // Prisma のスキーマに合わせて変換 (displayName -> name, profileImageUrl -> avatarUrl)
    const prismaUpdates: Prisma.UserProfileUpdateInput = {};
    if (updates.displayName !== undefined) {
      if (updates.displayName === '') throw new ServiceError('Display name cannot be empty', 400); // test.md US-UPRO-02
      prismaUpdates.name = updates.displayName;
    }
    if (updates.bio !== undefined) prismaUpdates.bio = updates.bio;
    if (updates.profileImageUrl !== undefined) prismaUpdates.avatarUrl = updates.profileImageUrl;

    if (Object.keys(prismaUpdates).length === 0) {
      // 更新内容がない場合は、現在のプロフィールを返すかエラー
      const currentProfile = await this.getProfile(userId);
      if (!currentProfile) throw new ServiceError('Profile not found', 404);
      return currentProfile;
    }

    try {
      const updatedProfile = await this.prisma.userProfile.update({
        where: { userId },
        data: prismaUpdates,
        // select で整形後の型に必要なフィールドを取得
        // select: { id: true, userId: true, name: true, bio: true, avatarUrl: true }
      });
      // UserProfile 型に整形
      const userProfileResult: UserProfile = { ...updatedProfile };
      return userProfileResult; // test.md US-UPRO-01
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new ServiceError('Profile not found', 404);
      }
      console.error('Update profile failed:', error);
      throw new ServiceError('Failed to update profile', 500);
    }
  }

  // --- updateCredentials を分割 --- 

  async updateEmail(userId: string, newEmail: string): Promise<void> {
      // メール形式チェック
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
          throw new ServiceError('Invalid email format', 400); // test.md US-CRED-04
      }
      try {
          await this.prisma.user.update({
              where: { id: userId },
              data: { email: newEmail },
          });
          // test.md US-CRED-01
      } catch (error: any) {
          if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
              throw new ServiceError('Email already in use', 409);
          }
          if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
              throw new ServiceError('User not found', 404);
          }
           console.error('Update email failed:', error);
          throw new ServiceError('Failed to update email', 500);
      }
  }

  async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
          throw new ServiceError('User not found', 404);
      }

      const validPassword = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!validPassword) {
          throw new ServiceError('Invalid current password', 401); // test.md US-CRED-03
      }

      // 新パスワード強度チェック
      if (newPassword.length < 8) { // 例: 8文字以上
          throw new ServiceError('Password is too weak', 400);
      }

      const newHashedPassword = await bcrypt.hash(newPassword, 10);
      try {
          await this.prisma.user.update({
              where: { id: userId },
              data: { passwordHash: newHashedPassword },
          });
          // test.md US-CRED-02
      } catch (error: any) { // P2025 は findUnique でハンドリング済みなので通常発生しないはず
           console.error('Update password failed:', error);
          throw new ServiceError('Failed to update password', 500);
      }
  }

  // --- 通知設定 --- 
  async getNotificationSettings(userId: string): Promise<{ subscriptionNewPost: boolean; rankingChange: boolean }> {
    // モデル名を NotificationPreferences に修正
    const setting = await this.prisma.notificationPreferences.findUnique({
      where: { userId },
      // スキーマに合わせて select するフィールド名を修正 (email, push?)
      // select: { subscriptionNewPost: true, rankingChange: true },
      select: { email: true, push: true }, // schema.prisma に合わせる (仮)
    });

    if (!setting) {
       const userExists = await this.prisma.user.findUnique({ where: { id: userId } });
       if (!userExists) throw new ServiceError('User not found', 404);
       // デフォルト値を返す (スキーマのデフォルト値に合わせる)
       return { subscriptionNewPost: true, rankingChange: false }; // TODO: spec.md/schema.prisma と同期
    }
    // TODO: spec.md の subscriptionNewPost/rankingChange にマッピングする必要があるか確認
    // return setting;
     return { subscriptionNewPost: setting.email, rankingChange: setting.push }; // 仮のマッピング
  }

  async updateNotificationSettings(userId: string, preferences: { subscriptionNewPost: boolean; rankingChange: boolean }): Promise<{ subscriptionNewPost: boolean; rankingChange: boolean }> {
    // TODO: preferences (subscriptionNewPost/rankingChange) を schema.prisma (email/push) にマッピング
    const prismaData = {
        email: preferences.subscriptionNewPost,
        push: preferences.rankingChange,
    };

    // バリデーション
    if (typeof prismaData.email !== 'boolean' || typeof prismaData.push !== 'boolean') {
        throw new ServiceError('Invalid preference value', 400);
    }

    try {
      // モデル名を NotificationPreferences に修正
      const updatedSetting = await this.prisma.notificationPreferences.upsert({
        where: { userId },
        create: {
          userId,
          email: prismaData.email,
          push: prismaData.push,
        },
        update: {
            email: prismaData.email,
            push: prismaData.push,
        },
        // select するフィールド名を修正
        select: { email: true, push: true },
      });
      // TODO: spec.md の形式にマッピングして返す
      return { subscriptionNewPost: updatedSetting.email, rankingChange: updatedSetting.push }; // 仮のマッピング
    } catch (error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
            throw new ServiceError('User not found', 404);
        }
         console.error('Update notification settings failed:', error);
        throw new ServiceError('Failed to update notification settings', 500);
    }
  }

  // --- フォロー/アンフォロー --- 
  async follow(followerId: string, targetType: 'user' /* | 'magazine' */, targetId: string): Promise<void> {
    if (targetType === 'user' && followerId === targetId) {
      throw new ServiceError('Cannot follow yourself', 400);
    }
    if (targetType !== 'user') {
        console.warn('Magazine follow is not supported in the current schema.');
        throw new ServiceError('Invalid target type for current schema', 400);
    }

    // Target user check を try の前に移動
    const targetExists = await this.prisma.user.findUnique({where: {id: targetId}});
    if (!targetExists) throw new ServiceError(`Target user not found`, 404);

    const data: Prisma.FollowCreateInput = {
        follower: { connect: { id: followerId } },
        following: { connect: { id: targetId } },
    };

    try {
        // Target user check は移動済み
        // const targetExists = await this.prisma.user.findUnique({where: {id: targetId}});
        // if (!targetExists) throw new ServiceError(`Target user not found`, 404);

        await this.prisma.follow.create({ data });
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        console.warn(`${followerId} already follows user ${targetId}`);
        return; // 冪等性
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
          // P2003 は followerId が存在しない場合に発生するはず
          throw new ServiceError(`Follower user not found`, 404);
      }
      // ServiceError などの予期しないエラーをハンドル
      console.error(`Failed to follow user ${targetId}:`, error);
      // エラーメッセージをより具体的にするか、元のエラーをラップすることも検討
      throw new ServiceError('Failed to follow', 500); 
    }
  }

  async unfollow(followerId: string, targetType: 'user' /* | 'magazine' */, targetId: string): Promise<void> {
      // targetType のバリデーションを 'user' のみに変更
      if (targetType !== 'user') {
          console.warn('Magazine unfollow is not supported in the current schema.');
          throw new ServiceError('Invalid target type for current schema', 400);
      }

      // 複合ユニークキー followerId_followingId を使う
      const whereCondition: Prisma.FollowWhereUniqueInput = {
          followerId_followingId: {
              followerId: followerId,
              followingId: targetId
          }
      };

      try {
          // deleteMany ではなく delete を使用
          await this.prisma.follow.delete({ where: whereCondition });
      } catch (error: any) {
          if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
              // Record to delete does not exist
              console.warn(`${followerId} was not following user ${targetId}`);
              return; // 冪等性
          }
           console.error(`Failed to unfollow user ${targetId}:`, error);
          throw new ServiceError('Failed to unfollow', 500);
      }
  }

  // --- フォロワー/フォロイー取得 --- 
  // TODO: getFollowers, getFollowing を実装 (スキーマに合わせて)

  // spec.md に合わせて /user/{userId} の DELETE を実装
  async deleteAccount(userId: string): Promise<void> {
      // 関連データの削除 (Follows, Comments, etc.) をトランザクションで行うのが望ましい
      try {
          // ここではユーザー削除のみ (関連データは CASCADE DELETE に依存するか別途削除)
          await this.prisma.user.delete({ where: { id: userId } });
          // test.md US-DEL-01
      } catch (error: any) {
           if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
               throw new ServiceError('User not found', 404);
           }
            console.error(`Failed to delete user ${userId}:`, error);
           throw new ServiceError('Failed to delete account', 500);
      }
  }

} 