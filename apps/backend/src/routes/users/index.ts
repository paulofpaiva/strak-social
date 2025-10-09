import { Router } from 'express'
import getByIdRouter from './getById'
import getByUsernameRouter from './getByUsername'
import suggestionsRouter from './suggestions'

const router = Router()

router.use('/suggestions', suggestionsRouter)
router.use('/', getByUsernameRouter)
router.use('/', getByIdRouter)

export default router
