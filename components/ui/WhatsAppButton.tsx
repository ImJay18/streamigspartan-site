'use client'

import { useState } from 'react'
import { getWhatsAppLink } from '@/lib/utils'
import { WHATSAPP_NUMBER } from '@/lib/constants'

const grad = 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)'

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={getWhatsAppLink(WHATSAPP_NUMBER, '¡Hola! Necesito ayuda con los planes de Streaming Spartan.')}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Contactar por WhatsApp"
      style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 50,
        display: 'flex', alignItems: 'center', gap: hovered ? 10 : 0,
        padding: hovered ? '12px 20px 12px 14px' : '14px',
        borderRadius: 999,
        background: grad,
        textDecoration: 'none',
        boxShadow: hovered
          ? '0 0 40px rgba(139,92,246,0.55), 0 8px 24px rgba(0,0,0,0.4)'
          : '0 0 20px rgba(139,92,246,0.3), 0 4px 12px rgba(0,0,0,0.3)',
        transition: 'all 0.3s ease',
        transform: hovered ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      {/* WhatsApp icon SVG oficial simplificado */}
      <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M16 3C8.82 3 3 8.82 3 16c0 2.4.64 4.64 1.74 6.58L3 29l6.58-1.72A13 13 0 0016 29c7.18 0 13-5.82 13-13S23.18 3 16 3z"
          fill="white" fillOpacity="0.15" stroke="white" strokeWidth="1.5" strokeLinejoin="round"
        />
        <path
          d="M11.5 10.5c.28 0 .58.01.82.02.26.01.55.03.82.63.33.72 1.02 2.5 1.1 2.68.09.18.15.4.03.63-.12.24-.18.38-.36.58-.18.2-.38.45-.54.6-.18.18-.37.38-.16.74.21.36.94 1.55 2.02 2.5 1.38 1.22 2.55 1.6 2.91 1.78.36.18.57.15.78-.09.21-.24.9-1.05 1.14-1.41.24-.36.48-.3.81-.18.33.12 2.1.99 2.46 1.17.36.18.6.27.69.42.09.15.09.87-.21 1.71-.3.84-1.74 1.62-2.4 1.71-.66.09-1.29.12-4.29-1.17-3.6-1.5-5.88-5.16-6.06-5.4-.18-.24-1.44-1.92-1.44-3.66 0-1.74.9-2.58 1.23-2.94.33-.36.72-.45.96-.45z"
          fill="white"
        />
      </svg>

      <span style={{
        color: '#fff',
        fontSize: 13,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        maxWidth: hovered ? 140 : 0,
        overflow: 'hidden',
        transition: 'max-width 0.3s ease, opacity 0.3s ease',
        opacity: hovered ? 1 : 0,
      }}>
        ¿Necesitas ayuda?
      </span>
    </a>
  )
}
