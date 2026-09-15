-- Note: the `user_role` enum type and the `packages` table's new columns
-- are created separately in scripts/seed.ts, since a `packages` table
-- already exists in this database from earlier (abandoned) work and
-- Postgres has no `CREATE TYPE IF NOT EXISTS`.

create table if not exists app_users (
  id text primary key,
  email text unique not null,
  name text,
  role user_role not null default 'user',
  allowed_pages text[],
  created_at timestamptz not null default now()
);

create table if not exists site_content (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now(),
  updated_by text references app_users(id) on delete set null
);

-- Repeated-card sections on the landing page (trust badges, services grid)
-- that the super admin can add/remove cards from, not just edit text in.
create table if not exists site_content_blocks (
  id uuid primary key default gen_random_uuid(),
  section text not null,
  position integer not null default 0,
  icon text not null default 'star',
  title text not null default '',
  body text not null default '',
  href text,
  created_at timestamptz not null default now()
);

create index if not exists site_content_blocks_section_idx on site_content_blocks (section, position);

create table if not exists travel_requests (
  id uuid primary key default gen_random_uuid(),
  destination text not null,
  guest_name text not null,
  guest_email text not null,
  guest_phone text not null,
  travel_date date,
  travelers_count integer not null default 1,
  notes text,
  context text,
  status text not null default 'new',
  assigned_to text references app_users(id) on delete set null,
  user_id text references app_users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists travel_requests_status_idx on travel_requests (status);
create index if not exists packages_category_idx on packages (category);
