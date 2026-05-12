-- BOEKFLOW DATABASE SCHEMA — Part 1 of 2

create extension if not exists "uuid-ossp";

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  email text unique,
  full_name text,
  role text default 'business' check (role in ('admin', 'business')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id) on delete set null,
  name text not null,
  slug text unique not null,
  email text,
  phone text,
  address text,
  city text,
  postal_code text,
  description text,
  category text,
  logo_url text,
  cover_photo_url text,
  primary_color text default '#0F1737',
  accent_color text default '#C4F542',
  bg_color text default '#FAF7F0',
  text_color text default '#0F1737',
  plan text default 'starter' check (plan in ('starter', 'pro', 'business')),
  trial_ends_at timestamptz default (now() + interval '14 days'),
  subscription_status text default 'trialing' check (subscription_status in ('trialing', 'active', 'past_due', 'cancelled')),
  stripe_customer_id text,
  stripe_subscription_id text,
  billing_period text default 'monthly' check (billing_period in ('monthly', 'six_month', 'yearly')),
  timezone text default 'Europe/Amsterdam',
  working_hours jsonb default '{"mon":["10:00","19:00"],"tue":["10:00","19:00"],"wed":["10:00","19:00"],"thu":["10:00","19:00"],"fri":["10:00","19:00"],"sat":["09:00","17:00"],"sun":null}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_businesses_slug on businesses(slug);
create index idx_businesses_owner on businesses(owner_id);

create table services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade not null,
  name text not null,
  description text,
  duration_min int not null default 30,
  price_cents int not null default 0,
  active boolean default true,
  display_order int default 0,
  created_at timestamptz default now()
);

create index idx_services_business on services(business_id);

create table customers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade not null,
  first_name text,
  last_name text,
  phone text,
  email text,
  notes text,
  tags text[],
  preferences jsonb default '{}'::jsonb,
  last_visit_at timestamptz,
  total_visits int default 0,
  total_spent_cents int default 0,
  status text default 'active' check (status in ('active', 'inactive', 'churned')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_customers_business on customers(business_id);
create index idx_customers_phone on customers(business_id, phone);
