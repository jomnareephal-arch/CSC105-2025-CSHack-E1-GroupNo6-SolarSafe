const BASE_URL = 'http://localhost:3000/api'

export async function fetchProtectionConfig() {
  const res = await fetch(`${BASE_URL}/config/protection`)
  if (!res.ok) throw new Error('Failed to fetch protection config')
  return res.json()
}

export async function createCalculation(body: object) {
  const res = await fetch(`${BASE_URL}/calculation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error('Failed to create calculation')
  return res.json()
}

export async function updateCalculation(id: number, body: object) {
  const res = await fetch(`${BASE_URL}/calculation/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error('Failed to update calculation')
  return res.json()
}
