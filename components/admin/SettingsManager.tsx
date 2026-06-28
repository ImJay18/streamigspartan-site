'use client'

import { useState } from 'react'
import { useToast } from './AdminToast'
import { createClient } from '@/lib/supabase/client'

const grad = 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)'
const inputStyle: React.CSSProperties = { width: '100%', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', borderRadius: 8, padding: '9px 12px', color: 'var(--admin-text)', fontSize: 13, outline: 'none' }
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 12, color: 'var(--admin-text2)', marginBottom: 5 }

const FIELDS = [
  { key: 'whatsapp_number',  label: 'Número WhatsApp',       placeholder: '3207685459',     desc: 'Solo números, sin +57' },
  { key: 'hero_title',       label: 'Título hero',           placeholder: 'Todo el entretenimiento...', desc: 'Título principal de la página', textarea: true },
  { key: 'hero_subtitle',    label: 'Subtítulo hero',        placeholder: 'Disfruta tus plataformas...', desc: 'Texto debajo del título', textarea: true },
  { key: 'total_clients',    label: 'Total de clientes',     placeholder: '2000',           desc: 'Número que se muestra en beneficios' },
  { key: 'site_name',        label: 'Nombre del sitio',      placeholder: 'Streaming Spartan', desc: 'Para SEO y metadatos' },
  { key: 'site_description', label: 'Descripción del sitio', placeholder: 'Tu mejor opción...', desc: 'Para SEO', textarea: true },
]

export default function SettingsManager({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [settings, setSettings] = useState(initialSettings)
  const [saving, setSaving] = useState<string | null>(null)
  const { toast } = useToast()

  async function handleSave(key: string) {
    setSaving(key)
    const supabase = createClient()
    const { error } = await supabase.from('site_settings').upsert({ key, value: settings[key] ?? '' })
    setSaving(null)
    if (error) toast('Error al guardar: ' + error.message, 'error')
    else toast(`Ajuste guardado correctamente`)
  }

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--admin-text)', marginBottom: 3 }}>Configuración general</h1>
        <p style={{ fontSize: 13, color: 'var(--admin-text2)' }}>Ajusta los textos y parámetros del sitio</p>
      </div>


      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {FIELDS.map(field => (
          <div key={field.key} style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 14, padding: '18px 20px' }}>
            <label style={labelStyle}>{field.label}</label>
            {field.desc && <p style={{ fontSize: 11, color: '#52525b', marginBottom: 8 }}>{field.desc}</p>}
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              {field.textarea ? (
                <textarea
                  style={{ ...inputStyle, minHeight: 72, resize: 'vertical', flex: 1 }}
                  value={settings[field.key] ?? ''}
                  onChange={e => setSettings(s => ({ ...s, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                />
              ) : (
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  value={settings[field.key] ?? ''}
                  onChange={e => setSettings(s => ({ ...s, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                />
              )}
              <button
                onClick={() => handleSave(field.key)}
                disabled={saving === field.key}
                style={{ padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, color: 'var(--admin-text)', background: grad, border: 'none', cursor: 'pointer', flexShrink: 0, opacity: saving === field.key ? 0.6 : 1, whiteSpace: 'nowrap' }}>
                {saving === field.key ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
