import { Router, Request, Response } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { prisma } from '../../db.js'
import { adminMiddleware } from '../auth/auth.route.js'

const router = Router()

// ── File upload setup ─────────────────────────────────────────────────────────
const uploadsDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}${ext}`)
  },
})
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } })

// ── POST /api/admin/upload ────────────────────────────────────────────────────
router.post('/upload', adminMiddleware, upload.single('image'), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' })
    return
  }
  const url = `/uploads/${req.file.filename}`
  res.json({ url })
})

// ── UV Index management ───────────────────────────────────────────────────────

// GET /api/admin/uv/:date  — get uv data for a date (YYYY-MM-DD)
router.get('/uv/:date', adminMiddleware, async (req: Request, res: Response) => {
  const { date } = req.params
  try {
    const rows = await prisma.$queryRawUnsafe<{ hour: number; uvIndex: number; level: string }[]>(
      'SELECT hour, uvIndex, level FROM "UVData" WHERE dayId = ? ORDER BY hour ASC',
      date
    )
    res.json({ date, uvData: rows })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/admin/uv/:date  — upsert entire day's UV index (array of {hour, uvIndex})
router.put('/uv/:date', adminMiddleware, async (req: Request, res: Response) => {
  const { date } = req.params
  const { uvData } = req.body as { uvData: { hour: number; uvIndex: number }[] }
  if (!Array.isArray(uvData)) {
    res.status(400).json({ error: 'uvData must be an array' })
    return
  }

  function uvLevel(uv: number): string {
    if (uv === 0)  return 'none'
    if (uv <= 26)  return 'low'
    if (uv <= 35)  return 'moderate'
    if (uv <= 49)  return 'high'
    if (uv <= 70)  return 'very_high'
    return 'extreme'
  }

  try {
    // Ensure Day row exists
    const existing = await prisma.$queryRawUnsafe<{ id: string }[]>(
      'SELECT id FROM "Day" WHERE id = ? LIMIT 1',
      date
    )
    if (existing.length === 0) {
      await prisma.$executeRawUnsafe(
        'INSERT INTO "Day" (id, date, createdAt, updatedAt) VALUES (?, ?, datetime(\'now\'), datetime(\'now\'))',
        date, date
      )
    } else {
      await prisma.$executeRawUnsafe(
        'UPDATE "Day" SET updatedAt = datetime(\'now\') WHERE id = ?',
        date
      )
    }

    // Upsert each hour
    for (const { hour, uvIndex } of uvData) {
      const level = uvLevel(uvIndex)
      await prisma.$executeRawUnsafe(
        `INSERT INTO "UVData" (hour, uvIndex, level, dayId)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(dayId, hour) DO UPDATE SET uvIndex = excluded.uvIndex, level = excluded.level`,
        hour, uvIndex, level, date
      )
    }
    res.json({ success: true })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// ── Product management ────────────────────────────────────────────────────────

// GET /api/admin/products
router.get('/products', adminMiddleware, async (_req: Request, res: Response) => {
  try {
    const products = await prisma.$queryRawUnsafe<any[]>(
      'SELECT * FROM "Product" ORDER BY id ASC'
    )
    res.json({ products })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/admin/products
router.post('/products', adminMiddleware, async (req: Request, res: Response) => {
  const { name, category, price, protectionScore, imageUrl, description } = req.body
  if (!name || !category || price == null || protectionScore == null) {
    res.status(400).json({ error: 'name, category, price, protectionScore are required' })
    return
  }
  try {
    await prisma.$executeRawUnsafe(
      `INSERT INTO "Product" (name, category, price, protectionScore, imageUrl, description, active, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))`,
      name, category, Number(price), Number(protectionScore), imageUrl ?? null, description ?? null
    )
    const rows = await prisma.$queryRawUnsafe<any[]>(
      'SELECT * FROM "Product" WHERE name = ? ORDER BY id DESC LIMIT 1',
      name
    )
    res.status(201).json({ product: rows[0] })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/admin/products/:id
router.put('/products/:id', adminMiddleware, async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const { name, category, price, protectionScore, imageUrl, description } = req.body
  try {
    await prisma.$executeRawUnsafe(
      `UPDATE "Product" SET name=?, category=?, price=?, protectionScore=?, imageUrl=?, description=?, updatedAt=datetime('now') WHERE id=?`,
      name, category, Number(price), Number(protectionScore), imageUrl ?? null, description ?? null, id
    )
    const rows = await prisma.$queryRawUnsafe<any[]>('SELECT * FROM "Product" WHERE id = ?', id)
    res.json({ product: rows[0] })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/admin/products/:id/active
router.patch('/products/:id/active', adminMiddleware, async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const { active } = req.body
  try {
    await prisma.$executeRawUnsafe(
      `UPDATE "Product" SET active=?, updatedAt=datetime('now') WHERE id=?`,
      active ? 1 : 0, id
    )
    res.json({ success: true })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/admin/products/:id
router.delete('/products/:id', adminMiddleware, async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  try {
    await prisma.$executeRawUnsafe('DELETE FROM "Product" WHERE id = ?', id)
    res.json({ success: true })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

export default router
