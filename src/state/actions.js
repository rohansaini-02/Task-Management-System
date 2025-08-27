// Action creators for boards, lists, and tasks
// This file contains all the action creators used by the boardsReducer

export const hydrateState = (state) => ({
  type: 'HYDRATE',
  payload: state
})

export const addBoard = (name) => ({
  type: 'ADD_BOARD',
  name
})

export const deleteBoard = (id) => ({
  type: 'DELETE_BOARD',
  id
})

export const renameBoard = (id, name) => ({
  type: 'RENAME_BOARD',
  id,
  name
})

export const setActiveBoard = (id) => ({
  type: 'SET_ACTIVE_BOARD',
  id
})

export const addList = (boardId, name) => ({
  type: 'ADD_LIST',
  boardId,
  name
})

export const deleteList = (boardId, listId) => ({
  type: 'DELETE_LIST',
  boardId,
  listId
})

export const renameList = (boardId, listId, name) => ({
  type: 'RENAME_LIST',
  boardId,
  listId,
  name
})

export const addCard = (boardId, listId, title, description = '') => ({
  type: 'ADD_CARD',
  boardId,
  listId,
  title,
  description
})

export const deleteCard = (boardId, listId, cardId) => ({
  type: 'DELETE_CARD',
  boardId,
  listId,
  cardId
})

export const updateCard = (boardId, listId, cardId, updates) => ({
  type: 'UPDATE_CARD',
  boardId,
  listId,
  cardId,
  updates
})

export const moveCard = (boardId, sourceListId, destinationListId, cardId, newIndex) => ({
  type: 'MOVE_CARD',
  boardId,
  sourceListId,
  destinationListId,
  cardId,
  newIndex
})

export const MOVE_BOARD = 'MOVE_BOARD'
export const moveBoard = (oldIndex, newIndex) => ({
  type: MOVE_BOARD,
  oldIndex,
  newIndex
})
