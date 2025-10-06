import { Router } from 'express'
import avatarRouter from './avatar'
import coverRouter from './cover'
import mediaRouter from './media'

const router = Router()

router.use('/', avatarRouter)
router.use('/', coverRouter)
router.use('/', mediaRouter)

export default router

