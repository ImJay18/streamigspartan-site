'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cartContext'
import type { Platform } from '@/types'

const grad = 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)'

export default function AddToCartButton({ platform }: { platform: Platform }) {
  const { addItem, items } = useCart()
  const [screens, setScreens] = useState(1)
  const [added, setAdded]     = useState(false)

  const inCart = items.find(i => i.platformId === platform.id)

  function handleAdd() {
    addItem({
      platformId:   platform.id,
      platformName: platform.name,
      logoUrl:      platform.logo_url,
      unitPrice:    platform.price,
    }, screens)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

      {/* Selector de pantallas */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: 'var(--site-text2)' }}>Pantallas:</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={() => setScreens(s => Math.max(1, s - 1))}
            style={{
              width: 22, height: 22, borderRadius: 5,
              border: '1px solid var(--site-border)',
              background: 'transparent',
              color: 'var(--site-text2)',
              cursor: 'pointer', fontSize: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
            −
          </button>
          {/* número siempre visible con contraste */}
          <span style={{
            fontSize: 13, fontWeight: 700,
            color: 'var(--site-text)',
            minWidth: 16, textAlign: 'center',
          }}>
            {screens}
          </span>
          <button
            onClick={() => setScreens(s => s + 1)}
            style={{
              width: 22, height: 22, borderRadius: 5,
              border: '1px solid var(--site-border)',
              background: 'transparent',
              color: 'var(--site-text2)',
              cursor: 'pointer', fontSize: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
            +
          </button>
        </div>
      </div>

      {/* Botón agregar */}
      <button
        onClick={handleAdd}
        style={{
          width: '100%', padding: '8px 0', borderRadius: 9, border: 'none',
          background: added ? 'rgba(52,211,153,0.15)' : 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)',
          color: added ? '#34d399' : '#fff',
          fontSize: 12, fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          transition: 'all 0.2s',
          outline: inCart && !added ? '1px solid rgba(139,92,246,0.4)' : 'none',
        }}>
        {added ? (
          <>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 7l4 4 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Agregado
          </>
        ) : inCart ? (
          <>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="white" strokeWidth="1.8" strokeLinecap="round"/></svg>
            Agregar más ({inCart.screens} en pedido)
          </>
        ) : (
          <>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 2h2l1.5 7M6 11h7l1.5-5H4.5M6 11l-1 3h8" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Agregar al pedido
          </>
        )}
      </button>
    </div>
  )
}
