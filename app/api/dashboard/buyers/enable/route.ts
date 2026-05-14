import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getResend, FROM_ADDRESS } from '@/lib/resend'
import { bienvenidaEmail } from '@/lib/emails/bienvenida'

function generateTempPassword(): string {
  // Incluye al menos una mayúscula, minúscula y número para cumplir políticas de Supabase
  const upper   = 'ABCDEFGHJKMNPQRSTUVWXYZ'
  const lower   = 'abcdefghjkmnpqrstuvwxyz'
  const digits  = '23456789'
  const all     = upper + lower + digits
  // Garantizamos al menos uno de cada tipo
  const pwd = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    digits[Math.floor(Math.random() * digits.length)],
    ...Array.from({ length: 5 }, () => all[Math.floor(Math.random() * all.length)]),
  ]
  // Mezclar
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

  const { data: order } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('id', order_id)
    .single()

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  const { data: existing } = await supabaseAdmin
    .from('buyer_profiles')
    .select('id')
    .eq('order_id', order_id)
    .single()

  if (existing) return NextResponse.json({ error: 'El comprador ya tiene acceso' }, { status: 409 })

  const buyerEmail = order.buyer_email
  const buyerName  = order.buyer_name
  const tempPassword = generateTempPassword()

  // Crear usuario o recuperar existente
  let authUserId: string
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: buyerEmail,
    email_confirm: true,
    user_metadata: { name: buyerName },
  })

  if (authError) {
    const { data: listData } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
    const found = listData?.users.find(u => u.email?.toLowerCase() === buyerEmail.toLowerCase())
    if (!found) return NextResponse.json({ error: authError.message }, { status: 500 })
    authUserId = found.id
  } else {
    authUserId = authData.user.id
  }

  // Setear contraseña explícitamente (separado de createUser para máxima confiabilidad)
  const { error: pwdError } = await supabaseAdmin.auth.admin.updateUserById(authUserId, {
    password: tempPassword,
    email_confirm: true,
  })

  if (pwdError) {
    return NextResponse.json({ error: `No se pudo setear contraseña: ${pwdError.message}` }, { status: 500 })
  }

  // Verificar estado del usuario creado
  const { data: verifyData } = await supabaseAdmin.auth.admin.getUserById(authUserId)
  const authUser = verifyData?.user

  // Crear buyer_profile
  const { error: profileError } = await supabaseAdmin.from('buyer_profiles').insert({
    user_id:  authUserId,
    order_id: order_id,
    name:     buyerName,
    email:    buyerEmail,
  })

  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 })

  // Email de bienvenida (opcional)
  let emailSent = false
  if (process.env.RESEND_API_KEY) {
    try {
      const origin = req.headers.get('origin') ?? req.nextUrl.origin
      const { subject, html } = bienvenidaEmail({
        nombre:            buyerName,
        email:             buyerEmail,
        password_temporal: tempPassword,
        fecha_evento:      '6 de febrero de 2027',
        url_app:           `${origin}/mi-experiencia/login`,
      })
      await getResend().emails.send({ from: FROM_ADDRESS, to: buyerEmail, subject, html })
      await supabaseAdmin.from('email_logs').insert({
        template_key:    'bienvenida',
        recipient_email: buyerEmail,
        subject,
        status:          'sent',
      })
      emailSent = true
    } catch { /* silencioso */ }
  }

  return NextResponse.json({
    ok: true,
    temp_password: tempPassword,
    email_sent: emailSent,
    debug: {
      user_id: authUserId,
      email_confirmed: !!authUser?.email_confirmed_at,
      confirmed_at: authUser?.email_confirmed_at ?? null,
    },
  })
}
