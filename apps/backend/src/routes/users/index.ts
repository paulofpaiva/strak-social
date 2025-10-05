import { Router } from 'express'
import getByUsernameRouter from './getByUsername'
import getByIdRouter from './getById'

const router = Router()

router.use('/', getByUsernameRouter)
router.use('/', getByIdRouter)

export default router

