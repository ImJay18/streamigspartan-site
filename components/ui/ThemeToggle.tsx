'use client'

import { useSiteTheme } from './SiteThemeProvider'

interface Props {
  compact?: boolean
}

export default function ThemeToggle({ compact = false }: Props) {
  const { theme, toggle } = useSiteTheme()
  const isDark = theme === 'dark'

  const icon = isDark ? (
    <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.1 3.1l1 1M11.9 11.9l1 1M11.9 4.1l1-1M3.1 12.9l1-1"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ) : (
    <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
      <path d="M12 9a5 5 0 01-6.7-6.7A6 6 0 1012 9z"
        stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    </svg>
  )

  if (compact) {
    return (
      <button
        onClick={toggle}
        aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        style={{
          width: 38, height: 38,
          borderRadius: 9,
          background: 'rgba(255,255,255,0.09)',
          border: '1px solid rgba(255,255,255,0.18)',
          cursor: 'pointer',
          color: 'rgba(255,255,255,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          transition: 'background 0.2s, border-color 0.2s, color 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(139,92,246,0.15)'
          e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'
          e.currentTarget.style.color = '#fff'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.09)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'
          e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
        }}>
        {icon}
      </button>
    )
  }

  // Full button for standalone use
  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 36, height: 36, borderRadius: 8,
        background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
        border: isDark ? '1px solid #1A1A2E' : '1px solid #DDDDE8',
        cursor: 'pointer',
        color: isDark ? '#A1A1AA' : '#5A5A72',
        transition: 'background 0.2s, border-color 0.2s, color 0.2s',
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.color = isDark ? '#fff' : '#0A0A14'
        e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = isDark ? '#A1A1AA' : '#5A5A72'
        e.currentTarget.style.borderColor = isDark ? '#1A1A2E' : '#DDDDE8'
      }}>
      {icon}
    </button>
  )
}
