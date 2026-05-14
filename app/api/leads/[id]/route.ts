import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  // Si el lead tiene órdenes con buyer_profile, eliminar usuario Auth también
  const { data: orders } = await supabaseAdmin
    .from('orders')
    .select('id, buyer_profiles(id, user_id)')
    .eq('lead_id', id)

  for (const order of orders ?? []) {
    const profiles = Array.isArray(order.buyer_profiles)
      ? order.buyer_profiles
      : order.buyer_profiles
        ? [order.buyer_profiles]
        : []

    for (const profile of profiles as Array<{ id: string; user_id: string }>) {
      await supabaseAdmin.from('buyer_profiles').delete().eq('id', profile.id)
      await supabaseAdmin.auth.admin.deleteUser(profile.user_id)
    }
  }

  // Eliminar el lead (las órdenes se eliminan por cascade si está configurado,
  // o las eliminamos explícitamente)
  await supabaseAdmin.from('orders').delete().eq('lead_id', id)
  const { error } = await supabaseAdmin.from('leads').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
