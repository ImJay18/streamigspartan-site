import { createClient } from '@/lib/supabase/server'
import DashboardQuickLinks from '@/components/admin/DashboardQuickLinks'

const grad = 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)'

export default async function DashboardHome() {
  const supabase = await createClient()

  const [
    { count: platforms },
    { count: combos },
    { count: faqs },
    { data: settings },
  ] = await Promise.all([
    supabase.from('platforms').select('*', { count: 'exact', head: true }),
    supabase.from('combos').select('*', { count: 'exact', head: true }),
    supabase.from('faqs').select('*', { count: 'exact', head: true }),
    supabase.from('site_settings').select('key,value').in('key', ['whatsapp_number']),
  ])

  const settingsMap = Object.fromEntries((settings ?? []).map(s => [s.key, s.value]))

  const STATS = [
    { label: 'Plataformas activas', value: platforms ?? 0,
      icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="12" rx="2" stroke="#8B5CF6" strokeWidth="1.6"/><path d="M2 8h16" stroke="#8B5CF6" strokeWidth="1.4"/></svg> },
    { label: 'Combos disponibles', value: combos ?? 0,
      icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 10h4l2-6 3 12 2-6h3" stroke="#D946EF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { label: 'FAQs publicadas', value: faqs ?? 0,
      icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="#8B5CF6" strokeWidth="1.6"/><path d="M10 14v-1M10 7a2 2 0 011.9 2.6C11.5 10.5 10 11 10 12" stroke="#8B5CF6" strokeWidth="1.6" strokeLinecap="round"/></svg> },
    { label: 'Número WhatsApp', value: settingsMap.whatsapp_number ?? '—',
      icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M17 3A9 9 0 002.5 14.5L1 19l4.6-1.5A9 9 0 0017 3z" stroke="#D946EF" strokeWidth="1.6" strokeLinejoin="round"/></svg> },
  ]

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--admin-text)', marginBottom: 4 }}>Panel de administración</h1>
        <p style={{ fontSize: 14, color: 'var(--admin-text2)' }}>Resumen general de Streaming Spartan</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {STATS.map(s => (
          <div key={s.label} style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 14, padding: '20px 20px 16px' }}>
            <div style={{ marginBottom: 12 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--admin-text)', marginBottom: 4, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--admin-text2)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--admin-text)', marginBottom: 14 }}>Accesos rápidos</h2>
      <DashboardQuickLinks />

      <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--admin-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, color: 'var(--admin-text2)' }}>Ver cómo se ve el sitio público</span>
        <a href="/" target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#fff', background: grad, textDecoration: 'none' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M6 2H2v10h10V8M8 2h4v4M6 8l4-4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Abrir sitio
        </a>
      </div>
    </div>
  )
}
