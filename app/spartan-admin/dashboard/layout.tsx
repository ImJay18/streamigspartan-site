import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { AdminThemeProvider } from '@/components/admin/AdminThemeProvider'
import { AdminToastProvider } from '@/components/admin/AdminToast'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/spartan-admin')

  return (
    <AdminThemeProvider>
      <AdminToastProvider>
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--admin-bg)' }}>
          <AdminSidebar userEmail={user.email ?? ''} />
          <main style={{ flex: 1, marginLeft: 240, minHeight: '100vh', background: 'var(--admin-main)', padding: 0 }}>
            {children}
          </main>
        </div>
      </AdminToastProvider>
    </AdminThemeProvider>
  )
}
