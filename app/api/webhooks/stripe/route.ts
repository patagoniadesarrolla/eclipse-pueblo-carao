import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { resend, FROM_ADDRESS } from '@/lib/resend'
import { bienvenidaEmail } from '@/lib/emails/bienvenida'
import Stripe from 'stripe'

export const runtime = 'nodejs'

function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') ?? ''

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook signature invalid' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const lead_id = session.metadata?.lead_id
    const buyerEmail = session.customer_details?.email ?? session.customer_email ?? ''
    const buyerName = session.customer_details?.name ?? session.metadata?.lead_name ?? ''
    const amountUsd = (session.amount_total ?? 30000) / 100

    if (!lead_id) {
      return NextResponse.json({ error: 'Missing lead_id' }, { status: 400 })
    }

    // 1. Actualizar lead status a "sold"
    await supabaseAdmin
      .from('leads')
      .update({ status: 'sold', updated_at: new Date().toISOString() })
      .eq('id', lead_id)

    // 2. Registrar en lead_status_history
    await supabaseAdmin.from('lead_status_history').insert({
      lead_id,
      from_status: null,
      to_status: 'sold',
      changed_by: null,
      changed_at: new Date().toISOString(),
    })

    // 3. Crear registro en orders
    const { data: order } = await supabaseAdmin
      .from('orders')
      .insert({
        lead_id,
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        amount_usd: amountUsd,
        payment_method: 'stripe',
        payment_status: 'paid',
        stripe_session_id: session.id,
      })
      .select()
      .single()

    // 4. Crear usuario en Supabase Auth con password temporal
    const tempPassword = generateTempPassword()
    const { data: authData } = await supabaseAdmin.auth.admin.createUser({
      email: buyerEmail,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { name: buyerName },
    })

    // 5. Crear buyer_profile
    if (authData?.user) {
      await supabaseAdmin.from('buyer_profiles').insert({
        user_id: authData.user.id,
        order_id: order?.id ?? null,
        name: buyerName,
        email: buyerEmail,
      })
    }

    // 6. Enviar email de bienvenida
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://eclipsepuebloca rao.com'
    const { subject, html } = bienvenidaEmail({
      nombre: buyerName,
      email: buyerEmail,
      password_temporal: tempPassword,
      fecha_evento: '6 de febrero de 2027',
      url_app: `${appUrl}/mi-experiencia`,
    })

    const { data: emailData } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: buyerEmail,
      subject,
      html,
    })

    // 7. Guardar en email_logs
    await supabaseAdmin.from('email_logs').insert({
      template_key: 'bienvenida',
      recipient_email: buyerEmail,
      recipient_name: buyerName,
      subject,
      status: 'sent',
      resend_id: emailData?.id ?? null,
    })
  }

  return NextResponse.json({ received: true })
}
