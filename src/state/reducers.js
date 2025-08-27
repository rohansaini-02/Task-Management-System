// Reducers file - contains board, list, and task reducers
// This will be used for more granular state management if needed

// Placeholder reducers - main logic is in BoardsContext.jsx
export function boardReducer(state, action) {
  switch (action.type) {
    case 'ADD_BOARD': {
      const newBoard = {
        id: action.id,
        name: action.name,
        lists: []
      }
      return [...state, newBoard]
    }
    case 'DELETE_BOARD': {
      return state.filter(board => board.id !== action.id)
    }
    case 'RENAME_BOARD': {
      return state.map(board =>
        board.id === action.id
          ? { ...board, name: action.name }
          : board
      )
    }
    default:
      return state
  }
}

export function listReducer(state, action) {
  switch (action.type) {
    case 'ADD_LIST': {
      const newList = {
        id: action.id,
        name: action.name,
        cards: []
      }
      return [...state, newList]
    }
    case 'DELETE_LIST': {
      return state.filter(list => list.id !== action.id)
    }
    case 'RENAME_LIST': {
      return state.map(list =>
        list.id === action.id
          ? { ...list, name: action.name }
          : list
      )
    }
    default:
      return state
  }
}

export function taskReducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK': {
      const newTask = {
        id: action.id,
        title: action.title,
        description: action.description
      }
      return [...state, newTask]
    }
    case 'DELETE_TASK': {
      return state.filter(task => task.id !== action.id)
    }
    case 'UPDATE_TASK': {
      return state.map(task =>
        task.id === action.id
          ? { ...task, ...action.updates }
          : task
      )
    }
    default:
      return state
  }
}
