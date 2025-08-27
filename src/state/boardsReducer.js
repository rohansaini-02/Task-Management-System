import { createId } from '../utils/id'

export const initialBoardsState = {
  boards: [
    {
      id: createId('board'),
      name: 'My First Board',
      lists: [
        { 
          id: createId('list'), 
          name: 'To Do', 
          cardOrder: [],
          cards: [] 
        },
        { 
          id: createId('list'), 
          name: 'In Progress', 
          cardOrder: [],
          cards: [] 
        },
        { 
          id: createId('list'), 
          name: 'Done', 
          cardOrder: [],
          cards: [] 
        },
      ],
    },
  ],
  activeBoardId: null
}

export function boardsReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload
    
    case 'ADD_BOARD': {
      const newBoard = {
        id: createId('board'),
        name: action.name,
        lists: [
          { 
            id: createId('list'), 
            name: 'To Do', 
            cardOrder: [],
            cards: [] 
          },
          { 
            id: createId('list'), 
            name: 'In Progress', 
            cardOrder: [],
            cards: [] 
          },
          { 
            id: createId('list'), 
            name: 'Done', 
            cardOrder: [],
            cards: [] 
          },
        ],
      }
      return { 
        ...state, 
        boards: [...state.boards, newBoard],
        activeBoardId: newBoard.id
      }
    }
    
    case 'DELETE_BOARD': {
      const newBoards = state.boards.filter(b => b.id !== action.boardId)
      let newActiveBoardId = state.activeBoardId
      
      if (state.activeBoardId === action.boardId) {
        newActiveBoardId = newBoards.length > 0 ? newBoards[0].id : null
      }
      
      return { 
        ...state, 
        boards: newBoards,
        activeBoardId: newActiveBoardId
      }
    }
    
    case 'RENAME_BOARD': {
      return {
        ...state,
        boards: state.boards.map(board =>
          board.id === action.boardId
            ? { ...board, name: action.name }
            : board
        )
      }
    }
    
    case 'SET_ACTIVE_BOARD': {
      return {
        ...state,
        activeBoardId: action.id
      }
    }
    
    case 'ADD_LIST': {
      return {
        ...state,
        boards: state.boards.map(board =>
          board.id === action.boardId
            ? { 
                ...board, 
                lists: [...board.lists, { 
                  id: createId('list'), 
                  name: action.name, 
                  cardOrder: [],
                  cards: [] 
                }] 
              }
            : board
        )
      }
    }
    
    case 'DELETE_LIST': {
      return {
        ...state,
        boards: state.boards.map(board =>
          board.id === action.boardId
            ? { ...board, lists: board.lists.filter(list => list.id !== action.listId) }
            : board
        )
      }
    }
    
    case 'RENAME_LIST': {
      return {
        ...state,
        boards: state.boards.map(board =>
          board.id === action.boardId
            ? {
                ...board,
                lists: board.lists.map(list =>
                  list.id === action.listId
                    ? { ...list, name: action.name }
                    : list
                )
              }
            : board
        )
      }
    }

    case 'MOVE_LIST': {
      const { boardId, sourceIndex, destinationIndex } = action
      return {
        ...state,
        boards: state.boards.map(board => {
          if (board.id !== boardId) return board
          const lists = [...board.lists]
          const [moved] = lists.splice(sourceIndex, 1)
          const insertAt = Math.min(Math.max(destinationIndex, 0), lists.length)
          lists.splice(insertAt, 0, moved)
          return { ...board, lists }
        })
      }
    }
    
    case 'ADD_CARD': {
      const newCard = {
        id: createId('card'),
        title: action.title,
        description: action.description,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      
      return {
        ...state,
        boards: state.boards.map(board =>
          board.id === action.boardId
            ? {
                ...board,
                lists: board.lists.map(list =>
                  list.id === action.listId
                    ? { 
                        ...list, 
                        cards: [...list.cards, newCard],
                        cardOrder: [...list.cardOrder, newCard.id]
                      }
                    : list
                )
              }
            : board
        )
      }
    }
    
    case 'DELETE_CARD': {
      return {
        ...state,
        boards: state.boards.map(board =>
          board.id === action.boardId
            ? {
                ...board,
                lists: board.lists.map(list =>
                  list.id === action.listId
                    ? { 
                        ...list, 
                        cards: list.cards.filter(card => card.id !== action.cardId),
                        cardOrder: list.cardOrder.filter(id => id !== action.cardId)
                      }
                    : list
                )
              }
            : board
        )
      }
    }
    
    case 'UPDATE_CARD': {
      return {
        ...state,
        boards: state.boards.map(board =>
          board.id === action.boardId
            ? {
                ...board,
                lists: board.lists.map(list =>
                  list.id === action.listId
                    ? {
                        ...list,
                        cards: list.cards.map(card =>
                          card.id === action.cardId
                            ? { 
                                ...card, 
                                ...action.updates,
                                updatedAt: Date.now()
                              }
                            : card
                        )
                      }
                    : list
                )
              }
            : board
        )
      }
    }
    
    case 'MOVE_CARD': {
      const { boardId, sourceListId, destinationListId, cardId, destinationIndex } = action
      if (!boardId || !sourceListId || !destinationListId || !cardId || destinationIndex == null) return state

      return {
        ...state,
        boards: state.boards.map(board => {
          if (board.id !== boardId) return board

          const lists = board.lists.map(list => ({ ...list, cards: [...list.cards], cardOrder: [...list.cardOrder] }))

          const source = lists.find(l => l.id === sourceListId)
          const destination = lists.find(l => l.id === destinationListId)
          if (!source || !destination) return board

          const srcIndexInOrder = source.cardOrder.indexOf(cardId)
          if (srcIndexInOrder === -1) return board
          source.cardOrder.splice(srcIndexInOrder, 1)

          const cardObj = source.cards.find(c => c.id === cardId)
          source.cards = source.cards.filter(c => c.id !== cardId)

          const insertIndex = Math.min(Math.max(destinationIndex, 0), destination.cardOrder.length)
          destination.cardOrder.splice(insertIndex, 0, cardId)

          const destHasCard = destination.cards.some(c => c.id === cardId)
          if (!destHasCard && cardObj) {
            destination.cards.splice(insertIndex, 0, cardObj)
          } else if (destHasCard) {
            destination.cards = destination.cardOrder.map(id => destination.cards.find(c => c.id === id)).filter(Boolean)
          }

          return { ...board, lists }
        })
      }
    }
    
    case 'MOVE_BOARD': {
      const { oldIndex, newIndex } = action
      const newBoards = [...state.boards]
      const [movedBoard] = newBoards.splice(oldIndex, 1)
      newBoards.splice(newIndex, 0, movedBoard)
      return { ...state, boards: newBoards }
    }

    case 'IMPORT_STATE': {
      const { boards, lists, cards, activeBoardId } = action.payload
      return {
        ...state,
        boards: boards || [],
        lists: lists || [],
        cards: cards || [],
        activeBoardId: activeBoardId || null
      }
    }

    default:
      return state
  }
}
