import { Request, Response } from 'express';
import PurchaseService from '../services/PurchaseService';
import { AuthenticatedRequest } from '../middleware/auth';
import Stripe from 'stripe'; // Stripe Webhook の署名検証用

// StripeクライアントとWebhookシークレットを初期化
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2025-04-30.basil' }); // PurchaseService と同じバージョンを指定
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

if (!webhookSecret) {
    console.warn('STRIPE_WEBHOOK_SECRET is not set. Webhook verification will fail.');
}

class PurchaseController {
  async createPurchaseIntent(req: AuthenticatedRequest, res: Response): Promise<void> {
    // 認証ミドルウェアから userId を取得
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const { amount, currency, paymentMethodId } = req.body;

    if (!amount || !currency) {
      res.status(400).json({ message: 'Missing amount or currency' });
      return;
    }
    if (typeof amount !== 'number' || amount <= 0) {
        res.status(400).json({ message: 'Invalid amount' });
        return;
    }
    if (typeof currency !== 'string') {
        res.status(400).json({ message: 'Invalid currency' });
        return;
    }

    try {
      const result = await PurchaseService.createPurchaseIntent({
        userId,
        amount,
        currency,
        paymentMethodId
      });
      res.status(201).json(result);
    } catch (error: any) {
      console.error('Error creating purchase intent:', error);
      res.status(500).json({ message: error.message || 'Internal server error' });
    }
  }

  // Stripe Webhook ハンドラ
  async handleWebhook(req: Request, res: Response): Promise<void> {
    const sig = req.headers['stripe-signature'] as string;
    let event: Stripe.Event;

    if (!webhookSecret) {
        res.status(500).send('Webhook secret not configured.');
        return;
    }
    if (!sig) {
        res.status(400).send('Missing Stripe signature.');
        return;
    }

    try {
      // リクエストボディは raw body を使用する必要があるため、Express の設定が必要
      // 通常、`express.raw({ type: 'application/json' })` ミドルウェアを事前に適用する
      event = stripe.webhooks.constructEvent((req as any).rawBody || req.body, sig, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed.`, err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // イベントタイプに応じた処理
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntentSucceeded = event.data.object as Stripe.PaymentIntent;
        console.log('Webhook received: PaymentIntent succeeded', paymentIntentSucceeded.id);
        // PurchaseService.handlePurchaseSuccess を呼び出す
        await PurchaseService.handlePurchaseSuccess(paymentIntentSucceeded.id);
        break;
      case 'payment_intent.payment_failed':
        const paymentIntentFailed = event.data.object as Stripe.PaymentIntent;
        console.log('Webhook received: PaymentIntent failed', paymentIntentFailed.id);
        await PurchaseService.handlePurchaseFailure(paymentIntentFailed.id);
        break;
      // 他の必要なイベントタイプもハンドル...
      // 例: payment_intent.canceled, payment_intent.processing など
      default:
        console.log(`Webhook received: Unhandled event type ${event.type}`);
    }

    // Stripe に受信確認を返す
    res.status(200).json({ received: true });
  }
}

export default new PurchaseController(); 