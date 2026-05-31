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
  filename:    (_req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`),
})
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } })

// ── POST /api/admin/upload ────────────────────────────────────────────────────
router.post('/upload', adminMiddleware, upload.single('image'), (req: Request, res: Response) => {
  if (!req.file) { res.status(400).json({ error: 'No file uploaded' }); return }
  res.json({ url: `/uploads/${req.file.filename}` })
})

// ── UV Index management ───────────────────────────────────────────────────────

function uvLevel(uv: number): string {
  if (uv === 0)  return 'none'
  if (uv <= 26)  return 'low'
  if (uv <= 35)  return 'moderate'
  if (uv <= 49)  return 'high'
  if (uv <= 70)  return 'very_high'
  return 'extreme'
}

// GET /api/admin/uv/:date
router.get('/uv/:date', adminMiddleware, async (req: Request, res: Response) => {
  const date = req.params.date as string
  try {
    const uvData = await prisma.uVData.findMany({
      where:   { dayId: date },
      orderBy: { hour: 'asc' },
    })
    res.json({ date, uvData })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/admin/uv/:date
router.put('/uv/:date', adminMiddleware, async (req: Request, res: Response) => {
  const date = req.params.date as string
  const { uvData } = req.body as { uvData: { hour: number; uvIndex: number }[] }
  if (!Array.isArray(uvData)) { res.status(400).json({ error: 'uvData must be an array' }); return }
  try {
    await prisma.day.upsert({
      where:  { id: date },
      update: { updatedAt: new Date() },
      create: { id: date, date },
    })
    for (const { hour, uvIndex } of uvData) {
      await prisma.uVData.upsert({
        where:  { dayId_hour: { dayId: date, hour } },
        update: { uvIndex, level: uvLevel(uvIndex) },
        create: { hour, uvIndex, level: uvLevel(uvIndex), dayId: date },
      })
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
    const products = await prisma.product.findMany({ orderBy: { id: 'asc' } })
    res.json({ products })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/admin/products
router.post('/products', adminMiddleware, async (req: Request, res: Response) => {
  const { name, category, price, protectionScore, imageUrl, description } = req.body
  if (!name || !category || price == null || protectionScore == null) {
    res.status(400).json({ error: 'name, category, price, protectionScore are required' }); return
  }
  try {
    const product = await prisma.product.create({
      data: { name, category, price: Number(price), protectionScore: Number(protectionScore), imageUrl: imageUrl ?? null, description: description ?? null, active: 1 },
    })
    res.status(201).json({ product })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/admin/products/:id
router.put('/products/:id', adminMiddleware, async (req: Request, res: Response) => {
  const { name, category, price, protectionScore, imageUrl, description } = req.body
  try {
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data:  { name, category, price: Number(price), protectionScore: Number(protectionScore), imageUrl: imageUrl ?? null, description: description ?? null },
    })
    res.json({ product })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/admin/products/:id/active
router.patch('/products/:id/active', adminMiddleware, async (req: Request, res: Response) => {
  try {
    await prisma.product.update({
      where: { id: Number(req.params.id) },
      data:  { active: req.body.active ? 1 : 0 },
    })
    res.json({ success: true })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/admin/products/:id
router.delete('/products/:id', adminMiddleware, async (req: Request, res: Response) => {
  try {
    await prisma.product.delete({ where: { id: Number(req.params.id) } })
    res.json({ success: true })
  } catch (err: any) {
    res.status(404).json({ error: 'Not found' })
  }
})

export default router
