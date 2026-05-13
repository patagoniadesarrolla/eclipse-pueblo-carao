-- =============================================
-- Migración: Editor de landing
-- Ejecutar en Supabase → SQL Editor
-- =============================================
--
-- ANTES DE EJECUTAR:
-- Ir a Storage → New bucket
--   Nombre: landing-media
--   Public: ON  (activar el toggle)
--
-- =============================================

-- Configuración global de la landing (una sola fila)
create table landing_settings (
  id uuid primary key default gen_random_uuid(),
  hero_title text not null default 'Eclipse en Pueblo Carao · 2027',
  hero_tagline text not null default 'Una noche que el universo preparó millones de años',
  hero_price text not null default '$300 USD',
  hero_bg_type text not null default 'color',   -- 'color' | 'image' | 'video'
  hero_bg_url text,
  primary_color text not null default '#7c3aed',
  secondary_color text not null default '#d97706',
  updated_at timestamptz default now()
);

create trigger update_landing_settings_updated_at
  before update on landing_settings
  for each row execute function update_updated_at_column();

-- Características del carrusel (editables desde el dashboard)
create table landing_features (
  id uuid primary key default gen_random_uuid(),
  emoji text not null default '⭐',
  title text not null,
  description text not null,
  sort_order int not null default 0,
  created_at timestamptz default now()
);

-- RLS: lectura pública, escritura solo dashboard_users
alter table landing_settings enable row level security;
alter table landing_features enable row level security;

create policy "Public read landing_settings" on landing_settings for select using (true);
create policy "Dashboard write landing_settings" on landing_settings for all using (
  exists (select 1 from dashboard_users where user_id = auth.uid())
);

create policy "Public read landing_features" on landing_features for select using (true);
create policy "Dashboard write landing_features" on landing_features for all using (
  exists (select 1 from dashboard_users where user_id = auth.uid())
);

-- Datos iniciales
insert into landing_settings (hero_title, hero_tagline, hero_price, hero_bg_type, primary_color, secondary_color)
values (
  'Eclipse en Pueblo Carao · 2027',
  'Una noche que el universo preparó millones de años',
  '$300 USD',
  'color',
  '#7c3aed',
  '#d97706'
);

insert into landing_features (emoji, title, description, sort_order) values
  ('🍷', 'Picnic gourmet', 'Selección de quesos, chacinados patagónicos, pan artesanal y vinos de bodega local bajo las estrellas.', 0),
  ('🔭', 'Guía de astroturismo', 'Acompañamiento experto durante el eclipse: historia, ciencia y mitología del cielo patagónico.', 1),
  ('📱', 'App digital exclusiva', 'Realidad aumentada para identificar constelaciones y mapa interactivo del eclipse en tiempo real.', 2),
  ('📜', 'Certificado de experiencia', 'Documento oficial que acredita tu presencia en uno de los eventos astronómicos más raros del siglo.', 3);
