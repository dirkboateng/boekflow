# BoekFlow

Multi-tenant SaaS boekingsplatform voor lokale ondernemers.

## Stack
- Next.js 15 + React 19 + TypeScript
- Supabase (Postgres + Auth + Storage)
- Tailwind CSS v3
- Vercel hosting

## Setup
1. Maak Supabase project op supabase.com
2. Run `supabase/schema.sql` daarna `supabase/schema-part2.sql` in SQL Editor
3. Kopieer 3 keys uit Project Settings → API
4. Import deze repo in Vercel, plak 3 keys als Environment Variables
5. Deploy
6. Ga naar `/signup`, maak account, in Supabase profiles tabel verander `role` van `business` naar `admin`
