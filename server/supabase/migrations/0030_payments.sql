-- =============================================================================
-- POP'S Villepinte — online payment (Stripe)
--
-- Adds a payment lifecycle to orders, independent of the fulfilment status.
-- Every new order is created `pending` and only released to the kitchen once
-- Stripe confirms the PaymentIntent succeeded (payment_status → 'paid'). The
-- `stripe_events` table dedupes webhook deliveries so a replayed event never
-- double-processes an order.
-- =============================================================================

-- Payment lifecycle, orthogonal to public.order_status (fulfilment):
--   pending    → PaymentIntent created, awaiting the customer to pay
--   processing → payment submitted, async confirmation pending (e.g. 3DS)
--   paid       → funds captured; order is live for the kitchen
--   failed     → payment attempt failed / card declined
--   refunded   → fully (or partially) refunded by an admin
create type public.payment_status as enum (
  'pending',
  'processing',
  'paid',
  'failed',
  'refunded'
);

alter table public.orders
  add column payment_status public.payment_status not null default 'pending',
  -- 'card' | 'apple_pay' | 'google_pay' | 'link' … resolved from Stripe on paid.
  add column payment_method text,
  add column stripe_payment_intent_id text,
  add column stripe_charge_id text,
  add column paid_at timestamptz,
  add column refunded_at timestamptz,
  add column amount_refunded_eur numeric(7, 2) not null default 0
    check (amount_refunded_eur >= 0);

-- Every order predating online payment was settled on-site (cash/CB). Mark them
-- paid so they stay visible in the operational dashboards (which now filter to
-- paid orders) and in revenue reporting.
update public.orders
  set payment_status = 'paid',
      paid_at = coalesce(paid_at, created_at)
  where created_at < now();

-- Operational lists (kitchen / today / live) filter on payment_status; the
-- payments dashboard filters/sorts on it too. One-intent-per-order lookup is
-- used by the webhook to resolve the order from a Stripe event.
create index if not exists orders_payment_status_idx
  on public.orders (payment_status);
create unique index if not exists orders_stripe_payment_intent_idx
  on public.orders (stripe_payment_intent_id)
  where stripe_payment_intent_id is not null;

-- Webhook idempotency + audit trail. Stripe may deliver the same event more
-- than once; we insert the event id first and treat a unique-violation as
-- "already handled". Service-role only (no RLS policies → no anon/auth access).
create table public.stripe_events (
  id text primary key,           -- Stripe event id (evt_…)
  type text not null,            -- e.g. payment_intent.succeeded
  order_id text references public.orders (id) on delete set null,
  payload jsonb,
  received_at timestamptz not null default now()
);

alter table public.stripe_events enable row level security;
