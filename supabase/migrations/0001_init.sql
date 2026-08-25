-- ============================================================================
-- Shaharyar Concrete — booking & ecommerce schema
-- Run this in the Supabase SQL Editor (or via `supabase db push`).
-- ============================================================================

create extension if not exists "pgcrypto"; -- for gen_random_uuid()

-- ----------------------------------------------------------------------------
-- profiles: one row per auth user, created automatically on signup
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  phone       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Automatically create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ----------------------------------------------------------------------------
-- services: read-only catalogue mirroring src/data/services.js
-- (kept in the DB too so pricing can be verified/audited server-side and so
-- an admin could update prices without a redeploy in future)
-- ----------------------------------------------------------------------------
create table if not exists public.services (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  title          text not null,
  price_per_sqm  numeric(10,2) not null,
  package_price  numeric(10,2) not null,
  package_sqm    integer not null,
  created_at     timestamptz not null default now()
);

alter table public.services enable row level security;

create policy "Anyone can view services"
  on public.services for select
  using (true);

insert into public.services (slug, title, price_per_sqm, package_price, package_sqm) values
  ('house-slabs', 'House Slabs', 25.00, 3750.00, 150),
  ('driveways',   'Driveways',   26.00, 4350.00, 150),
  ('formwork',    'Formwork',    27.00, 4500.00, 150)
on conflict (slug) do update set
  title = excluded.title,
  price_per_sqm = excluded.price_per_sqm,
  package_price = excluded.package_price,
  package_sqm = excluded.package_sqm;

-- ----------------------------------------------------------------------------
-- orders: one row per checkout / Stripe session
-- ----------------------------------------------------------------------------
create table if not exists public.orders (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references auth.users (id) on delete cascade,
  stripe_session_id     text unique,
  stripe_payment_intent text,
  customer_name         text not null,
  customer_email        text not null,
  customer_phone        text not null,
  address               text not null,
  city                  text not null,
  state                 text not null,
  postcode              text not null,
  notes                 text,
  total_amount          numeric(10,2) not null,
  payment_status        text not null default 'pending'
                          check (payment_status in ('pending','paid','failed','refunded')),
  status                text not null default 'received'
                          check (status in ('received','scheduled','in_progress','completed','cancelled')),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_stripe_session_id_idx on public.orders (stripe_session_id);

alter table public.orders enable row level security;

-- Users can only ever read their own orders. All writes happen from the
-- Edge Functions using the service_role key, which bypasses RLS entirely —
-- so intentionally there is NO insert/update policy for the anon/authenticated
-- roles here. This keeps pricing and payment_status tamper-proof from the client.
create policy "Users can view their own orders"
  on public.orders for select
  using (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- order_items: line items per order
-- ----------------------------------------------------------------------------
create table if not exists public.order_items (
  id                uuid primary key default gen_random_uuid(),
  order_id          uuid not null references public.orders (id) on delete cascade,
  service_slug      text not null,
  service_title     text not null,
  sqm               numeric(10,2) not null,
  quantity          integer not null check (quantity > 0),
  package_selected  boolean not null default false,
  unit_price        numeric(10,2) not null,
  line_total        numeric(10,2) not null,
  created_at        timestamptz not null default now()
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

alter table public.order_items enable row level security;

create policy "Users can view items on their own orders"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and o.user_id = auth.uid()
    )
  );

-- Keep updated_at current on orders
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute procedure public.set_updated_at();
