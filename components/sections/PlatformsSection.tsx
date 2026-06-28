'use client'

import Image from 'next/image'
import { Platform } from '@/types'
import AddToCartButton from './AddToCartButton'

const grad = 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)'
const COP  = (v: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v)

function PlatformCard({ p }: { p: Platform }) {
  const isPromo  = p.original_price > 0 && p.original_price > p.price
  const discount = isPromo ? Math.round(((p.original_price - p.price) / p.original_price) * 100) : 0

  return (
    <div
      style={{
        position: 'relative',
        background: 'var(--plat-card-bg)',
        border: isPromo ? '1.5px solid rgba(217,70,239,0.45)' : '1px solid var(--plat-card-border)',
        borderRadius: 18,
        padding: '20px 18px 18px',
        display: 'flex', flexDirection: 'column', gap: 0,
        transition: 'transform 0.25s, border-color 0.25s, box-shadow 0.25s',
        boxShadow: isPromo
          ? '0 0 24px rgba(217,70,239,0.12), 0 4px 16px rgba(0,0,0,0.3)'
          : '0 4px 16px rgba(0,0,0,0.25)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-5px)'
        e.currentTarget.style.borderColor = isPromo ? 'rgba(217,70,239,0.7)' : 'rgba(139,92,246,0.5)'
        e.currentTarget.style.boxShadow = isPromo
          ? '0 0 32px rgba(217,70,239,0.2), 0 8px 24px rgba(0,0,0,0.4)'
          : '0 8px 28px rgba(139,92,246,0.15), 0 4px 16px rgba(0,0,0,0.4)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = isPromo ? 'rgba(217,70,239,0.45)' : 'rgba(255,255,255,0.07)'
        e.currentTarget.style.boxShadow = isPromo
          ? '0 0 24px rgba(217,70,239,0.12), 0 4px 16px rgba(0,0,0,0.3)'
          : '0 4px 16px rgba(0,0,0,0.25)'
      }}>

      {/* Promo star badge — top left */}
      {isPromo && (
        <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: grad,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(139,92,246,0.5)',
          }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M7 1l1.5 3.5L12 5l-2.5 2.4.6 3.6L7 9.4 3.9 11l.6-3.6L2 5l3.5-.5L7 1z" fill="white"/>
            </svg>
          </div>
        </div>
      )}

      {/* Discount badge — top right */}
      {isPromo && (
        <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '3px 8px', borderRadius: 999,
            background: 'rgba(139,92,246,0.2)',
            border: '1px solid rgba(139,92,246,0.35)',
            fontSize: 9, fontWeight: 800, color: '#C084FC',
            letterSpacing: '0.06em',
          }}>
            -{discount}%
          </div>
        </div>
      )}

      {/* Logo — tall area */}
      <div style={{
        height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 12,
        marginTop: isPromo ? 8 : 0,
      }}>
        <Image
          src={p.logo_url} alt={p.name}
          width={130} height={52}
          style={{ objectFit: 'contain', maxHeight: 52, width: 'auto' }}
          unoptimized
          onError={(e) => {
            // Show name as text fallback if logo fails to load
            const target = e.currentTarget as HTMLImageElement
            target.style.display = 'none'
            const parent = target.parentElement
            if (parent && !parent.querySelector('.logo-fallback')) {
              const span = document.createElement('span')
              span.className = 'logo-fallback'
              span.textContent = p.name
              span.style.cssText = 'font-size:15px;font-weight:800;color:#8B5CF6;letter-spacing:-0.02em;'
              parent.appendChild(span)
            }
          }}
        />
      </div>

      {/* Plan type badge */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
        <span style={{
          fontSize: 9, fontWeight: 800, padding: '3px 9px',
          borderRadius: 999, color: '#fff', background: grad,
          letterSpacing: '0.05em',
        }}>
          {p.plan_type}
        </span>
      </div>

      {/* Features */}
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6, flex: 1, marginBottom: 16 }}>
        {p.features.map(f => (
          <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, color: 'var(--plat-feat-color)' }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="6" cy="6" r="5" stroke="#8B5CF6" strokeWidth="1.2"/>
              <path d="M3.5 6l2 2 3-3" stroke="#8B5CF6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {f}
          </li>
        ))}
      </ul>

      {/* Price */}
      <div style={{ borderTop: '1px solid var(--plat-card-border)', paddingTop: 14, marginTop: 'auto' }}>
        {isPromo && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through' }}>{COP(p.original_price)}</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 12 }}>
          <span style={{ fontSize: 12, color: 'var(--plat-text2)' }}>Desde</span>
          <span style={{ color: isPromo ? '#D946EF' : 'var(--plat-price-color)', fontWeight: 800, fontSize: 17, letterSpacing: '-0.02em' }}>
            {COP(p.price)}
          </span>
          <span style={{ fontSize: 10, color: 'var(--plat-text2)' }}>/ pantalla</span>
        </div>
        <AddToCartButton platform={p}/>
      </div>
    </div>
  )
}

