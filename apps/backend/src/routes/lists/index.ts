import { Router } from 'express'
import createRouter from './create'
import listRouter from './list'
import getByIdRouter from './getById'
import updateRouter from './update'
import deleteRouter from './delete'
import membersRouter from './members'
import removeMemberRouter from './removeMember'
import searchRouter from './search'
import followRouter from './follow'
import unfollowRouter from './unfollow'
import postsRouter from './posts'

const router = Router()

router.use('/', createRouter)
router.use('/', listRouter)
router.use('/', searchRouter)
router.use('/', getByIdRouter)
router.use('/', updateRouter)
router.use('/', deleteRouter)
router.use('/', membersRouter)
router.use('/', removeMemberRouter)
router.use('/', followRouter)
router.use('/', unfollowRouter)
router.use('/', postsRouter)

export default router

