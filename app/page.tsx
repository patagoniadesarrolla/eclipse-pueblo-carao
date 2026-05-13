import Hero from '@/components/landing/Hero'
import Countdown from '@/components/landing/Countdown'
import Includes from '@/components/landing/Includes'
import Location from '@/components/landing/Location'
import FAQ from '@/components/landing/FAQ'
import Footer from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <main style={{ background: '#050508' }}>
      <Hero />
      <Countdown />
      <Includes />
      <Location />
      <FAQ />
      <Footer />
    </main>
  )
}
