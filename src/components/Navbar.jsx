import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import ExportImport from './ExportImport'

export default function Navbar({ state, onImport }) {
  return (
    <nav style={{
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-primary)',
      padding: '12px 0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      transition: 'background-color 0.3s ease, border-color 0.3s ease'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1200px',
        padding: '0 24px'
      }}>
        <Link to="/" style={{
          color: 'var(--text-primary)',
          textDecoration: 'none',
          fontSize: '20px',
          fontWeight: 'bold',
          transition: 'color 0.3s ease'
        }}>
          📋 Tamasha Boards
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <ExportImport state={state} onImport={onImport} />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}

