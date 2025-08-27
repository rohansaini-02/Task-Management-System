import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Board from './pages/Board'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useBoards } from './hooks/useBoards'

export default function App() {
  const { state, dispatch } = useBoards()

  const handleImport = (importedState) => {
    dispatch({ type: 'IMPORT_STATE', payload: importedState })
  }

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        {/* Dashboard Heading - Above Navbar */}
        <div style={{
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-primary)',
          padding: '16px 24px',
          textAlign: 'center'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '28px',
            fontWeight: '700',
            color: 'var(--heading-color)',
            letterSpacing: '0.5px',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease'
          }}>
            Dashboard
          </h1>
        </div>
        
        <Navbar state={state} onImport={handleImport} />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/b/:boardId" element={<Board />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
