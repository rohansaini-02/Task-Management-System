import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.scss'
import App from './App.jsx'
import { BoardsProvider } from './components/BoardsContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BoardsProvider>
      <App />
    </BoardsProvider>
  </StrictMode>,
)
