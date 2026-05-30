import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../../contexts/AuthContext'

const BASE_URL = 'http://localhost:3000/api'

// ── Types ─────────────────────────────────────────────────────────────────────
interface Product {
  id: number
  name: string
  category: string
  price: number
  protectionScore: number
  imageUrl: string | null
  description: string | null
  active: number
}

const CATEGORIES = [
  { value: 'sunscreen', label: 'Sunscreen', scoreLabel: 'SPF' },
  { value: 'hats', label: 'Hats', scoreLabel: 'UPF' },
  { value: 'uv-jacket', label: 'UV Jacket', scoreLabel: 'UPF' },
  { value: 'sunglasses', label: 'Sunglasses', scoreLabel: 'UV Blocking %' },
  { value: 'umbrella', label: 'Umbrella', scoreLabel: 'UV Blocking %' },
]

function getScoreLabel(category: string) {
  return CATEGORIES.find(c => c.value === category)?.scoreLabel ?? 'Protection Score'
}

const HOURS = Array.from({ length: 13 }, (_, i) => i + 6) // 6..18

function uvLevel(uv: number): string {
  if (uv === 0) return 'none'
  if (uv <= 2) return 'low'
  if (uv <= 5) return 'moderate'
  if (uv <= 7) return 'high'
  if (uv <= 10) return 'very_high'
  return 'extreme'
}

