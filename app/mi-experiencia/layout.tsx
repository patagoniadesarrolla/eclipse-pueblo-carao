import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import StarField from '@/components/buyer/StarField'
import BuyerNav from '@/components/buyer/BuyerNav'

export const metadata = { title: 'Mi Experiencia · Eclipse Pueblo Carao' }

export default async function BuyerLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/mi-experiencia/login')

  // Verificar buyer_profile
  const { data: profile } = await supabase
    .from('buyer_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!profile) redirect('/mi-experiencia/sin-acceso')

  // Contar notificaciones no leídas
  const { count: unreadCount } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .not('id', 'in', supabase
      .from('notification_reads')
      .select('notification_id')
      .eq('user_id', user.id)
    )

  return (
    <div className="min-h-screen flex" style={{ background: '#050508', color: 'white' }}>
      <StarField />
      <BuyerNav unreadCount={unreadCount ?? 0} />
      <main
        className="flex-1 overflow-y-auto pb-20 md:pb-0"
        style={{ position: 'relative', zIndex: 1 }}
      >
        {children}
      </main>
    </div>
  )
}
