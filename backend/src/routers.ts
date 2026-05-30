import { Router } from 'express'
import calculationRouter from './modules/calculate/calculate.router.js'
import configRouter from './modules/calculate/config.router.js'

const router = Router()

router.use('/calculation', calculationRouter)
router.use('/config', configRouter)

export default router
