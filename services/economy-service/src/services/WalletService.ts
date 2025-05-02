import { PrismaClient, Prisma } from '@prisma/client'; // PointHistoryType をインポートしない
import { UserId } from '../../../../shared/schema'; // 元の相対パスに戻す

const prisma = new PrismaClient();

// ポイント履歴タイプを定義
export type PointHistoryType = 'CREDIT' | 'DEBIT';
export const POINT_HISTORY_TYPE = {
  CREDIT: 'CREDIT' as const, // 付与
  DEBIT: 'DEBIT' as const  // 消費
};

// Prisma Transaction Client をオプションで受け入れる型
type OptionalTransactionClient = Prisma.TransactionClient | undefined;

class WalletService {
  // ユーザーIDに基づいてウォレットを取得または作成する
  // Note: トランザクション内で呼ぶ場合は tx を渡す
  async getOrCreateWallet(userId: UserId, tx?: OptionalTransactionClient): Promise<{ id: string; balance: number }> {
    const db = tx || prisma;
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
    const wallet = await this.getOrCreateWallet(userId); // ここはトランザクション外で良い
    return wallet.balance;
  }

  // ポイントを消費する (内部処理用)
  // トランザクションコンテキストをオプションで受け取る
  async debitPoints(
    userId: UserId,
    amount: number,
    reason: string,
    relatedId?: string,
    tx?: OptionalTransactionClient
  ): Promise<boolean> {
    const executeDebit = async (db: Prisma.TransactionClient | PrismaClient) => {
      if (amount <= 0) {
        throw new Error('Debit amount must be positive');
      }
      // getOrCreateWallet にもトランザクションを渡す
      const wallet = await this.getOrCreateWallet(userId, db instanceof PrismaClient ? undefined : db);
      if (wallet.balance < amount) {
        console.warn(`Insufficient balance for user ${userId} to debit ${amount} points for ${reason}.`);
        return false;
      }

      // 1. 残高を減らす
      await db.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: amount } },
      });

      // 2. 履歴を記録
      await db.pointHistory.create({
        data: {
          userId,
          walletId: wallet.id,
          amount: -amount, // 消費は負の値で記録
          type: POINT_HISTORY_TYPE.DEBIT,
          reason,
          relatedId,
        }
      });
      console.log(`Debited ${amount} points from user ${userId} for ${reason}. New balance: ${wallet.balance - amount}`);
      return true;
    };

    // tx が渡されていればそれを使用、なければ新しいトランザクションを開始
    if (tx) {
      return await executeDebit(tx);
    } else {
      return await prisma.$transaction(async (newTx: Prisma.TransactionClient) => {
        return await executeDebit(newTx);
      });
    }
  }

   // ポイントを付与する (内部処理用)
   // 基本的に外部のトランザクション内で呼ばれることを想定し、tx を必須とする
   async creditPoints(
     userId: UserId,
     amount: number,
     reason: string,
     relatedId?: string,
     tx?: Prisma.TransactionClient // 将来性を考えて Optional にしておくが、現状は tx 必須で呼び出す
    ): Promise<void> {

     // tx が渡されていない場合はエラーにするか、単独トランザクションを開始するか検討
     // ここではエラーとする（呼び出し元でトランザクション管理を強制）
     if (!tx) {
         throw new Error('creditPoints must be called within a transaction.');
     }
     const db = tx;

    if (amount <= 0) {
      throw new Error('Credit amount must be positive');
    }
    // getOrCreateWallet にもトランザクションを渡す
    const wallet = await this.getOrCreateWallet(userId, db);

    // 1. 残高を増やす
    await db.wallet.update({
      where: { id: wallet.id },
      data: { balance: { increment: amount } },
    });

    // 2. 履歴を記録
    await db.pointHistory.create({
      data: {
        userId,
        walletId: wallet.id,
        amount: amount, // 付与は正の値
        type: POINT_HISTORY_TYPE.CREDIT,
        reason,
        relatedId,
      }
    });
    console.log(`Credited ${amount} points to user ${userId} for ${reason}. New balance: ${wallet.balance + amount}`);
   }

}

export default new WalletService(); 