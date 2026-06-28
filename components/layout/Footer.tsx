import { NAV_LINKS, WHATSAPP_NUMBER } from '@/lib/constants'
import { getWhatsAppLink } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'

const grad = 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)'

const SOCIAL = [
  { name: 'Facebook', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M11 2H9a4 4 0 00-4 4v2H3v3h2v5h3V11h2l1-3H8V6a1 1 0 011-1h2V2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg> },
  { name: 'Instagram', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="3.5" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="8" r="2.8" stroke="currentColor" strokeWidth="1.3"/><circle cx="11.5" cy="4.5" r="0.8" fill="currentColor"/></svg> },
  { name: 'TikTok', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 2v8.5a2.5 2.5 0 11-2.5-2.5H9V5a5 5 0 005 1V3a3 3 0 01-4-1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg> },
  { name: 'YouTube', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="4" width="14" height="9" rx="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M6.5 6l4 2.5-4 2.5V6z" fill="currentColor"/></svg> },
]

// Fallback si Supabase está pausado
const FALLBACK_PAYMENTS = ['VISA', 'Mastercard', 'PayPal', 'Nequi', 'Daviplata']

export default async function Footer() {
  const supabase = await createClient()
  const { data: paymentMethods } = await supabase
    .from('payment_methods')
    .select('id, name')
    .eq('active', true)
    .order('display_order')

  const payments = paymentMethods && paymentMethods.length > 0
    ? paymentMethods.map(p => p.name)
    : FALLBACK_PAYMENTS

  return (
    <footer style={{ background: 'var(--site-bg2)', borderTop: '1px solid var(--site-border)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 40, marginBottom: 48 }} className="footer-grid">

          {/* Brand */}
          <div>
            <div style={{ marginBottom: 14 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Streaming Spartan" style={{ height: 48, width: 'auto', objectFit: 'contain' }}/>
            </div>
            <p style={{ fontSize: 12, color: 'var(--site-text2)', lineHeight: 1.6, marginBottom: 16, maxWidth: 200 }}>
              Tu mejor opción para acceder a las mejores plataformas de streaming al mejor precio.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {SOCIAL.map(s => (
                <a key={s.name} href="#" aria-label={s.name} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid var(--site-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--site-text2)', textDecoration: 'none' }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links rápidos */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--site-text)', marginBottom: 14 }}>Enlaces rápidos</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {NAV_LINKS.map(l => (
                <a key={l.href} href={l.href} style={{ fontSize: 12, color: 'var(--site-text2)', textDecoration: 'none' }}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Soporte */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--site-text)', marginBottom: 14 }}>Soporte</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['WhatsApp', 'Políticas de servicio', 'Términos y condiciones', 'Contacto'].map(item => (
                <a key={item}
                  href={item === 'WhatsApp' ? getWhatsAppLink(WHATSAPP_NUMBER) : '#'}
                  target={item === 'WhatsApp' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  style={{ fontSize: 12, color: 'var(--site-text2)', textDecoration: 'none' }}>
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Métodos de pago — dinámico desde Supabase */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--site-text)', marginBottom: 14 }}>Métodos de pago</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {payments.map(p => (
                <div key={p} style={{ padding: '5px 10px', border: '1px solid var(--site-border)', borderRadius: 8, background: 'var(--site-card)', fontSize: 11, fontWeight: 600, color: 'var(--site-text2)' }}>
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid var(--site-border)', paddingTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <p style={{ fontSize: 11, color: '#52525b' }}>© {new Date().getFullYear()} Streaming Spartan. Todos los derechos reservados.</p>
          <p style={{ fontSize: 11, color: '#52525b' }}>
            Hecho con <span style={{ background: grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>♥</span> en Colombia
          </p>
        </div>
      </div>
      <style>{`@media(max-width:768px){.footer-grid{grid-template-columns:1fr 1fr !important}}`}</style>
    </footer>
  )
}
