import { createContext, useContext, useState, type ReactNode } from 'react'

interface AuthContextType {
  token: string | null
  username: string | null
  role: string | null
  login: (token: string, username: string, role: string) => void
  logout: () => void
  isLoggedIn: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ss_token'))
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem('ss_username'))
  const [role, setRole] = useState<string | null>(() => localStorage.getItem('ss_role'))

  function login(token: string, username: string, role: string) {
    localStorage.setItem('ss_token', token)
    localStorage.setItem('ss_username', username)
    localStorage.setItem('ss_role', role)
    setToken(token)
    setUsername(username)
    setRole(role)
  }

  function logout() {
    localStorage.removeItem('ss_token')
    localStorage.removeItem('ss_username')
    localStorage.removeItem('ss_role')
    setToken(null)
    setUsername(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ token, username, role, login, logout, isLoggedIn: !!token, isAdmin: role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
