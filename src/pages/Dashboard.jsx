import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import BoardList from '../components/BoardList'
import BoardCard from '../components/BoardCard'
import SearchBar from '../components/SearchBar'
import EmptyState from '../components/EmptyState'
import AddBoardModal from '../components/AddBoardModal'
import { useBoards } from '../hooks/useBoards'

export default function Dashboard() {
  const { state, dispatch } = useBoards()
  const navigate = useNavigate()
  const [showAddModal, setShowAddModal] = useState(false)
  
  // Board editing state
  const [editingBoardId, setEditingBoardId] = useState(null)
  const [editingBoardName, setEditingBoardName] = useState('')

  // Search state
  const [searchQuery, setSearchQuery] = useState('')

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const isValidEdit = useMemo(() => editingBoardName.trim().length > 0, [editingBoardName])

  // Search filtering logic
  const filteredBoards = useMemo(() => {
    if (!searchQuery) {
      return state.boards
    }
    
    return state.boards.filter(board => 
      board.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [state.boards, searchQuery])

  function handleAddBoard(name) {
    dispatch({ type: 'ADD_BOARD', name })
  }

  function onOpenBoard(id) {
    dispatch({ type: 'SET_ACTIVE_BOARD', id })
    navigate(`/b/${id}`)
  }

  function onDeleteBoard(boardId, boardName) {
    const ok = confirm(`Delete board "${boardName}"? This cannot be undone.`)
    if (!ok) return
    dispatch({ type: 'DELETE_BOARD', boardId })
  }

  // Board editing functions
  function startEditBoard(board) {
    setEditingBoardId(board.id)
    setEditingBoardName(board.name)
  }

  function saveBoardEdit() {
    if (!isValidEdit) return
    dispatch({ type: 'RENAME_BOARD', boardId: editingBoardId, name: editingBoardName.trim() })
    setEditingBoardId(null)
    setEditingBoardName('')
  }

  function cancelBoardEdit() {
    setEditingBoardId(null)
    setEditingBoardName('')
  }

  // Search handler
  function handleSearch(query) {
    setSearchQuery(query)
  }

  // DnD handlers
  function handleDragEnd(event) {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = state.boards.findIndex(board => board.id === active.id)
      const newIndex = state.boards.findIndex(board => board.id === over.id)
      
      dispatch({ type: 'MOVE_BOARD', oldIndex, newIndex })
    }
  }

    return (
    <main className="container">
      <div className="spacer" />

      {/* Search and Add New Board Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        gap: '20px'
      }}>
        {/* Search Bar - Left Side */}
        <div style={{ flex: 1, maxWidth: '400px' }}>
          <SearchBar onSearch={handleSearch} placeholder="Search boards by name..." />
        </div>

        {/* Add New Board Button - Right Side */}
        <div style={{ flexShrink: 0 }}>
          <button
            aria-label="New board"
            onClick={() => setShowAddModal(true)}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '2px dashed var(--border-primary)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = 'var(--accent-primary)'
              e.target.style.color = 'var(--accent-primary)'
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'var(--border-primary)'
              e.target.style.color = 'var(--text-secondary)'
            }}
          >
            + New Board
          </button>
        </div>
      </div>

      {/* Boards Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredBoards.map(board => board.id)}
          strategy={verticalListSortingStrategy}
        >
          <BoardList>
            {filteredBoards.length === 0 && searchQuery ? (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '200px',
                width: '100%'
              }}>
                <EmptyState 
                  type="search" 
                  message={`No boards found matching "${searchQuery}"`}
                  icon="📋"
                />
              </div>
            ) : (
              filteredBoards.map((b) => (
                <BoardCard
                  key={b.id}
                  board={b}
                  isEditing={editingBoardId === b.id}
                  editingName={editingBoardName}
                  onNameChange={setEditingBoardName}
                  onStartEdit={() => startEditBoard(b)}
                  onSaveEdit={saveBoardEdit}
                  onCancelEdit={cancelBoardEdit}
                  onOpen={() => onOpenBoard(b.id)}
                  onDelete={() => onDeleteBoard(b.id, b.name)}
                />
              ))
            )}
          </BoardList>
        </SortableContext>
      </DndContext>

      {/* Add Board Modal */}
      <AddBoardModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddBoard}
      />
    </main>
  )
}


