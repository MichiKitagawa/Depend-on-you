import { PrismaClient, Prisma } from '@prisma/client'; // WithdrawalStatus をインポートしない
import { UserId } from '../../../../shared/schema'; // 元の相対パスに戻す
import WalletService from './WalletService';

const prisma = new PrismaClient();

// ステータス定数を定義
export type WithdrawalStatus = 'REQUESTED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';
export const WITHDRAWAL_STATUS = {
  REQUESTED: 'REQUESTED' as const,
  PROCESSING: 'PROCESSING' as const,
  COMPLETED: 'COMPLETED' as const,
  REJECTED: 'REJECTED' as const
};

interface WithdrawalRequestInput {
  userId: UserId;
  amount: number; // 出金したいポイント数
  // TODO: Define bank account details required for withdrawal
  // bankName?: string;
  // branchName?: string;
  // accountType?: string;
  // accountNumber?: string;
  // accountHolder?: string;
}

interface WithdrawalOutput {
  withdrawalId: string;
  status: WithdrawalStatus;
  requestedAt: Date;
}

class WithdrawalService {

  // 出金申請を作成する
  async requestWithdrawal(input: WithdrawalRequestInput): Promise<WithdrawalOutput> {
    if (input.amount <= 0) {
      throw new Error('Withdrawal amount must be positive');
    }
    // TODO: 最低出金額、手数料などのチェック
    // TODO: Validate bank account details (input.bankName etc.)

    const wallet = await WalletService.getOrCreateWallet(input.userId);

    // 1. 残高確認
    if (wallet.balance < input.amount) {
      throw new Error('Insufficient balance for withdrawal request');
    }

    // 2. トランザクション内でポイント消費と出金申請レコード作成を行う
    const withdrawal = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 2a. Withdrawal レコードを作成 (先に ID を確定するため)
      const newWithdrawal = await tx.withdrawal.create({
        data: {
          userId: input.userId,
          walletId: wallet.id,
          amount: input.amount,
          status: WITHDRAWAL_STATUS.REQUESTED,
          // TODO: Save bank account details (potentially encrypted or referenced)
          // bankName: input.bankName,
          // ...
        },
        select: { id: true, status: true, requestedAt: true } // id を取得
      });

      // 2b. ポイントをデビット (tx と relatedId を渡す)
      const debited = await WalletService.debitPoints(
          input.userId,
          input.amount,
          `Withdrawal request: ${newWithdrawal.id}`,
          newWithdrawal.id, // relatedId
          tx // transaction context
      );
      if (!debited) {
        // 通常ここには来ないはずだが、念のためロールバック
        throw new Error('Failed to debit points for withdrawal (Insufficient balance after lock?)');
      }

      return newWithdrawal; // id, status, requestedAt を含む
    });

    console.log(`Withdrawal requested: withdrawalId=${withdrawal.id}, userId=${input.userId}, amount=${input.amount}`);

    return {
      withdrawalId: withdrawal.id,
      status: withdrawal.status,
      requestedAt: withdrawal.requestedAt
    };
  }

  // ユーザーIDに基づいて出金履歴を取得
  async getWithdrawalsByUserId(userId: UserId): Promise<WithdrawalOutput[]> {
     const withdrawals = await prisma.withdrawal.findMany({
       where: { userId },
       orderBy: { requestedAt: 'desc' },
       select: { id: true, status: true, requestedAt: true }
     });

     return withdrawals.map((w: { id: string; status: any; requestedAt: Date }) => ({
       withdrawalId: w.id,
       status: w.status as WithdrawalStatus,
       requestedAt: w.requestedAt
     }));
  }

  // TODO: 管理者向け: 出金申請一覧取得、ステータス更新 (PROCESSING, COMPLETED, REJECTED) などのメソッド

}

export default new WithdrawalService(); 