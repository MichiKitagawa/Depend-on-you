import { Request, Response } from 'express';
import { PurchaseService, PurchaseOutput, PurchaseStatus } from '../services/PurchaseService'; // クラスをインポート
import { AuthenticatedRequest } from '../middleware/auth';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client'; // 必要に応じて

// Controller をクラスとして定義
export default class PurchaseController {
  private purchaseService: PurchaseService;
  private stripe: Stripe; // Webhook 用 Stripe インスタンス

  // コンストラクタで PurchaseService と Stripe インスタンスを受け取る
  constructor(purchaseServiceInstance: PurchaseService, stripeInstance: Stripe) {
    this.purchaseService = purchaseServiceInstance;
    this.stripe = stripeInstance;
  }

  // createPurchaseIntent をインスタンスメソッドに変更
  async createPurchaseIntent(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const userId = req.user.id;
    const { amount, currency, paymentMethodId } = req.body;

    if (typeof amount !== 'number' || typeof currency !== 'string') {
      res.status(400).json({ message: 'Missing amount or currency' });
      return;
    }
    if (amount <= 0) {
      res.status(400).json({ message: 'Invalid amount' });
      return;
    }

    try {
      // this.purchaseService を使用
      const result = await this.purchaseService.createPurchaseIntent({
        userId,
        amount,
        currency,
        paymentMethodId,
      });
      res.status(201).json(result);
    } catch (error: any) {
      console.error('Error creating purchase intent:', error);
      res.status(500).json({ message: error.message || 'Internal server error' });
    }
  }

  // handleWebhook をインスタンスメソッドに変更
  async handleWebhook(req: Request, res: Response): Promise<void> {
    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !webhookSecret) {
      console.error('Webhook Error: Missing signature or secret');
      res.status(400).send('Missing Stripe signature or webhook secret configuration.');
      return;
    }

    let event: Stripe.Event;

    try {
      // this.stripe を使用
      event = this.stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed.`, err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntentSucceeded = event.data.object as Stripe.PaymentIntent;
        console.log(`Webhook received: PaymentIntent succeeded ${paymentIntentSucceeded.id}`);
        try {
          // this.purchaseService を使用
          await this.purchaseService.handlePurchaseSuccess(paymentIntentSucceeded.id);
        } catch (error) {
          console.error('Error in handlePurchaseSuccess:', error);
          // ここで 500 を返すと Stripe がリトライする可能性。エラーの種類に応じて判断。
        }
        break;
      case 'payment_intent.payment_failed':
        const paymentIntentFailed = event.data.object as Stripe.PaymentIntent;
        console.log(`Webhook received: PaymentIntent failed ${paymentIntentFailed.id}`);
        try {
           // this.purchaseService を使用
          await this.purchaseService.handlePurchaseFailure(paymentIntentFailed.id);
        } catch (error) {
          console.error('Error in handlePurchaseFailure:', error);
        }
        break;
      // ... handle other event types
      default:
        console.log(`Webhook received: Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({ received: true });
  }
} 