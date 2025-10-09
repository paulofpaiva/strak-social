import { Router } from 'express'
import createRouter from './create'
import listRouter from './list'
import getByIdRouter from './getById'
import listByUserRouter from './listByUser'
import updateRouter from './update'
import deleteRouter from './delete'
import likeRouter from './like'
import commentsRouter from './comments'
import followingRouter from './following'
import trendingRouter from './trending'
import bookmarkRouter from './bookmark'

const router = Router()

router.use('/', createRouter)
router.use('/', listRouter)
router.use('/', followingRouter)
router.use('/', trendingRouter)
router.use('/', listByUserRouter)
router.use('/', getByIdRouter)
router.use('/', updateRouter)
router.use('/', deleteRouter)
router.use('/', likeRouter)
router.use('/', commentsRouter)
router.use('/', bookmarkRouter)

export default router

