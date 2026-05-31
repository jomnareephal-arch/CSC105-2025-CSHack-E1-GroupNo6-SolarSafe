import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const BASE_URL = '/api'

function EyeIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

function PasswordInput({ value, onChange, placeholder }: {
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="flex items-center gap-2 border-2 border-amber-200 rounded-xl px-3 py-2.5 bg-white/80 focus-within:border-amber-500 transition-colors">
      <input
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="flex-1 outline-none text-sm text-amber-900 bg-transparent placeholder:text-amber-300"
        required
      />
      <button type="button" onClick={() => setShow(v => !v)} className="text-amber-400 hover:text-amber-700 transition-colors shrink-0">
        {show ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  )
}

export default function SettingPage() {
  const { username, token, logout, role } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword,     setNewPassword]     = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const initials = (username ?? '?').slice(0, 2).toUpperCase()

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setSuccess('')
    if (newPassword !== confirmPassword) { setError('New passwords do not match'); return }
    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to change password'); return }
      setSuccess('Password changed successfully!')
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
    } catch {
      setError('Cannot connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-amber-950 mb-5 md:mb-6">Settings</h1>

      <div className="flex flex-col gap-4 max-w-lg mx-auto">

        {/* ── Profile card ───────────────────────────────────────── */}
        <div className="bg-white/70 border-2 border-amber-200 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-4">Account</p>
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-extrabold shrink-0 shadow"
              style={{ backgroundColor: '#E8884A' }}
            >
              {initials}
            </div>
            <div>
              <p className="text-lg font-bold text-amber-950 leading-tight">{username}</p>
              <span
                className="inline-block mt-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                style={
                  role === 'admin'
                    ? { backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d' }
                    : { backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #86efac' }
                }
              >
                {role === 'admin' ? '🛡 Admin' : '👤 User'}
              </span>
            </div>
          </div>
        </div>

        {/* ── Change password card ────────────────────────────────── */}
        <div className="bg-white/70 border-2 border-amber-200 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-4">Change Password</p>
          <form onSubmit={handleChangePassword} className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-semibold text-amber-800 mb-1 block">Current Password</label>
              <PasswordInput value={currentPassword} onChange={setCurrentPassword} placeholder="Enter current password" />
            </div>
            <div>
              <label className="text-xs font-semibold text-amber-800 mb-1 block">New Password</label>
              <PasswordInput value={newPassword} onChange={setNewPassword} placeholder="At least 6 characters" />
            </div>
            <div>
              <label className="text-xs font-semibold text-amber-800 mb-1 block">Confirm New Password</label>
              <PasswordInput value={confirmPassword} onChange={setConfirmPassword} placeholder="Repeat new password" />
            </div>

            {error   && (
              <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                ⚠️ {error}
              </p>
            )}
            {success && (
              <p className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                ✓ {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full py-3 rounded-xl text-white font-bold text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
              style={{ backgroundColor: '#E8884A' }}
            >
              {loading ? 'Saving…' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* ── Sign out card ───────────────────────────────────────── */}
        <div className="bg-white/70 border-2 border-red-100 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-red-400 mb-1">Danger Zone</p>
          <p className="text-xs text-gray-400 mb-4">You will be logged out and need to sign in again.</p>
          <button
            onClick={logout}
            className="w-full py-3 rounded-xl font-bold text-sm border-2 border-red-300 text-red-600 bg-red-50 hover:bg-red-100 active:scale-95 transition-all"
          >
            Sign Out
          </button>
        </div>

      </div>
    </div>
  )
}
