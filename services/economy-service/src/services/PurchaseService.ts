import { PrismaClient, Prisma } from '@prisma/client'; // PurchaseStatus はインポートしない
import { UserId } from '../../../../shared/schema'; // UserId のみ shared/schema からインポート
import { WalletService } from './WalletService'; // クラスとしてインポート
import Stripe from 'stripe'; // Stripe SDK のインポート

// グローバルなインスタンスは削除
// const prisma = new PrismaClient();
// const stripe = new Stripe(...);

// ステータス定数を定義
export type PurchaseStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export const PURCHASE_STATUS = {
  PENDING: 'PENDING' as const,
  COMPLETED: 'COMPLETED' as const,
  FAILED: 'FAILED' as const,
  REFUNDED: 'REFUNDED' as const
};

interface PurchaseInput {
  userId: UserId;
  amount: number; // 購入したいポイント数
  currency: string; // 決済通貨 (例: 'jpy')
  paymentMethodId?: string; // Stripe PaymentMethod ID など
  // 必要に応じて他の決済情報
}

export interface PurchaseOutput {
  purchaseId: string;
  status: PurchaseStatus;
  clientSecret?: string; // Stripe PaymentIntent の client_secret (フロントエンドで使用)
}

// export default new PurchaseService(); を削除し、クラスをエクスポート
export class PurchaseService {
  private prisma: PrismaClient | Prisma.TransactionClient;
  private stripe: Stripe;
  private walletService: WalletService;

  // コンストラクタで依存関係を受け取る
  constructor(
    prismaInstance?: PrismaClient | Prisma.TransactionClient,
    stripeInstance?: Stripe,
    walletServiceInstance?: WalletService
  ) {
    this.prisma = prismaInstance || new PrismaClient();
    // Stripe キーは環境変数から取得する前提
    this.stripe = stripeInstance || new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2025-04-30.basil' });
    // WalletService も DI する
    this.walletService = walletServiceInstance || new WalletService(this.prisma as PrismaClient); // デフォルトでは自身の prisma を渡す
  }

