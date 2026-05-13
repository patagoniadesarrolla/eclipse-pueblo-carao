import { createServerSupabaseClient } from '@/lib/supabase-server'
import KanbanBoard from '@/components/dashboard/KanbanBoard'
import { Lead } from '@/types'

export const dynamic = 'force-dynamic'

export default async function PipelinePage() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  const leads: Lead[] = data ?? []

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Pipeline</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {leads.length} {leads.length === 1 ? 'lead' : 'leads'} en total · Arrastrá para cambiar estado
        </p>
      </div>
      <KanbanBoard initialLeads={leads} />
    </div>
  )
}
