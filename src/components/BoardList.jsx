export default function BoardList({ children }) {
  return (
    <section className="board-list" role="region" aria-label="Boards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
      {children}
    </section>
  )
}
