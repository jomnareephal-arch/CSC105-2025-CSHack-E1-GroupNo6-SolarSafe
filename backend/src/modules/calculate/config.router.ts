import { Router } from 'express'
import { PROTECTION_CONFIG } from './protectionConfig.js'

const router = Router()

router.get('/protection', (_req, res) => {
  res.json(PROTECTION_CONFIG)
})

export default router
