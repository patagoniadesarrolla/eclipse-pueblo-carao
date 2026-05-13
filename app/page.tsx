import { createServerSupabaseClient } from '@/lib/supabase-server'
import { DEFAULT_SETTINGS, DEFAULT_FEATURES } from '@/types'
import Hero from '@/components/landing/Hero'
import Countdown from '@/components/landing/Countdown'
import Programa from '@/components/landing/Programa'
import Includes from '@/components/landing/Includes'
import Location from '@/components/landing/Location'
import FAQ from '@/components/landing/FAQ'
import Footer from '@/components/landing/Footer'

// Siempre datos frescos — sin caché
export const dynamic = 'force-dynamic'

async function getLandingData() {
  try {
    const supabase = createServerSupabaseClient()
    const [{ data: settings }, { data: features }] = await Promise.all([
      supabase.from('landing_settings').select('*').single(),
      supabase.from('landing_features').select('*').order('sort_order'),
    ])
    return {
      settings: settings ?? DEFAULT_SETTINGS,
      features: features?.length ? features : DEFAULT_FEATURES,
    }
  } catch {
    return { settings: DEFAULT_SETTINGS, features: DEFAULT_FEATURES }
  }
}

export default async function LandingPage() {
  const { settings, features } = await getLandingData()

  return (
    <main style={{ background: '#050508' }}>
      <Hero settings={settings} />
      <Countdown />
      <Programa />
      <Includes features={features} settings={settings} />
      <Location settings={settings} />
      <FAQ />
      <Footer />
    </main>
  )
}
