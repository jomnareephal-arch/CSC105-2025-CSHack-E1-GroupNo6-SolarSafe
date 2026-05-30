import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const BASE_URL = 'http://localhost:3000/api'

interface Props {
  onGoSignup: () => void
}

const PersonIcon = () => (
  <svg className="w-5 h-5 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
)

const LockIcon = () => (
  <svg className="w-5 h-5 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
)

const EyeIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const EyeOffIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

export default function LoginPage({ onGoSignup }: Props) {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Login failed'); return }
      login(data.token, data.username, data.role ?? 'user')
    } catch {
      setError('Cannot connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4" style={{ backgroundColor: '#FDF0E8' }}>
      <div className="bg-white rounded-3xl shadow-xl flex flex-col items-center gap-5
                      w-full max-w-sm sm:max-w-md md:max-w-lg
                      px-6 py-10 sm:px-10 sm:py-12">

        {/* Logo */}
        <div className="w-20 h-20 rounded-full shrink-0" style={{ backgroundColor: '#E8884A' }} />

        <div className="text-center">
          <h1 className="text-3xl font-bold" style={{ color: '#1a1a1a' }}>Solar Safe</h1>
          <p className="text-base text-gray-500 mt-1">Login</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          {/* Username */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Username</label>
            <div className="flex items-center border border-gray-200 rounded-2xl px-4 py-3 gap-3 bg-white focus-within:border-orange-400 transition-colors">
              <PersonIcon />
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="flex-1 outline-none text-sm text-gray-700 bg-transparent"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Password</label>
            <div className="flex items-center border border-gray-200 rounded-2xl px-4 py-3 gap-3 bg-white focus-within:border-orange-400 transition-colors">
              <LockIcon />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="flex-1 outline-none text-sm text-gray-700 bg-transparent"
                required
              />
              <button type="button" onClick={() => setShowPassword(v => !v)} className="text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 mt-1 transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#E8884A' }}
          >
            {loading ? 'Logging in…' : <>Login <span className="text-lg">→</span></>}
          </button>
        </form>

        <hr className="w-16 border-gray-200" />

        <p className="text-sm text-gray-500">
          New user?{' '}
          <button onClick={onGoSignup} className="font-semibold hover:underline" style={{ color: '#E8884A' }}>
            Sign up
          </button>
        </p>
      </div>
    </div>
  )
}
