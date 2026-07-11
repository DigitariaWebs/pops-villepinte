import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { SUPABASE_ADMIN } from '../../common/supabase/supabase.module';
import { NotificationsService } from '../notifications/notifications.service';
import { OrdersService } from '../orders/orders.service';
import { OrdersGateway } from '../orders/orders.gateway';
import { StripeService } from './stripe.service';
import { PaymentsQueryDto } from './dto/payments-query.dto';

/** Round to 2 decimals (money). */
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

const PAYMENT_SELECT =
  'id, created_at, customer_name, customer_phone, total_eur, status, ' +
  'payment_status, payment_method, paid_at, refunded_at, ' +
  'amount_refunded_eur, stripe_payment_intent_id, pickup_mode, delivery_fee_eur';

/** euros (numeric) → integer minor units for Stripe. */
function toMinorUnits(eur: number | string): number {
  return Math.round(Number(eur) * 100);
}
/** integer minor units → euros. */
function toEur(minor: number): number {
  return Math.round(minor) / 100;
}

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @Inject(SUPABASE_ADMIN) private readonly supabase: SupabaseClient,
    private readonly stripe: StripeService,
    private readonly gateway: OrdersGateway,
    private readonly notifications: NotificationsService,
    @Inject(forwardRef(() => OrdersService))
    private readonly orders: OrdersService,
  ) {}

  isConfigured(): boolean {
    return this.stripe.isConfigured();
  }

  get publishableKey(): string | null {
    return this.stripe.publishableKey;
  }

  /**
   * Create a PaymentIntent for a freshly-inserted order and persist its id on
   * the order row. The amount is the server-authoritative total — the client
   * never sends prices. Returns the client secret the app hands to the Stripe
   * PaymentSheet.
   */
  async createIntentForOrder(order: {
    id: string;
    user_id: string;
    total_eur: number | string;
    customer_name: string;
  }): Promise<{ clientSecret: string; publishableKey: string | null }> {
    const amount = toMinorUnits(order.total_eur);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new BadRequestException('Montant de commande invalide.');
    }

    const intent = await this.stripe.createPaymentIntent({
      amount,
      currency: this.stripe.currency,
      // Card + wallets (Apple Pay / Google Pay / Link) are enabled from the
      // Stripe Dashboard; automatic_payment_methods surfaces whichever apply.
      automatic_payment_methods: { enabled: true },
      description: `POP'S Villepinte — commande ${order.id}`,
      metadata: {
        order_id: order.id,
        user_id: order.user_id,
        customer_name: order.customer_name,
      },
    });

    const { error } = await this.supabase
      .from('orders')
      .update({
        stripe_payment_intent_id: intent.id,
        payment_status: 'pending',
      })
      .eq('id', order.id);
    if (error) throw error;

    if (!intent.client_secret) {
      throw new BadRequestException(
        "Stripe n'a pas retourné de client secret.",
      );
    }

    return {
      clientSecret: intent.client_secret,
      publishableKey: this.stripe.publishableKey,
    };
  }

  /**
   * Customer-triggered confirmation after the PaymentSheet reports success.
   * A safety net that doesn't depend on webhook latency: we re-fetch the
   * PaymentIntent from Stripe (source of truth) and, if it succeeded, mark the
   * order paid. Idempotent with the webhook path.
   */
  async confirmPayment(userId: string, orderId: string) {
    const { data: order, error } = await this.supabase
      .from('orders')
      .select('id, user_id, payment_status, status, stripe_payment_intent_id')
      .eq('id', orderId)
      .maybeSingle();
    if (error) throw error;
    if (!order) throw new NotFoundException('Order not found');
    if (order.user_id !== userId) {
      throw new ForbiddenException('Not your order');
    }
    if (order.payment_status === 'paid') {
      return { id: order.id, payment_status: 'paid', status: order.status };
    }
    if (!order.stripe_payment_intent_id) {
      throw new BadRequestException('Aucun paiement associé à cette commande.');
    }

    const intent = await this.stripe.retrievePaymentIntent(
      order.stripe_payment_intent_id,
      { expand: ['latest_charge'] },
    );

    if (intent.status === 'succeeded') {
      await this.markOrderPaid(intent);
      return { id: order.id, payment_status: 'paid', status: order.status };
    }

    return {
      id: order.id,
      payment_status: order.payment_status,
      status: order.status,
      stripe_status: intent.status,
    };
  }

  // ─── Webhook ─────────────────────────────────────────────────────────

  /**
   * Verify + dispatch a Stripe webhook. Deduped via the stripe_events table:
   * the first insert wins, a replayed event hits the PK and is ignored.
   */
  async handleWebhook(rawBody: Buffer, signature: string): Promise<void> {
    const event = this.stripe.constructEvent(rawBody, signature);

    // Fast dedupe: if we already recorded this event id, it's a Stripe retry of
    // something we finished — skip. (Recording happens only AFTER successful
    // processing below, so a transient failure re-processes on the next retry
    // rather than being silently swallowed.)
    const { data: seen } = await this.supabase
      .from('stripe_events')
      .select('id')
      .eq('id', event.id)
      .maybeSingle();
    if (seen) return;

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.markOrderPaid(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await this.markOrderFailed(event.data.object as Stripe.PaymentIntent);
        break;
      case 'charge.refunded':
        await this.markOrderRefunded(event.data.object as Stripe.Charge);
        break;
      default:
        this.logger.debug(`Unhandled Stripe event ${event.type}`);
    }

    // Record only after the handler succeeded. A concurrent duplicate delivery
    // may race us here — the unique PK makes the loser a no-op (all handlers
    // are idempotent anyway).
    const orderId =
      (event.data.object as { metadata?: { order_id?: string } })?.metadata
        ?.order_id ?? null;
    await this.supabase
      .from('stripe_events')
      .insert({ id: event.id, type: event.type, order_id: orderId });
  }

  // ─── State transitions ───────────────────────────────────────────────

  /**
   * Flip an order to paid and RELEASE it to the kitchen. This is where the
   * order:created SSE event fires (order creation deliberately does not emit
   * until the money is in). Idempotent: a second call is a no-op.
   */
  private async markOrderPaid(pi: Stripe.PaymentIntent): Promise<void> {
    const order = await this.findOrderForIntent(pi);
    if (!order) {
      this.logger.warn(`paid intent ${pi.id} has no matching order`);
      return;
    }
    if (order.payment_status === 'paid') return; // already released

    // Re-fetch with the charge expanded so we can read the real method used
    // (card vs apple_pay / google_pay wallet).
    const full =
      typeof pi.latest_charge === 'object' && pi.latest_charge
        ? pi
        : await this.stripe.retrievePaymentIntent(pi.id, {
            expand: ['latest_charge'],
          });
    const { method, chargeId } = this.resolveMethod(full);

    const { error } = await this.supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        paid_at: new Date().toISOString(),
        payment_method: method,
        stripe_charge_id: chargeId,
      })
      .eq('id', order.id);
    if (error) throw error;

    // Push the now-paid order to the admin/kitchen SSE stream + notify the
    // customer their order is confirmed.
    const fullOrder = await this.orders.getAdminOrderById(order.id);
    this.gateway.emit({ type: 'order:created', data: fullOrder });

    void this.notifications
      .notify(
        { kind: 'user', userIds: [order.user_id] },
        {
          title: 'Paiement confirmé 💳',
          body: 'Ta commande est validée, on s\'en occupe !',
          notificationKind: 'order',
          orderId: order.id,
          data: { status: order.status, payment_status: 'paid' },
        },
      )
      .catch(() => {
        /* push is best-effort */
      });
  }

  private async markOrderFailed(pi: Stripe.PaymentIntent): Promise<void> {
    const order = await this.findOrderForIntent(pi);
    if (!order || order.payment_status === 'paid') return;
    const { error } = await this.supabase
      .from('orders')
      .update({ payment_status: 'failed' })
      .eq('id', order.id);
    if (error) throw error;
  }

  private async markOrderRefunded(charge: Stripe.Charge): Promise<void> {
    const intentId =
      typeof charge.payment_intent === 'string'
        ? charge.payment_intent
        : charge.payment_intent?.id;
    if (!intentId) return;
    const { data: order } = await this.supabase
      .from('orders')
      .select('id')
      .eq('stripe_payment_intent_id', intentId)
      .maybeSingle();
    if (!order) return;

    const { error } = await this.supabase
      .from('orders')
      .update({
        payment_status: 'refunded',
        refunded_at: new Date().toISOString(),
        amount_refunded_eur: toEur(charge.amount_refunded),
      })
      .eq('id', order.id);
    if (error) throw error;

    const fullOrder = await this.orders.getAdminOrderById(order.id);
    this.gateway.emit({ type: 'order:status_changed', data: fullOrder });
  }

  // ─── Admin refund ────────────────────────────────────────────────────

  /**
   * Admin-initiated refund. Refunds the full captured amount by default.
   * Stripe fires charge.refunded which finalises payment_status via the
   * webhook, but we also update optimistically so the dashboard reflects it
   * immediately even if the webhook is delayed.
   */
  async refundOrder(orderId: string) {
    const { data: order, error } = await this.supabase
      .from('orders')
      .select(
        'id, payment_status, stripe_payment_intent_id, stripe_charge_id, total_eur, amount_refunded_eur',
      )
      .eq('id', orderId)
      .maybeSingle();
    if (error) throw error;
    if (!order) throw new NotFoundException('Order not found');
    if (order.payment_status !== 'paid') {
      throw new BadRequestException(
        'Seule une commande payée peut être remboursée.',
      );
    }
    if (!order.stripe_payment_intent_id) {
      throw new BadRequestException('Aucun paiement Stripe à rembourser.');
    }

    const refund = await this.stripe.createRefund({
      payment_intent: order.stripe_payment_intent_id,
    });

    const { data: updated, error: updErr } = await this.supabase
      .from('orders')
      .update({
        payment_status: 'refunded',
        refunded_at: new Date().toISOString(),
        amount_refunded_eur:
          refund.amount != null
            ? toEur(refund.amount)
            : Number(order.total_eur),
      })
      .eq('id', order.id)
      .select('id, payment_status, refunded_at, amount_refunded_eur')
      .single();
    if (updErr) throw updErr;

    const fullOrder = await this.orders.getAdminOrderById(order.id);
    this.gateway.emit({ type: 'order:status_changed', data: fullOrder });

    return updated;
  }

  // ─── Admin reporting ─────────────────────────────────────────────────

  /** Transactions list for the payments dashboard (all payment statuses). */
  async getPayments(query: PaymentsQueryDto) {
    let qb = this.supabase.from('orders').select(PAYMENT_SELECT);

    if (query.payment_status) {
      qb = qb.eq('payment_status', query.payment_status);
    }
    if (query.search) {
      const s = query.search.replace(/[%,]/g, '');
      qb = qb.or(
        `id.ilike.%${s}%,customer_name.ilike.%${s}%,customer_phone.ilike.%${s}%`,
      );
    }
    if (query.date_from) qb = qb.gte('created_at', query.date_from);
    if (query.date_to) qb = qb.lte('created_at', query.date_to);

    qb = qb
      .order('created_at', { ascending: false })
      .range(query.offset, query.offset + (query.limit ?? 20) - 1);

    const { data, error } = await qb;
    if (error) throw error;
    return data;
  }

  /**
   * Aggregate totals for the payments dashboard. Computed in JS over the rows
   * in range (a single fast-food's volume comfortably fits) rather than a SQL
   * aggregate/RPC, to keep the schema surface small.
   */
  async getPaymentsSummary(query: PaymentsQueryDto) {
    let qb = this.supabase
      .from('orders')
      .select('payment_status, total_eur, amount_refunded_eur');
    if (query.date_from) qb = qb.gte('created_at', query.date_from);
    if (query.date_to) qb = qb.lte('created_at', query.date_to);
    qb = qb.limit(10000);

    const { data, error } = await qb;
    if (error) throw error;
    const rows = data ?? [];

    const paidRows = rows.filter((r) => r.payment_status === 'paid');
    const refundedRows = rows.filter((r) => r.payment_status === 'refunded');
    const grossPaid = paidRows.reduce((a, r) => a + Number(r.total_eur), 0);
    const refunded = refundedRows.reduce(
      (a, r) => a + Number(r.amount_refunded_eur ?? r.total_eur),
      0,
    );

    return {
      count: rows.length,
      paid_count: paidRows.length,
      pending_count: rows.filter((r) => r.payment_status === 'pending').length,
      processing_count: rows.filter((r) => r.payment_status === 'processing')
        .length,
      failed_count: rows.filter((r) => r.payment_status === 'failed').length,
      refunded_count: refundedRows.length,
      gross_paid_eur: round2(grossPaid),
      refunded_eur: round2(refunded),
      net_eur: round2(grossPaid - refunded),
    };
  }

  // ─── Helpers ─────────────────────────────────────────────────────────

  private async findOrderForIntent(pi: Stripe.PaymentIntent): Promise<{
    id: string;
    user_id: string;
    status: string;
    payment_status: string;
  } | null> {
    // Prefer the stored intent id; fall back to metadata for older intents.
    const byIntent = await this.supabase
      .from('orders')
      .select('id, user_id, status, payment_status')
      .eq('stripe_payment_intent_id', pi.id)
      .maybeSingle();
    if (byIntent.data) return byIntent.data;

    const orderId = pi.metadata?.order_id;
    if (!orderId) return null;
    const byMeta = await this.supabase
      .from('orders')
      .select('id, user_id, status, payment_status')
      .eq('id', orderId)
      .maybeSingle();
    return byMeta.data ?? null;
  }

  private resolveMethod(pi: Stripe.PaymentIntent): {
    method: string | null;
    chargeId: string | null;
  } {
    const charge =
      typeof pi.latest_charge === 'object' ? pi.latest_charge : null;
    const chargeId =
      typeof pi.latest_charge === 'string'
        ? pi.latest_charge
        : (charge?.id ?? null);
    const details = charge?.payment_method_details;
    let method: string | null =
      details?.type ?? pi.payment_method_types?.[0] ?? null;
    if (details?.type === 'card') {
      const wallet = details.card?.wallet?.type;
      if (wallet === 'apple_pay') method = 'apple_pay';
      else if (wallet === 'google_pay') method = 'google_pay';
      else method = 'card';
    }
    return { method, chargeId };
  }
}
