'use client'

import { useEffect, useRef } from 'react'
import { useCart } from '@/lib/cartContext'
import { buildWhatsAppMessage } from '@/lib/cart'
import { WHATSAPP_NUMBER } from '@/lib/constants'
import { getWhatsAppLink } from '@/lib/utils'

const grad = 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)'
const COP  = (v: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v)

export default function CartDrawer() {
  const { items, state, isOpen, closeCart, updateItem, removeItem, clearCart } = useCart()
  const drawerRef = useRef<HTMLDivElement>(null)

  // Cerrar con Escape
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [closeCart])

  // Bloquear scroll del body cuando está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  function handleCheckout() {
    const msg = buildWhatsAppMessage(state, items)
    window.open(getWhatsAppLink(WHATSAPP_NUMBER, msg), '_blank')
  }

  const totalItems = items.reduce((acc, i) => acc + i.screens, 0)

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeCart}
        style={{
          position: 'fixed', inset: 0, zIndex: 998,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          transition: 'opacity 0.3s',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'all' : 'none',
        }}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 999,
          width: '100%', maxWidth: 420,
          background: 'var(--site-bg2)',
          borderLeft: '1px solid var(--site-border)',
          display: 'flex', flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: isOpen ? '-20px 0 60px rgba(0,0,0,0.5)' : 'none',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--site-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 3h2l.4 2M7 13h10l2-7H5.4M7 13L5.4 5M7 13l-1.5 4h11" stroke="#8B5CF6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9" cy="18" r="1" fill="#8B5CF6"/>
              <circle cx="16" cy="18" r="1" fill="#8B5CF6"/>
            </svg>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--site-text)' }}>Mi pedido</span>
            {totalItems > 0 && (
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>
                {totalItems}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {items.length > 0 && (
              <button onClick={clearCart}
                style={{ padding: '5px 10px', borderRadius: 7, fontSize: 11, border: '1px solid rgba(239,68,68,0.2)', background: 'transparent', color: '#f87171', cursor: 'pointer' }}>
                Vaciar
              </button>
            )}
            <button onClick={closeCart}
              style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid var(--site-border)', background: 'transparent', color: 'var(--site-text2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {items.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, padding: '60px 0' }}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ opacity: 0.3 }}>
                <path d="M8 8h4l2 22M14 30h26l5-16H12" stroke="#A1A1AA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="20" cy="42" r="2.5" fill="#A1A1AA"/>
                <circle cx="36" cy="42" r="2.5" fill="#A1A1AA"/>
              </svg>
              <p style={{ fontSize: 14, color: 'var(--site-text2)', textAlign: 'center' }}>Tu pedido está vacío</p>
              <p style={{ fontSize: 12, color: '#52525b', textAlign: 'center' }}>Agrega plataformas desde el catálogo</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

              {/* Combos agrupados */}
              {state.appliedCombos.map((combo, idx) => (
                <div key={combo.comboId + idx}
                  style={{ background: 'var(--site-card)', border: '1.5px solid rgba(139,92,246,0.3)', borderRadius: 14, padding: '14px 14px 12px', boxShadow: '0 2px 12px rgba(139,92,246,0.08)' }}>
                  {/* Header combo */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'linear-gradient(135deg,#8B5CF6,#D946EF)', flexShrink: 0 }}/>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--site-text)' }}>{combo.comboName}</span>
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--site-text)', letterSpacing: '-0.02em' }}>{COP(combo.comboPrice)}</span>
                  </div>
                  {/* Platform logos */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: combo.savedAmount > 0 ? 8 : 0 }}>
                    {combo.platformLogos && combo.platformLogos.length > 0
                      ? combo.platformLogos.map((logo, i) => (
                        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={logo} alt={combo.platformNames[i] ?? ''} style={{ height: 18, width: 'auto', maxWidth: 60, objectFit: 'contain' }} />
                          {i < combo.platformLogos.length - 1 && (
                            <span style={{ color: 'rgba(139,92,246,0.5)', fontSize: 12, fontWeight: 600 }}>+</span>
                          )}
                        </span>
                      ))
                      : combo.platformNames.map((name, i) => (
                        <span key={name} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: 'rgba(139,92,246,0.12)', color: '#8B5CF6', fontWeight: 600, border: '1px solid rgba(139,92,246,0.2)' }}>
                            {name}
                          </span>
                          {i < combo.platformNames.length - 1 && (
                            <span style={{ color: 'rgba(139,92,246,0.4)', fontSize: 11 }}>+</span>
                          )}
                        </span>
                      ))
                    }
                  </div>
                  {combo.savedAmount > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span style={{ fontSize: 11, color: '#34d399', fontWeight: 600 }}>Ahorraste {COP(combo.savedAmount)}</span>
                    </div>
                  )}
                </div>
              ))}

              {/* Items unitarios */}
              {state.items.map(item => (
                <div key={item.platformId}
                  style={{ background: 'var(--site-card)', border: '1px solid var(--site-border)', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* Logo */}
                  <div style={{ width: 44, height: 28, flexShrink: 0, position: 'relative' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.logoUrl} alt={item.platformName} style={{ width: '100%', height: '100%', objectFit: 'contain' }}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--site-text)', marginBottom: 2 }}>{item.platformName}</p>
                    <p style={{ fontSize: 11, color: 'var(--site-text2)' }}>{COP(item.unitPrice)} / pantalla</p>
                  </div>
                  {/* Selector de pantallas */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button
                      onClick={() => updateItem(item.platformId, item.screens - 1)}
                      style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid var(--site-border)', background: 'transparent', color: 'var(--site-text2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                      −
                    </button>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--site-text)', minWidth: 20, textAlign: 'center' }}>{item.screens}</span>
                    <button
                      onClick={() => updateItem(item.platformId, item.screens + 1)}
                      style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid var(--site-border)', background: 'transparent', color: 'var(--site-text2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                      +
                    </button>
                  </div>
                  <div style={{ minWidth: 64, textAlign: 'right' }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--site-text)' }}>{COP(item.unitPrice * item.screens)}</p>
                  </div>
                  <button onClick={() => removeItem(item.platformId)}
                    style={{ background: 'none', border: 'none', color: '#52525b', cursor: 'pointer', padding: 2, flexShrink: 0 }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#52525b')}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </button>
                </div>
              ))}

              {/* Items originales con pantallas en combo (solo para referencia visual) */}
              {items.filter(i => !state.items.find(s => s.platformId === i.platformId) &&
                !state.appliedCombos.some(c => c.platformNames.includes(i.platformName))).length === 0 && null}

            </div>
          )}
        </div>

        {/* Footer con total */}
        {items.length > 0 && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid var(--site-border)', flexShrink: 0 }}>
            {/* Desglose */}
            <div style={{ marginBottom: 12 }}>
              {state.appliedCombos.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: 'var(--site-text2)' }}>
                    {state.appliedCombos.length} combo{state.appliedCombos.length > 1 ? 's' : ''}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--site-text2)' }}>
                    {COP(state.appliedCombos.reduce((a, c) => a + c.comboPrice, 0))}
                  </span>
                </div>
              )}
              {state.items.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: 'var(--site-text2)' }}>Plataformas adicionales</span>
                  <span style={{ fontSize: 12, color: 'var(--site-text2)' }}>
                    {COP(state.items.reduce((a, i) => a + i.unitPrice * i.screens, 0))}
                  </span>
                </div>
              )}
              {state.appliedCombos.some(c => c.savedAmount > 0) && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: '#34d399' }}>Ahorro en combos</span>
                  <span style={{ fontSize: 12, color: '#34d399' }}>
                    -{COP(state.appliedCombos.reduce((a, c) => a + c.savedAmount, 0))}
                  </span>
                </div>
              )}
            </div>

            {/* Total */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, paddingTop: 10, borderTop: '1px solid var(--site-border)' }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--site-text)' }}>Total</span>
              <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--site-text)', letterSpacing: '-0.02em' }}>{COP(state.total)}</span>
            </div>

            {/* CTA WhatsApp */}
            <button onClick={handleCheckout}
              style={{ width: '100%', padding: '13px', borderRadius: 12, border: 'none', background: grad, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 0 24px rgba(139,92,246,0.35)' }}>
              <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
                <path d="M18.9 3.1A10.9 10.9 0 002.8 16.8L1 21l4.3-1.8A10.9 10.9 0 0018.9 3.1z" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
                <path d="M7.5 9.8c.7 1.5 1.8 2.8 3.2 3.8.2.2.6.1.8-.1l.7-1c.2-.3.5-.4.8-.2l2.5 1.4c.3.2.4.5.2.8-.5 1.1-1.8 2-3.1 1.8-3.3-.6-6.2-3.5-6.5-6.8-.2-1.3.7-2.6 1.8-3.1.3-.1.6 0 .8.2l1.4 2.5c.2.3.1.7-.2.9l-1 .7" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              Confirmar por WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  )
}
