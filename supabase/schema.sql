-- =============================================
-- Schema: Eclipse en Pueblo Carao 2027
-- =============================================

-- Tabla de leads (prospectos interesados)
create table leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  source text default 'landing',
  status text default 'new',
  assigned_to uuid references auth.users(id),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tabla de usuarios del dashboard (agentes/admins)
create table dashboard_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  name text,
  email text,
  role text default 'agent',
  created_at timestamptz default now()
);

-- Función que actualiza updated_at automáticamente
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_leads_updated_at
  before update on leads
  for each row execute function update_updated_at_column();

-- Row Level Security
alter table leads enable row level security;
alter table dashboard_users enable row level security;

-- Solo los usuarios registrados en dashboard_users pueden leer/modificar leads
create policy "Dashboard users can manage leads" on leads for all using (
  exists (select 1 from dashboard_users where user_id = auth.uid())
);

-- Los dashboard_users pueden ver a sus compañeros de equipo
-- Política simple: cualquier usuario autenticado puede leer dashboard_users
-- (evita recursión infinita al consultarse a sí misma)
create policy "Auth users can read dashboard_users" on dashboard_users
for select using (auth.role() = 'authenticated');
