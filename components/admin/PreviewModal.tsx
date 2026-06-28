'use client'

import Image from 'next/image'
import type { Platform, Combo } from '@/types'

const grad = 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)'
const COP  = (v: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v)

function PlatformPreview({ p }: { p: Platform }) {
  const isPromo  = p.original_price > 0 && p.original_price > p.price
  const discount = isPromo ? Math.round(((p.original_price - p.price) / p.original_price) * 100) : 0
  return (
    <div style={{ background: '#0F0F0F', border: isPromo ? '1px solid rgba(217,70,239,0.5)' : '1px solid #1A1A2E', borderRadius: 16, padding: 20, width: 200, position: 'relative', boxShadow: isPromo ? '0 0 20px rgba(217,70,239,0.1)' : 'none' }}>
      {isPromo && (
        <div style={{ position: 'absolute', top: -11, right: 12 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 999, background: 'linear-gradient(135deg,#D946EF,#8B5CF6)', fontSize: 10, fontWeight: 800, color: '#fff', boxShadow: '0 0 12px rgba(217,70,239,0.5)' }}>
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M5 1l1.1 2.4 2.6.2-1.9 1.7.6 2.6L5 6.7 2.6 7.9l.6-2.6L1.3 3.6l2.6-.2L5 1z" fill="white"/></svg>
            -{discount}% Promo
          </div>
        </div>
      )}
      <div style={{ height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: isPromo ? 4 : 0, marginBottom: 12 }}>
        <Image src={p.logo_url} alt={p.name} width={100} height={40} style={{ objectFit: 'contain', maxHeight: 40, width: 'auto' }} unoptimized/>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{p.name}</span>
        <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 999, color: '#fff', background: grad }}>{p.plan_type}</span>
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, marginBottom: 12 }}>
        {p.features.map(f => (
          <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#A1A1AA', marginBottom: 4 }}>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="#8B5CF6" strokeWidth="1.2"/><path d="M3.5 6l2 2 3-3" stroke="#8B5CF6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {f}
          </li>
        ))}
      </ul>
      <div style={{ paddingTop: 10, borderTop: '1px solid #1A1A2E' }}>
        {isPromo && <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}><span style={{ fontSize: 11, color: '#71717a', textDecoration: 'line-through' }}>{COP(p.original_price)}</span><span style={{ fontSize: 10, fontWeight: 700, color: '#D946EF' }}>-{discount}%</span></div>}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: '#A1A1AA' }}>Desde <span style={{ color: isPromo ? '#D946EF' : '#fff', fontWeight: 700 }}>{COP(p.price)}</span></span>
          <span style={{ fontSize: 11, fontWeight: 600, padding: '5px 10px', borderRadius: 7, color: '#fff', background: grad }}>Ver planes</span>
        </div>
      </div>
    </div>
  )
}

function ComboPreview({ c }: { c: Combo }) {
  const discount = c.original_price > 0 && c.original_price > c.price
    ? Math.round(((c.original_price - c.price) / c.original_price) * 100) : 0
  const BADGE_BG: Record<string, string> = { purple: '#8B5CF6', magenta: '#D946EF', green: '#10b981' }
  return (
    <div style={{ background: '#0F0F0F', border: c.is_featured ? '2px solid #8B5CF6' : '1px solid #1A1A2E', borderRadius: 16, padding: '22px 18px 18px', width: 220, position: 'relative', boxShadow: c.is_featured ? '0 0 30px rgba(139,92,246,0.15)' : 'none' }}>
      {c.badge_text && (
        <div style={{ position: 'absolute', top: -11, left: 14 }}>
          <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 999, color: '#fff', background: BADGE_BG[c.badge_color] ?? '#8B5CF6' }}>{c.badge_text}</span>
        </div>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
        {c.platform_names.map((name, i) => (
          <span key={name} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{name}</span>
            {i < c.platform_names.length - 1 && <span style={{ color: '#8B5CF6', fontSize: 14 }}>+</span>}
          </span>
        ))}
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{c.name}</h3>
      <p style={{ fontSize: 11, color: '#A1A1AA', marginBottom: 14 }}>{c.description}</p>
      {c.original_price > 0 && c.original_price > c.price && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{ fontSize: 12, color: '#52525b', textDecoration: 'line-through' }}>{COP(c.original_price)}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#34d399' }}>-{discount}%</span>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 14 }}>
        <span style={{ fontSize: 26, fontWeight: 900, color: '#fff' }}>{COP(c.price)}</span>
        <span style={{ fontSize: 11, color: '#A1A1AA' }}>/mes</span>
      </div>
      <div style={{ textAlign: 'center', padding: '9px', borderRadius: 10, background: grad, fontSize: 12, fontWeight: 600, color: '#fff' }}>Elegir combo</div>
    </div>
  )
}

interface PreviewModalProps {
  type: 'platform' | 'combo'
  item: Platform | Combo
  onClose: () => void
}

export default function PreviewModal({ type, item, onClose }: PreviewModalProps) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}
    >
      <div onClick={e => e.stopPropagation()} style={{ background: '#0A0A0A', border: '1px solid #1A1A2E', borderRadius: 20, padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, minWidth: 320 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 2 }}>Vista previa</h3>
            <p style={{ fontSize: 12, color: '#A1A1AA' }}>Así se verá en la landing</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: '1px solid #1A1A2E', borderRadius: 8, color: '#A1A1AA', cursor: 'pointer', padding: '6px 8px' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Preview */}
        <div style={{ background: '#050505', borderRadius: 14, padding: 28, border: '1px solid #1A1A2E' }}>
          {type === 'platform'
            ? <PlatformPreview p={item as Platform}/>
            : <ComboPreview c={item as Combo}/>
          }
        </div>

        <p style={{ fontSize: 11, color: '#52525b', textAlign: 'center' }}>
          Click fuera para cerrar
        </p>
      </div>
    </div>
  )
}
