'use client'

import { useEffect, useState } from 'react'
import { getWhatsAppLink } from '@/lib/utils'
import { WHATSAPP_NUMBER } from '@/lib/constants'

const INDICATORS = [
  { label: 'Activación inmediata',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#8B5CF6" strokeWidth="1.5"/><path d="M8 5v3.5L10 10" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  { label: 'Soporte WhatsApp',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.5 2.5A6.5 6.5 0 002 11.3L1 15l3.8-1A6.5 6.5 0 0013.5 2.5z" stroke="#8B5CF6" strokeWidth="1.5" strokeLinejoin="round"/></svg> },
  { label: 'Planes económicos',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#8B5CF6" strokeWidth="1.5"/><path d="M8 4.5v1M8 10.5v1M5.5 7.5A2.5 2.5 0 018 5.5M8 10.5A2.5 2.5 0 0110.5 8" stroke="#8B5CF6" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: 'Renovación fácil',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8a5 5 0 019-3M13 8a5 5 0 01-9 3" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round"/><path d="M12 4.5L13 5l-.5 1.5" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
]

const grad = 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)'

export default function HeroSection() {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t) }, [])

  return (
    <section id="inicio" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', paddingTop: 100 }}>

      {/* ── Imagen de fondo full-width ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-bg.jpg"
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center right',
          }}
        />
        {/* Difuminado izquierdo — cubre el texto */}
        {/* Difuminado izquierdo — cubre el texto */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #050505 35%, rgba(5,5,5,0.82) 58%, rgba(5,5,5,0.05) 100%)' }}/>
        {/* Difuminado superior */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #050505 0%, transparent 18%)' }}/>
        {/* Difuminado inferior */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #050505 0%, transparent 22%)' }}/>
        {/* Difuminado derecho sutil */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left, rgba(5,5,5,0.6) 0%, transparent 18%)' }}/>
      </div>

      {/* ── Contenido ── */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: '80px 24px', width: '100%' }}>
        <div style={{ maxWidth: 620 }}>

          {/* Fade-in wrapper */}
          <div style={{ transition: 'opacity 0.7s, transform 0.7s', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(28px)' }}>

            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, border: '1px solid rgba(139,92,246,0.35)', background: 'rgba(139,92,246,0.1)', marginBottom: 28 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#8B5CF6', animation: 'pulse 2s infinite' }}/>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#8B5CF6', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Entretenimiento Premium</span>
            </div>

            {/* Título */}
            <h1 style={{ fontSize: 'clamp(40px, 5.5vw, 68px)', fontWeight: 800, lineHeight: 1.08, marginBottom: 22, color: '#fff' }}>
              Todo el entretenimiento{' '}
              <span style={{ background: grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', display: 'block' }}>
                que quieres,
              </span>
              en un solo lugar.
            </h1>

            {/* Subtítulo */}
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 36, maxWidth: 480 }}>
              Disfruta tus plataformas favoritas con planes premium al mejor precio.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 40 }}>
              <a
                href={getWhatsAppLink(WHATSAPP_NUMBER, '¡Hola! Quiero comprar un plan de Streaming Spartan.')}
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 26px', borderRadius: 12, fontWeight: 600, fontSize: 15, color: '#fff', background: grad, textDecoration: 'none', boxShadow: '0 0 30px rgba(139,92,246,0.4)', transition: 'opacity 0.2s, transform 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.opacity='0.9'; e.currentTarget.style.transform='scale(1.02)' }}
                onMouseLeave={e => { e.currentTarget.style.opacity='1'; e.currentTarget.style.transform='scale(1)' }}>
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none"><rect x="3" y="2" width="11" height="13" rx="2" stroke="white" strokeWidth="1.6"/><path d="M5.5 6h6M5.5 9h6M5.5 12h4" stroke="white" strokeWidth="1.3" strokeLinecap="round"/></svg>
                Comprar ahora
              </a>
              <a
                href="#plataformas"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 26px', borderRadius: 12, fontWeight: 600, fontSize: 15, color: '#fff', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', textDecoration: 'none', backdropFilter: 'blur(8px)', transition: 'background 0.2s, border-color 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.14)'; e.currentTarget.style.borderColor='rgba(139,92,246,0.5)' }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.15)' }}>
                Ver catálogo
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M3 7.5h9M8.5 4l4 3.5-4 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            </div>

            {/* Indicators */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 28px' }}>
              {INDICATORS.map(ind => (
                <div key={ind.label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  {ind.icon}
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{ind.label}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: 0.45 }}>
        <span style={{ fontSize: 10, color: '#A1A1AA', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Explorar</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="animate-bounce-slow">
          <path d="M3 5l4 4 4-4" stroke="#A1A1AA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </section>
  )
}
