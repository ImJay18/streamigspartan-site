'use client'

import { Combo } from '@/types'
import { getWhatsAppLink } from '@/lib/utils'
import { WHATSAPP_NUMBER } from '@/lib/constants'

const COP = (v: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v)

/* Badge icon per badge_color */
const BadgeIcon = ({ color }: { color: string }) => {
  if (color === 'purple') return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
      <path d="M6 1l.9 2.7H10L7.6 5.3l.9 2.7L6 6.4 3.5 8l.9-2.7L2 3.7h3.1L6 1z" fill="currentColor"/>
    </svg>
  )
  if (color === 'magenta') return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
      <path d="M6 1v2M6 9v2M1 6h2M9 6h2M2.9 2.9l1.4 1.4M7.7 7.7l1.4 1.4M2.9 9.1l1.4-1.4M7.7 4.3l1.4-1.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
      <path d="M6 1.5L1 4v4c0 2.5 2 4.8 5 5.5 3-0.7 5-3 5-5.5V4L6 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    </svg>
  )
}

const BADGE_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  purple:  { bg: '#7C3AED', color: '#ffffff', border: '#7C3AED' },
  magenta: { bg: '#A21CAF', color: '#ffffff', border: '#A21CAF' },
  green:   { bg: '#059669', color: '#ffffff', border: '#059669' },
}

function ComboCard({ combo }: { combo: Combo }) {
  const discount = combo.original_price > combo.price
    ? Math.round(((combo.original_price - combo.price) / combo.original_price) * 100) : 0

  const featured = combo.is_featured
  const badge    = BADGE_STYLE[combo.badge_color] ?? BADGE_STYLE.purple

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex', flexDirection: 'column',
        background: featured
          ? 'var(--combo-featured-bg)'
          : 'var(--combo-card-bg)',
        borderRadius: 22,
        padding: '32px 28px 26px',
        border: featured
          ? '1.5px solid rgba(139,92,246,0.55)'
          : '1px solid rgba(255,255,255,0.07)',
        boxShadow: featured
          ? '0 0 0 1px rgba(139,92,246,0.25), 0 8px 40px rgba(139,92,246,0.2), 0 2px 8px rgba(0,0,0,0.15)'
          : '0 2px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        backdropFilter: 'blur(12px)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-5px)'
        if (!featured) e.currentTarget.style.boxShadow = '0 12px 36px rgba(139,92,246,0.15), inset 0 1px 0 rgba(255,255,255,0.04)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        if (!featured) e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)'
      }}>

      {/* Top glow line on featured */}
      {featured && (
        <div style={{
          position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.8), rgba(217,70,239,0.8), transparent)',
          borderRadius: '0 0 4px 4px',
        }}/>
      )}

      {/* Badge */}
      {combo.badge_text && (
        <div style={{ position: 'absolute', top: -14, left: 22 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 12px', borderRadius: 999,
            background: badge.bg,
            border: `1.5px solid ${badge.border}`,
            color: badge.color,
            fontSize: 10, fontWeight: 800,
            letterSpacing: '0.08em', textTransform: 'uppercase' as const,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}>
            <BadgeIcon color={combo.badge_color} />
            {combo.badge_text}
          </div>
        </div>
      )}

      {/* Platform logos */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'center',
        gap: 10, marginBottom: 20, marginTop: combo.badge_text ? 8 : 0,
        minHeight: 36,
      }}>
        {combo.platform_logos && combo.platform_logos.length > 0
          ? combo.platform_logos.map((logo, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo}
                alt={combo.platform_names[i] ?? ''}
                style={{ height: 24, width: 'auto', maxWidth: 80, objectFit: 'contain', filter: 'var(--combo-logo-filter)' }}
              />
              {i < combo.platform_logos.length - 1 && (
                <span style={{ color: 'var(--combo-plus)', fontSize: 18, fontWeight: 400, lineHeight: 1 }}>+</span>
              )}
            </span>
          ))
          : combo.platform_names.map((name, i) => (
            <span key={name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{name}</span>
              {i < combo.platform_names.length - 1 && (
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 16 }}>+</span>
              )}
            </span>
          ))
        }
      </div>

      {/* Name + description */}
      <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--combo-text)', marginBottom: 6, letterSpacing: '-0.02em' }}>
        {combo.name}
      </h3>
      <p style={{ fontSize: 13, color: 'var(--combo-text2)', marginBottom: 'auto', paddingBottom: 22, lineHeight: 1.5 }}>
        {combo.description}
      </p>

      {/* Price */}
      <div style={{ marginTop: 8 }}>
        {combo.original_price > 0 && combo.original_price > combo.price && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 13, color: 'var(--combo-old-price)', textDecoration: 'line-through' }}>
              {COP(combo.original_price)}
            </span>
            {discount > 0 && (
              <span style={{
                fontSize: 11, fontWeight: 700,
                color: '#34d399',
                background: 'rgba(52,211,153,0.12)',
                border: '1px solid rgba(52,211,153,0.25)',
                padding: '1px 7px', borderRadius: 999,
              }}>
                -{discount}%
              </span>
            )}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 20 }}>
          <span style={{
            fontSize: 40, fontWeight: 900, color: 'var(--combo-price)', lineHeight: 1,
            letterSpacing: '-0.03em',
          }}>
            {COP(combo.price)}
          </span>
          <span style={{ fontSize: 13, color: 'var(--combo-text2)', fontWeight: 400 }}>/ mes</span>
        </div>

        {/* CTA button */}
        <a
          href={getWhatsAppLink(WHATSAPP_NUMBER, `¡Hola! Quiero adquirir el ${combo.name} de Streaming Spartan.`)}
          target="_blank" rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '14px', borderRadius: 14,
            fontWeight: 700, fontSize: 15,
            color: featured ? '#fff' : 'var(--combo-text)',
            background: featured
              ? 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)'
              : 'rgba(255,255,255,0.06)',
            border: featured
              ? 'none'
              : '1px solid rgba(255,255,255,0.12)',
            textDecoration: 'none',
            boxShadow: featured ? '0 4px 20px rgba(139,92,246,0.45)' : 'none',
            transition: 'opacity 0.2s, transform 0.15s, box-shadow 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.opacity = '0.9'
            e.currentTarget.style.transform = 'translateY(-1px)'
            if (featured) e.currentTarget.style.boxShadow = '0 6px 28px rgba(139,92,246,0.6)'
            else e.currentTarget.style.background = 'rgba(139,92,246,0.10)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.opacity = '1'
            e.currentTarget.style.transform = 'translateY(0)'
            if (featured) e.currentTarget.style.boxShadow = '0 4px 20px rgba(139,92,246,0.45)'
            else e.currentTarget.style.background = 'rgba(139,92,246,0.06)'
          }}>
          {/* Cart icon */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M1 1h2.5l1.8 8M5 11.5h8l2-6H4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="6.5" cy="14" r="1.2" fill="currentColor"/>
            <circle cx="12" cy="14" r="1.2" fill="currentColor"/>
          </svg>
          Elegir combo
        </a>
      </div>
    </div>
  )
}

