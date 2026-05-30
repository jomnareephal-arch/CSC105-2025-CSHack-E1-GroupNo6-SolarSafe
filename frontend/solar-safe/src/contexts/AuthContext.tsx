import { createContext, useContext, useState, type ReactNode } from 'react'

interface AuthContextType {
  token: string | null
  username: string | null
  login: (token: string, username: string) => void
  logout: () => void
  isLoggedIn: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ss_token'))
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem('ss_username'))

  function login(token: string, username: string) {
    localStorage.setItem('ss_token', token)
    localStorage.setItem('ss_username', username)
    setToken(token)
    setUsername(username)
  }

  function logout() {
    localStorage.removeItem('ss_token')
    localStorage.removeItem('ss_username')
    setToken(null)
    setUsername(null)
  }

  return (
    <AuthContext.Provider value={{ token, username, login, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
