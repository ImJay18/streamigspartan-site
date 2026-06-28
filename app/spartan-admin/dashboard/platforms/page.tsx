import { createClient } from '@/lib/supabase/server'
import PlatformsManager from '@/components/admin/PlatformsManager'

export default async function PlatformsPage() {
  const supabase = await createClient()
  const { data: platforms } = await supabase
    .from('platforms').select('*').order('display_order')
  return <PlatformsManager initialPlatforms={platforms ?? []} />
}
