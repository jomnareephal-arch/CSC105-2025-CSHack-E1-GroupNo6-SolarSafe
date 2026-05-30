import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const BASE_URL = 'http://localhost:3000/api'

const PersonIcon = () => (
  <svg className="w-5 h-5 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
)

export default function SettingPage() {
  const { username, token, logout } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
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
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch {
      setError('Cannot connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center p-4 sm:p-8">
      <div className="bg-white rounded-3xl shadow-xl
                      w-full max-w-sm sm:max-w-md md:max-w-lg
                      px-6 py-8 sm:px-10 sm:py-10
                      flex flex-col gap-6">

        {/* Account section */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Account</h2>
          <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Username</label>
          <div className="flex items-center border border-gray-200 rounded-2xl px-4 py-3 gap-3 bg-gray-50">
            <PersonIcon />
            <span className="text-sm text-gray-700">{username}</span>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Change password section */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Change Password</h2>
          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Current Password</label>
              <input
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition-colors"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1.5 block">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition-colors"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Confirm New Password</label>
              <input
                type="password"
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition-colors"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl text-white font-bold text-base hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#E8884A' }}
            >
              {loading ? 'Saving…' : 'Change Password'}
            </button>
          </form>
        </div>

        <hr className="border-gray-100" />

        <button
          onClick={logout}
          className="w-full py-3.5 rounded-2xl text-white font-bold text-base hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#E8884A' }}
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
