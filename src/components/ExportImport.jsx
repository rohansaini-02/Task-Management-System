import { useState, useRef } from 'react'
import { exportState, importState } from '../utils/stateValidator'

export default function ExportImport({ state, onImport }) {
  const [isImporting, setIsImporting] = useState(false)
  const [importError, setImportError] = useState('')
  const fileInputRef = useRef(null)

  const handleExport = () => {
    try {
      exportState(state)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    }
  }

  const handleImport = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setIsImporting(true)
    setImportError('')

    try {
      const importedState = await importState(file)

      // Show confirmation dialog
      const confirmed = confirm(
        `Import will replace all current data with ${importedState.boards.length} boards, ${importedState.lists.length} lists, and ${importedState.cards.length} cards. This cannot be undone. Continue?`
      )

      if (confirmed) {
        onImport(importedState)
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    } catch (error) {
      setImportError(error.message)
    } finally {
      setIsImporting(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }}>
      {/* Export Button */}
      <button
        onClick={handleExport}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 12px',
          borderRadius: '6px',
          border: '1px solid var(--border-primary)',
          background: 'var(--bg-tertiary)',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          fontSize: '13px',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'var(--border-primary)'
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'var(--bg-tertiary)'
        }}
      >
        📤 Export
      </button>

      {/* Import Button */}
      <button
        onClick={triggerFileInput}
        disabled={isImporting}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 12px',
          borderRadius: '6px',
          border: '1px solid var(--border-primary)',
          background: isImporting ? 'var(--border-secondary)' : 'var(--bg-tertiary)',
          color: isImporting ? 'var(--text-muted)' : 'var(--text-primary)',
          cursor: isImporting ? 'not-allowed' : 'pointer',
          fontSize: '13px',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          if (!isImporting) {
            e.target.style.background = 'var(--border-primary)'
          }
        }}
        onMouseLeave={(e) => {
          if (!isImporting) {
            e.target.style.background = 'var(--bg-tertiary)'
          }
        }}
      >
        {isImporting ? '⏳ Importing...' : '📥 Import'}
      </button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        style={{ display: 'none' }}
      />

      {/* Error message */}
      {importError && (
        <div style={{
          padding: '4px 8px',
          background: 'var(--danger-secondary)',
          border: '1px solid var(--danger-primary)',
          borderRadius: '4px',
          color: 'var(--danger-primary)',
          fontSize: '12px',
          whiteSpace: 'nowrap'
        }}>
          ❌ {importError}
        </div>
      )}
    </div>
  )
}