  async createPurchaseIntent(input: PurchaseInput): Promise<PurchaseOutput> {
    if (input.amount <= 0) {
      throw new Error('Purchase amount must be positive');
    }

    // TODO: ポイント数に応じた価格を決定するロジックを実装する。
    //       (例: データベースや設定ファイルから価格テーブルを読み込む)
    //       const priceTable = await getPriceTable();
    //       const price = priceTable[input.currency]?.[input.amount] || input.amount * defaultRate;
    const price = input.amount; // 仮: 1ポイント=1円（または指定通貨の1単位）

    // TODO: 通貨に応じた最小・最大価格チェック (Stripeの制限など)

    const wallet = await this.walletService.getOrCreateWallet(input.userId);

    // 1. Prisma で Purchase レコードを PENDING ステータスで作成
    const purchase = await this.prisma.purchase.create({
      data: {
        userId: input.userId,
        walletId: wallet.id,
        amount: input.amount,
        currency: input.currency.toUpperCase(),
        price: price,
        status: PURCHASE_STATUS.PENDING, // 文字列リテラルを使用
        provider: 'Stripe'
      },
      select: { id: true }
    });

    try {
      // 2. Stripe PaymentIntent を作成
      const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
        amount: price, // Stripe は最小通貨単位 (例: JPY なら円) で指定
        currency: input.currency,
        metadata: { purchaseId: purchase.id, userId: input.userId },
        // payment_method が提供されていれば、それを設定
        ...(input.paymentMethodId && { payment_method: input.paymentMethodId }),
        // confirm: true, // すぐに確認する場合は payment_method が必須
        // confirmation_method: 'manual', // Webhook で確定する場合は manual
        // setup_future_usage: 'off_session', // カード情報を保存する場合
        // customer: stripeCustomerId, // Stripe Customer ID があれば
      };
      const paymentIntent = await this.stripe.paymentIntents.create(paymentIntentParams);


      // 3. Purchase レコードに Stripe 取引 ID (PaymentIntent ID) を保存
      await this.prisma.purchase.update({
        where: { id: purchase.id },
        data: { providerTxId: paymentIntent.id }
      });

      console.log(`Created Stripe PaymentIntent: ${paymentIntent.id} for purchaseId: ${purchase.id}, userId: ${input.userId}`);

      return {
        purchaseId: purchase.id,
        status: PURCHASE_STATUS.PENDING, // この時点では PENDING
        clientSecret: paymentIntent.client_secret || undefined // フロントエンドで決済フローを完了させるために必要
      };
    } catch (error: any) {
      console.error('Error creating Stripe PaymentIntent:', error);
      // エラーが発生したら Purchase レコードを FAILED に更新
      await this.prisma.purchase.update({
        where: { id: purchase.id },
        data: { status: PURCHASE_STATUS.FAILED },
      });
      // Stripe API エラーの場合、詳細なメッセージを返すことも検討
      throw new Error(`Failed to create payment intent: ${error.message || error}`);
    }
  }

  // Stripe Webhook 等で決済成功通知を受け取った際の処理
  async handlePurchaseSuccess(providerTxId: string): Promise<void> {
    // this.prisma を使用
    const purchaseCheck = await this.prisma.purchase.findFirst({
      where: { providerTxId, status: PURCHASE_STATUS.PENDING },
      select: { id: true }
    });

    if (!purchaseCheck) {
      console.warn(`Webhook: Purchase not found or not pending for providerTxId: ${providerTxId}. Idempotency check.`);
      return;
    }

    // トランザクション内で Purchase 更新とポイント付与を行う
    try {
      // $transaction メソッドが存在するかどうかで判断
      if (typeof (this.prisma as any).$transaction === 'function') {
          await (this.prisma as PrismaClient).$transaction(async (tx) => {
            // 1. providerTxId と PENDING ステータスで Purchase を再度検索してロック
            const purchase = await tx.purchase.findFirst({
              where: { providerTxId, status: PURCHASE_STATUS.PENDING },
              select: { id: true, userId: true, amount: true }
            });

            // 万が一、トランザクション開始までの間に別プロセスによって状態が変わった場合
            if (!purchase) {
              return; // 冪等性を考慮し、エラーにはしない
            }

            // 2. Purchase ステータスを COMPLETED に更新
            await tx.purchase.update({
              where: { id: purchase.id },
              data: { status: PURCHASE_STATUS.COMPLETED },
            });

            // 3. WalletService を使ってポイントを付与 (tx と relatedId を渡す)
            await this.walletService.creditPoints(
                purchase.userId,
                purchase.amount,
                `Purchase completion: ${purchase.id}`,
                purchase.id, // relatedId
                tx // transaction context
            );

            console.log(`Webhook: Purchase ${purchase.id} completed successfully. Credited ${purchase.amount} points to user ${purchase.userId}.`);
          });
      } else {
          // TransactionClient インスタンスの場合は $transaction を呼べない
          throw new Error('handlePurchaseSuccess cannot be called within an existing transaction.');
      }
    } catch (error) {
       console.error(`Webhook: Error handling purchase success for providerTxId: ${providerTxId}`, error);
       // TODO: エラーハンドリング
    }
  }

  // 決済失敗時の処理
  async handlePurchaseFailure(providerTxId: string): Promise<void> {
    // ここも冪等性を考慮
    const purchase = await this.prisma.purchase.findFirst({
       where: { providerTxId, status: { not: PURCHASE_STATUS.COMPLETED } }, // 既に成功しているものは更新しない
       select: { id: true, status: true }
    });

    if (!purchase) {
      console.warn(`Webhook: Purchase not found or already completed for failed providerTxId: ${providerTxId}.`);
      return;
    }

    // PENDING 以外 (例: requires_action など) から失敗した場合も考慮
    if(purchase.status !== PURCHASE_STATUS.FAILED) {
        await this.prisma.purchase.update({
          where: { id: purchase.id },
          data: { status: PURCHASE_STATUS.FAILED },
        });
        console.log(`Webhook: Purchase ${purchase.id} marked as FAILED.`);
    } else {
        console.log(`Webhook: Purchase ${purchase.id} was already marked as FAILED.`);
    }
  }
} 