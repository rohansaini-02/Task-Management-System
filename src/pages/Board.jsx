import { useMemo, useState, useRef, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useBoards } from '../hooks/useBoards'
import Modal from '../components/Modal'
import SortableList from '../components/SortableList'
import DraggableCard from '../components/DraggableCard'
import AddCardComposer from '../components/AddCardComposer'
import SearchBar from '../components/SearchBar'
import EmptyState from '../components/EmptyState'
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, horizontalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function Board() {
  const { boardId } = useParams()
  const { state, dispatch } = useBoards()
  const board = state.boards.find(b => b.id === boardId)

  const [showNewList, setShowNewList] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [editingListId, setEditingListId] = useState(null)
  const [editingName, setEditingName] = useState('')

  // Card modal state
  const [activeCard, setActiveCard] = useState(null) // { listId, cardId }
  const [cardTitle, setCardTitle] = useState('')
  const [cardDescription, setCardDescription] = useState('')
  const titleInputRef = useRef(null)

  // Search state
  const [searchQuery, setSearchQuery] = useState('')

  // Prevent DnD keyboard sensor from hijacking keys in inputs
  const stopDndKey = (e) => {
    e.stopPropagation()
  }

  // DnD state
  const [draggingCard, setDraggingCard] = useState(null) // { listId, card }

  // Build sensors, disabling KeyboardSensor while modal is open
  const pointer = useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  const keyboard = useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  const sensors = useSensors(...(activeCard ? [pointer] : [pointer, keyboard]))

  // Move all hooks to top level before any conditional returns
  const existingNames = useMemo(() => {
    if (!board) return new Set()
    return new Set(board.lists.map(l => l.name.trim().toLowerCase()))
  }, [board])

  const isValidNew = useMemo(() => {
    if (!board) return false
    const v = newListName.trim().toLowerCase()
    return v.length > 0 && !existingNames.has(v)
  }, [newListName, existingNames, board])

  const isValidEdit = useMemo(() => {
    if (!board) return false
    const v = editingName.trim().toLowerCase()
    if (v.length === 0) return false
    const others = board.lists.filter(l => l.id !== editingListId).map(l => l.name.trim().toLowerCase())
    return !others.includes(v)
  }, [editingName, editingListId, board])

  // Search filtering logic
  const filteredLists = useMemo(() => {
    if (!board) return []

    if (!searchQuery) {
      return board.lists
    }

    const q = searchQuery.toLowerCase()
    return board.lists.filter(list => list.name.toLowerCase().includes(q))
  }, [board, searchQuery])

  useEffect(() => {
    if (activeCard && titleInputRef.current) {
      titleInputRef.current.focus()
      titleInputRef.current.select()
    }
  }, [activeCard])

  if (!board) {
    return (
      <main className="container">
        <div className="spacer" />
        <p>Board not found.</p>
        <Link 
          to="/" 
          style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '6px',
            background: 'var(--bg-secondary)',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            border: '1px solid var(--border-primary)',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--accent-primary)'
            e.target.style.color = 'white'
            e.target.style.borderColor = 'var(--accent-primary)'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'var(--bg-secondary)'
            e.target.style.color = 'var(--text-secondary)'
            e.target.style.borderColor = 'var(--border-primary)'
          }}
        >
          ← Back
        </Link>
      </main>
    )
  }

  // Add missing function definitions
  function handleAddList(e) {
    e.preventDefault()
    if (!isValidNew) return
    dispatch({ type: 'ADD_LIST', boardId, name: newListName.trim() })
    setNewListName('')
    setShowNewList(false)
  }

  function handleStartRename(list) {
    setEditingListId(list.id)
    setEditingName(list.name)
  }

  function handleSaveRename(e) {
    e.preventDefault()
    if (!isValidEdit) return
    dispatch({ type: 'RENAME_LIST', boardId, listId: editingListId, name: editingName.trim() })
    setEditingListId(null)
    setEditingName('')
  }

  function handleCancelRename() {
    setEditingListId(null)
    setEditingName('')
  }

  function handleDeleteList(listId, name) {
    const ok = confirm(`Delete list "${name}"? All cards will be removed.`)
    if (!ok) return
    dispatch({ type: 'DELETE_LIST', boardId, listId })
  }

  // Search handler
  function handleSearch(query) {
    setSearchQuery(query)
  }

  const buttonBase = {
    padding: '6px 10px',
    borderRadius: 6,
    border: '1px solid #374151',
    background: '#1f2937',
    color: '#e5e7eb',
    cursor: 'pointer'
  }

  const buttonDanger = {
    ...buttonBase,
    border: '1px solid #7f1d1d',
    background: '#3f1d1d',
    color: '#fca5a5'
  }

  // Card helpers
  function openCard(listId, card) {
    setActiveCard({ listId, cardId: card.id })
    setCardTitle(card.title)
    setCardDescription(card.description || '')
  }

  function closeCard() {
    setActiveCard(null)
    setCardTitle('')
    setCardDescription('')
  }

  function saveCard() {
    if (!cardTitle.trim()) return
    dispatch({ type: 'UPDATE_CARD', boardId, listId: activeCard.listId, cardId: activeCard.cardId, updates: { title: cardTitle.trim(), description: cardDescription } })
    closeCard()
  }

  function deleteCard() {
    const ok = confirm('Delete this card?')
    if (!ok) return
    dispatch({ type: 'DELETE_CARD', boardId, listId: activeCard.listId, cardId: activeCard.cardId })
    closeCard()
  }

  // DnD handlers
  function handleDragStart(event) {
    const { active } = event
    if (active.data.current?.type === 'list') {
      // setDraggingListId(active.id) // This line was removed
    } else {
      const { listId, card } = active.data.current || {}
      if (card) setDraggingCard({ listId, card })
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event
    setDraggingCard(null)
    // setDraggingListId(null) // This line was removed
    if (!over) return

    // List reorder
    if (active.data.current?.type === 'list' && over.data.current?.type === 'list') {
      const from = active.data.current.index
      const to = over.data.current.index
      if (from !== to) {
        dispatch({ type: 'MOVE_LIST', boardId, sourceIndex: from, destinationIndex: to })
      }
      return
    }

    // Card reorder/move
    const { listId: sourceListId, card } = active.data.current || {}
    if (!card) return

    let destinationListId
    let destinationIndex
    if (over.data.current?.type === 'list') {
      destinationListId = over.id
      const destList = board.lists.find(l => l.id === destinationListId)
      destinationIndex = destList ? destList.cardOrder.length : 0
    } else {
      destinationListId = over.data.current?.listId
      destinationIndex = over.data.current?.index
    }

    if (!sourceListId || !destinationListId || destinationIndex == null) return
    if (sourceListId === destinationListId && active.id === over.id) return

    dispatch({ type: 'MOVE_CARD', boardId, sourceListId, destinationListId, cardId: card.id, destinationIndex })
  }

  return (
    <main className="container" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="spacer" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 4 }}>
        <Link 
          to="/" 
          style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 10px',
            borderRadius: '6px',
            background: 'var(--bg-secondary)',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            border: '1px solid var(--border-primary)',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
          aria-label="Back to Dashboard"
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--accent-primary)'
            e.target.style.color = 'white'
            e.target.style.borderColor = 'var(--accent-primary)'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'var(--bg-secondary)'
            e.target.style.color = 'var(--text-secondary)'
            e.target.style.borderColor = 'var(--border-primary)'
          }}
        >
          ←
        </Link>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: 0.3 }}>{board.name}</h1>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: 16 }}>
        <SearchBar onSearch={handleSearch} placeholder="Search lists by name..." />
      </div>

      <div style={{ position: 'sticky', top: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(6px)', padding: '8px 0', zIndex: 1 }}>
        {showNewList ? (
          <div style={{ width: '100%', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 10, padding: 12 }}>
            <form aria-label="Add list" onSubmit={handleAddList}>
              <label htmlFor="new-list-name" className="sr-only">List name</label>
              <input
                id="new-list-name"
                aria-label="List name"
                autoFocus
                placeholder="List name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyDownCapture={stopDndKey}
                style={{ width: '100%', padding: '8px 10px', marginBottom: 12, borderRadius: 6, border: '1px solid #374151', background: '#0f172a', color: '#e5e7eb' }}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="submit" disabled={!isValidNew} style={buttonBase}>Add List</button>
                <button type="button" onClick={() => { setShowNewList(false); setNewListName('') }} style={buttonBase}>Cancel</button>
              </div>
            </form>
          </div>
        ) : (
          <button
            aria-label="New list"
            onClick={() => setShowNewList(true)}
            style={{ width: '100%', height: 48, background: 'transparent', border: '2px dashed #374151', borderRadius: 10, color: '#9ca3af', cursor: 'pointer' }}
          >
            + New List
          </button>
        )}
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <SortableContext items={filteredLists.map(l => l.id)} strategy={horizontalListSortingStrategy}>
          <section aria-label="Lists" style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
            {filteredLists.length === 0 && searchQuery ? (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '200px',
                width: '100%'
              }}>
                <EmptyState 
                  type="search" 
                  message={`No lists found matching "${searchQuery}"`}
                  icon="🔍"
                />
              </div>
            ) : (
              filteredLists.map((list, listIndex) => (
                <SortableList key={list.id} id={list.id} index={listIndex}>
                  <div style={{ minWidth: 320, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 10, padding: 12 }}>
                    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      {editingListId === list.id ? (
                        <form onSubmit={handleSaveRename} style={{ display: 'flex', gap: 8, alignItems: 'center', width: '100%' }}>
                          <label htmlFor={`rename-${list.id}`} className="sr-only">List name</label>
                          <input
                            id={`rename-${list.id}`}
                            aria-label="List name"
                            autoFocus
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDownCapture={stopDndKey}
                            style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: '1px solid #374151', background: '#0f172a', color: '#e5e7eb' }}
                          />
                          <button type="submit" disabled={!isValidEdit} style={buttonBase}>Save</button>
                          <button type="button" onClick={handleCancelRename} style={buttonBase}>Cancel</button>
                        </form>
                      ) : (
                        <>
                          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{list.name}</h3>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button aria-label={`Rename list ${list.name}`} onClick={() => handleStartRename(list)} style={buttonBase}>Rename</button>
                            <button aria-label={`Delete list ${list.name}`} onClick={() => handleDeleteList(list.id, list.name)} style={buttonDanger}>Delete</button>
                          </div>
                        </>
                      )}
                    </header>

                    <AddCardComposer onAdd={(title) => dispatch({ type: 'ADD_CARD', boardId, listId: list.id, title: title.trim() })} />

                    {(() => {
                      const orderedCards = (list.cardOrder.length ? list.cardOrder.map(id => list.cards.find(c => c.id === id)) : list.cards).filter(Boolean)
                      return (
                        <SortableContext items={orderedCards.map(c => c.id)} strategy={verticalListSortingStrategy}>
                          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 8 }}>
                            {orderedCards.length === 0 ? (
                              <p style={{ color: '#9ca3af', fontSize: 14, textAlign: 'left', margin: '8px 0' }}>No cards yet</p>
                            ) : (
                              orderedCards.map((card, index) => (
                                <DraggableCard
                                  key={card.id}
                                  id={card.id}
                                  listId={list.id}
                                  index={index}
                                  title={card.title}
                                  description={card.description}
                                  onClick={() => openCard(list.id, card)}
                                />
                              ))
                            )}
                          </div>
                        </SortableContext>
                      )
                    })()}
                  </div>
                </SortableList>
              ))
            )}
          </section>
        </SortableContext>

        <DragOverlay>
          {draggingCard ? (
            <div style={{ textAlign: 'left', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 8, padding: 10, color: 'var(--text-primary)', cursor: 'grabbing', boxShadow: '0 10px 30px var(--shadow-primary)' }}>
              <div style={{ fontWeight: 600 }}>{draggingCard.card.title}</div>
              {draggingCard.card.description && (
                <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{draggingCard.card.description}</div>
              )}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <Modal
        isOpen={!!activeCard}
        onClose={closeCard}
        title="Edit Card"
        footer={[
          <button key="save" data-default onClick={saveCard} style={buttonBase} aria-label="Save card">Save</button>,
          <button key="delete" onClick={deleteCard} style={buttonDanger} aria-label="Delete card">Delete</button>,
          <button key="cancel" onClick={closeCard} style={buttonBase} aria-label="Close">Cancel</button>
        ]}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label htmlFor="card-title">Title</label>
          <input
            id="card-title"
            ref={titleInputRef}
            value={cardTitle}
            onChange={(e) => setCardTitle(e.target.value)}
            onKeyDownCapture={stopDndKey}
            onKeyDown={(e) => e.stopPropagation()}
            onKeyPress={(e) => e.stopPropagation()}
            onKeyUp={(e) => e.stopPropagation()}
            placeholder="Card title"
            aria-label="Card title"
            required
            style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border-primary)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
          />
          <label htmlFor="card-desc">Description</label>
          <textarea
            id="card-desc"
            value={cardDescription}
            onChange={(e) => setCardDescription(e.target.value)}
            onKeyDownCapture={stopDndKey}
            onKeyDown={(e) => e.stopPropagation()}
            onKeyPress={(e) => e.stopPropagation()}
            onKeyUp={(e) => e.stopPropagation()}
            placeholder="Optional description"
            aria-label="Card description"
            rows={5}
            style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border-primary)', background: 'var(--bg-primary)', color: 'var(--text-primary)', resize: 'vertical' }}
          />
        </div>
      </Modal>
    </main>
  )
}


