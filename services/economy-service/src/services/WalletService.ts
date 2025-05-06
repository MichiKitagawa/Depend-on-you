import { PrismaClient, Prisma } from '@prisma/client'; // PointHistoryType をインポートしない
import { UserId } from '../../../../shared/schema'; // 元の相対パスに戻す

// グローバルな prisma インスタンスは削除 (または必要なら別ファイルへ)
// const prisma = new PrismaClient();

// ポイント履歴タイプを定義
export type PointHistoryType = 'CREDIT' | 'DEBIT';
export const POINT_HISTORY_TYPE = {
  CREDIT: 'CREDIT' as const, // 付与
  DEBIT: 'DEBIT' as const  // 消費
};

// Prisma Transaction Client をオプションで受け入れる型
type DbClient = PrismaClient | Prisma.TransactionClient;

// export default new WalletService(); を削除し、クラスをエクスポート
export class WalletService {
  private prisma: DbClient;

  // コンストラクタで PrismaClient を受け取る (DI)
  constructor(prismaInstance?: DbClient) {
    this.prisma = prismaInstance || new PrismaClient();
  }

  // ユーザーIDに基づいてウォレットを取得または作成する
  // Note: トランザクション内で呼ぶ場合は tx を渡す
  async getOrCreateWallet(userId: UserId, tx?: Prisma.TransactionClient): Promise<{ id: string; balance: number }> {
    const db = tx || this.prisma;
    let wallet = await db.wallet.findUnique({
      where: { userId },
      select: { id: true, balance: true },
    });

    if (!wallet) {
      wallet = await db.wallet.create({
        data: { userId },
        select: { id: true, balance: true },
      });
    }
    return wallet;
  }

  // ウォレット残高を取得する (getOrCreateWallet を内部で呼ぶ)
  async getWalletBalance(userId: UserId): Promise<number> {
    const wallet = await this.getOrCreateWallet(userId);
    return wallet.balance;
  }

  // ポイントを消費する (内部処理用)
  // トランザクションコンテキストをオプションで受け取る
  async debitPoints(
    userId: UserId,
    amount: number,
    reason: string,
    relatedId?: string,
    tx?: Prisma.TransactionClient
  ): Promise<boolean> {
    const executeDebit = async (db: DbClient) => {
      if (amount <= 0) {
        throw new Error('Debit amount must be positive');
      }
      const wallet = await this.getOrCreateWallet(userId, db === this.prisma ? undefined : db);
      if (wallet.balance < amount) {
        console.warn(`Insufficient balance for user ${userId} to debit ${amount} points for ${reason}.`);
        return false;
      }

      await db.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: amount } },
      });

      await db.pointHistory.create({
        data: {
          userId,
          walletId: wallet.id,
          amount: -amount,
          type: POINT_HISTORY_TYPE.DEBIT,
          reason,
          relatedId,
        }
      });
      console.log(`Debited ${amount} points from user ${userId} for ${reason}. New balance: ${wallet.balance - amount}`);
      return true;
    };

    if (tx) {
      return await executeDebit(tx);
    } else {
      // $transaction メソッドが存在するかどうかで判断
      // (this.prisma as any) で型チェックを回避
      if (typeof (this.prisma as any).$transaction === 'function') {
        // ここで this.prisma は PrismaClient インスタンスとみなす
        return await (this.prisma as PrismaClient).$transaction(async (newTx) => {
            return await executeDebit(newTx);
        });
      } else {
          // TransactionClient には $transaction がないと想定
          // throw new Error('Cannot start a new transaction within an existing transaction context without the base PrismaClient instance.');
          // メソッドが存在しない場合はエラーを投げる
          throw new Error('Cannot start a new transaction without a PrismaClient instance.');
      }
    }
  }

   // ポイントを付与する (内部処理用)
   // 基本的に外部のトランザクション内で呼ばれることを想定し、tx を必須とする
   async creditPoints(
     userId: UserId,
     amount: number,
     reason: string,
     relatedId?: string,
     tx?: Prisma.TransactionClient
    ): Promise<void> {
     if (!tx) {
         throw new Error('creditPoints must be called within a transaction.');
     }
     const db = tx;

    if (amount <= 0) {
      throw new Error('Credit amount must be positive');
    }
    const wallet = await this.getOrCreateWallet(userId, db);

    await db.wallet.update({
      where: { id: wallet.id },
      data: { balance: { increment: amount } },
    });

    await db.pointHistory.create({
      data: {
        userId,
        walletId: wallet.id,
        amount: amount,
        type: POINT_HISTORY_TYPE.CREDIT,
        reason,
        relatedId,
      }
    });
    console.log(`Credited ${amount} points to user ${userId} for ${reason}. New balance: ${wallet.balance + amount}`);
   }

} 