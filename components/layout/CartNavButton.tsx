'use client'

import { useCart } from '@/lib/cartContext'

interface Props {
  scrolled?: boolean
}

export default function CartNavButton({ scrolled = false }: Props) {
  const { items, openCart } = useCart()
  const total = items.reduce((acc, i) => acc + i.screens, 0)

  return (
    <button
      onClick={openCart}
      style={{
        position: 'relative',
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 18px', fontSize: 14, fontWeight: 500,
        color: '#fff',
        background: 'transparent',
        border: '1.5px solid rgba(139,92,246,0.6)',
        borderRadius: 12,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        width: '100%',
        justifyContent: 'center',
        transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
        boxShadow: '0 0 0 0 rgba(139,92,246,0)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#8B5CF6'
        e.currentTarget.style.background = 'rgba(139,92,246,0.12)'
        e.currentTarget.style.boxShadow = '0 0 14px rgba(139,92,246,0.3)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(139,92,246,0.6)'
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.boxShadow = '0 0 0 0 rgba(139,92,246,0)'
      }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M1 1h2.5l1.8 8M5 11.5h8l2-6H4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="6.5" cy="14" r="1.2" fill="currentColor"/>
        <circle cx="12" cy="14" r="1.2" fill="currentColor"/>
      </svg>
      Mi carrito
      {total > 0 && (
        <div style={{
          position: 'absolute', top: -7, right: -7,
          width: 20, height: 20, borderRadius: '50%',
          background: 'linear-gradient(135deg,#8B5CF6,#D946EF)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700, color: '#fff',
          boxShadow: '0 2px 8px rgba(139,92,246,0.5)',
        }}>
          {total}
        </div>
      )}
    </button>
  )
}
