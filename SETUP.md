# Setup Guide — Shaharyar Concrete booking & ecommerce site

This turns the site into a full service-booking + ecommerce flow: browse services →
add to cart → log in → checkout → pay with Stripe → order saved in Supabase →
customer dashboard with order history.

Follow these steps in order. Nothing here touches the design — it's all backend wiring.

---

## 1. Install dependencies

```bash
npm install
```

---

## 2. Create a Supabase project

1. Go to https://supabase.com/dashboard and create a new project (choose a region close to Melbourne, e.g. Sydney).
2. Once it's provisioned, go to **Project Settings → API** and note down:
   - **Project URL** (`https://xxxx.supabase.co`)
   - **anon public key**
   - **service_role key** (keep this secret — server-side only, never in the frontend)

---

## 3. Run the database migration

1. In the Supabase Dashboard, open **SQL Editor**.
2. Paste the entire contents of `supabase/migrations/0001_init.sql` and click **Run**.

This creates:
- `profiles` — one row per user, auto-created on signup via trigger
- `services` — pricing catalogue (pre-seeded with your 3 services/prices)
- `orders` — one row per checkout
- `order_items` — line items per order
- Row Level Security policies so customers can only ever see their **own** profile/orders, and so pricing can't be tampered with (all writes happen server-side with the service role key, not from the browser)

**Alternative (Supabase CLI):**
```bash
supabase login
supabase link --project-ref YOUR-PROJECT-REF
supabase db push
```

---

## 4. Configure Supabase Auth

In **Authentication → URL Configuration**:
- **Site URL**: your production URL (e.g. `https://shaharyarconcrete.com.au`), or `http://localhost:5173` for local dev.
- **Redirect URLs**: add both:
  - `http://localhost:5173/reset-password`
  - `https://your-production-domain.com/reset-password`

In **Authentication → Providers → Email**, email/password sign-up is enabled by default — that's all this project uses. Leave "Confirm email" on if you want new users to verify their email before logging in (the Signup page already handles both cases).

---

## 5. Create a Stripe account

1. Go to https://dashboard.stripe.com and create an account (or use an existing one).
2. Stay in **Test mode** while developing.
3. Go to **Developers → API keys** and note down:
   - **Publishable key** (`pk_test_...`)
   - **Secret key** (`sk_test_...`) — server-side only

---

## 6. Deploy the Supabase Edge Functions

The two Edge Functions live in `supabase/functions/`:
- `create-checkout-session` — creates the Stripe Checkout Session and the pending order (called from the browser, requires login)
- `stripe-webhook` — receives payment confirmation from Stripe and marks the order paid (called by Stripe directly, not by the browser)

```bash
supabase login
supabase link --project-ref YOUR-PROJECT-REF

# Set secrets used by the functions (server-side only, never exposed to the browser)
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase secrets set SITE_URL=https://your-production-domain.com
# STRIPE_WEBHOOK_SECRET is added in step 7 below, after creating the webhook

# Deploy
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook --no-verify-jwt
```

> `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are automatically available inside every Edge Function — you don't need to set those as secrets yourself.

---

## 7. Connect the Stripe webhook

1. In the Stripe Dashboard, go to **Developers → Webhooks → Add endpoint**.
2. Endpoint URL:
   `https://YOUR-PROJECT-REF.supabase.co/functions/v1/stripe-webhook`
3. Select these events:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.payment_failed`
4. After creating it, copy the **Signing secret** (`whsec_...`) and set it:
   ```bash
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
   ```
5. Redeploy the webhook function so it picks up the secret:
   ```bash
   supabase functions deploy stripe-webhook --no-verify-jwt
   ```

**Testing locally:** use the Stripe CLI to forward events to your local function:
```bash
stripe listen --forward-to https://YOUR-PROJECT-REF.supabase.co/functions/v1/stripe-webhook
```

---

## 8. Set your environment variables

Copy `.env.example` to `.env` and fill in the real values from steps 2 and 5:

```bash
cp .env.example .env
```

```
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_SITE_URL=http://localhost:5173
```

`.env` is already git-ignored — never commit it.

---

## 9. Run it locally

```bash
npm run dev
```

Visit `http://localhost:5173`. Try the full flow:
1. Browse to a service card → set area/quantity → **Add to Cart**
2. Go to **Cart** → **Checkout** → you'll be asked to log in/sign up first
3. Fill in the checkout form → **Continue to Payment**
4. Use a Stripe test card: `4242 4242 4242 4242`, any future expiry, any CVC
5. You'll land on the success page, and the order will appear in **Dashboard**

---

## 10. Build & deploy the frontend

```bash
npm run build
```

This outputs a static site in `dist/`. Deploy it anywhere that serves static files with an SPA fallback (all routes should serve `index.html`) — e.g. Vercel, Netlify, Cloudflare Pages, or your existing host.

- **Vercel/Netlify**: SPA fallback is automatic for Vite projects — just set the environment variables from step 8 in the host's dashboard (the `VITE_*` ones), set build command `npm run build`, output directory `dist`.
- Update `VITE_SITE_URL` (and the Supabase Auth Redirect URLs, and the Edge Function `SITE_URL` secret) to your real production domain once you deploy.

---

## Troubleshooting

- **"Not authenticated" on checkout** — the user's Supabase session expired or cookies/localStorage were cleared; log in again.
- **Order stuck on "pending" after payment** — the Stripe webhook hasn't reached Supabase yet (can take a few seconds) or the webhook secret is wrong. Check **Supabase → Edge Functions → stripe-webhook → Logs** and **Stripe → Developers → Webhooks → your endpoint → recent deliveries**.
- **RLS errors reading orders** — make sure you ran the full migration, including the policies; only the logged-in owner of an order can read it.
- **CORS errors calling the Edge Function** — redeploy `create-checkout-session`; the function already returns permissive CORS headers, but a stale deployment can lag behind.
