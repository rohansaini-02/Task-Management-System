import { useState, useEffect, useRef } from 'react'

export default function SearchBar({ onSearch, placeholder = "Search cards..." }) {
  const [query, setQuery] = useState('')
  const debounceRef = useRef(null)

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    
    debounceRef.current = setTimeout(() => {
      onSearch(query.trim().toLowerCase())
    }, 300)
    
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query, onSearch])

  return (
    <div className="search">
      <input
        className="search__input"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label="Search cards"
      />
      <div className="search__icon">🔍</div>
      {query && (
        <button
          className="search__clear"
          onClick={() => setQuery('')}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  )
}
