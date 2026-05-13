-- =============================================
-- Seed: Datos de prueba
-- =============================================
--
-- IMPORTANTE: Antes de ejecutar este seed:
-- 1. Ir a Authentication → Users → Add user en el dashboard de Supabase
-- 2. Crear: email=admin@pueblocarao.com, password=Admin2027!
-- 3. Copiar el UUID generado y reemplazar el placeholder de abajo
--
-- =============================================

-- Usuario admin en el panel (reemplazar el UUID con el real de auth.users)
insert into dashboard_users (user_id, name, email, role)
values (
  '00000000-0000-0000-0000-000000000000',  -- ← reemplazar con UUID real
  'Admin Carao',
  'admin@pueblocarao.com',
  'admin'
);

-- 5 leads de ejemplo con distintos estados
insert into leads (name, email, phone, source, status, notes) values
  (
    'María García',
    'maria.garcia@gmail.com',
    '+54 9 11 3456 7890',
    'landing',
    'new',
    null
  ),
  (
    'Carlos Rodríguez',
    'carlos.rod@hotmail.com',
    '+54 9 11 2345 6789',
    'instagram',
    'contacted',
    'Interesado en traer a toda la familia. Preguntar por descuento grupal.'
  ),
  (
    'Valentina López',
    'valen.lopez@gmail.com',
    '+54 9 261 4567 890',
    'referral',
    'quoted',
    'Cotización enviada por WhatsApp el 10/05. Esperar respuesta.'
  ),
  (
    'Alejandro Méndez',
    'alex.mendez@empresa.com',
    '+54 9 351 5678 901',
    'landing',
    'sold',
    'Pagó señal el 10/05. Confirmado para el evento. Enviar instrucciones de acceso.'
  ),
  (
    'Luciana Torres',
    'luci.torres@gmail.com',
    null,
    'landing',
    'lost',
    'No respondió después del primer contacto. Intentar reactivar en diciembre.'
  );
