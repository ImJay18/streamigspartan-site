'use client'

const grad = 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)'

const STEPS = [
  { n: '1', title: 'Elige tu plan',      desc: 'Selecciona la plataforma o combo que prefieras.',
    icon: <svg width="30" height="30" viewBox="0 0 30 30" fill="none"><rect x="5" y="3" width="20" height="24" rx="3" stroke="url(#hw1)" strokeWidth="1.8"/><path d="M9 10h12M9 15h12M9 20h8" stroke="url(#hw1)" strokeWidth="1.6" strokeLinecap="round"/><defs><linearGradient id="hw1" x1="5" y1="3" x2="25" y2="27"><stop stopColor="#8B5CF6"/><stop offset="1" stopColor="#D946EF"/></linearGradient></defs></svg> },
  { n: '2', title: 'Realiza tu pago',    desc: 'Pagos seguros con múltiples métodos disponibles.',
    icon: <svg width="30" height="30" viewBox="0 0 30 30" fill="none"><rect x="3" y="8" width="24" height="15" rx="3" stroke="url(#hw2)" strokeWidth="1.8"/><path d="M3 13h24" stroke="url(#hw2)" strokeWidth="1.8"/><path d="M7 19h5M16 19h3" stroke="url(#hw2)" strokeWidth="1.8" strokeLinecap="round"/><defs><linearGradient id="hw2" x1="3" y1="8" x2="27" y2="23"><stop stopColor="#8B5CF6"/><stop offset="1" stopColor="#D946EF"/></linearGradient></defs></svg> },
  { n: '3', title: 'Recibe tu acceso',   desc: 'Te enviamos tus accesos en minutos por WhatsApp.',
    icon: <svg width="30" height="30" viewBox="0 0 30 30" fill="none"><path d="M25 5A13 13 0 004.2 22.2L2 28l5.9-2.2A13 13 0 0025 5z" stroke="url(#hw3)" strokeWidth="1.8" strokeLinejoin="round"/><defs><linearGradient id="hw3" x1="2" y1="5" x2="28" y2="28"><stop stopColor="#8B5CF6"/><stop offset="1" stopColor="#D946EF"/></linearGradient></defs></svg> },
  { n: '4', title: 'Disfruta sin límites', desc: 'Empieza a disfrutar tu contenido favorito al instante.',
    icon: <svg width="30" height="30" viewBox="0 0 30 30" fill="none"><rect x="3" y="6" width="24" height="16" rx="3" stroke="url(#hw4)" strokeWidth="1.8"/><path d="M10 26h10M15 22v4" stroke="url(#hw4)" strokeWidth="1.8" strokeLinecap="round"/><path d="M12 11l8 3.5-8 3.5V11z" fill="url(#hw4)"/><defs><linearGradient id="hw4" x1="3" y1="6" x2="27" y2="26"><stop stopColor="#8B5CF6"/><stop offset="1" stopColor="#D946EF"/></linearGradient></defs></svg> },
]

export default function HowItWorks() {
  return (
    <section id="como-funciona" style={{ padding: '80px 0', background: 'var(--site-bg)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 'clamp(26px,4vw,38px)', fontWeight: 700, color: 'var(--site-text)', marginBottom: 12 }}>
            ¿Cómo{' '}
            <span style={{ background: grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>funciona</span>?
          </h2>
          <p style={{ fontSize: 15, color: 'var(--site-text2)' }}>En menos de 15 minutos tienes tu acceso activo.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24, position: 'relative' }} className="steps-grid">
          {/* connector */}
          <div style={{ position: 'absolute', top: 52, left: '12.5%', right: '12.5%', height: 1, background: grad, opacity: 0.4 }} className="steps-connector"/>

          {STEPS.map(s => (
            <div key={s.n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ position: 'relative', width: 104, height: 104, borderRadius: '50%', border: '1px solid #1A1A2E', background: 'var(--site-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, zIndex: 1 }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1), transparent)', pointerEvents: 'none' }}/>
                {s.icon}
                <div style={{ position: 'absolute', top: -8, right: -8, width: 26, height: 26, borderRadius: '50%', background: grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: 'var(--site-text)' }}>
                  {s.n}
                </div>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--site-text)', marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--site-text2)', lineHeight: 1.5, maxWidth: 160 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media(max-width:768px){
          .steps-grid{grid-template-columns:repeat(2,1fr) !important}
          .steps-connector{display:none !important}
        }
      `}</style>
    </section>
  )
}
