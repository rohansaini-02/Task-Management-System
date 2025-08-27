import { useContext } from 'react'
import { BoardsContext } from '../components/BoardsContext'

export function useBoards() {
  const ctx = useContext(BoardsContext)
  if (!ctx) throw new Error('useBoards must be used within BoardsProvider')
  return ctx
}
