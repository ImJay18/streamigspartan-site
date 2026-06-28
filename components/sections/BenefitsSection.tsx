'use client'

const grad = 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)'

const BENEFITS = [
  { title: 'Entrega inmediata', desc: 'Recibe tus accesos en minutos.',
    icon: <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><circle cx="13" cy="13" r="10" stroke="url(#bi1)" strokeWidth="1.8"/><path d="M13 7v6.5L16 15" stroke="url(#bi1)" strokeWidth="1.8" strokeLinecap="round"/><defs><linearGradient id="bi1" x1="3" y1="3" x2="23" y2="23"><stop stopColor="#8B5CF6"/><stop offset="1" stopColor="#D946EF"/></linearGradient></defs></svg> },
  { title: 'Servicio confiable', desc: 'Más de 2,000 clientes satisfechos.',
    icon: <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M13 2L3 7v8c0 5.5 4.3 10.6 10 12 5.7-1.4 10-6.5 10-12V7L13 2z" stroke="url(#bi2)" strokeWidth="1.8" strokeLinejoin="round"/><path d="M8.5 13l3.5 3.5 6-6.5" stroke="url(#bi2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><defs><linearGradient id="bi2" x1="3" y1="2" x2="23" y2="26"><stop stopColor="#8B5CF6"/><stop offset="1" stopColor="#D946EF"/></linearGradient></defs></svg> },
  { title: 'Soporte WhatsApp', desc: 'Soporte directo por WhatsApp.',
    icon: <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M22 4A11 11 0 003.3 18.9L2 23l4.2-1.7A11 11 0 0022 4z" stroke="url(#bi3)" strokeWidth="1.8" strokeLinejoin="round"/><defs><linearGradient id="bi3" x1="2" y1="4" x2="24" y2="23"><stop stopColor="#8B5CF6"/><stop offset="1" stopColor="#D946EF"/></linearGradient></defs></svg> },
  { title: 'Pagos fáciles', desc: 'Múltiples medios de pago disponibles.',
    icon: <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect x="3" y="7" width="20" height="13" rx="3" stroke="url(#bi4)" strokeWidth="1.8"/><path d="M3 12h20" stroke="url(#bi4)" strokeWidth="1.8"/><path d="M7 17h4M15 17h2" stroke="url(#bi4)" strokeWidth="1.8" strokeLinecap="round"/><defs><linearGradient id="bi4" x1="3" y1="7" x2="23" y2="20"><stop stopColor="#8B5CF6"/><stop offset="1" stopColor="#D946EF"/></linearGradient></defs></svg> },
]

export default function BenefitsSection() {
  return (
    <section style={{ borderTop: '1px solid var(--site-border)', borderBottom: '1px solid var(--site-border)', background: 'var(--site-bg2)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }} className="benefits-grid">
          {BENEFITS.map(b => (
            <div key={b.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ flexShrink: 0, marginTop: 2 }}>{b.icon}</div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 3, background: grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{b.title}</p>
                <p style={{ fontSize: 12, color: 'var(--site-text2)', lineHeight: 1.5 }}>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:768px){.benefits-grid{grid-template-columns:1fr 1fr !important}}`}</style>
    </section>
  )
}
