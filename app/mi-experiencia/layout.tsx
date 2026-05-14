import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import StarField from '@/components/buyer/StarField'
import BuyerNav from '@/components/buyer/BuyerNav'

export const metadata = { title: 'Mi Experiencia · Eclipse Pueblo Carao' }

const PUBLIC_PATHS = ['/mi-experiencia/login', '/mi-experiencia/sin-acceso']

export default async function BuyerLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? ''

  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return (
      <div className="min-h-screen" style={{ background: '#050508', color: 'white' }}>
        {children}
      </div>
    )
  }

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
