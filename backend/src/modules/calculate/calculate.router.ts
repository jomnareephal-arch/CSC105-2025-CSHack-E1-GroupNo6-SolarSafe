import { Router } from 'express'
import {
  createCalculation, getCalculation, listCalculations,
  updateCalculation, deleteCalculation,
} from './calculate.controller.js'

const router = Router()

router.post('/',    createCalculation)
router.get('/',     listCalculations)
router.get('/:id',  getCalculation)
router.put('/:id',  updateCalculation)
router.delete('/:id', deleteCalculation)

export default router
