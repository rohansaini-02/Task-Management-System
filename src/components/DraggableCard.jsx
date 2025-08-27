import { memo } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const DraggableCard = memo(function DraggableCard({ id, listId, index, title, description, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id, 
    data: { listId, index, card: { id, title, description } } 
  })

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    textAlign: 'left',
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border-primary)',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '8px',
    color: 'var(--text-primary)',
    cursor: 'grab',
    width: '100%',
    outline: 'none'
  }

  return (
    <button
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      {...attributes}
      {...listeners}
      role="button"
      tabIndex={0}
      aria-label={`Card: ${title}${description ? `. ${description}` : ''}. Click to edit.`}
      onFocus={(e) => {
        e.target.style.outline = '2px solid var(--accent-primary)'
        e.target.style.outlineOffset = '2px'
        e.target.style.borderColor = 'var(--accent-primary)'
      }}
      onBlur={(e) => {
        e.target.style.outline = 'none'
        e.target.style.borderColor = 'var(--border-primary)'
      }}
      onMouseEnter={(e) => {
        if (!isDragging) {
          e.target.style.borderColor = 'var(--accent-primary)'
          e.target.style.transform = 'translateY(-1px)'
          e.target.style.boxShadow = '0 2px 8px var(--shadow-primary)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isDragging) {
          e.target.style.borderColor = 'var(--border-primary)'
          e.target.style.transform = 'translateY(0)'
          e.target.style.boxShadow = 'none'
        }
      }}
    >
      <div style={{ 
        fontWeight: '600',
        fontSize: '14px',
        lineHeight: '1.4',
        marginBottom: description ? '4px' : '0'
      }}>
        {title}
      </div>
      {description && (
        <div style={{ 
          fontSize: '13px', 
          color: 'var(--text-secondary)', 
          lineHeight: '1.3',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {description}
        </div>
      )}
    </button>
  )
})

export default DraggableCard
