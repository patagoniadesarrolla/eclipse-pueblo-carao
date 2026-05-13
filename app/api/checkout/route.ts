import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const { lead_id, lead_email, lead_name } = await req.json()

    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: lead_email ?? undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: 30000, // $300.00
            product_data: {
              name: 'Eclipse del Dragón — Experiencia completa',
              description: 'Pueblo Carao · 6 de febrero de 2027',
            },
          },
          quantity: 1,
        },
      ],
      metadata: { lead_id, lead_name: lead_name ?? '' },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/mi-experiencia?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error creando sesión de pago'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
