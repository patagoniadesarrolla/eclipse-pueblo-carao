import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [{ data: notifications }, { data: reads }] = await Promise.all([
    supabase.from('notifications').select('*').order('created_at', { ascending: false }),
    supabase.from('notification_reads').select('notification_id').eq('user_id', user.id),
  ])

  const readIds = new Set((reads ?? []).map(r => r.notification_id))
  const result = (notifications ?? []).map(n => ({ ...n, read: readIds.has(n.id) }))

  return NextResponse.json({ notifications: result })
}
