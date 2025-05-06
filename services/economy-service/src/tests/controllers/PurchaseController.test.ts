// PurchaseController.test.ts
import { Request, Response, NextFunction } from 'express';
import PurchaseController from '../../controllers/PurchaseController';
import { PurchaseService, PurchaseOutput, PurchaseStatus, PURCHASE_STATUS } from '../../services/PurchaseService';
import { AuthenticatedRequest } from '../../middleware/auth'; // 認証済みリクエスト型
import Stripe from 'stripe';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'; // mockDeep 等をインポート

// PurchaseService のモックは beforeEach で行う
// jest.mock('../../services/PurchaseService');
// const MockPurchaseService = PurchaseService as jest.Mocked<typeof PurchaseService>;

// Stripe SDK のモック
jest.mock('stripe', () => {
    const mockConstructEventFn = jest.fn();
    return {
        __esModule: true,
        default: jest.fn().mockImplementation(() => ({
            paymentIntents: {
                create: jest.fn().mockResolvedValue({ id: 'pi_mock', client_secret: 'mock_secret' }),
            },
            webhooks: {
                constructEvent: mockConstructEventFn,
            },
        })),
    };
});

// Request/Response/NextFunction のモック
const mockRequest = (body: any = {}, params: any = {}, user: any = null): Partial<AuthenticatedRequest> => ({
    body,
    params,
    user,
});
const mockResponse = (): Partial<Response> => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};
const mockNext: NextFunction = jest.fn();

