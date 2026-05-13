import { createServerSupabaseClient } from '@/lib/supabase-server'
import { DEFAULT_SETTINGS, DEFAULT_FEATURES } from '@/types'
import LandingEditor from '@/components/dashboard/landing/LandingEditor'

export const metadata = { title: 'Editor de Landing · Eclipse Carao' }

export default async function LandingPage() {
  const supabase = createServerSupabaseClient()

  const [{ data: settings }, { data: features }] = await Promise.all([
    supabase.from('landing_settings').select('*').single(),
    supabase.from('landing_features').select('*').order('sort_order'),
  ])

  return (
    <LandingEditor
      initialSettings={settings ?? DEFAULT_SETTINGS}
      initialFeatures={features ?? DEFAULT_FEATURES}
    />
  )
}
