import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase-admin'
import Stripe from 'stripe'

export const runtime = 'nodejs'

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

    // 4. Crear usuario en Supabase Auth
    const { data: authData } = await supabaseAdmin.auth.admin.createUser({
      email: buyerEmail,
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
  }

  return NextResponse.json({ received: true })
}
