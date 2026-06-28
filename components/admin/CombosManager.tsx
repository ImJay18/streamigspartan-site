'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Combo, Platform } from '@/types'
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
const EMPTY: Partial<Combo> = { name: '', description: '', platform_names: [], platform_logos: [], price: 0, original_price: 0, badge_text: '', badge_color: 'purple', is_featured: false, active: true, display_order: 0 }
const IS: React.CSSProperties = { width: '100%', background: '#050505', border: '1px solid var(--admin-border)', borderRadius: 8, padding: '9px 12px', color: 'var(--admin-text)', fontSize: 13, outline: 'none', boxSizing: 'border-box' as const }
const LS: React.CSSProperties = { display: 'block', fontSize: 12, color: 'var(--admin-text2)', marginBottom: 5 }
const COP = (v: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v)
const BADGE_BG: Record<string, string> = { purple: '#8B5CF6', magenta: '#D946EF', green: '#10b981' }
const BADGE_COLORS = [{ value: 'purple', label: 'Morado' }, { value: 'magenta', label: 'Magenta' }, { value: 'green', label: 'Verde' }]

// ─── Selector de plataformas ──────────────────────────────────
function PlatformSelector({
  selected,
  onChange,
  available,
}: {
  selected: string[]
  onChange: (names: string[]) => void
  available: Pick<Platform, 'id' | 'name' | 'logo_url' | 'price'>[]
}) {
  function toggle(name: string) {
    if (selected.includes(name)) {
      onChange(selected.filter(n => n !== name))
    } else {
      onChange([...selected, name])
    }
  }

  return (
    <div>
      <label style={LS}>
        Plataformas incluidas{' '}
        <span style={{ color: 'var(--admin-text3)', fontWeight: 400 }}>
          ({selected.length} seleccionadas)
        </span>
      </label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {available.map(p => {
          const isSelected = selected.includes(p.name)
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => toggle(p.name)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                background: isSelected ? 'rgba(139,92,246,0.1)' : 'var(--admin-surface2)',
                border: isSelected ? '1.5px solid #8B5CF6' : '1px solid var(--admin-border)',
                transition: 'all 0.15s', textAlign: 'left',
              }}
            >
              <div style={{ width: 40, height: 22, position: 'relative', flexShrink: 0 }}>
                <Image src={p.logo_url} alt={p.name} fill style={{ objectFit: 'contain' }} unoptimized />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                <p style={{ fontSize: 10, color: 'var(--admin-text2)', margin: 0 }}>{COP(p.price)}/pantalla</p>
              </div>
              <div style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isSelected ? '#8B5CF6' : 'transparent', border: isSelected ? 'none' : '1.5px solid var(--admin-border)', transition: 'all 0.15s' }}>
                {isSelected && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Vista previa del combo seleccionado */}
      {selected.length > 0 && (
        <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 8, background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
          {selected.map((name, i) => (
            <span key={name} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#a78bfa' }}>{name}</span>
              {i < selected.length - 1 && <span style={{ color: '#8B5CF6', fontSize: 14, fontWeight: 300 }}>+</span>}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Sortable card ────────────────────────────────────────────
function SortableComboCard({ combo, onEdit, onDelete, onPreview }: {
  combo: Combo; onEdit: () => void; onDelete: () => void; onPreview: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: combo.id })
  const discount = combo.original_price > 0 && combo.original_price > combo.price
    ? Math.round(((combo.original_price - combo.price) / combo.original_price) * 100) : 0

  return (
    <div ref={setNodeRef}
      style={{ background: 'var(--admin-surface)', border: combo.is_featured ? '1px solid rgba(139,92,246,0.4)' : '1px solid var(--admin-border)', borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}>
      <div {...attributes} {...listeners} style={{ cursor: 'grab', color: 'var(--admin-text3)', flexShrink: 0 }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 4h6M4 7h6M4 10h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--admin-text)' }}>{combo.name}</span>
          {combo.badge_text && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, color: '#fff', background: BADGE_BG[combo.badge_color] ?? '#8B5CF6' }}>{combo.badge_text}</span>}
          {combo.is_featured && <span style={{ fontSize: 10, color: '#8B5CF6' }}>★ Destacado</span>}
        </div>
        {/* Plataformas como chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
          {combo.platform_names.map(name => (
            <span key={name} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: 'rgba(139,92,246,0.1)', color: '#a78bfa', fontWeight: 600, border: '1px solid rgba(139,92,246,0.2)' }}>
              {name}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--admin-text)' }}>{COP(combo.price)}<span style={{ fontSize: 11, fontWeight: 400, color: 'var(--admin-text2)' }}>/mes</span></span>
          {combo.original_price > 0 && combo.original_price > combo.price && (
            <span style={{ fontSize: 11, color: 'var(--admin-text3)', textDecoration: 'line-through' }}>{COP(combo.original_price)}</span>
          )}
          {discount > 0 && <span style={{ fontSize: 10, fontWeight: 700, color: '#34d399' }}>-{discount}%</span>}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
        <button onClick={onPreview}
          style={{ padding: '6px 9px', borderRadius: 7, fontSize: 11, border: '1px solid var(--admin-border)', background: 'transparent', color: '#8B5CF6', cursor: 'pointer' }}
          title="Vista previa">
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M1 7s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.3"/><circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.3"/></svg>
        </button>
        <button onClick={onEdit} style={{ padding: '6px 10px', borderRadius: 7, fontSize: 12, border: '1px solid var(--admin-border)', background: 'transparent', color: 'var(--admin-text2)', cursor: 'pointer' }}>Editar</button>
        <button onClick={onDelete} style={{ padding: '6px 10px', borderRadius: 7, fontSize: 12, border: '1px solid rgba(239,68,68,0.2)', background: 'transparent', color: '#f87171', cursor: 'pointer' }}>Eliminar</button>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────
export default function CombosManager({
  initialCombos,
  availablePlatforms,
}: {
  initialCombos: Combo[]
  availablePlatforms: Pick<Platform, 'id' | 'name' | 'logo_url' | 'price'>[]
}) {
  const [combos, setCombos]   = useState(initialCombos)
  const [editing, setEditing] = useState<Partial<Combo> | null>(null)
  const [preview, setPreview] = useState<Combo | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIdx = combos.findIndex(c => c.id === active.id)
    const newIdx = combos.findIndex(c => c.id === over.id)
    const reordered = arrayMove(combos, oldIdx, newIdx).map((c, i) => ({ ...c, display_order: i + 1 }))
    setCombos(reordered)
    const supabase = createClient()
    await Promise.all(reordered.map(c => supabase.from('combos').update({ display_order: c.display_order }).eq('id', c.id)))
    toast('Orden actualizado')
  }

  async function handleSave() {
    if (!editing?.name)                      { toast('El nombre es requerido', 'error'); return }
    if (!editing?.platform_names?.length)    { toast('Selecciona al menos una plataforma', 'error'); return }
    setLoading(true)

    // Sincronizar platform_logos desde plataformas disponibles
    const logos = (editing.platform_names ?? []).map(name => {
      const found = availablePlatforms.find(p => p.name === name)
      return found?.logo_url ?? ''
    })

    const payload = { ...editing, platform_logos: logos }
    const supabase = createClient()
    const { data, error } = await supabase.from('combos').upsert(payload).select().single()
    setLoading(false)
    if (error) { toast('Error: ' + error.message, 'error'); return }
    setCombos(prev => editing.id ? prev.map(c => c.id === data.id ? data : c) : [...prev, data])
    setEditing(null)
    toast(editing.id ? 'Combo actualizado' : 'Combo creado')
    router.refresh()
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este combo?')) return
    const supabase = createClient()
    await supabase.from('combos').delete().eq('id', id)
    setCombos(prev => prev.filter(c => c.id !== id))
    toast('Combo eliminado', 'error')
  }

  // Calcular precio sugerido (suma de unitarios)
  const suggestedPrice = (editing?.platform_names ?? []).reduce((acc, name) => {
    const p = availablePlatforms.find(p => p.name === name)
    return acc + (p?.price ?? 0)
  }, 0)

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--admin-text)', marginBottom: 3 }}>Combos</h1>
          <p style={{ fontSize: 13, color: 'var(--admin-text2)' }}>{combos.length} combos — arrastra para reordenar</p>
        </div>
        <button onClick={() => setEditing({ ...EMPTY })}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 9, fontSize: 13, fontWeight: 600, color: '#fff', background: grad, border: 'none', cursor: 'pointer' }}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
          Nuevo combo
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={combos.map(c => c.id)} strategy={verticalListSortingStrategy}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {combos.map(c => (
              <SortableComboCard key={c.id} combo={c}
                onEdit={() => setEditing({ ...c })}
                onDelete={() => handleDelete(c.id)}
                onPreview={() => setPreview(c)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {combos.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--admin-text3)' }}>
          <p style={{ fontSize: 14 }}>No hay combos creados aún.</p>
          <p style={{ fontSize: 12, marginTop: 4 }}>Crea tu primer combo seleccionando plataformas del catálogo.</p>
        </div>
      )}

      {/* Modal edición */}
      {editing && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 18, padding: 28, width: '100%', maxWidth: 580, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--admin-text)' }}>{editing.id ? 'Editar combo' : 'Nuevo combo'}</h2>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', color: 'var(--admin-text2)', cursor: 'pointer' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Nombre */}
              <div>
                <label style={LS}>Nombre del combo</label>
                <input style={IS} value={editing.name ?? ''} onChange={e => setEditing(p => ({ ...p!, name: e.target.value }))} placeholder="Combo Básico"/>
              </div>

              {/* Selector de plataformas */}
              <PlatformSelector
                selected={editing.platform_names ?? []}
                onChange={names => setEditing(p => ({ ...p!, platform_names: names }))}
                available={availablePlatforms}
              />

              {/* Descripción auto-generada o editable */}
              <div>
                <label style={LS}>Descripción</label>
                <input style={IS}
                  value={editing.description ?? ''}
                  onChange={e => setEditing(p => ({ ...p!, description: e.target.value }))}
                  placeholder={(editing.platform_names ?? []).join(' + ') || 'Descripción del combo'}
                />
              </div>

              {/* Precios */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={LS}>
                    Precio COP
                    {suggestedPrice > 0 && (
                      <button type="button"
                        onClick={() => setEditing(p => ({ ...p!, price: suggestedPrice }))}
                        style={{ marginLeft: 6, fontSize: 10, color: '#8B5CF6', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                        Usar suma ({COP(suggestedPrice)})
                      </button>
                    )}
                  </label>
                  <input style={IS} type="number" step="1" value={editing.price ?? 0}
                    onChange={e => setEditing(p => ({ ...p!, price: parseFloat(e.target.value) }))}/>
                </div>
                <div>
                  <label style={LS}>Precio original COP <span style={{ color: 'var(--admin-text3)', fontWeight: 400 }}>(opcional)</span></label>
                  <input style={IS} type="number" step="1" value={editing.original_price ?? 0}
                    onChange={e => setEditing(p => ({ ...p!, original_price: parseFloat(e.target.value) }))}/>
                </div>
              </div>

              {/* Descuento preview */}
              {(editing.original_price ?? 0) > 0 && (editing.original_price ?? 0) > (editing.price ?? 0) && (
                <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.2)', fontSize: 12, color: '#34d399' }}>
                  ✓ Se mostrará -{Math.round(((editing.original_price! - editing.price!) / editing.original_price!) * 100)}% de descuento
                </div>
              )}

              {/* Badge */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={LS}>Texto badge <span style={{ color: 'var(--admin-text3)', fontWeight: 400 }}>(opcional)</span></label>
                  <input style={IS} value={editing.badge_text ?? ''} onChange={e => setEditing(p => ({ ...p!, badge_text: e.target.value }))} placeholder="Más vendido"/>
                </div>
                <div>
                  <label style={LS}>Color badge</label>
                  <select style={{ ...IS }} value={editing.badge_color ?? 'purple'} onChange={e => setEditing(p => ({ ...p!, badge_color: e.target.value as Combo['badge_color'] }))}>
                    {BADGE_COLORS.map(bc => <option key={bc.value} value={bc.value}>{bc.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div style={{ display: 'flex', gap: 20 }}>
                {[{ key: 'active', label: 'Activo' }, { key: 'is_featured', label: '★ Destacado' }].map(toggle => (
                  <label key={toggle.key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <div style={{ position: 'relative', width: 36, height: 20 }}
                      onClick={() => setEditing(p => ({ ...p!, [toggle.key]: !p![toggle.key as keyof Combo] }))}>
                      <div style={{ position: 'absolute', inset: 0, borderRadius: 999, background: editing[toggle.key as keyof Combo] ? '#8B5CF6' : 'var(--admin-border)', transition: 'background 0.2s' }}/>
                      <div style={{ position: 'absolute', top: 3, left: editing[toggle.key as keyof Combo] ? 18 : 3, width: 14, height: 14, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }}/>
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--admin-text2)' }}>{toggle.label}</span>
                  </label>
                ))}
              </div>

            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
              <button onClick={() => setEditing(null)} style={{ flex: 1, padding: '10px', borderRadius: 9, fontSize: 13, fontWeight: 600, border: '1px solid var(--admin-border)', background: 'transparent', color: 'var(--admin-text2)', cursor: 'pointer' }}>
                Cancelar
              </button>
              <button onClick={handleSave} disabled={loading} style={{ flex: 2, padding: '10px', borderRadius: 9, fontSize: 13, fontWeight: 600, color: '#fff', background: grad, border: 'none', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
                {loading ? 'Guardando...' : 'Guardar combo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {preview && <PreviewModal type="combo" item={preview} onClose={() => setPreview(null)}/>}
    </div>
  )
}
