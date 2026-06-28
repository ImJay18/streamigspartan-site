'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAdminTheme } from './AdminThemeProvider'

const grad = 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)'

const NAV = [
  { label: 'Inicio',        href: '/spartan-admin/dashboard',
    icon: <svg width="17" height="17" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="10" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="10" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg> },
  { label: 'Plataformas',   href: '/spartan-admin/dashboard/platforms',
    icon: <svg width="17" height="17" viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2 7h14" stroke="currentColor" strokeWidth="1.3"/><path d="M6 13l2.5-2.5L11 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: 'Combos',        href: '/spartan-admin/dashboard/combos',
    icon: <svg width="17" height="17" viewBox="0 0 18 18" fill="none"><path d="M2 9h3.5l2-5.5 3 11 2-5.5H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: 'FAQs',          href: '/spartan-admin/dashboard/faqs',
    icon: <svg width="17" height="17" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M9 13v-1M9 6a2 2 0 011.8 2.5C10.5 9.5 9 10 9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  { label: 'Métodos de pago', href: '/spartan-admin/dashboard/payment-methods',
    icon: <svg width="17" height="17" viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2 8h14" stroke="currentColor" strokeWidth="1.4"/><circle cx="5.5" cy="11.5" r="1" fill="currentColor"/><rect x="8" y="10.5" width="5" height="2" rx="1" fill="currentColor" opacity=".5"/></svg> },
  { label: 'Configuración', href: '/spartan-admin/dashboard/settings',
    icon: <svg width="17" height="17" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M9 2v1.5M9 14.5V16M2 9h1.5M14.5 9H16M4.1 4.1l1 1M12.9 12.9l1 1M4.1 13.9l1-1M12.9 5.1l1-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
]

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const router   = useRouter()
  const { theme, toggle } = useAdminTheme()

  const S = {
    sidebar:  'var(--admin-sidebar)',
    border:   'var(--admin-border)',
    text:     'var(--admin-text)',
    text2:    'var(--admin-text2)',
    surface:  'var(--admin-surface)',
    surface2: 'var(--admin-surface2)',
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/spartan-admin')
    router.refresh()
  }

  return (
    <aside style={{ position: 'fixed', top: 0, left: 0, width: 240, height: '100vh', background: S.sidebar, borderRight: `1px solid ${S.border}`, display: 'flex', flexDirection: 'column', zIndex: 40, transition: 'background 0.3s' }}>

      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: `1px solid ${S.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Streaming Spartan" style={{ height: 40, width: 'auto', objectFit: 'contain' }}/>
        </div>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: 10, color: '#8B5CF6', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Panel Administrador</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        {NAV.map(item => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 10, marginBottom: 2,
              textDecoration: 'none',
              color: active ? (theme === 'dark' ? '#fff' : '#3b0fa0') : S.text2,
              background: active ? 'rgba(139,92,246,0.15)' : 'transparent',
              borderLeft: active ? '2px solid #8B5CF6' : '2px solid transparent',
              fontSize: 13, fontWeight: active ? 600 : 400,
              transition: 'all 0.15s',
            }}>
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Theme switch + user */}
      <div style={{ padding: '12px 10px', borderTop: `1px solid ${S.border}` }}>

        {/* Theme toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', marginBottom: 8, background: S.surface, borderRadius: 10, border: `1px solid ${S.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            {theme === 'dark'
              ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M10 7a4 4 0 11-5.3-3.8A5 5 0 0010 7z" stroke={S.text2} strokeWidth="1.3" strokeLinejoin="round"/></svg>
              : <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="3" stroke={S.text2} strokeWidth="1.3"/><path d="M7 1v1M7 12v1M1 7h1M12 7h1M3 3l.7.7M10.3 10.3l.7.7M10.3 3.7L11 3M3 10.3l-.7.7" stroke={S.text2} strokeWidth="1.3" strokeLinecap="round"/></svg>
            }
            <span style={{ fontSize: 12, color: S.text2 }}>{theme === 'dark' ? 'Modo oscuro' : 'Modo claro'}</span>
          </div>
          {/* Toggle switch */}
          <div onClick={toggle} style={{ position: 'relative', width: 36, height: 20, cursor: 'pointer' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 999, background: theme === 'dark' ? '#8B5CF6' : '#E4E4F0', transition: 'background 0.25s' }}/>
            <div style={{ position: 'absolute', top: 3, left: theme === 'dark' ? 18 : 3, width: 14, height: 14, borderRadius: '50%', background: '#fff', transition: 'left 0.25s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}/>
          </div>
        </div>

        {/* User info */}
        <div style={{ padding: '8px 12px', marginBottom: 8, background: S.surface, borderRadius: 10, border: `1px solid ${S.border}` }}>
          <div style={{ fontSize: 10, color: S.text2, marginBottom: 2 }}>Conectado como</div>
          <div style={{ fontSize: 12, color: S.text, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userEmail}</div>
        </div>

        <button onClick={handleLogout}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 10, background: 'transparent', border: `1px solid ${S.border}`, color: S.text2, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(239,68,68,0.4)'; e.currentTarget.style.color='#ef4444' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor=S.border; e.currentTarget.style.color=S.text2 }}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M11 11l3-3-3-3M14 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
