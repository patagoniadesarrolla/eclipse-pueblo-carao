-- Migration: Meta Lead Ads integration + UTM tracking + lead status history

-- Agregar columnas UTM y meta_leadgen_id a la tabla leads
alter table leads add column if not exists utm_source text;
alter table leads add column if not exists utm_medium text;
alter table leads add column if not exists utm_campaign text;
alter table leads add column if not exists meta_leadgen_id text;

-- Índice para evitar duplicados de leads de Meta
create unique index if not exists leads_meta_leadgen_id_key on leads (meta_leadgen_id)
  where meta_leadgen_id is not null;

-- Tabla de historial de cambios de estado
create table if not exists lead_status_history (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid references leads(id) on delete cascade,
  from_status text,
  to_status   text not null,
  changed_by  uuid references auth.users(id),
  changed_at  timestamptz default now()
);

alter table lead_status_history enable row level security;

create policy "Dashboard users can manage history"
  on lead_status_history for all
  using (
    exists (select 1 from dashboard_users where user_id = auth.uid())
  );

-- Índice para consultas por lead
create index if not exists lead_status_history_lead_id_idx
  on lead_status_history (lead_id, changed_at desc);
