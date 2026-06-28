import { createClient } from '@/lib/supabase/server'
import FAQsManager from '@/components/admin/FAQsManager'
export default async function FAQsPage() {
  const supabase = await createClient()
  const { data: faqs } = await supabase.from('faqs').select('*').order('display_order')
  return <FAQsManager initialFAQs={faqs ?? []} />
}
