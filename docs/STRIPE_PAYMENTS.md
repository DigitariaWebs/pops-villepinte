# Stripe payments — setup & operations

Online card payment (card + Apple Pay + Google Pay) via Stripe. **Payment is
required to place an order**: the app creates the order, the customer pays in a
Stripe PaymentSheet, and only a paid order is released to the kitchen.

## How it works

```
App: cart → checkout
  │  POST /orders            (server computes total, creates Stripe PaymentIntent)
  │  ← { order, stripe_client_secret }      order.payment_status = 'pending'
  │
  │  Stripe PaymentSheet (card / Apple Pay / Google Pay)
  │
  │  POST /orders/:id/confirm-payment        (re-checks the intent, releases if paid)
  ▼
Stripe webhook → POST /payments/webhook
     payment_intent.succeeded  → payment_status='paid'  → order:created SSE → kitchen sees it
     payment_intent.payment_failed → payment_status='failed'
     charge.refunded → payment_status='refunded'
```

- The **server is the source of truth for price** — the client never sends
  amounts. The PaymentIntent amount is the recomputed `orders.total_eur`.
- The **webhook** is the authority that marks an order paid. The app's
  `confirm-payment` call is a belt-and-braces fallback so orders release
  instantly without waiting on webhook latency. Both paths are idempotent
  (deduped via the `stripe_events` table).
- Unpaid orders (`pending` / `processing` / `failed`) never appear in the
  kitchen / today / live views. They are visible only in the super admin
  **Paiements** page.

## 1. Stripe dashboard

1. Create a Stripe account (or use the existing one). Start in **Test mode**.
2. **Developers → API keys** — copy the **Secret key** (`sk_test_…`) and
   **Publishable key** (`pk_test_…`).
3. **Settings → Payment methods** — enable Cards, Apple Pay, Google Pay, Link.
4. **Developers → Webhooks → Add endpoint**:
   - URL: `https://pops-villepinte.vercel.app/api/v1/payments/webhook`
     (use your local tunnel URL when testing locally — see below).
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`,
     `charge.refunded`.
   - Copy the **Signing secret** (`whsec_…`).

## 2. Backend env (`server/api/.env`, and Vercel project env for prod)

```
STRIPE_SECRET_KEY=sk_test_…
STRIPE_PUBLISHABLE_KEY=pk_test_…
STRIPE_WEBHOOK_SECRET=whsec_…
STRIPE_CURRENCY=eur
```

> Until `STRIPE_SECRET_KEY` is set, the API still boots but **order creation
> returns 503** ("paiement en ligne pas encore disponible"). This is intentional
> — no order can be placed without a working payment path.

For production, add the same four vars in the **Vercel** project (Settings →
Environment Variables) and redeploy.

## 3. Database migration

Apply `server/supabase/migrations/0030_payments.sql`:

```bash
# via Supabase CLI (from server/supabase)
supabase db push
# or run the SQL directly against the database (psql / Supabase SQL editor)
```

It adds the `payment_status` enum + payment columns on `orders`, backfills all
existing orders to `paid` (they predate online payment), and creates the
`stripe_events` idempotency table.

## 4. Mobile app

Env (already scaffolded — replace the placeholders):
- `.env` (local): `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_…`
- `eas.json` → `preview.env` and `production.env`:
  `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` (`pk_test_…` preview / `pk_live_…` prod)
  and `EXPO_PUBLIC_STRIPE_MERCHANT_ID=merchant.com.progix.pops`.

**A native rebuild is required** — `@stripe/stripe-react-native` is a native
module, so OTA updates won't ship it. Build with EAS:

```bash
eas build --profile preview --platform android   # test APK
eas build --profile production --platform all     # store builds
```

### Apple Pay
- Register the merchant id `merchant.com.progix.pops` in the Apple Developer
  portal (Certificates, IDs & Profiles → Identifiers → Merchant IDs).
- In Stripe: **Settings → Payment methods → Apple Pay** → add the domain /
  follow the iOS registration. The `@stripe/stripe-react-native` config plugin
  (in `app.json`) already adds the Apple Pay entitlement at prebuild.

### Google Pay
- Enabled via the plugin (`enableGooglePay: true` in `app.json`) + Stripe
  dashboard. Uses Stripe's test environment automatically while the key is
  `pk_test_…` (see `STRIPE_TEST_MODE` in `checkout.tsx`).

## 5. Testing

Test cards (Test mode): `4242 4242 4242 4242`, any future expiry, any CVC, any
postal code. 3-D Secure: `4000 0027 6000 3184`.

Local webhook testing with the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/v1/payments/webhook
# copy the whsec_… it prints into server/api/.env as STRIPE_WEBHOOK_SECRET
stripe trigger payment_intent.succeeded
```

## 6. Super admin

**Analytique → Paiements** (`/payments`): transactions list with KPIs (net
encaissé, brut, remboursé), status filter + search, and a **Rembourser**
action (full refund) on paid orders. Order tables now show a live payment
badge (Payé · Apple Pay, En attente, Remboursé, …).

## Going live checklist

- [ ] Swap all keys to live (`sk_live_…`, `pk_live_…`, live `whsec_…`).
- [ ] Point the live webhook endpoint at the production API URL.
- [ ] Set the live vars in Vercel + `eas.json` production profile.
- [ ] Apple Pay merchant id verified in Apple Developer + Stripe.
- [ ] Rebuild + resubmit the app (native change ⇒ new store build).
- [ ] Place one real low-value order end-to-end, then refund it from the
      Paiements page.
