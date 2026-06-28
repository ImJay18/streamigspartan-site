import { createClient } from '@/lib/supabase/server'
import PaymentMethodsManager from '@/components/admin/PaymentMethodsManager'

export default async function PaymentMethodsPage() {
  const supabase = await createClient()
  const { data: methods } = await supabase
    .from('payment_methods')
    .select('*')
    .order('display_order')

  return <PaymentMethodsManager initialMethods={methods ?? []} />
}
