import { useState, useRef, useEffect } from 'react'

export default function AddCardComposer({ onAdd }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  const valid = title.trim().length > 0

  const buttonBase = {
    padding: '6px 10px',
    borderRadius: 6,
    border: '1px solid #374151',
    background: '#1f2937',
    color: '#e5e7eb',
    cursor: 'pointer'
  }

  function submit(e) {
    e.preventDefault()
    if (!valid) return
    onAdd(title)
    setTitle('')
    setOpen(false)
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} aria-label="Add card" style={{ ...buttonBase, width: '100%', background: 'transparent', border: '1px dashed #374151', color: '#9ca3af', padding: '8px 10px', borderRadius: 8 }}>+ Add card</button>
    )
  }

  return (
    <form onSubmit={submit} aria-label="Add card" style={{ display: 'flex', gap: 8, width: '100%', marginBottom: 8 }}>
      <input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDownCapture={(e) => e.stopPropagation()}
        placeholder="Card title"
        aria-label="Card title"
        style={{ flex: 1, padding: '8px 10px', borderRadius: 6, border: '1px solid #374151', background: '#0f172a', color: '#e5e7eb' }}
      />
      <button type="submit" disabled={!valid} style={buttonBase}>Add</button>
      <button type="button" onClick={() => { setOpen(false); setTitle('') }} style={buttonBase}>Cancel</button>
    </form>
  )
}