function uvColor(uv: number): string {
  if (uv <= 10) return '#22C55E'
  if (uv <= 20) return '#EAB308'
  if (uv <= 30) return '#F97316'
  if (uv <= 40) return '#EF4444'
  return '#9333EA'
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AdminPage() {
  const { token } = useAuth()
  const authHeaders = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  // ── UV Index state ────────────────────────────────────────────────────────
  const today = new Date().toISOString().slice(0, 10)
  const [uvDate, setUvDate] = useState(today)
  const [uvValues, setUvValues] = useState<Record<number, number>>(
    Object.fromEntries(Array.from({ length: 24 }, (_, h) => [h, 0]))
  )
  const [uvSaving, setUvSaving] = useState(false)
  const [uvMsg, setUvMsg] = useState('')

  // ── Product state ─────────────────────────────────────────────────────────
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)

  // Form state
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({
    name: '',
    category: 'sunscreen',
    price: '',
    protectionScore: '',
    description: '',
    imageUrl: '',
  })
  const [imagePreview, setImagePreview] = useState<string>('')
  const [formMsg, setFormMsg] = useState('')
  const [formError, setFormError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Load UV data when date changes ────────────────────────────────────────
  useEffect(() => {
    fetch(`${BASE_URL}/admin/uv/${uvDate}`, { headers: authHeaders })
      .then(r => r.json())
      .then(data => {
        if (data.uvData) {
          const map: Record<number, number> = Object.fromEntries(
            Array.from({ length: 24 }, (_, h) => [h, 0])
          )
          for (const row of data.uvData) map[row.hour] = row.uvIndex
          setUvValues(map)
        }
      })
      .catch(() => {})
  }, [uvDate])

  // ── Load products ─────────────────────────────────────────────────────────
  useEffect(() => {
    setLoadingProducts(true)
    fetch(`${BASE_URL}/admin/products`, { headers: authHeaders })
      .then(r => r.json())
      .then(data => setProducts(data.products ?? []))
      .catch(() => {})
      .finally(() => setLoadingProducts(false))
  }, [])

  // ── UV handlers ───────────────────────────────────────────────────────────
  function handleUvChange(hour: number, val: string) {
    const n = Math.max(0, Number(val) || 0)
    setUvValues(prev => ({ ...prev, [hour]: n }))
  }

  async function saveUV() {
    setUvSaving(true)
    setUvMsg('')
    const uvData = Object.entries(uvValues).map(([h, v]) => ({ hour: Number(h), uvIndex: v }))
    try {
      const res = await fetch(`${BASE_URL}/admin/uv/${uvDate}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ uvData }),
      })
      if (res.ok) setUvMsg('✓ UV Index saved!')
      else setUvMsg('Error saving')
    } catch {
      setUvMsg('Cannot connect to server')
    } finally {
      setUvSaving(false)
      setTimeout(() => setUvMsg(''), 3000)
    }
  }

  // ── Image upload ──────────────────────────────────────────────────────────
  async function handleImageUpload(file: File) {
    const fd = new FormData()
    fd.append('image', file)
    try {
      const res = await fetch(`${BASE_URL}/admin/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })
      const data = await res.json()
      if (data.url) {
        setForm(f => ({ ...f, imageUrl: `http://localhost:3000${data.url}` }))
        setImagePreview(`http://localhost:3000${data.url}`)
      }
    } catch {
      setFormError('Image upload failed')
    }
  }

  // ── Product form handlers ─────────────────────────────────────────────────
  function resetForm() {
    setEditingId(null)
    setForm({ name: '', category: 'sunscreen', price: '', protectionScore: '', description: '', imageUrl: '' })
    setImagePreview('')
    setFormMsg('')
    setFormError('')
  }

  function startEdit(p: Product) {
    setEditingId(p.id)
    setForm({
      name: p.name,
      category: p.category,
      price: String(p.price),
      protectionScore: String(p.protectionScore),
      description: p.description ?? '',
      imageUrl: p.imageUrl ?? '',
    })
    setImagePreview(p.imageUrl ?? '')
    setFormMsg('')
    setFormError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmitProduct(e: React.FormEvent) {
    e.preventDefault()
    setFormMsg('')
    setFormError('')
    const body = {
      name: form.name,
      category: form.category,
      price: Number(form.price),
      protectionScore: Number(form.protectionScore),
      description: form.description || null,
      imageUrl: form.imageUrl || null,
    }
    try {
      if (editingId !== null) {
        const res = await fetch(`${BASE_URL}/admin/products/${editingId}`, {
          method: 'PUT', headers: authHeaders, body: JSON.stringify(body),
        })
        const data = await res.json()
        if (!res.ok) { setFormError(data.error || 'Update failed'); return }
        setProducts(prev => prev.map(p => p.id === editingId ? data.product : p))
        setFormMsg('✓ Product updated!')
      } else {
        const res = await fetch(`${BASE_URL}/admin/products`, {
          method: 'POST', headers: authHeaders, body: JSON.stringify(body),
        })
        const data = await res.json()
        if (!res.ok) { setFormError(data.error || 'Create failed'); return }
        setProducts(prev => [...prev, data.product])
        setFormMsg('✓ Product added!')
      }
      resetForm()
    } catch {
      setFormError('Cannot connect to server')
    }
  }

  async function toggleActive(p: Product) {
    const newActive = p.active ? 0 : 1
    await fetch(`${BASE_URL}/admin/products/${p.id}/active`, {
      method: 'PATCH', headers: authHeaders, body: JSON.stringify({ active: newActive }),
    })
    setProducts(prev => prev.map(x => x.id === p.id ? { ...x, active: newActive } : x))
  }

  async function deleteProduct(id: number) {
    if (!confirm('Delete this product?')) return
    await fetch(`${BASE_URL}/admin/products/${id}`, { method: 'DELETE', headers: authHeaders })
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const scoreLabel = getScoreLabel(form.category)

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6" style={{ color: '#5F2900' }}>Admin Dashboard</h1>

      {/* ══ UV Index Section ══════════════════════════════════════════════════ */}
      <section className="bg-white rounded-2xl shadow p-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold" style={{ color: '#5F2900' }}>UV Index by Hour</h2>
            <p className="text-sm text-gray-500">Set UV Index forecast for each hour (0–20)</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={uvDate}
              onChange={e => setUvDate(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Hour grid */}
        <div className="overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-2">
            {HOURS.map(h => (
              <div key={h} className="flex flex-col items-center gap-1 w-14">
                <span className="text-xs text-gray-500">{h}:00</span>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                  style={{ backgroundColor: uvColor(uvValues[h] ?? 0) }}
                >
                  {uvValues[h] ?? 0}
                </div>
                <input
                  type="number"
                  min={0}
                  value={uvValues[h] ?? 0}
                  onChange={e => handleUvChange(h, e.target.value)}
                  className="w-12 border border-gray-200 rounded-lg text-center text-xs py-1 focus:outline-none focus:border-orange-400"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-600">
          {[['#22C55E','0–10 Low'],['#EAB308','11–20 Moderate'],['#F97316','21–30 High'],['#EF4444','31–40 Very High'],['#9333EA','41+ Extreme']].map(([c,l]) => (
            <span key={l} className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: c }} />
              {l}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={saveUV}
            disabled={uvSaving}
            className="px-6 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#E8884A' }}
          >
            {uvSaving ? 'Saving…' : 'Save UV Index'}
          </button>
          {uvMsg && <span className="text-sm text-green-600 font-medium">{uvMsg}</span>}
        </div>
      </section>

      {/* ══ Add / Edit Product Form ═══════════════════════════════════════════ */}
      <section className="bg-white rounded-2xl shadow p-6 mb-8">
        <h2 className="text-lg font-bold mb-4" style={{ color: '#5F2900' }}>
          {editingId !== null ? 'Edit Product' : 'Add Product'}
        </h2>

        <form onSubmit={handleSubmitProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Image upload */}
          <div className="md:col-span-2 flex items-start gap-4">
            <div
              className="w-28 h-28 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer hover:border-orange-400 transition-colors shrink-0"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview
                ? <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                : <div className="text-center text-gray-400 text-xs p-2">
                    <svg className="w-8 h-8 mx-auto mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    Click or drag image
                  </div>
              }
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) {
                  setImagePreview(URL.createObjectURL(file))
                  handleImageUpload(file)
                }
              }}
            />
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-600 block mb-1">Image URL (optional)</label>
              <input
                type="text"
                placeholder="Or paste URL directly"
                value={form.imageUrl}
                onChange={e => { setForm(f => ({ ...f, imageUrl: e.target.value })); setImagePreview(e.target.value) }}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Product Name *</label>
            <input
              required
              type="text"
              placeholder="e.g. Solar Shield V2"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Category *</label>
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 bg-white"
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Protection score — label changes by category */}
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">{scoreLabel} *</label>
            <input
              required
              type="number"
              min={0}
              max={9999}
              placeholder={scoreLabel === 'SPF' ? 'e.g. 50' : scoreLabel === 'UPF' ? 'e.g. 50' : 'e.g. 99'}
              value={form.protectionScore}
              onChange={e => setForm(f => ({ ...f, protectionScore: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
            />
          </div>

          {/* Price */}
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Price (฿) *</label>
            <input
              required
              type="number"
              min={0}
              placeholder="e.g. 1250"
              value={form.price}
              onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-gray-600 block mb-1">Description</label>
            <textarea
              rows={2}
              placeholder="Optional description..."
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none"
            />
          </div>

          {formError && <p className="md:col-span-2 text-red-500 text-sm">{formError}</p>}
          {formMsg && <p className="md:col-span-2 text-green-600 text-sm font-medium">{formMsg}</p>}

          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#E8884A' }}
            >
              {editingId !== null ? 'Update Product' : 'Add Product'}
            </button>
            {editingId !== null && (
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 rounded-xl text-gray-600 font-semibold text-sm border border-gray-200 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* ══ Product Table ═════════════════════════════════════════════════════ */}
      <section className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ color: '#5F2900' }}>Armory Inventory (Products)</h2>
          <span className="text-xs bg-orange-100 text-orange-700 font-semibold px-3 py-1 rounded-full">
            {products.filter(p => p.active).length} Active Products
          </span>
        </div>

        {loadingProducts ? (
          <p className="text-sm text-gray-400 text-center py-8">Loading…</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 px-2 text-gray-500 font-medium w-8">#</th>
                  <th className="text-left py-2 px-2 text-gray-500 font-medium">Product Name</th>
                  <th className="text-left py-2 px-2 text-gray-500 font-medium">Category</th>
                  <th className="text-left py-2 px-2 text-gray-500 font-medium">Score</th>
                  <th className="text-left py-2 px-2 text-gray-500 font-medium">Price (฿)</th>
                  <th className="text-center py-2 px-2 text-gray-500 font-medium">Active</th>
                  <th className="text-center py-2 px-2 text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-orange-50/40 transition-colors">
                    <td className="py-3 px-2 text-gray-400">{i + 1}</td>
                    <td className="py-3 px-2 font-medium text-gray-800 flex items-center gap-2">
                      {p.imageUrl && (
                        <img src={p.imageUrl} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                      )}
                      {p.name}
                    </td>
                    <td className="py-3 px-2 capitalize text-gray-600">{p.category}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${Math.min(100, (p.protectionScore / 100) * 100)}%`,
                              backgroundColor: p.protectionScore >= 50 ? '#22C55E' : p.protectionScore >= 30 ? '#EAB308' : '#F97316',
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{p.protectionScore}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-gray-700">{p.price.toLocaleString()}</td>
                    <td className="py-3 px-2 text-center">
                      <button
                        onClick={() => toggleActive(p)}
                        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
                        style={{ backgroundColor: p.active ? '#E8884A' : '#D1D5DB' }}
                      >
                        <span
                          className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                          style={{ transform: p.active ? 'translateX(22px)' : 'translateX(2px)' }}
                        />
                      </button>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => startEdit(p)}
                          className="p-1.5 rounded-lg hover:bg-orange-100 text-orange-600 transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 rounded-lg hover:bg-red-100 text-red-500 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14H6L5 6"/>
                            <path d="M10 11v6M14 11v6"/>
                            <path d="M9 6V4h6v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-400 text-sm">No products yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
