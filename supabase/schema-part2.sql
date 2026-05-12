-- BOEKFLOW SCHEMA — Part 2 of 2

create table appointments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade not null,
  customer_id uuid references customers(id) on delete set null,
  service_id uuid references services(id) on delete set null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text default 'confirmed' check (status in ('pending', 'confirmed', 'completed', 'no_show', 'cancelled')),
  notes text,
  source text default 'manual' check (source in ('manual', 'booking_page', 'whatsapp', 'sms', 'email', 'api')),
  price_cents_at_booking int,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_appointments_business on appointments(business_id);
create index idx_appointments_starts on appointments(business_id, starts_at);
create index idx_appointments_customer on appointments(customer_id);

create table messages (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade not null,
  customer_id uuid references customers(id) on delete cascade,
  channel text check (channel in ('whatsapp', 'sms', 'email')),
  direction text check (direction in ('in', 'out')),
  content text,
  ai_generated boolean default false,
  appointment_id uuid references appointments(id),
  sent_at timestamptz default now()
);

create index idx_messages_business on messages(business_id);
create index idx_messages_customer on messages(customer_id);

create table automation_rules (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade not null,
  name text not null,
  description text,
  trigger_type text not null check (trigger_type in ('rebooking', 'no_show', 'reminder', 'winback', 'birthday', 'first_visit')),
  trigger_config jsonb default '{}'::jsonb,
  channel text not null check (channel in ('whatsapp', 'sms', 'email', 'auto')),
  template text,
  active boolean default true,
  total_sent int default 0,
  total_converted int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_automation_business on automation_rules(business_id);

create table marketing_content (
  key text primary key,
  content jsonb not null,
  updated_at timestamptz default now(),
  updated_by uuid references profiles(id)
);

insert into marketing_content (key, content) values
  ('hero', '{"title": "Volle agenda. Automatisch.", "subtitle": "BoekFlow is een AI assistent die zelf klanten benadert via WhatsApp, SMS en email.", "cta_primary": "Start 14 dagen gratis", "cta_secondary": "Bekijk demo"}'),
  ('welcome_deal', '{"active": true, "text": "Welkomstdeal: eerste maand gratis bij 6+ maanden abonnement", "expires": "2026-07-31"}');
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger profiles_updated_at before update on profiles for each row execute function update_updated_at();
create trigger businesses_updated_at before update on businesses for each row execute function update_updated_at();
create trigger customers_updated_at before update on customers for each row execute function update_updated_at();
create trigger appointments_updated_at before update on appointments for each row execute function update_updated_at();
create trigger automation_updated_at before update on automation_rules for each row execute function update_updated_at();

create or replace function handle_new_user()
returns trigger security definer set search_path = public as $$
begin insert into profiles (id, email) values (new.id, new.email); return new; end;
$$ language plpgsql;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

alter table profiles enable row level security;
alter table businesses enable row level security;
alter table services enable row level security;
alter table customers enable row level security;
alter table appointments enable row level security;
alter table messages enable row level security;
alter table automation_rules enable row level security;
alter table marketing_content enable row level security;

create policy "profiles_self_select" on profiles for select using (auth.uid() = id);
create policy "profiles_self_update" on profiles for update using (auth.uid() = id);
create policy "profiles_admin_all" on profiles for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "businesses_public_read" on businesses for select using (true);
create policy "businesses_owner_update" on businesses for update using (owner_id = auth.uid());
create policy "businesses_owner_insert" on businesses for insert with check (owner_id = auth.uid());
create policy "businesses_admin_all" on businesses for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "services_public_read" on services for select using (active = true);
create policy "services_owner_all" on services for all using (exists (select 1 from businesses where id = services.business_id and owner_id = auth.uid()));

create policy "customers_owner_all" on customers for all using (exists (select 1 from businesses where id = customers.business_id and owner_id = auth.uid()));
create policy "appointments_owner_all" on appointments for all using (exists (select 1 from businesses where id = appointments.business_id and owner_id = auth.uid()));
create policy "appointments_public_insert" on appointments for insert with check (source = 'booking_page');
create policy "messages_owner_all" on messages for all using (exists (select 1 from businesses where id = messages.business_id and owner_id = auth.uid()));
create policy "automation_owner_all" on automation_rules for all using (exists (select 1 from businesses where id = automation_rules.business_id and owner_id = auth.uid()));

create policy "content_public_read" on marketing_content for select using (true);
create policy "content_admin_write" on marketing_content for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

insert into storage.buckets (id, name, public) values ('logos', 'logos', true), ('photos', 'photos', true) on conflict (id) do nothing;

create policy "logos_public_read" on storage.objects for select using (bucket_id = 'logos');
create policy "logos_owner_write" on storage.objects for insert with check (bucket_id = 'logos' and auth.uid() is not null);
create policy "photos_public_read" on storage.objects for select using (bucket_id = 'photos');
create policy "photos_owner_write" on storage.objects for insert with check (bucket_id = 'photos' and auth.uid() is not null);
