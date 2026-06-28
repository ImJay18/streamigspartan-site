'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from './AdminToast'

const grad = 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)'

interface PaymentMethod {
  id: string
  name: string
  active: boolean
  display_order: number
}

interface Props {
  initialMethods: PaymentMethod[]
}

export default function PaymentMethodsManager({ initialMethods }: Props) {
  const [methods, setMethods]   = useState<PaymentMethod[]>(initialMethods)
  const [newName, setNewName]   = useState('')
  const [adding, setAdding]     = useState(false)
  const [saving, setSaving]     = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const { toast } = useToast()

  const supabase = createClient()

  /* ── Toggle activo/inactivo ── */
  async function handleToggle(method: PaymentMethod) {
    setSaving(method.id)
    const next = !method.active
    const { error } = await supabase
      .from('payment_methods')
      .update({ active: next })
      .eq('id', method.id)

    if (error) {
      toast('Error al actualizar: ' + error.message, 'error')
    } else {
      setMethods(ms => ms.map(m => m.id === method.id ? { ...m, active: next } : m))
      toast(next ? `"${method.name}" activado` : `"${method.name}" desactivado`)
    }
    setSaving(null)
  }

  /* ── Renombrar ── */
  async function handleRename(method: PaymentMethod, newValue: string) {
    if (!newValue.trim() || newValue === method.name) return
    setSaving(method.id)
    const { error } = await supabase
      .from('payment_methods')
      .update({ name: newValue.trim() })
      .eq('id', method.id)

    if (error) {
      toast('Error al renombrar: ' + error.message, 'error')
    } else {
      setMethods(ms => ms.map(m => m.id === method.id ? { ...m, name: newValue.trim() } : m))
      toast(`Nombre actualizado`)
    }
    setSaving(null)
  }

  /* ── Agregar nuevo ── */
  async function handleAdd() {
    if (!newName.trim()) return
    setAdding(true)
    const nextOrder = methods.length > 0
      ? Math.max(...methods.map(m => m.display_order)) + 1
      : 1

    const { data, error } = await supabase
      .from('payment_methods')
      .insert({ name: newName.trim(), active: true, display_order: nextOrder })
      .select()
      .single()

    if (error) {
      toast('Error al agregar: ' + error.message, 'error')
    } else {
      setMethods(ms => [...ms, data])
      setNewName('')
      toast(`"${data.name}" agregado`)
    }
    setAdding(false)
  }

  /* ── Eliminar ── */
  async function handleDelete(method: PaymentMethod) {
    if (!confirm(`¿Eliminar "${method.name}"? Esta acción no se puede deshacer.`)) return
    setDeleting(method.id)
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', method.id)

    if (error) {
      toast('Error al eliminar: ' + error.message, 'error')
    } else {
      setMethods(ms => ms.filter(m => m.id !== method.id))
      toast(`"${method.name}" eliminado`)
    }
    setDeleting(null)
  }

  /* ── Mover orden ── */
  async function handleMove(method: PaymentMethod, direction: 'up' | 'down') {
    const sorted = [...methods].sort((a, b) => a.display_order - b.display_order)
    const idx    = sorted.findIndex(m => m.id === method.id)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= sorted.length) return

    const swap = sorted[swapIdx]
    const aOrder = method.display_order
    const bOrder = swap.display_order

    await supabase.from('payment_methods').update({ display_order: bOrder }).eq('id', method.id)
    await supabase.from('payment_methods').update({ display_order: aOrder }).eq('id', swap.id)

    setMethods(ms => ms.map(m => {
      if (m.id === method.id) return { ...m, display_order: bOrder }
      if (m.id === swap.id)   return { ...m, display_order: aOrder }
      return m
    }))
  }

  const sorted = [...methods].sort((a, b) => a.display_order - b.display_order)
  const active = sorted.filter(m => m.active)
  const inactive = sorted.filter(m => !m.active)

  return (
    <div style={{ padding: 32 }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--admin-text)', marginBottom: 3 }}>
          Métodos de pago
        </h1>
        <p style={{ fontSize: 13, color: 'var(--admin-text2)' }}>
          Administra los métodos de pago que aparecen en el pie de página del sitio
        </p>
      </div>

      {/* Preview */}
      <div style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 14, padding: '16px 20px', marginBottom: 24 }}>
        <p style={{ fontSize: 11, color: 'var(--admin-text2)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 12 }}>
          Vista previa — Pie de página
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {active.length === 0
            ? <span style={{ fontSize: 12, color: '#52525b' }}>Sin métodos activos</span>
            : active.map(m => (
              <div key={m.id} style={{ padding: '5px 10px', border: '1px solid #1A1A2E', borderRadius: 8, background: '#0F0F0F', fontSize: 11, fontWeight: 600, color: '#A1A1AA' }}>
                {m.name}
              </div>
            ))
          }
        </div>
      </div>

      {/* Agregar nuevo */}
      <div style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 14, padding: '18px 20px', marginBottom: 20 }}>
        <p style={{ fontSize: 12, color: 'var(--admin-text2)', marginBottom: 10, fontWeight: 500 }}>
          Agregar método de pago
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="Ej: PSE, Efecty, Bancolombia..."
            style={{ flex: 1, background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', borderRadius: 8, padding: '9px 12px', color: 'var(--admin-text)', fontSize: 13, outline: 'none' }}
          />
          <button
            onClick={handleAdd}
            disabled={adding || !newName.trim()}
            style={{ padding: '9px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#fff', background: grad, border: 'none', cursor: 'pointer', opacity: adding || !newName.trim() ? 0.5 : 1, whiteSpace: 'nowrap' }}>
            {adding ? 'Agregando...' : '+ Agregar'}
          </button>
        </div>
      </div>

      {/* Lista activos */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text2)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
          Activos ({active.length})
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {active.map((m, i) => (
            <MethodRow
              key={m.id}
              method={m}
              saving={saving === m.id}
              deleting={deleting === m.id}
              isFirst={i === 0}
              isLast={i === active.length - 1}
              onToggle={() => handleToggle(m)}
              onRename={v => handleRename(m, v)}
              onDelete={() => handleDelete(m)}
              onMove={dir => handleMove(m, dir)}
            />
          ))}
          {active.length === 0 && (
            <p style={{ fontSize: 13, color: '#52525b', padding: '12px 0' }}>No hay métodos activos.</p>
          )}
        </div>
      </div>

      {/* Lista inactivos */}
      {inactive.length > 0 && (
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text2)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
            Inactivos ({inactive.length})
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {inactive.map((m, i) => (
              <MethodRow
                key={m.id}
                method={m}
                saving={saving === m.id}
                deleting={deleting === m.id}
                isFirst={i === 0}
                isLast={i === inactive.length - 1}
                onToggle={() => handleToggle(m)}
                onRename={v => handleRename(m, v)}
                onDelete={() => handleDelete(m)}
                onMove={dir => handleMove(m, dir)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Fila individual ── */
function MethodRow({
  method, saving, deleting, isFirst, isLast,
  onToggle, onRename, onDelete, onMove,
}: {
  method: PaymentMethod
  saving: boolean
  deleting: boolean
  isFirst: boolean
  isLast: boolean
  onToggle: () => void
  onRename: (v: string) => void
  onDelete: () => void
  onMove: (dir: 'up' | 'down') => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft]     = useState(method.name)

  function commitRename() {
    setEditing(false)
    onRename(draft)
  }

  return (
    <div style={{
      background: 'var(--admin-surface)',
      border: '1px solid var(--admin-border)',
      borderRadius: 10,
      padding: '12px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      opacity: method.active ? 1 : 0.55,
    }}>

      {/* Orden arrows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <button onClick={() => onMove('up')} disabled={isFirst}
          style={{ background: 'none', border: 'none', cursor: isFirst ? 'default' : 'pointer', color: isFirst ? '#3f3f46' : 'var(--admin-text2)', padding: 2, lineHeight: 1 }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button onClick={() => onMove('down')} disabled={isLast}
          style={{ background: 'none', border: 'none', cursor: isLast ? 'default' : 'pointer', color: isLast ? '#3f3f46' : 'var(--admin-text2)', padding: 2, lineHeight: 1 }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      {/* Nombre editable */}
      <div style={{ flex: 1 }}>
        {editing ? (
          <input
            autoFocus
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commitRename}
            onKeyDown={e => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') { setEditing(false); setDraft(method.name) } }}
            style={{ background: 'var(--admin-bg)', border: '1px solid rgba(139,92,246,0.5)', borderRadius: 6, padding: '5px 9px', color: 'var(--admin-text)', fontSize: 13, outline: 'none', width: '100%' }}
          />
        ) : (
          <span
            onClick={() => setEditing(true)}
            title="Clic para editar"
            style={{ fontSize: 13, fontWeight: 600, color: 'var(--admin-text)', cursor: 'text', borderBottom: '1px dashed transparent' }}
            onMouseEnter={e => (e.currentTarget.style.borderBottomColor = '#52525b')}
            onMouseLeave={e => (e.currentTarget.style.borderBottomColor = 'transparent')}>
            {method.name}
          </span>
        )}
      </div>

      {/* Toggle activo */}
      <button
        onClick={onToggle}
        disabled={saving}
        title={method.active ? 'Desactivar' : 'Activar'}
        style={{
          width: 38, height: 22, borderRadius: 11,
          background: method.active ? '#8B5CF6' : '#27272a',
          border: 'none', cursor: 'pointer', position: 'relative',
          transition: 'background 0.2s', flexShrink: 0,
          opacity: saving ? 0.5 : 1,
        }}>
        <span style={{
          position: 'absolute', top: 3,
          left: method.active ? 19 : 3,
          width: 16, height: 16, borderRadius: '50%',
          background: '#fff', transition: 'left 0.2s',
        }}/>
      </button>

      {/* Eliminar */}
      <button
        onClick={onDelete}
        disabled={deleting}
        title="Eliminar"
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#52525b', padding: 4, borderRadius: 6, transition: 'color 0.2s', opacity: deleting ? 0.5 : 1 }}
        onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
        onMouseLeave={e => (e.currentTarget.style.color = '#52525b')}>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d="M2 4h11M5 4V2.5a.5.5 0 01.5-.5h4a.5.5 0 01.5.5V4M6 7v4M9 7v4M3 4l.8 8.5a1 1 0 001 .9h5.4a1 1 0 001-.9L12 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}
