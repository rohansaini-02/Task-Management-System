import { memo } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const BoardCard = memo(function BoardCard({ 
  board, 
  isEditing, 
  editingName, 
  onNameChange, 
  onStartEdit, 
  onSaveEdit, 
  onCancelEdit, 
  onOpen, 
  onDelete 
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: board.id })
  
  const truncateTitle = (title, maxLength = 18) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isEditing) {
      e.preventDefault()
      onOpen()
    }
    if (e.key === 'Escape' && isEditing) {
      e.preventDefault()
      onCancelEdit()
    }
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    position: 'relative'
  }

  return (
    <article
      ref={setNodeRef}
      style={style}
      role="button"
      tabIndex={0}
      aria-label={`Board: ${board.name}. Click to open, or use edit and delete buttons.`}
      onKeyDown={handleKeyDown}
    >
      <div 
        className="board-card"
        onClick={(e) => {
          if (isDragging || e.target.closest('button')) {
            return
          }
          onOpen()
        }}
      >
        {isEditing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onSaveEdit()
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            <input
              type="text"
              value={editingName}
              onChange={(e) => onNameChange(e.target.value)}
              onKeyDown={(e) => {
                e.stopPropagation()
                if (e.key === 'Escape') {
                  onCancelEdit()
                }
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-primary)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '16px',
                fontWeight: '600',
                outline: 'none'
              }}
              aria-label="Edit board name"
              autoFocus
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="submit"
                className="btn btn-primary"
                aria-label="Save board name"
              >
                Save
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onCancelEdit()
                }}
                className="btn"
                aria-label="Cancel editing board name"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* Control buttons - positioned at the top */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onStartEdit()
                  }}
                  aria-label={`Edit board name: ${board.name}`}
                  className="icon-btn"
                >
                  ✏️
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete()
                  }}
                  aria-label={`Delete board: ${board.name}`}
                  className="icon-btn icon-btn--danger"
                >
                  🗑️
                </button>
              </div>

              {/* Drag handle - only this element has drag listeners */}
              <div
                style={{
                  cursor: 'grab',
                  fontSize: '16px',
                  color: 'var(--text-muted)',
                  padding: '4px',
                  userSelect: 'none'
                }}
                {...attributes}
                {...listeners}
                aria-label="Drag to reorder board"
              >
                ⋮⋮
              </div>
            </div>

            {/* Board title */}
            <h3 className="board-card__title" title={board.name}>
              {truncateTitle(board.name)}
            </h3>

            {/* Board stats */}
            <div style={{
              fontSize: '14px',
              color: 'var(--text-muted)',
              marginTop: 'auto'
            }}>
              {board.lists.length} list{board.lists.length !== 1 ? 's' : ''} • {
                board.lists.reduce((total, list) => total + (list.cards?.length || 0), 0)
              } card{board.lists.reduce((total, list) => total + (list.cards?.length || 0), 0) !== 1 ? 's' : ''}
            </div>
          </>
        )}
      </div>
    </article>
  )
})

export default BoardCard
