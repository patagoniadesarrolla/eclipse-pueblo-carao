import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getResend, FROM_ADDRESS } from '@/lib/resend'
import { bienvenidaEmail } from '@/lib/emails/bienvenida'

function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
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

  // Verificar que no tenga ya un buyer_profile
  const { data: existing } = await supabaseAdmin
    .from('buyer_profiles')
    .select('id')
    .eq('order_id', order_id)
    .single()

  if (existing) return NextResponse.json({ error: 'El comprador ya tiene acceso' }, { status: 409 })

  const buyerEmail = order.buyer_email
  const buyerName  = order.buyer_name

  // Crear usuario en Supabase Auth (o recuperar si ya existe)
  let authUserId: string
  const tempPassword = generateTempPassword()

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: buyerEmail,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { name: buyerName },
  })

  if (authError) {
    // Si el usuario ya existe, buscar su ID
    const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()
    const found = users.find(u => u.email === buyerEmail)
    if (!found) return NextResponse.json({ error: authError.message }, { status: 500 })
    authUserId = found.id
    // Actualizar contraseña
    await supabaseAdmin.auth.admin.updateUserById(authUserId, { password: tempPassword })
  } else {
    authUserId = authData.user.id
  }

  // Crear buyer_profile
  const { error: profileError } = await supabaseAdmin.from('buyer_profiles').insert({
    user_id:  authUserId,
    order_id: order_id,
    name:     buyerName,
    email:    buyerEmail,
  })

  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 })

  // Enviar email de bienvenida
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://eclipse-pueblo-carao.vercel.app'
  const { subject, html } = bienvenidaEmail({
    nombre:            buyerName,
    email:             buyerEmail,
    password_temporal: tempPassword,
    fecha_evento:      '6 de febrero de 2027',
    url_app:           `${appUrl}/mi-experiencia/login`,
  })

  await getResend().emails.send({ from: FROM_ADDRESS, to: buyerEmail, subject, html })

  await supabaseAdmin.from('email_logs').insert({
    template_key:    'bienvenida',
    recipient_email: buyerEmail,
    subject,
    status:          'sent',
  })

  return NextResponse.json({ ok: true, temp_password: tempPassword })
}