describe('PurchaseController', () => {
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;
  let mockStripeInstance: DeepMockProxy<Stripe>; // Stripe モックを DeepMockProxy に変更
  let mockConstructEventRef: jest.Mock; // constructEvent のモック参照は残す
  let mockPurchaseService: DeepMockProxy<PurchaseService>;
  let purchaseController: PurchaseController; // Controller インスタンス
  let statusSpy: jest.SpyInstance;
  let jsonSpy: jest.SpyInstance;
  let sendSpy: jest.SpyInstance;
  let logSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    res = mockResponse();

    // Stripe モックインスタンス (DeepMockProxy を使用)
    mockStripeInstance = mockDeep<Stripe>();
    // constructEvent のモック設定 (具体的なモック実装はテストケース側で行う場合もある)
    mockConstructEventRef = mockStripeInstance.webhooks.constructEvent;

    // PurchaseService モックインスタンス
    mockPurchaseService = mockDeep<PurchaseService>();
    // mockReset は DeepMockProxy には不要 (jest.clearAllMocks()でクリアされる)

    // purchaseController インスタンス生成 (モックを注入)
    // Stripe インスタンスもモックを渡す
    purchaseController = new PurchaseController(mockPurchaseService, mockStripeInstance);

    // console スパイ設定
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    jsonSpy = jest.fn();
    statusSpy = jest.fn().mockReturnValue({ json: jsonSpy });
    sendSpy = jest.fn().mockReturnValue({ json: jsonSpy });
  });

  afterEach(() => {
    jest.clearAllMocks();
    // console スパイリストア
    logSpy.mockRestore();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  describe('createPurchaseIntent', () => {
    const userId = 'test-user-1';
    const purchaseData = { amount: 1000, currency: 'JPY', paymentMethodId: 'pm_card_visa' };
    const mockIntentResult: PurchaseOutput = {
        purchaseId: 'pur-abc',
        status: PURCHASE_STATUS.PENDING,
        clientSecret: 'pi_123_secret_456'
    };

    it('正常系: 認証済みユーザーで PaymentIntent を作成', async () => {
      req = mockRequest(purchaseData, {}, { id: userId });
      mockPurchaseService.createPurchaseIntent.mockResolvedValue(mockIntentResult);

      // Controller インスタンスのメソッドを呼び出す
      await purchaseController.createPurchaseIntent(req as AuthenticatedRequest, res as Response);

      expect(mockPurchaseService.createPurchaseIntent).toHaveBeenCalledWith({
        userId,
        amount: purchaseData.amount,
        currency: purchaseData.currency,
        paymentMethodId: purchaseData.paymentMethodId,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockIntentResult);
    });

    it('異常系: 金額(amount) がない場合 400 エラー', async () => {
      req = mockRequest({ currency: 'JPY' }, {}, { id: userId });
      // Controller インスタンスのメソッドを呼び出す
      await purchaseController.createPurchaseIntent(req as AuthenticatedRequest, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Missing amount or currency' });
      expect(mockPurchaseService.createPurchaseIntent).not.toHaveBeenCalled();
    });

     it('異常系: 通貨(currency) がない場合 400 エラー', async () => {
      req = mockRequest({ amount: 1000 }, {}, { id: userId });
      // Controller インスタンスのメソッドを呼び出す
      await purchaseController.createPurchaseIntent(req as AuthenticatedRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Missing amount or currency' });
      expect(mockPurchaseService.createPurchaseIntent).not.toHaveBeenCalled();
    });

    it('異常系: 不正な金額(amount) の場合 400 エラー', async () => {
      req = mockRequest({ amount: -100, currency: 'JPY' }, {}, { id: userId });
      // Controller インスタンスのメソッドを呼び出す
      await purchaseController.createPurchaseIntent(req as AuthenticatedRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid amount' });
    });

    it('異常系: ユーザーが認証されていない場合 401 エラー', async () => {
      req = mockRequest(purchaseData, {}, null);
      // Controller インスタンスのメソッドを呼び出す
      await purchaseController.createPurchaseIntent(req as AuthenticatedRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
      expect(mockPurchaseService.createPurchaseIntent).not.toHaveBeenCalled();
    });

    it('異常系: サービス層でエラーが発生した場合 500 エラー', async () => {
      req = mockRequest(purchaseData, {}, { id: userId });
      const serviceError = new Error('Stripe API error');
      mockPurchaseService.createPurchaseIntent.mockRejectedValue(serviceError);

      await purchaseController.createPurchaseIntent(req as AuthenticatedRequest, res as Response);

      expect(mockPurchaseService.createPurchaseIntent).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: serviceError.message });
    });
  });

  describe('handleWebhook', () => {
    const webhookSecret = 'whsec_test_secret';
    let originalWebhookSecret: string | undefined;

    const mockWebhookRequest = (rawBody: string | Buffer, signature: string): Partial<Request> => ({
        headers: { 'stripe-signature': signature },
        body: Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(rawBody, 'utf8'),
    });

    beforeAll(() => {
        originalWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        process.env.STRIPE_WEBHOOK_SECRET = webhookSecret;
    });

    afterAll(() => {
        process.env.STRIPE_WEBHOOK_SECRET = originalWebhookSecret;
    });

    // beforeEach は describe スコープで実行される

    it('正常系: payment_intent.succeeded イベントを処理し 200 を返す', async () => {
      const paymentIntentId = 'pi_success_123';
      const paymentIntentData = {
          id: paymentIntentId,
          object: 'payment_intent',
          status: 'succeeded',
          amount: 1000,
          currency: 'jpy',
          client_secret: 'pi_mock_secret_succeeded',
          created: Math.floor(Date.now() / 1000),
          livemode: false,
          payment_method_types: ['card'],
          capture_method: 'automatic',
          confirmation_method: 'automatic',
          amount_capturable: 0,
          amount_received: 1000,
          application: null,
          application_fee_amount: null,
          automatic_payment_methods: null,
          canceled_at: null,
          cancellation_reason: null,
          customer: null,
          description: null,
          invoice: null,
          last_payment_error: null,
          latest_charge: null,
          metadata: {},
          next_action: null,
          on_behalf_of: null,
          payment_method: null,
          payment_method_options: {},
          payment_method_configuration_details: null,
          processing: null,
          receipt_email: null,
          review: null,
          setup_future_usage: null,
          shipping: null,
          source: null,
          statement_descriptor: null,
          statement_descriptor_suffix: null,
          transfer_data: null,
          transfer_group: null,
      } as unknown as Stripe.PaymentIntent;
      const eventPayload: Stripe.PaymentIntentSucceededEvent = {
        id: 'evt_1',
        object: 'event',
        type: 'payment_intent.succeeded',
        api_version: '2020-08-27',
        created: Math.floor(Date.now() / 1000),
        livemode: false,
        pending_webhooks: 0,
        request: { id: null, idempotency_key: null },
        data: {
          object: paymentIntentData,
        },
      };
      const payloadString = JSON.stringify(eventPayload);
      const dummySignature = 't=123,v1=abc';
      req = mockWebhookRequest(payloadString, dummySignature);

      // constructEvent モックを設定
      mockConstructEventRef.mockReturnValue(eventPayload);
      mockPurchaseService.handlePurchaseSuccess.mockResolvedValue();

      // Controller インスタンスのメソッドを呼び出す
      await purchaseController.handleWebhook(req as Request, res as Response);

      // constructEvent の呼び出しを検証
      expect(mockConstructEventRef).toHaveBeenCalledWith(req.body, dummySignature, webhookSecret);
      expect(mockPurchaseService.handlePurchaseSuccess).toHaveBeenCalledWith(paymentIntentId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ received: true });
    });

    it('正常系: payment_intent.payment_failed イベントを処理し 200 を返す', async () => {
        const paymentIntentId = 'pi_failed_456';
        const paymentIntentData = {
            id: paymentIntentId,
            object: 'payment_intent',
            status: 'requires_payment_method',
            amount: 500,
            currency: 'usd',
            client_secret: 'pi_mock_secret_failed',
            created: Math.floor(Date.now() / 1000),
            livemode: false,
            payment_method_types: ['card'],
            capture_method: 'automatic',
            confirmation_method: 'automatic',
            last_payment_error: {
              type: 'card_error',
              code: 'card_declined',
              message: 'Your card was declined.',
              payment_method: { id: 'pm_mock', object: 'payment_method', type: 'card', card: {} as any, created: 0, customer: null, livemode: false, metadata: {}} as Stripe.PaymentMethod,
            },
            amount_capturable: 0,
            amount_received: 0,
            application: null,
            application_fee_amount: null,
            automatic_payment_methods: null,
            canceled_at: null,
            cancellation_reason: null,
            customer: null,
            description: null,
            invoice: null,
            latest_charge: null,
            metadata: {},
            next_action: null,
            on_behalf_of: null,
            payment_method: null,
            payment_method_options: {},
            payment_method_configuration_details: null,
            processing: null,
            receipt_email: null,
            review: null,
            setup_future_usage: null,
            shipping: null,
            source: null,
            statement_descriptor: null,
            statement_descriptor_suffix: null,
            transfer_data: null,
            transfer_group: null,
        } as unknown as Stripe.PaymentIntent;
        const eventPayload: Stripe.PaymentIntentPaymentFailedEvent = {
          id: 'evt_2',
          object: 'event',
          type: 'payment_intent.payment_failed',
          api_version: '2020-08-27',
          created: Math.floor(Date.now() / 1000),
          livemode: false,
          pending_webhooks: 0,
          request: { id: null, idempotency_key: null },
          data: {
            object: paymentIntentData,
          },
        };
        const payloadString = JSON.stringify(eventPayload);
        const dummySignature = 't=456,v1=def';
        req = mockWebhookRequest(payloadString, dummySignature);

        mockConstructEventRef.mockReturnValue(eventPayload);
        mockPurchaseService.handlePurchaseFailure.mockResolvedValue();

        await purchaseController.handleWebhook(req as Request, res as Response);

        expect(mockConstructEventRef).toHaveBeenCalledWith(req.body, dummySignature, webhookSecret);
        expect(mockPurchaseService.handlePurchaseFailure).toHaveBeenCalledWith(paymentIntentId);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ received: true });
    });

    it('異常系: 署名検証に失敗した場合 400 を返す', async () => {
      const payloadString = 'invalid payload';
      const invalidSignature = 'invalid';
      req = mockWebhookRequest(payloadString, invalidSignature);

      const signatureError = new Error('Webhook signature verification failed');
      mockConstructEventRef.mockImplementation(() => { throw signatureError; });

      await purchaseController.handleWebhook(req as Request, res as Response);

      expect(mockConstructEventRef).toHaveBeenCalledWith(req.body, invalidSignature, webhookSecret);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(`Webhook Error: ${signatureError.message}`);
      expect(mockPurchaseService.handlePurchaseSuccess).not.toHaveBeenCalled();
      expect(mockPurchaseService.handlePurchaseFailure).not.toHaveBeenCalled();
    });

    it('異常系: stripe-signature ヘッダーがない場合 400 を返す', async () => {
      req = mockWebhookRequest('{}', '');
      (req as Partial<Request>).headers = {};

      await purchaseController.handleWebhook(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Missing Stripe signature or webhook secret configuration.');
      expect(mockConstructEventRef).not.toHaveBeenCalled();
    });

    it('正常系: 未対応のイベントタイプは無視され 200 を返す', async () => {
        const chargeData = {
            id: 'ch_other',
            object: 'charge',
            status: 'succeeded',
             amount: 2000,
            currency: 'eur',
            created: Math.floor(Date.now() / 1000),
            livemode: false,
            paid: true,
            captured: true,
            amount_captured: 2000,
            amount_refunded: 0,
            balance_transaction: 'txn_mock',
            billing_details: { address: null, email: null, name: null, phone: null, tax_id: null },
            calculated_statement_descriptor: '',
            disputed: false,
            failure_balance_transaction: null,
            failure_code: null,
            failure_message: null,
            fraud_details: {},
            invoice: null,
            metadata: {},
            on_behalf_of: null,
            order: null,
            outcome: {
              network_status: 'approved_by_network',
              reason: null,
              risk_level: 'normal',
              risk_score: 0,
              seller_message: 'Payment complete.',
              type: 'authorized',
              advice_code: null,
              network_advice_code: null,
              network_decline_code: null,
            },
            payment_intent: 'pi_mock',
            payment_method: 'pm_mock',
            payment_method_details: { card: {} } as any,
            receipt_email: null,
            receipt_number: null,
            receipt_url: null,
            refunded: false,
            refunds: { object: 'list', data: [], has_more: false, url: '' },
            review: null,
            shipping: null,
            source_transfer: null,
            statement_descriptor: null,
            statement_descriptor_suffix: null,
            transfer_data: null,
            transfer_group: null,
        } as unknown as Stripe.Charge;
        const eventPayload: Stripe.ChargeSucceededEvent = {
            id: 'evt_other',
            object: 'event',
            type: 'charge.succeeded',
            api_version: '2020-08-27',
            created: Math.floor(Date.now() / 1000),
            livemode: false,
            pending_webhooks: 0,
            request: { id: null, idempotency_key: null },
            data: {
              object: chargeData,
            },
        };
        const payloadString = JSON.stringify(eventPayload);
        const dummySignature = 't=789,v1=ghi';
        req = mockWebhookRequest(payloadString, dummySignature);

        mockConstructEventRef.mockReturnValue(eventPayload);

        await purchaseController.handleWebhook(req as Request, res as Response);

        expect(mockConstructEventRef).toHaveBeenCalledTimes(1);
        expect(mockPurchaseService.handlePurchaseSuccess).not.toHaveBeenCalled();
        expect(mockPurchaseService.handlePurchaseFailure).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ received: true });
    });
  });
});