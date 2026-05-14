import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Obtener todas las notificaciones no leídas
  const { data: all } = await supabase.from('notifications').select('id')
  const { data: reads } = await supabase.from('notification_reads').select('notification_id').eq('user_id', user.id)
  const readIds = new Set((reads ?? []).map(r => r.notification_id))
  const unread = (all ?? []).filter(n => !readIds.has(n.id))

  if (unread.length > 0) {
    await supabase.from('notification_reads').insert(
      unread.map(n => ({ notification_id: n.id, user_id: user.id }))
    )
  }

  return NextResponse.json({ marked: unread.length })
}
