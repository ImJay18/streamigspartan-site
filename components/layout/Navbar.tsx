'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { NAV_LINKS, WHATSAPP_NUMBER } from '@/lib/constants'
import CartNavButton from './CartNavButton'
import { getWhatsAppLink } from '@/lib/utils'
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [activeHref, setActiveHref] = useState('')
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sections = NAV_LINKS.map(l => l.href.replace('#', ''))
    const targets = sections.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (targets.length === 0) return

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) setActiveHref('#' + e.target.id)
      })
    }, { rootMargin: '-40% 0px -55% 0px' })

    targets.forEach(t => obs.observe(t))
    return () => obs.disconnect()
  }, [pathname])

  return (
    <>
      <header style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        // Pill container — padding top to float the pill
        padding: scrolled ? '8px 20px' : '16px 20px',
        transition: 'padding 0.35s ease',
        pointerEvents: 'none',
      }}>
        {/* ── The pill ── */}
        <nav style={{
          pointerEvents: 'all',
          maxWidth: 1380,
          margin: '0 auto',
          height: 68,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          padding: '0 12px 0 8px',
          // Dark glass pill
          background: 'rgba(8,8,20,0.82)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 18,
          border: '1px solid rgba(100,120,255,0.18)',
          // Blue/purple glow matching image
          boxShadow: scrolled
            ? '0 0 0 1px rgba(100,120,255,0.12), 0 8px 32px rgba(80,60,255,0.25), 0 2px 8px rgba(0,0,0,0.5)'
            : '0 0 0 1px rgba(100,120,255,0.10), 0 4px 24px rgba(80,60,255,0.18), 0 2px 8px rgba(0,0,0,0.4)',
          transition: 'box-shadow 0.35s ease, background 0.35s ease',
        }}>

          {/* ── Logo ── */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0, padding: '0 8px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Streaming Spartan" style={{ height: 52, width: 'auto', objectFit: 'contain' }}/>
          </a>

          {/* Divider */}
          <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} className="hidden-mobile"/>

          {/* ── Nav links ── */}
          <ul style={{ display: 'flex', alignItems: 'center', gap: 2, listStyle: 'none', margin: 0, padding: 0, flex: 1, justifyContent: 'center' }} className="hidden-mobile">
            {NAV_LINKS.map(l => {
              const isActive = activeHref === l.href
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    style={{
                      position: 'relative',
                      padding: '8px 16px',
                      fontSize: 14,
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
                      textDecoration: 'none',
                      borderRadius: 10,
                      transition: 'color 0.2s',
                      display: 'block',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.85)' }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }}>
                    {l.label}
                    {/* Active underline */}
                    {isActive && (
                      <span style={{
                        position: 'absolute',
                        bottom: 2, left: '50%',
                        transform: 'translateX(-50%)',
                        width: '60%', height: 2,
                        borderRadius: 999,
                        background: 'linear-gradient(90deg, #8B5CF6, #60a5fa)',
                      }}/>
                    )}
                  </a>
                </li>
              )
            })}
          </ul>

          {/* ── Right CTAs ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }} className="hidden-mobile">
            {/* Theme toggle — circular dark button */}
            <div style={{
              width: 38, height: 38,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ThemeToggle compact />
            </div>

            {/* Cart — matches image: outlined purple border */}
            <CartNavButton scrolled={true} />

            {/* WhatsApp — green pill, large, with icon */}
            <a
              href={getWhatsAppLink(WHATSAPP_NUMBER, '¡Hola! Me interesa conocer más sobre los planes de Streaming Spartan.')}
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 20px',
                fontSize: 14, fontWeight: 700,
                color: '#fff',
                background: '#22C55E',
                borderRadius: 12,
                textDecoration: 'none',
                boxShadow: '0 2px 14px rgba(34,197,94,0.4)',
                transition: 'transform 0.15s, box-shadow 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 6px 22px rgba(34,197,94,0.55)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 14px rgba(34,197,94,0.4)'
              }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Comprar por WhatsApp
            </a>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: 'none', padding: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)' }}
            className="show-mobile"
            aria-label="Menú">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              {menuOpen
                ? <path d="M5 5l12 12M17 5L5 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                : <path d="M3 7h16M3 11h16M3 15h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>}
            </svg>
          </button>
        </nav>

        {/* Mobile menu — drops below pill */}
        {menuOpen && (
          <div style={{
            pointerEvents: 'all',
            maxWidth: 1380, margin: '8px auto 0',
            background: 'rgba(8,8,20,0.96)',
            backdropFilter: 'blur(20px)',
            borderRadius: 16,
            border: '1px solid rgba(100,120,255,0.15)',
            padding: '12px 16px',
          }}>
            {/* Nav links */}
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                style={{ display: 'block', padding: '10px 14px', fontSize: 14, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', borderRadius: 8 }}>
                {l.label}
              </a>
            ))}

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '8px 0' }}/>

            {/* Carrito + Toggle en fila */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              {/* Carrito */}
              <div style={{ flex: 1 }}>
                <CartNavButton scrolled={true} />
              </div>
              {/* Theme toggle */}
              <div style={{
                width: 44, height: 44,
                borderRadius: 10,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <ThemeToggle compact />
              </div>
            </div>

            {/* WhatsApp */}
            <a
              href={getWhatsAppLink(WHATSAPP_NUMBER)}
              target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px', fontSize: 14, fontWeight: 600, color: '#fff', background: '#22C55E', borderRadius: 10, textDecoration: 'none', textAlign: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Comprar por WhatsApp
            </a>
          </div>
        )}
      </header>

      <style>{`
        @media (max-width: 900px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: block !important; }
        }
      `}</style>
    </>
  )
}
