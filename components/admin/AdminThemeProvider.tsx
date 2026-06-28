'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({ theme: 'dark', toggle: () => {} })

const THEMES = {
  dark: {
    '--admin-bg':           '#050505',
    '--admin-sidebar':      '#0A0A0A',
    '--admin-surface':      '#0F0F0F',
    '--admin-surface2':     '#141414',
    '--admin-border':       '#1A1A2E',
    '--admin-text':         '#FFFFFF',
    '--admin-text2':        '#A1A1AA',
    '--admin-text3':        '#52525b',
    '--admin-main':         '#080808',
    /* colores usados inline en componentes */
    '--admin-card-bg':      '#0F0F0F',
    '--admin-card-border':  '#1A1A2E',
    '--admin-input-bg':     '#050505',
    '--admin-muted':        '#A1A1AA',
    '--admin-faint':        '#52525b',
    '--admin-danger':       '#ef4444',
  },
  light: {
    '--admin-bg':           '#F0F0F5',
    '--admin-sidebar':      '#FFFFFF',
    '--admin-surface':      '#FFFFFF',
    '--admin-surface2':     '#F8F8FC',
    '--admin-border':       '#E2E2EE',
    '--admin-text':         '#0A0A0F',
    '--admin-text2':        '#6B6B80',
    '--admin-text3':        '#9999AA',
    '--admin-main':         '#F0F0F5',
    /* colores usados inline en componentes */
    '--admin-card-bg':      '#FFFFFF',
    '--admin-card-border':  '#E2E2EE',
    '--admin-input-bg':     '#F8F8FC',
    '--admin-muted':        '#6B6B80',
    '--admin-faint':        '#9999AA',
    '--admin-danger':       '#dc2626',
  },
}

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('spartan-admin-theme') as Theme | null
    if (saved) setTheme(saved)
    setMounted(true)
  }, [])

  function toggle() {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('spartan-admin-theme', next)
      return next
    })
  }

  // Inyectar variables CSS en :root en tiempo real
  useEffect(() => {
    if (!mounted) return
    const vars = THEMES[theme]
    Object.entries(vars).forEach(([k, v]) => {
      document.documentElement.style.setProperty(k, v)
    })
  }, [theme, mounted])

  // Aplicar tema dark por defecto en SSR
  if (!mounted) {
    const ssrVars = Object.entries(THEMES.dark).map(([k, v]) => `${k}:${v}`).join(';')
    return (
      <ThemeCtx.Provider value={{ theme: 'dark', toggle }}>
        <style>{`:root{${ssrVars}}`}</style>
        {children}
      </ThemeCtx.Provider>
    )
  }

  return (
    <ThemeCtx.Provider value={{ theme, toggle }}>
      {children}
    </ThemeCtx.Provider>
  )
}

export function useAdminTheme() {
  return useContext(ThemeCtx)
}
