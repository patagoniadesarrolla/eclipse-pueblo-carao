import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { order_id } = await req.json()
  if (!order_id) return NextResponse.json({ error: 'order_id required' }, { status: 400 })

  // Obtener buyer_profile asociado a esta orden
  const { data: profile } = await supabaseAdmin
    .from('buyer_profiles')
    .select('id, user_id')
    .eq('order_id', order_id)
    .single()

  if (!profile) return NextResponse.json({ error: 'No hay acceso activo para esta orden' }, { status: 404 })

  // Eliminar buyer_profile
  await supabaseAdmin.from('buyer_profiles').delete().eq('id', profile.id)

  // Eliminar usuario de Supabase Auth
  await supabaseAdmin.auth.admin.deleteUser(profile.user_id)

  // Marcar orden como refunded
  await supabaseAdmin
    .from('orders')
    .update({ payment_status: 'refunded' })
    .eq('id', order_id)

  return NextResponse.json({ ok: true })
}
