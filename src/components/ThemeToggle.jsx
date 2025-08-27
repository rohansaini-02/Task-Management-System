import { useState, useEffect } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState('system')

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('tamasha-theme')
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement
    
    if (theme === 'system') {
      // Remove data-theme and let CSS handle it
      root.removeAttribute('data-theme')
    } else {
      // Set explicit theme
      root.setAttribute('data-theme', theme)
    }
    
    // Save to localStorage
    localStorage.setItem('tamasha-theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme(current => {
      if (current === 'light') return 'dark'
      if (current === 'dark') return 'system'
      return 'light'
    })
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return '☀️'
      case 'dark': return '🌙'
      case 'system': return '🖥️'
      default: return '🖥️'
    }
  }

  const getThemeLabel = () => {
    switch (theme) {
      case 'light': return 'Light'
      case 'dark': return 'Dark'
      case 'system': return 'System'
      default: return 'System'
    }
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} theme`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        borderRadius: '8px',
        border: '1px solid var(--border-primary)',
        background: 'var(--bg-tertiary)',
        color: 'var(--text-primary)',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.target.style.background = 'var(--border-primary)'
      }}
      onMouseLeave={(e) => {
        e.target.style.background = 'var(--bg-tertiary)'
      }}
    >
      <span style={{ fontSize: '16px' }}>{getThemeIcon()}</span>
      <span>{getThemeLabel()}</span>
    </button>
  )
}
