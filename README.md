# Eclipse en Pueblo Carao 2027

Plataforma de astroturismo premium para el eclipse anular del 6 de febrero de 2027 en Esquel, Patagonia Argentina.

## Stack

- **Next.js 14** (App Router)
- **Supabase** (auth + PostgreSQL)
- **Tailwind CSS**
- **Vercel** (deploy)

---

## Configuración inicial

### 1. Crear proyecto en Supabase

1. Ir a [supabase.com](https://supabase.com) → New project
2. Elegir región más cercana (ej: South America - São Paulo)
3. Guardar la contraseña del proyecto

### 2. Correr el schema

En Supabase → SQL Editor → New query, pegar el contenido de `supabase/schema.sql` y ejecutar.

### 3. Crear usuario admin y correr seed

1. Ir a Authentication → Users → Add user
   - Email: `admin@pueblocarao.com`
   - Password: `Admin2027!`
   - Copiar el UUID generado
2. En `supabase/seed.sql`, reemplazar `00000000-0000-0000-0000-000000000000` con el UUID real
3. Ejecutar `supabase/seed.sql` en el SQL Editor

### 4. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Completar con los valores de Supabase → Settings → API:
- `NEXT_PUBLIC_SUPABASE_URL` → Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → anon / public key
- `SUPABASE_SERVICE_ROLE_KEY` → service_role key (mantener privado)

### 5. Instalar dependencias y correr localmente

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

### 6. Configurar Meta Webhook (Lead Ads)

1. Ir a [Meta for Developers](https://developers.facebook.com) → tu app → **Webhooks**
2. Suscribirse al objeto **"leadgen"**
3. URL del webhook: `https://[tu-dominio]/api/webhooks/meta`
4. Verify token: el valor de `META_WEBHOOK_VERIFY_TOKEN` en tu `.env.local`
5. Seleccionar el campo **"leadgen"** para recibir notificaciones de leads nuevos
6. Agregar `META_WEBHOOK_VERIFY_TOKEN` en Vercel → Settings → Environment Variables

Los leads de Meta aparecen en el dashboard con fuente **"Meta Ads"** y se descartan duplicados automáticamente.

### 7. Deploy en Vercel

```bash
npx vercel --prod
```

O conectar el repo en [vercel.com](https://vercel.com) y agregar las variables de entorno en Settings → Environment Variables.

---

## Estructura del proyecto

```
/app
  /page.tsx              → Landing pública
  /dashboard
    /layout.tsx          → Auth guard + sidebar
    /page.tsx            → Redirect a /leads
    /login/page.tsx      → Login
    /leads/page.tsx      → Gestión de leads
  /api/leads/route.ts    → POST endpoint leads
/components
  /landing/              → Componentes de la landing
  /dashboard/            → Componentes del panel
/lib
  /supabase.ts           → Cliente browser
  /supabase-server.ts    → Cliente server
/supabase
  /schema.sql            → Schema de base de datos
  /seed.sql              → Datos de prueba
```

## URLs

| Ruta | Descripción |
|------|-------------|
| `/` | Landing pública con formulario de reserva |
| `/dashboard/login` | Login del panel |
| `/dashboard/leads` | Gestión de leads |
