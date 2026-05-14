import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ order_id: string }> }
) {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { order_id } = await params

  // Obtener buyer_profile asociado (si existe)
  const { data: profile } = await supabaseAdmin
    .from('buyer_profiles')
    .select('id, user_id')
    .eq('order_id', order_id)
    .single()

  if (profile) {
    await supabaseAdmin.from('buyer_profiles').delete().eq('id', profile.id)
    await supabaseAdmin.auth.admin.deleteUser(profile.user_id)
  }

  // Obtener lead_id para resetear su estado
  const { data: order } = await supabaseAdmin
    .from('orders')
    .select('lead_id')
    .eq('id', order_id)
    .single()

  // Eliminar la orden
  const { error } = await supabaseAdmin.from('orders').delete().eq('id', order_id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Resetear estado del lead a 'contacted' si estaba en 'sold'
  if (order?.lead_id) {
    await supabaseAdmin
      .from('leads')
      .update({ status: 'contacted' })
      .eq('id', order.lead_id)
      .eq('status', 'sold')
  }

  return NextResponse.json({ ok: true })
}
