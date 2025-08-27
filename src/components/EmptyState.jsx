export default function EmptyState({ type = "default", message, icon = "📋" }) {
  const defaultMessages = {
    default: "No items to display",
    search: "No cards found matching your search",
    cards: "No cards in this list yet",
    lists: "No lists in this board yet"
  }

  const displayMessage = message || defaultMessages[type] || defaultMessages.default

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      color: '#9ca3af',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>
        {icon}
      </div>
      <p style={{ 
        margin: 0, 
        fontSize: '14px', 
        lineHeight: '1.5',
        maxWidth: '300px'
      }}>
        {displayMessage}
      </p>
    </div>
  )
}
