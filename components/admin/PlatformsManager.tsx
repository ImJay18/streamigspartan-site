'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Platform } from '@/types'
import Image from 'next/image'
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext, verticalListSortingStrategy, useSortable, arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useToast } from './AdminToast'
import PreviewModal from './PreviewModal'

const grad = 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)'
const EMPTY: Partial<Platform> = { name: '', logo_url: '', plan_type: 'Premium', features: [], price: 0, original_price: 0, active: true, display_order: 0 }
const IS = (extra?: React.CSSProperties): React.CSSProperties => ({ width: '100%', background: '#050505', border: '1px solid var(--admin-border)', borderRadius: 8, padding: '9px 12px', color: 'var(--admin-text)', fontSize: 13, outline: 'none', boxSizing: 'border-box', ...extra })
const LS: React.CSSProperties = { display: 'block', fontSize: 12, color: 'var(--admin-text2)', marginBottom: 5 }

// ─── Logo uploader ────────────────────────────────────────────
function LogoUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [mode, setMode] = useState<'file' | 'url'>(value ? 'url' : 'file')
  const { toast } = useToast()

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { data, error } = await supabase.storage.from('platform-logos').upload(filename, file, { upsert: true })
    setUploading(false)
    if (error) { toast('Error subiendo imagen: ' + error.message, 'error'); return }
    const { data: { publicUrl } } = supabase.storage.from('platform-logos').getPublicUrl(data.path)
    onChange(publicUrl)
    setMode('url')
    toast('Imagen subida correctamente')
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 0, marginBottom: 8, border: '1px solid var(--admin-border)', borderRadius: 8, overflow: 'hidden', width: 'fit-content' }}>
        {(['file', 'url'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} type="button"
            style={{ padding: '6px 14px', fontSize: 12, fontWeight: 500, border: 'none', cursor: 'pointer', background: mode === m ? '#8B5CF6' : 'transparent', color: mode === m ? '#fff' : 'var(--admin-text2)', transition: 'all 0.15s' }}>
            {m === 'file' ? 'Subir imagen' : 'URL externa'}
          </button>
        ))}
      </div>
      {mode === 'file' ? (
        <div>
          <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }}/>
          <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
            style={{ width: '100%', padding: '24px 16px', border: '2px dashed var(--admin-border)', borderRadius: 10, background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--admin-border)')}>
            {uploading
              ? <><svg width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ animation: 'spin 1s linear infinite' }}><circle cx="11" cy="11" r="9" stroke="#1A1A2E" strokeWidth="2"/><path d="M11 2a9 9 0 019 9" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"/></svg><span style={{ fontSize: 13, color: 'var(--admin-text2)' }}>Subiendo...</span></>
              : <><svg width="26" height="26" viewBox="0 0 28 28" fill="none"><path d="M14 4v14M8 10l6-6 6 6" stroke="#8B5CF6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 22h20" stroke="var(--admin-border)" strokeWidth="1.8" strokeLinecap="round"/></svg><span style={{ fontSize: 13, color: 'var(--admin-text2)' }}>Click para seleccionar imagen</span><span style={{ fontSize: 11, color: 'var(--admin-text3)' }}>PNG, JPG, SVG, WEBP — máx 2MB</span></>
            }
          </button>
          {value && <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ position: 'relative', width: 60, height: 28, flexShrink: 0 }}><Image src={value} alt="" fill style={{ objectFit: 'contain' }} unoptimized/></div><span style={{ fontSize: 11, color: '#34d399' }}>Logo subido</span><button type="button" onClick={() => onChange('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--admin-text2)', cursor: 'pointer', fontSize: 16 }}>×</button></div>}
        </div>
      ) : (
        <div>
          <input style={IS()} value={value} onChange={e => onChange(e.target.value)} placeholder="https://..."/>
          {value && <div style={{ marginTop: 8, padding: '8px 12px', background: 'var(--admin-surface2)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ position: 'relative', width: 80, height: 32 }}><Image src={value} alt="" fill style={{ objectFit: 'contain' }} unoptimized/></div><span style={{ fontSize: 11, color: 'var(--admin-text2)' }}>Vista previa</span></div>}
        </div>
      )}
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

// ─── Sortable row ─────────────────────────────────────────────
function SortableRow({ p, isLast, onEdit, onToggle, onDelete, onPreview }: {
  p: Platform
  isLast: boolean
  onEdit: () => void
  onToggle: () => void
  onDelete: () => void
  onPreview: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: p.id })
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    background: isDragging ? 'rgba(139,92,246,0.05)' : 'transparent',
    borderBottom: isLast ? 'none' : '1px solid var(--admin-border)',
  }

  return (
    <tr ref={setNodeRef} style={style}>
      {/* Drag handle */}
      <td style={{ padding: '10px 12px', width: 32 }}>
        <div {...attributes} {...listeners} style={{ cursor: 'grab', color: 'var(--admin-text3)', display: 'flex', alignItems: 'center' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 4h6M4 7h6M4 10h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
        </div>
      </td>
      <td style={{ padding: '10px 12px' }}>
        <div style={{ width: 64, height: 30, position: 'relative' }}>
          <Image src={p.logo_url} alt={p.name} fill style={{ objectFit: 'contain' }} unoptimized/>
        </div>
      </td>
      <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 500, color: 'var(--admin-text)' }}>{p.name}</td>
      <td style={{ padding: '10px 12px' }}>
        <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 999, background: 'rgba(139,92,246,0.15)', color: '#a78bfa', fontWeight: 600 }}>{p.plan_type}</span>
      </td>
      <td style={{ padding: '10px 12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {p.original_price > 0 && p.original_price > p.price && (
            <span style={{ fontSize: 11, color: 'var(--admin-text3)', textDecoration: 'line-through' }}>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(p.original_price)}</span>
          )}
          <span style={{ fontSize: 13, fontWeight: 600, color: p.original_price > 0 && p.original_price > p.price ? '#D946EF' : 'var(--admin-text)' }}>
            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(p.price)}
          </span>
        </div>
      </td>
      <td style={{ padding: '10px 12px' }}>
        <button onClick={onToggle}
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 9px', borderRadius: 999, fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer', background: p.active ? 'rgba(52,211,153,0.12)' : 'rgba(239,68,68,0.1)', color: p.active ? '#34d399' : '#f87171' }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }}/>
          {p.active ? 'Activa' : 'Inactiva'}
        </button>
      </td>
      <td style={{ padding: '10px 12px' }}>
        <div style={{ display: 'flex', gap: 5 }}>
          <button onClick={onPreview}
            style={{ padding: '5px 9px', borderRadius: 7, fontSize: 11, border: '1px solid var(--admin-border)', background: 'transparent', color: '#8B5CF6', cursor: 'pointer' }}
            title="Vista previa">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M1 7s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.3"/><circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.3"/></svg>
          </button>
          <button onClick={onEdit}
            style={{ padding: '5px 9px', borderRadius: 7, fontSize: 11, border: '1px solid var(--admin-border)', background: 'transparent', color: 'var(--admin-text2)', cursor: 'pointer' }}>
            Editar
          </button>
          <button onClick={onDelete}
            style={{ padding: '5px 9px', borderRadius: 7, fontSize: 11, border: '1px solid rgba(239,68,68,0.2)', background: 'transparent', color: '#f87171', cursor: 'pointer' }}>
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  )
}

