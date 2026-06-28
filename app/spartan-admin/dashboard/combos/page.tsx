import { createClient } from '@/lib/supabase/server'
import CombosManager from '@/components/admin/CombosManager'

export default async function CombosPage() {
  const supabase = await createClient()
  const [{ data: combos }, { data: platforms }] = await Promise.all([
    supabase.from('combos').select('*').order('display_order'),
    supabase.from('platforms').select('id,name,logo_url,price').eq('active', true).order('display_order'),
  ])
  return <CombosManager initialCombos={combos ?? []} availablePlatforms={platforms ?? []} />
}
