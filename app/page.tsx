import { createClient } from '@/lib/supabase/server'
import { CartProvider } from '@/lib/cartContext'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import BenefitsSection from '@/components/sections/BenefitsSection'
import PlatformsSection from '@/components/sections/PlatformsSection'
import CombosSection from '@/components/sections/CombosSection'
import HowItWorks from '@/components/sections/HowItWorks'
import FAQSection from '@/components/sections/FAQSection'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import CartDrawer from '@/components/sections/CartDrawer'

export const revalidate = 60

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: platforms }, { data: combos }, { data: faqs }] = await Promise.all([
    supabase.from('platforms').select('*').eq('active', true).order('display_order'),
    supabase.from('combos').select('*').eq('active', true).order('display_order'),
    supabase.from('faqs').select('*').eq('active', true).order('display_order'),
  ])

  return (
    <CartProvider initialCombos={combos ?? []}>
      <Navbar />
      <CartDrawer />
      <main>
        <HeroSection />
        <BenefitsSection />
        <PlatformsSection platforms={platforms ?? []} />
        <CombosSection combos={combos ?? []} />
        <HowItWorks />
        <FAQSection faqs={faqs ?? []} />
      </main>
      <Footer />
      <WhatsAppButton />
    </CartProvider>
  )
}
