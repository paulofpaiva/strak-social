import { Router } from 'express'
import avatarRouter from './avatar'
import coverRouter from './cover'
import mediaRouter from './media'
import serveRouter from './serve'

const router = Router()

router.use('/', avatarRouter)
router.use('/', coverRouter)
router.use('/', mediaRouter)
router.use('/', serveRouter)

export default router

