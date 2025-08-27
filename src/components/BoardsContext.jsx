import { createContext, useEffect, useMemo, useReducer, useRef } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { initialBoardsState, boardsReducer } from '../state/boardsReducer'

const BoardsContext = createContext(null)

export function BoardsProvider({ children }) {
  const [persisted, setPersisted] = useLocalStorage('tamasha.boards-state', initialBoardsState)
  const [state, dispatch] = useReducer(boardsReducer, persisted)
  const saveTimeoutRef = useRef(null)

  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      setPersisted(state)
    }, 300)
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [state, setPersisted])

  useEffect(() => {
    if (persisted && Object.keys(persisted).length > 0) {
      dispatch({ type: 'HYDRATE', payload: persisted })
    }
  }, [persisted])

  const value = useMemo(() => ({ state, dispatch }), [state])

  return <BoardsContext.Provider value={value}>{children}</BoardsContext.Provider>
}

// Export the context for useBoards hook to use
export { BoardsContext }


