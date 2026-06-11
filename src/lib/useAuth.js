import { useEffect, useState } from 'react'
import { watchAuth } from './firebase.js'

// Liefert den aktuellen Auth-Status (Firebase-User oder null).
export default function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = watchAuth((u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  return { user, loading }
}
