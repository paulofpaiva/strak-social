import { Router } from 'express'
import signUpRouter from './signUp'
import signInRouter from './signIn'
import checkUsernameRouter from './checkUsername'
import signOutRouter from './signOut'
import sessionRouter from './session'
import profileRouter from './profile'
import avatarRouter from './avatar'
import coverRouter from './cover'
import changePasswordRouter from './changePassword'

const router = Router()

router.use('/sign-up', signUpRouter)
router.use('/sign-in', signInRouter)
router.use('/check-username', checkUsernameRouter)
router.use('/sign-out', signOutRouter)
router.use('/session', sessionRouter)
router.use('/profile', profileRouter)
router.use('/avatar', avatarRouter)
router.use('/cover', coverRouter)
router.use('/change-password', changePasswordRouter)

export default router

