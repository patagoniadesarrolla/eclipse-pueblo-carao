import { createServerSupabaseClient } from '@/lib/supabase-server'
import Sidebar from '@/components/dashboard/Sidebar'

export const metadata = { title: 'Panel · Eclipse Pueblo Carao' }

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Sin usuario: renderizar solo los children (login page) sin sidebar
  // El middleware ya se encarga de proteger las rutas
  if (!user) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      <Sidebar userEmail={user.email ?? ''} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
