import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { me, login as apiLogin, register as apiRegister, logout as apiLogout } from '../api'
import type { User } from '../types'

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    me()
      .then(res => {
        if (res.authenticated && res.id && res.username) {
          setUser({ id: res.id, username: res.username })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const login = async (username: string, password: string) => {
    const u = await apiLogin(username, password)
    setUser(u)
  }

  const register = async (username: string, password: string) => {
    const u = await apiRegister(username, password)
    setUser(u)
  }

  const logout = async () => {
    await apiLogout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
