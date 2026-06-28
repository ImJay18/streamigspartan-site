'use client'

import { useState } from 'react'
import { useToast } from './AdminToast'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { FAQ } from '@/types'

const grad = 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)'
const EMPTY: Partial<FAQ> = { question: '', answer: '', display_order: 0, active: true }
const inputStyle: React.CSSProperties = { width: '100%', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', borderRadius: 8, padding: '9px 12px', color: 'var(--admin-text)', fontSize: 13, outline: 'none' }
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 12, color: 'var(--admin-text2)', marginBottom: 5 }

export default function FAQsManager({ initialFAQs }: { initialFAQs: FAQ[] }) {
  const [faqs, setFaqs]       = useState(initialFAQs)
  const [editing, setEditing] = useState<Partial<FAQ> | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  async function handleSave() {
    if (!editing) return
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase.from('faqs').upsert(editing).select().single()
    setLoading(false)
    if (error) { toast('Error: ' + error.message, 'error'); return }
    setFaqs(prev => editing.id ? prev.map(f => f.id === data.id ? data : f) : [...prev, data])
    setEditing(null)
    toast('FAQ guardada correctamente')
    router.refresh()
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta pregunta?')) return
    const supabase = createClient()
    await supabase.from('faqs').delete().eq('id', id)
    setFaqs(prev => prev.filter(f => f.id !== id))
  }

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--admin-text)', marginBottom: 3 }}>Preguntas frecuentes</h1>
          <p style={{ fontSize: 13, color: 'var(--admin-text2)' }}>{faqs.length} preguntas registradas</p>
        </div>
        <button onClick={() => setEditing(EMPTY)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 9, fontSize: 13, fontWeight: 600, color: 'var(--admin-text)', background: grad, border: 'none', cursor: 'pointer' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
          Nueva pregunta
        </button>
      </div>


      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {faqs.map(f => (
          <div key={f.id} style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 12, padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--admin-text)' }}>{f.question}</span>
                <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 999, background: f.active ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)', color: f.active ? '#34d399' : '#f87171', fontWeight: 600 }}>
                  {f.active ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--admin-text2)', lineHeight: 1.5 }}>{f.answer}</p>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <button onClick={() => setEditing(f)} style={{ padding: '6px 10px', borderRadius: 7, fontSize: 12, border: '1px solid var(--admin-border)', background: 'transparent', color: 'var(--admin-text2)', cursor: 'pointer' }}>Editar</button>
              <button onClick={() => handleDelete(f.id)} style={{ padding: '6px 10px', borderRadius: 7, fontSize: 12, border: '1px solid rgba(239,68,68,0.2)', background: 'transparent', color: '#f87171', cursor: 'pointer' }}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 18, padding: 28, width: '100%', maxWidth: 520 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--admin-text)' }}>{editing.id ? 'Editar pregunta' : 'Nueva pregunta'}</h2>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', color: 'var(--admin-text2)', cursor: 'pointer' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label style={labelStyle}>Pregunta</label><input style={inputStyle} value={editing.question ?? ''} onChange={e => setEditing(p => ({ ...p!, question: e.target.value }))} placeholder="¿Cómo recibo mi cuenta?"/></div>
              <div><label style={labelStyle}>Respuesta</label><textarea style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }} value={editing.answer ?? ''} onChange={e => setEditing(p => ({ ...p!, answer: e.target.value }))} placeholder="Una vez realizado el pago..."/></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={labelStyle}>Orden</label><input style={inputStyle} type="number" value={editing.display_order ?? 0} onChange={e => setEditing(p => ({ ...p!, display_order: parseInt(e.target.value) }))}/></div>
                <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 2 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}>
                    <div style={{ position: 'relative', width: 34, height: 20 }} onClick={() => setEditing(p => ({ ...p!, active: !p!.active }))}>
                      <div style={{ position: 'absolute', inset: 0, borderRadius: 999, background: editing.active ? '#8B5CF6' : '#1A1A2E', transition: 'background 0.2s' }}/>
                      <div style={{ position: 'absolute', top: 3, left: editing.active ? 17 : 3, width: 14, height: 14, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }}/>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--admin-text2)' }}>Activa</span>
                  </label>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
              <button onClick={() => setEditing(null)} style={{ flex: 1, padding: '10px', borderRadius: 9, fontSize: 13, fontWeight: 600, border: '1px solid var(--admin-border)', background: 'transparent', color: 'var(--admin-text2)', cursor: 'pointer' }}>Cancelar</button>
              <button onClick={handleSave} disabled={loading} style={{ flex: 2, padding: '10px', borderRadius: 9, fontSize: 13, fontWeight: 600, color: 'var(--admin-text)', background: grad, border: 'none', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
