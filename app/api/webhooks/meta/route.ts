import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// GET — verificación de webhook por Meta
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mode      = searchParams.get('hub.mode')
  const token     = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.META_WEBHOOK_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }

  return new NextResponse('Forbidden', { status: 403 })
}

// POST — lead nuevo desde Meta Lead Ads
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const changes = body?.entry?.[0]?.changes ?? []

    for (const change of changes) {
      const value = change?.value
      if (!value?.leadgen_id) continue

      const leadgenId = String(value.leadgen_id)
      const fieldData: Array<{ name: string; values: string[] }> = value.field_data ?? []

      const get = (key: string) =>
        fieldData.find((f) => f.name === key)?.values?.[0]?.trim() ?? null

      const fullName = get('full_name') ?? get('first_name') ?? ''
      const email    = get('email') ?? ''
      const phone    = get('phone_number') ?? get('phone') ?? null

      if (!fullName && !email) continue

      // Insertar ignorando duplicados (índice único en meta_leadgen_id)
      await supabaseAdmin.from('leads').insert({
        name:            fullName || email,
        email:           email.toLowerCase(),
        phone,
        source:          'meta_lead_ad',
        meta_leadgen_id: leadgenId,
      })
      // Si ya existe el leadgen_id, el insert falla silenciosamente (constraint unique)
    }
  } catch {
    // Meta requiere siempre 200 para no reintentar
  }

  return new NextResponse('OK', { status: 200 })
}
