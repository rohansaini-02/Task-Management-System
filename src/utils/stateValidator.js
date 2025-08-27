// State validation utility
export function validateStateShape(data) {
  // Check if data is an object
  if (!data || typeof data !== 'object') {
    return { isValid: false, error: 'Invalid data format: must be an object' }
  }

  // Check for required top-level properties
  const requiredProps = ['boards', 'lists', 'cards']
  for (const prop of requiredProps) {
    if (!(prop in data)) {
      return { isValid: false, error: `Missing required property: ${prop}` }
    }
    if (!Array.isArray(data[prop])) {
      return { isValid: false, error: `Property ${prop} must be an array` }
    }
  }

  // Validate boards structure
  for (const board of data.boards) {
    if (!board.id || !board.name || !Array.isArray(board.lists)) {
      return { isValid: false, error: 'Invalid board structure: missing id, name, or lists array' }
    }
  }

  // Validate lists structure
  for (const list of data.lists) {
    if (!list.id || !list.name || !Array.isArray(list.cardOrder)) {
      return { isValid: false, error: 'Invalid list structure: missing id, name, or cardOrder array' }
    }
  }

  // Validate cards structure
  for (const card of data.cards) {
    if (!card.id || !card.title || typeof card.createdAt !== 'number') {
      return { isValid: false, error: 'Invalid card structure: missing id, title, or createdAt' }
    }
  }

  return { isValid: true, error: null }
}

// Export state as JSON
export function exportState(state) {
  const exportData = {
    boards: state.boards,
    lists: state.lists,
    cards: state.cards,
    activeBoardId: state.activeBoardId,
    exportedAt: new Date().toISOString(),
    version: '1.0.0'
  }

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json'
  })

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `tamasha-boards-backup-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Import state from JSON
export function importState(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        const validation = validateStateShape(data)
        
        if (!validation.isValid) {
          reject(new Error(validation.error))
          return
        }

        // Extract the state data (remove metadata)
        const stateData = {
          boards: data.boards,
          lists: data.lists,
          cards: data.cards,
          activeBoardId: data.activeBoardId || null
        }

        resolve(stateData)
      } catch {
        reject(new Error('Invalid JSON file'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsText(file)
  })
}
