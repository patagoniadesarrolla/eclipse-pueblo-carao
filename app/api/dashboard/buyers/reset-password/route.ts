import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'

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

  const { data: profile } = await supabaseAdmin
    .from('buyer_profiles')
    .select('user_id, name, email')
    .eq('order_id', order_id)
    .single()

  if (!profile) return NextResponse.json({ error: 'No hay acceso activo para esta orden' }, { status: 404 })

  const newPassword = generateTempPassword()

  const { error } = await supabaseAdmin.auth.admin.updateUserById(profile.user_id, {
    password: newPassword,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, temp_password: newPassword, email: profile.email, name: profile.name })
}