/* ── "Combos inteligentes" card ── */
function CombosPromoCard() {
  return (
    <div style={{
      position: 'relative',
      background: 'var(--plat-card-bg)',
      border: '1.5px solid rgba(139,92,246,0.35)',
      borderRadius: 18,
      padding: '28px 22px',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 16, textAlign: 'center',
      boxShadow: '0 0 24px rgba(139,92,246,0.12), 0 4px 16px rgba(0,0,0,0.08)',
      transition: 'transform 0.25s, box-shadow 0.25s',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-5px)'
      e.currentTarget.style.boxShadow = '0 0 40px rgba(139,92,246,0.22), 0 8px 24px rgba(0,0,0,0.12)'
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = '0 0 24px rgba(139,92,246,0.12), 0 4px 16px rgba(0,0,0,0.08)'
    }}>
      {/* Top glow line */}
      <div style={{
        position: 'absolute', top: 0, left: '15%', right: '15%', height: 2,
        background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.6), rgba(217,70,239,0.6), transparent)',
        borderRadius: '0 0 4px 4px',
      }}/>

      {/* Gift box icon */}
      <div style={{
        width: 64, height: 64,
        borderRadius: '50%',
        background: 'rgba(139,92,246,0.12)',
        border: '1px solid rgba(139,92,246,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
          <rect x="3" y="13" width="24" height="14" rx="2" stroke="#8B5CF6" strokeWidth="1.5"/>
          <path d="M3 17h24M15 13v14" stroke="#8B5CF6" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M15 13c0 0-4-1-4-4s2-3 4-1c2-2 4-1 4 1s-4 4-4 4z" stroke="#8B5CF6" strokeWidth="1.4" strokeLinejoin="round"/>
          <path d="M8 13V9M22 13V9M5 9h20" stroke="#8B5CF6" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      </div>

      <div>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--site-text)', marginBottom: 8, letterSpacing: '-0.01em' }}>
          Combos inteligentes
        </h3>
        <p style={{ fontSize: 12, color: 'var(--site-text2)', lineHeight: 1.6 }}>
          Detectamos las mejores combinaciones para que ahorres hasta un 40%.
        </p>
      </div>

      <a href="#combos" style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 20px', borderRadius: 12,
        border: '1px solid rgba(139,92,246,0.45)',
        color: '#8B5CF6', fontSize: 13, fontWeight: 600,
        textDecoration: 'none', width: '100%', justifyContent: 'center',
        transition: 'background 0.2s, border-color 0.2s, color 0.2s',
        background: 'rgba(139,92,246,0.08)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(139,92,246,0.15)'
        e.currentTarget.style.borderColor = 'rgba(139,92,246,0.7)'
        e.currentTarget.style.color = '#A855F7'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(139,92,246,0.08)'
        e.currentTarget.style.borderColor = 'rgba(139,92,246,0.45)'
        e.currentTarget.style.color = '#8B5CF6'
      }}>
        Ver combos populares
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>
    </div>
  )
}

export default function PlatformsSection({ platforms }: { platforms: Platform[] }) {
  return (
    <section id="plataformas" style={{ padding: '80px 0', background: 'var(--site-bg)' }}>
      <div style={{ maxWidth: 1380, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{
            fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800,
            color: 'var(--site-text)', marginBottom: 14,
            letterSpacing: '-0.03em', lineHeight: 1.1,
          }}>
            Las mejores{' '}
            <span style={{ background: grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              plataformas
            </span>
            {' '}disponibles
          </h2>
          <p style={{ fontSize: 15, color: 'var(--site-text2)', maxWidth: 560, margin: '0 auto', lineHeight: 1.65 }}>
            Selecciona tus plataformas y el número de pantallas. Detectamos combos automáticamente para que ahorres más.
          </p>
        </div>

        {/* Cards grid — 5 cols + combos card */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 16 }} className="platforms-grid">
          {platforms.map(p => <PlatformCard key={p.id} p={p}/>)}
          {/* Combos promo card always last */}
          <CombosPromoCard />
        </div>

        {/* Bottom guarantee note */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 28 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L1 4v4.5c0 2.8 2.4 5.4 6 6.3 3.6-.9 6-3.5 6-6.3V4L7 1z" stroke="#8B5CF6" strokeWidth="1.2" strokeLinejoin="round"/>
            <path d="M4 7l2.5 2.5 4-4" stroke="#8B5CF6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontSize: 12, color: 'var(--site-text2)' }}>
            Todos nuestros servicios incluyen garantía y soporte personalizado
          </span>
        </div>
      </div>

      <style>{`
        @media(max-width:1200px){ .platforms-grid{ grid-template-columns:repeat(3,1fr) !important } }
        @media(max-width:768px) { .platforms-grid{ grid-template-columns:repeat(2,1fr) !important } .plat-strip{ grid-template-columns:1fr 1fr !important } }
        @media(max-width:480px) { .platforms-grid{ grid-template-columns:1fr 1fr !important } .plat-strip{ grid-template-columns:1fr !important } }
      `}</style>
    </section>
  )
}
