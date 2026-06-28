'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({
  theme: 'dark',
  toggle: () => {},
})

const SITE_THEMES = {
  dark: {
    '--site-bg':        '#050505',
    '--site-bg-75':     'rgba(5,5,5,0.75)',
    '--site-bg2':       '#080808',
    '--site-bg3':       '#0F0F0F',
    '--site-card':      '#0F0F0F',
    '--site-border':    '#1A1A2E',
    '--site-text':      '#FFFFFF',
    '--site-text2':     '#A1A1AA',
    '--site-text3':     '#52525b',
    '--site-nav-bg':    'rgba(5,5,5,0.95)',
    '--site-scrollbar': '#050505',
    /* Combos section */
    '--combo-featured-bg':  'linear-gradient(145deg, #0e0720 0%, #120a28 60%, #0a0515 100%)',
    '--combo-card-bg':      'rgba(12,10,24,0.85)',
    '--combo-strip-bg':     'rgba(255,255,255,0.05)',
    '--combo-strip-cell':   'rgba(8,6,18,0.7)',
    '--combo-logo-filter':  'none',
    '--combo-text':         '#ffffff',
    '--combo-text2':        'rgba(255,255,255,0.45)',
    '--combo-price':        '#ffffff',
    '--combo-old-price':    'rgba(255,255,255,0.3)',
    '--combo-plus':         'rgba(255,255,255,0.35)',
    /* Platform cards */
    '--plat-card-bg':       'linear-gradient(160deg, #0D0B1E 0%, #0A0818 100%)',
    '--plat-card-border':   'rgba(255,255,255,0.07)',
    '--plat-feat-color':    'rgba(255,255,255,0.6)',
    '--plat-text2':         'rgba(255,255,255,0.4)',
    '--plat-price-color':   '#ffffff',
    '--plat-strip-cell':    'rgba(8,6,18,0.65)',
  },
  light: {
    '--site-bg':        '#F4F4F8',
    '--site-bg-75':     'rgba(244,244,248,0.75)',
    '--site-bg2':       '#EBEBF2',
    '--site-bg3':       '#FFFFFF',
    '--site-card':      '#FFFFFF',
    '--site-border':    '#DDDDE8',
    '--site-text':      '#0A0A14',
    '--site-text2':     '#5A5A72',
    '--site-text3':     '#9999AA',
    '--site-nav-bg':    'rgba(244,244,248,0.95)',
    '--site-scrollbar': '#F4F4F8',
    /* Combos section */
    '--combo-featured-bg':  '#FFFFFF',
    '--combo-card-bg':      '#FFFFFF',
    '--combo-strip-bg':     'rgba(0,0,0,0.04)',
    '--combo-strip-cell':   '#F0EFF8',
    '--combo-logo-filter':  'none',
    '--combo-text':         '#0A0A14',
    '--combo-text2':        '#5A5A72',
    '--combo-price':        '#0A0A14',
    '--combo-old-price':    '#9999AA',
    '--combo-plus':         '#9999AA',
    /* Platform cards */
    '--plat-card-bg':       '#FFFFFF',
    '--plat-card-border':   '#E2E2EE',
    '--plat-feat-color':    '#5A5A72',
    '--plat-text2':         '#9999AA',
    '--plat-price-color':   '#0A0A14',
    '--plat-strip-cell':    '#F0EFF8',
  },
}

export function SiteThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('spartan-site-theme') as Theme | null
    if (saved) setTheme(saved)
    setMounted(true)
  }, [])

  function toggle() {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('spartan-site-theme', next)
      return next
    })
  }

  useEffect(() => {
    if (!mounted) return
    const vars = SITE_THEMES[theme]
    Object.entries(vars).forEach(([k, v]) => {
      document.documentElement.style.setProperty(k, v)
    })
    document.body.style.backgroundColor = SITE_THEMES[theme]['--site-bg']
    document.body.style.color           = SITE_THEMES[theme]['--site-text']
    // data-theme drives CSS background patterns in globals.css
    document.body.setAttribute('data-theme', theme)
  }, [theme, mounted])

  if (!mounted) {
    const ssrVars = Object.entries(SITE_THEMES.dark).map(([k, v]) => `${k}:${v}`).join(';')
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

export function useSiteTheme() {
  return useContext(ThemeCtx)
}
