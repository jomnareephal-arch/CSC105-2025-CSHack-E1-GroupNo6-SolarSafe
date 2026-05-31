import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../../db.js'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'solarsafe-secret-key'

// ── Middleware: verify JWT ────────────────────────────────────────────────────
export function authMiddleware(req: Request, res: Response, next: Function) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) { res.status(401).json({ error: 'No token provided' }); return }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number; username: string; role: string }
    ;(req as any).userId   = payload.userId
    ;(req as any).username = payload.username
    ;(req as any).role     = payload.role
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

export function adminMiddleware(req: Request, res: Response, next: Function) {
  authMiddleware(req, res, () => {
    if ((req as any).role !== 'admin') {
      res.status(403).json({ error: 'Admin access required' }); return
    }
    next()
  })
}

// ── POST /api/auth/signup ─────────────────────────────────────────────────────
router.post('/signup', async (req: Request, res: Response) => {
  const { username, password } = req.body
  if (!username || !password) { res.status(400).json({ error: 'Username and password are required' }); return }
  if (password.length < 6)    { res.status(400).json({ error: 'Password must be at least 6 characters' }); return }
  try {
    const existing = await prisma.user.findUnique({ where: { username } })
    if (existing) { res.status(409).json({ error: 'Username already taken' }); return }
    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({ data: { username, password: hashed, role: 'user' } })
    const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
    res.status(201).json({ token, username: user.username, role: user.role })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// ── POST /api/auth/signin ─────────────────────────────────────────────────────
router.post('/signin', async (req: Request, res: Response) => {
  const { username, password } = req.body
  if (!username || !password) { res.status(400).json({ error: 'Username and password are required' }); return }
  try {
    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) { res.status(401).json({ error: 'Invalid username or password' }); return }
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) { res.status(401).json({ error: 'Invalid username or password' }); return }
    const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, username: user.username, role: user.role })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
router.get('/me', authMiddleware, (req: Request, res: Response) => {
  res.json({ userId: (req as any).userId, username: (req as any).username })
})

// ── PUT /api/auth/change-password ─────────────────────────────────────────────
router.put('/change-password', authMiddleware, async (req: Request, res: Response) => {
  const { currentPassword, newPassword, confirmPassword } = req.body
  if (!currentPassword || !newPassword || !confirmPassword) { res.status(400).json({ error: 'All fields are required' }); return }
  if (newPassword !== confirmPassword) { res.status(400).json({ error: 'New passwords do not match' }); return }
  if (newPassword.length < 6) { res.status(400).json({ error: 'New password must be at least 6 characters' }); return }
  try {
    const user = await prisma.user.findUnique({ where: { id: (req as any).userId } })
    if (!user) { res.status(404).json({ error: 'User not found' }); return }
    const valid = await bcrypt.compare(currentPassword, user.password)
    if (!valid) { res.status(401).json({ error: 'Current password is incorrect' }); return }
    const hashed = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } })
    res.json({ message: 'Password changed successfully' })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

export default router
