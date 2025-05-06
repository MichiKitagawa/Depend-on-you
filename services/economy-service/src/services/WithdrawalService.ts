import { PrismaClient, Prisma, Withdrawal } from '@prisma/client';
import { UserId } from '../../../../shared/schema';
import { WalletService } from './WalletService'; // クラスとしてインポート

// ステータス定数
export const WITHDRAWAL_STATUS = {
  REQUESTED: 'REQUESTED' as const,
  PROCESSING: 'PROCESSING' as const,
  COMPLETED: 'COMPLETED' as const,
  FAILED: 'FAILED' as const,
};
export type WithdrawalStatus = typeof WITHDRAWAL_STATUS[keyof typeof WITHDRAWAL_STATUS];

// 出力用インターフェース
export interface WithdrawalOutput {
  withdrawalId: string;
  status: WithdrawalStatus;
  requestedAt: Date;
  amount: number;
}

// export default new WithdrawalService(); を削除し、クラスをエクスポート
export class WithdrawalService {
  private prisma: PrismaClient | Prisma.TransactionClient;
  private walletService: WalletService;

  // コンストラクタで依存関係を受け取る
  constructor(prismaInstance: PrismaClient | Prisma.TransactionClient, walletServiceInstance: WalletService) {
    this.prisma = prismaInstance;
    this.walletService = walletServiceInstance;
  }

  // 出金申請処理
  async requestWithdrawal(
    userId: UserId,
    amount: number,
    bankAccountId: string // 仮: 本来はもっと詳細な情報が必要
    // TODO: 引数に詳細な銀行口座情報 (bankName, branchName, accountNumber, accountHolderName など) を追加
  ): Promise<WithdrawalOutput> {
    if (amount <= 0) {
      throw new Error('Withdrawal amount must be positive');
    }
    // TODO: 最低出金額チェック (例: 1000円以上など)

    // $transaction は PrismaClient インスタンスから呼ぶ想定
    // if (!(this.prisma instanceof PrismaClient)) { // instanceof チェックはモックで機能しにくいので削除
    //     throw new Error('requestWithdrawal must be called with a PrismaClient instance, not a transaction client.');
    // }

    return await (this.prisma as PrismaClient).$transaction(async (tx) => { // this.prisma を PrismaClient としてキャスト
      // 1. ウォレットを取得して残高確認と ID 取得
      const wallet = await this.walletService.getOrCreateWallet(userId, tx); // tx を渡す
      if (wallet.balance < amount) {
        throw new Error('Insufficient balance');
      }

      // 2. Withdrawal レコード作成 (REQUESTED ステータス)
      const withdrawalRecord = await tx.withdrawal.create({
        data: {
          userId,
          walletId: wallet.id, // 取得した wallet.id を使用
          amount,
          status: WITHDRAWAL_STATUS.REQUESTED,
          // bankInfo: JSON.stringify({ bankAccountId }), // bankInfo フィールドはスキーマにないので削除
        },
      });

      // 3. ポイントを消費 (WalletService の debitPoints を使用)
      const debitSuccess = await this.walletService.debitPoints(
          userId,
          amount,
          `Withdrawal request: ${withdrawalRecord.id}`,
          withdrawalRecord.id,
          tx // トランザクションコンテキストを渡す
      );

      if (!debitSuccess) {
        // debitPoints が false を返した場合 (通常は残高不足だが、ここでは発生しないはず)
        // ロールバックされるので、追加のエラー処理は不要かもしれないが、念のためログ出力
        console.error(`Failed to debit points for withdrawal ${withdrawalRecord.id}, though balance check passed. This should not happen.`);
        throw new Error('Failed to debit points for withdrawal. Operation rolled back.');
      }

      console.log(`Withdrawal requested: withdrawalId=${withdrawalRecord.id}, userId=${userId}, amount=${amount}`);

      return {
        withdrawalId: withdrawalRecord.id,
        status: withdrawalRecord.status as WithdrawalStatus,
        requestedAt: withdrawalRecord.createdAt,
        amount: withdrawalRecord.amount,
      };
    });
  }

  // ユーザーの出金履歴を取得
  async getUserWithdrawals(userId: UserId): Promise<WithdrawalOutput[]> {
    const withdrawals = await this.prisma.withdrawal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // WithdrawalOutput 型にマッピング
    return withdrawals.map(w => ({
      withdrawalId: w.id,
      status: w.status as WithdrawalStatus,
      requestedAt: w.createdAt,
      amount: w.amount,
    }));
  }

  // TODO: 管理者向けの出金処理メソッド (ステータス更新など)
  // async processWithdrawal(withdrawalId: string, newStatus: WithdrawalStatus) { ... }
  // async markWithdrawalCompleted(withdrawalId: string) { ... }
  // async markWithdrawalFailed(withdrawalId: string, reason: string) { ... }
} 