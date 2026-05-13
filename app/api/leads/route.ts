import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Cliente con service role para saltear RLS en el endpoint público de la landing
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name, email, phone, source = 'landing',
      utm_source, utm_medium, utm_campaign,
    } = body

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: 'Nombre y email son requeridos' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin.from('leads').insert({
      name:         name.trim(),
      email:        email.trim().toLowerCase(),
      phone:        phone?.trim() || null,
      source,
      utm_source:   utm_source   || null,
      utm_medium:   utm_medium   || null,
      utm_campaign: utm_campaign || null,
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al crear lead:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
