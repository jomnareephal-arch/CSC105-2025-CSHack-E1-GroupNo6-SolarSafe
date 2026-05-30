import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../../db.js'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'solarsafe-secret-key'

// ── Raw SQL helpers (User model was added after prisma generate) ──────────────
type UserRow = { id: number; username: string; password: string }

async function findUserByUsername(username: string): Promise<UserRow | null> {
  const rows = await prisma.$queryRawUnsafe<UserRow[]>(
    'SELECT id, username, password FROM "User" WHERE username = ? LIMIT 1',
    username
  )
  return rows[0] ?? null
}

async function findUserById(id: number): Promise<UserRow | null> {
  const rows = await prisma.$queryRawUnsafe<UserRow[]>(
    'SELECT id, username, password FROM "User" WHERE id = ? LIMIT 1',
    id
  )
  return rows[0] ?? null
}

async function createUser(username: string, hashedPassword: string): Promise<UserRow> {
  await prisma.$executeRawUnsafe(
    'INSERT INTO "User" (username, password, createdAt, updatedAt) VALUES (?, ?, datetime(\'now\'), datetime(\'now\'))',
    username,
    hashedPassword
  )
  const rows = await prisma.$queryRawUnsafe<UserRow[]>(
    'SELECT id, username, password FROM "User" WHERE username = ? LIMIT 1',
    username
  )
  return rows[0]
}

async function updatePassword(id: number, hashedPassword: string): Promise<void> {
  await prisma.$executeRawUnsafe(
    'UPDATE "User" SET password = ?, updatedAt = datetime(\'now\') WHERE id = ?',
    hashedPassword,
    id
  )
}

// ── Middleware: verify JWT ────────────────────────────────────────────────────
export function authMiddleware(req: Request, res: Response, next: Function) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    res.status(401).json({ error: 'No token provided' })
    return
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number; username: string }
    ;(req as any).userId = payload.userId
    ;(req as any).username = payload.username
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

// ── POST /api/auth/signup ─────────────────────────────────────────────────────
router.post('/signup', async (req: Request, res: Response) => {
  const { username, password } = req.body
  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' })
    return
  }
  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters' })
    return
  }
  try {
    const existing = await findUserByUsername(username)
    if (existing) {
      res.status(409).json({ error: 'Username already taken' })
      return
    }
    const hashed = await bcrypt.hash(password, 10)
    const user = await createUser(username, hashed)
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' })
    res.status(201).json({ token, username: user.username })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// ── POST /api/auth/signin ─────────────────────────────────────────────────────
router.post('/signin', async (req: Request, res: Response) => {
  const { username, password } = req.body
  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' })
    return
  }
  try {
    const user = await findUserByUsername(username)
    if (!user) {
      res.status(401).json({ error: 'Invalid username or password' })
      return
    }
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      res.status(401).json({ error: 'Invalid username or password' })
      return
    }
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, username: user.username })
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
  if (!currentPassword || !newPassword || !confirmPassword) {
    res.status(400).json({ error: 'All fields are required' })
    return
  }
  if (newPassword !== confirmPassword) {
    res.status(400).json({ error: 'New passwords do not match' })
    return
  }
  if (newPassword.length < 6) {
    res.status(400).json({ error: 'New password must be at least 6 characters' })
    return
  }
  try {
    const user = await findUserById((req as any).userId)
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    const valid = await bcrypt.compare(currentPassword, user.password)
    if (!valid) {
      res.status(401).json({ error: 'Current password is incorrect' })
      return
    }
    const hashed = await bcrypt.hash(newPassword, 10)
    await updatePassword(user.id, hashed)
    res.json({ message: 'Password changed successfully' })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

export default router