// ─── Main component ───────────────────────────────────────────
export default function PlatformsManager({ initialPlatforms }: { initialPlatforms: Platform[] }) {
  const [platforms, setPlatforms] = useState(initialPlatforms)
  const [editing, setEditing]     = useState<Partial<Platform> | null>(null)
  const [preview, setPreview]     = useState<Platform | null>(null)
  const [loading, setLoading]     = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIdx = platforms.findIndex(p => p.id === active.id)
    const newIdx = platforms.findIndex(p => p.id === over.id)
    const reordered = arrayMove(platforms, oldIdx, newIdx).map((p, i) => ({ ...p, display_order: i + 1 }))
    setPlatforms(reordered)
    const supabase = createClient()
    await Promise.all(reordered.map(p => supabase.from('platforms').update({ display_order: p.display_order }).eq('id', p.id)))
    toast('Orden actualizado')
  }

  async function handleSave() {
    if (!editing?.name)     { toast('El nombre es requerido', 'error'); return }
    if (!editing?.logo_url) { toast('El logo es requerido', 'error'); return }
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase.from('platforms').upsert(editing).select().single()
    setLoading(false)
    if (error) { toast('Error: ' + error.message, 'error'); return }
    setPlatforms(prev => editing.id ? prev.map(p => p.id === data.id ? data : p) : [...prev, data])
    setEditing(null)
    toast(editing.id ? 'Plataforma actualizada' : 'Plataforma creada')
    router.refresh()
  }

  async function handleToggle(p: Platform) {
    const supabase = createClient()
    await supabase.from('platforms').update({ active: !p.active }).eq('id', p.id)
    setPlatforms(prev => prev.map(x => x.id === p.id ? { ...x, active: !x.active } : x))
    toast(p.active ? `${p.name} desactivada` : `${p.name} activada`, 'info')
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta plataforma?')) return
    const supabase = createClient()
    await supabase.from('platforms').delete().eq('id', id)
    setPlatforms(prev => prev.filter(p => p.id !== id))
    toast('Plataforma eliminada', 'error')
  }

  const TH = (label: string) => (
    <th key={label} style={{ padding: '11px 12px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: 'var(--admin-text2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</th>
  )

  return (
    <div style={{ padding: 32 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--admin-text)', marginBottom: 3 }}>Plataformas</h1>
          <p style={{ fontSize: 13, color: 'var(--admin-text2)' }}>{platforms.length} plataformas — arrastra para reordenar</p>
        </div>
        <button onClick={() => setEditing({ ...EMPTY })}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 9, fontSize: 13, fontWeight: 600, color: '#fff', background: grad, border: 'none', cursor: 'pointer' }}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
          Nueva plataforma
        </button>
      </div>

      {/* Tabla con DnD */}
      <div style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 14, overflow: 'hidden' }}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={platforms.map(p => p.id)} strategy={verticalListSortingStrategy}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--admin-border)' }}>
                  <th style={{ width: 32 }}/>
                  {['Logo', 'Nombre', 'Tipo', 'Precio', 'Estado', 'Acciones'].map(h => TH(h))}
                </tr>
              </thead>
              <tbody>
                {platforms.map((p, i) => (
                  <SortableRow
                    key={p.id}
                    p={p}
                    isLast={i === platforms.length - 1}
                    onEdit={() => setEditing({ ...p })}
                    onToggle={() => handleToggle(p)}
                    onDelete={() => handleDelete(p.id)}
                    onPreview={() => setPreview(p)}
                  />
                ))}
              </tbody>
            </table>
          </SortableContext>
        </DndContext>
      </div>

      {/* Modal edición */}
      {editing && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 18, padding: 28, width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--admin-text)' }}>{editing.id ? 'Editar plataforma' : 'Nueva plataforma'}</h2>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', color: 'var(--admin-text2)', cursor: 'pointer' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div><label style={LS}>Nombre</label><input style={IS()} value={editing.name ?? ''} onChange={e => setEditing(p => ({ ...p!, name: e.target.value }))} placeholder="Netflix"/></div>
              <div><label style={LS}>Logo</label><LogoUploader value={editing.logo_url ?? ''} onChange={url => setEditing(p => ({ ...p!, logo_url: url }))}/></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={LS}>Tipo de plan</label><input style={IS()} value={editing.plan_type ?? ''} onChange={e => setEditing(p => ({ ...p!, plan_type: e.target.value }))} placeholder="Premium"/></div>
                <div><label style={LS}>Precio COP</label><input style={IS()} type="number" step="1" value={editing.price ?? 0} onChange={e => setEditing(p => ({ ...p!, price: parseFloat(e.target.value) }))}/></div>
              </div>
              <div>
                <label style={LS}>Precio original COP <span style={{ color: 'var(--admin-text3)', fontWeight: 400 }}>(opcional — activa badge Promo)</span></label>
                <input style={IS()} type="number" step="1" value={editing.original_price ?? 0} onChange={e => setEditing(p => ({ ...p!, original_price: parseFloat(e.target.value) }))} placeholder="0"/>
                {(editing.original_price ?? 0) > 0 && (editing.original_price ?? 0) > (editing.price ?? 0) && (
                  <div style={{ marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 999, background: grad, fontSize: 10, fontWeight: 800, color: '#fff' }}>
                    ★ -{Math.round(((editing.original_price! - editing.price!) / editing.original_price!) * 100)}% Promo — se mostrará en la landing
                  </div>
                )}
              </div>
              <div><label style={LS}>Características (una por línea)</label><textarea style={{ ...IS(), minHeight: 88, resize: 'vertical' }} value={(editing.features ?? []).join('\n')} onChange={e => setEditing(p => ({ ...p!, features: e.target.value.split('\n').filter(Boolean) }))} placeholder="4K Ultra HD&#10;Perfiles ilimitados&#10;Renovación fácil"/></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={LS}>Orden</label><input style={IS()} type="number" value={editing.display_order ?? 0} onChange={e => setEditing(p => ({ ...p!, display_order: parseInt(e.target.value) }))}/></div>
                <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 2 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <div style={{ position: 'relative', width: 38, height: 22 }} onClick={() => setEditing(p => ({ ...p!, active: !p!.active }))}>
                      <div style={{ position: 'absolute', inset: 0, borderRadius: 999, background: editing.active ? '#8B5CF6' : 'var(--admin-border)', transition: 'background 0.2s' }}/>
                      <div style={{ position: 'absolute', top: 3, left: editing.active ? 19 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }}/>
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--admin-text2)' }}>Activa</span>
                  </label>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button onClick={() => setEditing(null)} style={{ flex: 1, padding: '10px', borderRadius: 9, fontSize: 13, fontWeight: 600, border: '1px solid var(--admin-border)', background: 'transparent', color: 'var(--admin-text2)', cursor: 'pointer' }}>Cancelar</button>
              <button onClick={handleSave} disabled={loading} style={{ flex: 2, padding: '10px', borderRadius: 9, fontSize: 13, fontWeight: 600, color: '#fff', background: grad, border: 'none', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal vista previa */}
      {preview && <PreviewModal type="platform" item={preview} onClose={() => setPreview(null)}/>}
    </div>
  )
}
