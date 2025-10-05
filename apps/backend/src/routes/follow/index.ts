import { Router } from 'express'
import toggleRouter from './toggle'
import followersRouter from './followers'
import followingRouter from './following'
import checkRouter from './check'

const router = Router()

router.use('/', toggleRouter)
router.use('/', followersRouter)
router.use('/', followingRouter)
router.use('/', checkRouter)

export default router

