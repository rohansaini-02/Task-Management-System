import { useEffect, useRef, useState } from 'react'

export function useLocalStorage(key, defaultValue) {
  const isFirstLoadRef = useRef(true)
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw == null) return defaultValue
      return JSON.parse(raw)
    } catch (err) {
      console.error('Failed to parse localStorage for key', key, err)
      return defaultValue
    }
  })

  useEffect(() => {
    if (isFirstLoadRef.current) {
      isFirstLoadRef.current = false
      // Ensure storage is initialized on first mount
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch (err) {
        console.error('Failed to initialize localStorage for key', key, err)
      }
      return
    }
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.error('Failed to write localStorage for key', key, err)
    }
  }, [key, value])

  return [value, setValue]
}


