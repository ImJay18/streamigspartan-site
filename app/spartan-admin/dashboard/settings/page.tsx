import { createClient } from '@/lib/supabase/server'
import SettingsManager from '@/components/admin/SettingsManager'
export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: settings } = await supabase.from('site_settings').select('key,value')
  const map = Object.fromEntries((settings ?? []).map(s => [s.key, s.value]))
  return <SettingsManager initialSettings={map} />
}
