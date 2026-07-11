import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import type { Env } from '../../config/env.validation';

/**
 * Thin wrapper around the Stripe SDK. Instantiated once from env. Kept
 * deliberately dumb (no order/domain knowledge) — PaymentsService owns the
 * business logic. If STRIPE_SECRET_KEY isn't set the client is null and every
 * call throws a 503, so the API still boots but payments fail loudly.
 */
@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private readonly client: Stripe | null;
  private readonly webhookSecret: string | null;
  readonly currency: string;
  readonly publishableKey: string | null;

  constructor(private readonly cfg: ConfigService<Env, true>) {
    const secret = this.cfg.get('STRIPE_SECRET_KEY', { infer: true }) ?? null;
    this.currency = (
      this.cfg.get('STRIPE_CURRENCY', { infer: true }) ?? 'eur'
    ).toLowerCase();
    this.publishableKey =
      this.cfg.get('STRIPE_PUBLISHABLE_KEY', { infer: true }) ?? null;
    this.webhookSecret =
      this.cfg.get('STRIPE_WEBHOOK_SECRET', { infer: true }) ?? null;

    this.client = secret
      ? new Stripe(secret, { typescript: true })
      : null;

    if (!this.client) {
      this.logger.warn(
        'STRIPE_SECRET_KEY not set — online payment is disabled until configured.',
      );
    }
  }

  isConfigured(): boolean {
    return this.client !== null;
  }

  private require(): Stripe {
    if (!this.client) {
      throw new ServiceUnavailableException(
        "Le paiement n'est pas encore configuré.",
      );
    }
    return this.client;
  }

  createPaymentIntent(
    params: Stripe.PaymentIntentCreateParams,
  ): Promise<Stripe.PaymentIntent> {
    return this.require().paymentIntents.create(params);
  }

  retrievePaymentIntent(
    id: string,
    params?: Stripe.PaymentIntentRetrieveParams,
  ): Promise<Stripe.PaymentIntent> {
    return this.require().paymentIntents.retrieve(id, params);
  }

  createRefund(params: Stripe.RefundCreateParams): Promise<Stripe.Refund> {
    return this.require().refunds.create(params);
  }

  /**
   * Verify a webhook payload against the signing secret and return the typed
   * event. Throws if the signature doesn't match the raw bytes — which is the
   * whole point of capturing rawBody in bootstrap.
   */
  constructEvent(payload: Buffer | string, signature: string): Stripe.Event {
    if (!this.webhookSecret) {
      throw new ServiceUnavailableException(
        'Stripe webhook secret non configuré.',
      );
    }
    return this.require().webhooks.constructEvent(
      payload,
      signature,
      this.webhookSecret,
    );
  }
}
