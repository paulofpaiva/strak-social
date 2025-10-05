import { Router } from 'express'
import createRouter from './create'
import getByIdRouter from './getById'
import listByPostRouter from './listByPost'
import updateRouter from './update'
import deleteRouter from './delete'
import likeRouter from './like'
import repliesRouter from './replies'

const router = Router()

router.use('/', createRouter)
router.use('/', getByIdRouter)
router.use('/', listByPostRouter)
router.use('/', updateRouter)
router.use('/', deleteRouter)
router.use('/', likeRouter)
router.use('/', repliesRouter)

export default router

