import type { CalcResult, CalculationPayload } from '../types/calculate.types'

const BASE_URL = '/api'

export async function fetchProtectionConfig() {
  const res = await fetch(`${BASE_URL}/config/protection`)
  if (!res.ok) throw new Error('Failed to fetch protection config')
  return res.json()
}

export async function createCalculation(body: CalculationPayload): Promise<CalcResult> {
  const res = await fetch(`${BASE_URL}/calculation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error('Failed to create calculation')
  return res.json()
}

export async function updateCalculation(id: number, body: CalculationPayload): Promise<CalcResult> {
  const res = await fetch(`${BASE_URL}/calculation/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error('Failed to update calculation')
  return res.json()
}
