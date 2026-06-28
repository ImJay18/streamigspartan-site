'use client'

import { useState } from 'react'
import { FAQ } from '@/types'

const grad = 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)'

function FAQItem({ faq }: { faq: FAQ }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ border: open ? '1px solid rgba(139,92,246,0.4)' : '1px solid #1A1A2E', borderRadius: 12, background: open ? 'rgba(139,92,246,0.04)' : 'var(--site-card)', transition: 'border-color 0.2s, background 0.2s' }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--site-text)' }}>{faq.question}</span>
        <div style={{ flexShrink: 0, width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: open ? grad : 'transparent', border: open ? 'none' : '1px solid #1A1A2E', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s, background 0.2s' }}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M2 4l3.5 3.5L9 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>
      {open && (
        <div style={{ padding: '0 20px 16px' }}>
          <p style={{ fontSize: 13, color: 'var(--site-text2)', lineHeight: 1.6 }}>{faq.answer}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQSection({ faqs }: { faqs: FAQ[] }) {
  return (
    <section id="faq" style={{ padding: '80px 0', background: 'var(--site-bg2)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontSize: 'clamp(26px,4vw,38px)', fontWeight: 700, color: 'var(--site-text)', marginBottom: 12 }}>
            Preguntas{' '}
            <span style={{ background: grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>frecuentes</span>
          </h2>
          <p style={{ fontSize: 15, color: 'var(--site-text2)' }}>Todo lo que necesitas saber antes de empezar.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {faqs.map(f => <FAQItem key={f.id} faq={f}/>)}
        </div>
      </div>
    </section>
  )
}
