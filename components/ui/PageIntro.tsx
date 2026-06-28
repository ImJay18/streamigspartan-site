'use client'

import { useEffect, useState } from 'react'

export default function PageIntro() {
  const [phase, setPhase] = useState<'loading' | 'revealing' | 'done'>('loading')

  useEffect(() => {
    const shown = sessionStorage.getItem('spartan-intro-shown')
    if (shown) { setPhase('done'); return }

    // 2.4s intro → 0.8s bars open → done
    const t1 = setTimeout(() => setPhase('revealing'), 2400)
    const t2 = setTimeout(() => {
      setPhase('done')
      sessionStorage.setItem('spartan-intro-shown', '1')
    }, 3200)

    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (phase === 'done') return null

  const splitting = phase === 'revealing'

  return (
    <>
      <style>{`
        @keyframes bar-open-top {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-100%); }
        }
        @keyframes bar-open-bot {
          0%   { transform: translateY(0); }
          100% { transform: translateY(100%); }
        }
        @keyframes studio-fade {
          0%,10% { opacity: 0; transform: translateY(-6px); }
          25%    { opacity: 1; transform: translateY(0); }
          75%    { opacity: 1; }
          90%,100%{ opacity: 0; }
        }
        @keyframes logo-rise {
          0%,15% { opacity: 0; transform: translateY(18px) scale(0.92); filter: blur(6px); }
          35%    { opacity: 1; transform: translateY(0) scale(1);      filter: blur(0); }
          78%    { opacity: 1; transform: translateY(0) scale(1); }
          92%,100%{ opacity: 0; transform: translateY(-8px) scale(1.04); filter: blur(3px); }
        }
        @keyframes line-grow {
          0%,20% { width: 0; opacity: 0; }
          45%    { width: 160px; opacity: 1; }
          78%    { width: 160px; opacity: 1; }
          95%    { width: 0; opacity: 0; }
        }
        @keyframes tagline-in {
          0%,30%  { opacity: 0; letter-spacing: 0.35em; }
          50%     { opacity: 1; letter-spacing: 0.2em; }
          78%     { opacity: 1; }
          92%,100%{ opacity: 0; }
        }
        @keyframes progress-fill {
          0%   { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes bg-glow {
          0%,100% { opacity: 0.6; }
          50%      { opacity: 1; }
        }
      `}</style>

      {/* ── BAR TOP ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: '50%', background: '#000', zIndex: 9999,
        transformOrigin: 'top center',
        animation: splitting ? 'bar-open-top 0.75s cubic-bezier(0.76,0,0.24,1) forwards' : 'none',
      }}/>

      {/* ── BAR BOTTOM ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: '50%', background: '#000', zIndex: 9999,
        transformOrigin: 'bottom center',
        animation: splitting ? 'bar-open-bot 0.75s cubic-bezier(0.76,0,0.24,1) forwards' : 'none',
      }}/>

      {/* ── INTRO CONTENT (solo en fase loading) ── */}
      {phase === 'loading' && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, #0d0520 0%, #000 100%)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
          overflow: 'hidden',
        }}>

          {/* Glow radial de fondo */}
          <div style={{
            position: 'absolute',
            width: 500, height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)',
            animation: 'bg-glow 2s ease-in-out infinite',
            pointerEvents: 'none',
          }}/>

          {/* "JVO Solutions Presenta" */}
          <p style={{
            fontSize: 10, fontWeight: 700,
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            marginBottom: 32,
            animation: 'studio-fade 2.4s ease forwards',
          }}>
            JVO Solutions Presenta
          </p>

          {/* Logo centrado */}
          <div style={{
            animation: 'logo-rise 2.4s ease forwards',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20,
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Streaming Spartan"
              style={{
                height: 90, width: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 40px rgba(139,92,246,0.8)) drop-shadow(0 0 80px rgba(139,92,246,0.4))',
                display: 'block',
              }}
            />
          </div>

          {/* Línea divisoria animada */}
          <div style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, #8B5CF6, #D946EF, transparent)',
            borderRadius: 999,
            marginBottom: 14,
            animation: 'line-grow 2.4s ease forwards',
            boxShadow: '0 0 8px rgba(139,92,246,0.6)',
          }}/>

          {/* Tagline */}
          <p style={{
            fontSize: 10, fontWeight: 700,
            color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase',
            animation: 'tagline-in 2.4s ease forwards',
          }}>
            Todo el entretenimiento que quieres
          </p>

          {/* Barra de progreso inferior */}
          <div style={{
            position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
            width: 120, height: 2,
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 999, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, #8B5CF6, #D946EF)',
              borderRadius: 999,
              animation: 'progress-fill 2.2s linear forwards',
              boxShadow: '0 0 6px rgba(139,92,246,0.8)',
            }}/>
          </div>

        </div>
      )}
    </>
  )
}
