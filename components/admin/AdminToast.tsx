'use client'

import { createContext, useContext, useState, useCallback } from 'react'

type ToastType = 'success' | 'error' | 'info'
interface Toast { id: number; msg: string; type: ToastType }

const ToastCtx = createContext<{
  toast: (msg: string, type?: ToastType) => void
}>({ toast: () => {} })

export function AdminToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  let counter = 0

  const toast = useCallback((msg: string, type: ToastType = 'success') => {
    const id = ++counter
    setToasts(prev => [...prev, { id, msg, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  const ICONS = {
    success: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="rgba(52,211,153,0.2)"/><path d="M5 8l2.5 2.5L11 6" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    error:   <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="rgba(239,68,68,0.2)"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#f87171" strokeWidth="1.6" strokeLinecap="round"/></svg>,
    info:    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="rgba(139,92,246,0.2)"/><path d="M8 7v4M8 5.5v.5" stroke="#a78bfa" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  }

  const COLORS = {
    success: { bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.25)',  color: '#34d399' },
    error:   { bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.25)',   color: '#f87171' },
    info:    { bg: 'rgba(139,92,246,0.08)',  border: 'rgba(139,92,246,0.25)',  color: '#a78bfa' },
  }

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      {/* Toast container */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none' }}>
        {toasts.map(t => (
          <div key={t.id}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 16px', borderRadius: 12,
              background: COLORS[t.type].bg,
              border: `1px solid ${COLORS[t.type].border}`,
              backdropFilter: 'blur(12px)',
              animation: 'toast-in 0.3s ease',
              minWidth: 240, maxWidth: 340,
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            }}>
            {ICONS[t.type]}
            <span style={{ fontSize: 13, color: COLORS[t.type].color, fontWeight: 500 }}>{t.msg}</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(12px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  return useContext(ToastCtx)
}
