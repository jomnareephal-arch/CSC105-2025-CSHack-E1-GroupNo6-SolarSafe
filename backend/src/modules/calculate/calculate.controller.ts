import type { Request, Response } from 'express'
import prisma from '../../prisma.js'
import type { SkinType, TimeSlot, ProtectionComponent } from '../../types/index.js'

const UV_INDEX_FALLBACK: Record<TimeSlot, number> = {
  '06:00': 20, '07:00': 23, '08:00': 26, '09:00': 30,
  '10:00': 34, '11:00': 37, '12:00': 52, '13:00': 50,
  '14:00': 47, '15:00': 36, '16:00': 29, '17:00': 25,
  '18:00': 18,
}

const SKIN_FACTOR: Record<SkinType, number> = {
  I: 1.0, II: 1.5, III: 2.0, IV: 3.0, V: 5.0, VI: 6.5,
}

async function getTodayUV(outdoorTime: TimeSlot): Promise<number> {
  const today = new Date().toISOString().slice(0, 10)
  const hour  = Number(outdoorTime.split(':')[0])
  const rows = await prisma.$queryRawUnsafe<{ uvIndex: number }[]>(
    'SELECT uvIndex FROM "UVData" WHERE dayId = ? AND hour = ? LIMIT 1',
    today, hour
  )
  if (rows.length > 0 && rows[0].uvIndex > 0) return rows[0].uvIndex
  return UV_INDEX_FALLBACK[outdoorTime]
}

function calcPF(components: ProtectionComponent[]): number {
  let spf = 0, upf = 0, hat_factor = 0, umbrella_factor = 0, glass_factor = 0
  for (const c of components) {
    if (c.type === 'sunscreen'  && c.spf !== undefined)             spf             = c.spf
    if (c.type === 'uvJacket'   && c.upf !== undefined)             upf             = c.upf
    if (c.type === 'hat'        && c.hat_factor !== undefined)      hat_factor      = c.hat_factor
    if (c.type === 'umbrella'   && c.umbrella_factor !== undefined) umbrella_factor = c.umbrella_factor
    if (c.type === 'sunglasses' && c.glass_factor !== undefined)    glass_factor    = c.glass_factor
  }
  return (spf             > 0 ? ((1 - 1/spf) * 100) * 0.25        : 0)
       + (upf             > 0 ? ((1 - 1/upf) * 100) * 0.35        : 0)
       + (hat_factor      > 0 ? hat_factor * 0.10                  : 0)
       + (umbrella_factor > 0 ? umbrella_factor * 0.20             : 0)
       + (glass_factor    > 0 ? glass_factor * 0.10                : 0)
}

async function calcSafeTime(skinType: SkinType, outdoorTime: TimeSlot, components: ProtectionComponent[]) {
  const uv = await getTodayUV(outdoorTime)
  const medBase = (SKIN_FACTOR[skinType] * 133.33) / uv
  const pf = calcPF(components)
  return {
    safeOutdoorMinutes: Math.round(medBase * (1 + pf / 100)),
    protectionScore:    Math.round(pf * 100) / 100,
  }
}

function formatRow(row: { protectionItems: string; [k: string]: unknown }) {
  return { ...row, protectionComponents: JSON.parse(row.protectionItems) as ProtectionComponent[] }
}

export async function createCalculation(req: Request, res: Response): Promise<void> {
  const { skinType, outdoorTime, protectionComponents = [] } = req.body as {
    skinType?: SkinType; outdoorTime?: TimeSlot; protectionComponents?: ProtectionComponent[]
  }
  if (!skinType || !outdoorTime) {
    res.status(400).json({ error: 'skinType and outdoorTime required' }); return
  }
  const { safeOutdoorMinutes, protectionScore } = await calcSafeTime(skinType, outdoorTime, protectionComponents)
  const row = await prisma.calculation.create({
    data: { skinType, outdoorTime, protectionItems: JSON.stringify(protectionComponents), protectionScore, safeOutdoorMinutes },
  })
  res.status(201).json(formatRow(row))
}

export async function listCalculations(_req: Request, res: Response): Promise<void> {
  const rows = await prisma.calculation.findMany({ orderBy: { createdAt: 'desc' } })
  res.json(rows.map(formatRow))
}

export async function getCalculation(req: Request, res: Response): Promise<void> {
  const row = await prisma.calculation.findUnique({ where: { id: Number(req.params['id']) } })
  if (!row) { res.status(404).json({ error: 'Not found' }); return }
  res.json(formatRow(row))
}

export async function updateCalculation(req: Request, res: Response): Promise<void> {
  const id = Number(req.params['id'])
  const existing = await prisma.calculation.findUnique({ where: { id } })
  if (!existing) { res.status(404).json({ error: 'Not found' }); return }

  const body = req.body as {
    skinType?: SkinType; outdoorTime?: TimeSlot
    protectionComponents?: ProtectionComponent[]; remainingSeconds?: number | null
  }
  const skinType    = body.skinType    ?? existing.skinType as SkinType
  const outdoorTime = body.outdoorTime ?? existing.outdoorTime as TimeSlot
  const protectionComponents: ProtectionComponent[] = body.protectionComponents
    ?? JSON.parse(existing.protectionItems) as ProtectionComponent[]
  const remainingSeconds = body.remainingSeconds !== undefined ? body.remainingSeconds : existing.remainingSeconds

  const { safeOutdoorMinutes, protectionScore } = await calcSafeTime(skinType, outdoorTime, protectionComponents)
  const row = await prisma.calculation.update({
    where: { id },
    data: { skinType, outdoorTime, protectionItems: JSON.stringify(protectionComponents), protectionScore, safeOutdoorMinutes, remainingSeconds },
  })
  res.json(formatRow(row))
}

export async function deleteCalculation(req: Request, res: Response): Promise<void> {
  try {
    await prisma.calculation.delete({ where: { id: Number(req.params['id']) } })
    res.status(204).send()
  } catch {
    res.status(404).json({ error: 'Not found' })
  }
}
