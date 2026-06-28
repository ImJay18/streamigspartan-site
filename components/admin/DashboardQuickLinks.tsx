'use client'

import Link from 'next/link'

const QUICK_LINKS = [
  { label: 'Gestionar plataformas', href: '/spartan-admin/dashboard/platforms',       desc: 'Agregar, editar o desactivar plataformas' },
  { label: 'Gestionar combos',      href: '/spartan-admin/dashboard/combos',          desc: 'Configurar precios y descuentos' },
  { label: 'Preguntas frecuentes',  href: '/spartan-admin/dashboard/faqs',            desc: 'Editar las FAQs del sitio' },
  { label: 'Métodos de pago',       href: '/spartan-admin/dashboard/payment-methods', desc: 'Editar los métodos del pie de página' },
  { label: 'Configuración general', href: '/spartan-admin/dashboard/settings',        desc: 'WhatsApp, textos hero y más' },
]

export default function DashboardQuickLinks() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
      {QUICK_LINKS.map(l => (
        <Link key={l.href} href={l.href}
          style={{ display: 'block', background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 14, padding: 20, textDecoration: 'none', transition: 'border-color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--admin-border)')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--admin-text)' }}>{l.label}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 8h8M9 5l3 3-3 3" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p style={{ fontSize: 12, color: 'var(--admin-text2)', margin: 0 }}>{l.desc}</p>
        </Link>
      ))}
    </div>
  )
}
