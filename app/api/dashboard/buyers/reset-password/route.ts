import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'

function generateTempPassword(): string {
  const upper  = 'ABCDEFGHJKMNPQRSTUVWXYZ'
  const lower  = 'abcdefghjkmnpqrstuvwxyz'
  const digits = '23456789'
  const all    = upper + lower + digits
  const pwd = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    digits[Math.floor(Math.random() * digits.length)],
    ...Array.from({ length: 5 }, () => all[Math.floor(Math.random() * all.length)]),
  ]
  for (let i = pwd.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pwd[i], pwd[j]] = [pwd[j], pwd[i]]
  }
  return pwd.join('')
}

export async function POST(req: NextRequest) {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { order_id } = await req.json()
  if (!order_id) return NextResponse.json({ error: 'order_id required' }, { status: 400 })

  const { data: profile } = await supabaseAdmin
    .from('buyer_profiles')
    .select('user_id, name, email')
    .eq('order_id', order_id)
    .single()

  if (!profile) return NextResponse.json({ error: 'No hay acceso activo para esta orden' }, { status: 404 })

  const newPassword = generateTempPassword()

  const { error } = await supabaseAdmin.auth.admin.updateUserById(profile.user_id, {
    password: newPassword,
    email_confirm: true,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Magic link con el origin real del request (no env var que puede ser localhost)
  const origin = req.headers.get('origin') ?? req.nextUrl.origin
  const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email: profile.email,
    options: { redirectTo: `${origin}/mi-experiencia` },
  })

  // Verificar estado del usuario para diagnóstico
  const { data: userData } = await supabaseAdmin.auth.admin.getUserById(profile.user_id)

  return NextResponse.json({
    ok: true,
    temp_password: newPassword,
    email: profile.email,
    name: profile.name,
    magic_link: linkError ? null : (linkData?.properties?.action_link ?? null),
    debug: {
      email_confirmed: !!userData?.user?.email_confirmed_at,
      link_error: linkError?.message ?? null,
    },
  })
}