export default function CombosSection({ combos }: { combos: Combo[] }) {
  return (
    <section id="combos" style={{ padding: '90px 0 80px', background: 'var(--site-bg2)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 52 }}>

          <h2 style={{
            fontSize: 'clamp(30px,4.5vw,48px)', fontWeight: 800,
            color: 'var(--site-text)', lineHeight: 1.1,
            letterSpacing: '-0.03em', marginBottom: 14,
          }}>
            Combos{' '}
            <span style={{
              background: 'linear-gradient(135deg, #8B5CF6, #D946EF)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>populares</span>
          </h2>
          <p style={{ fontSize: 16, color: 'var(--site-text2)', maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}>
            Ahorra más combinando tus plataformas favoritas en un solo plan.
          </p>
        </div>

        {/* Cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }} className="combos-grid">
          {combos.map(c => <ComboCard key={c.id} combo={c} />)}
        </div>

        {/* Bottom note */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 22 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L1 4v4.5c0 2.8 2.4 5.4 6 6.3 3.6-.9 6-3.5 6-6.3V4L7 1z" stroke="#8B5CF6" strokeWidth="1.2" strokeLinejoin="round"/>
            <path d="M4 7l2.5 2.5 4-4" stroke="#8B5CF6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontSize: 12, color: 'var(--site-text2)' }}>
            Todos nuestros combos incluyen garantía y soporte personalizado
          </span>
        </div>
      </div>

      <style>{`
        @media(max-width:900px){ .combos-grid{ grid-template-columns:1fr !important } }
      `}</style>
    </section>
  )
}
