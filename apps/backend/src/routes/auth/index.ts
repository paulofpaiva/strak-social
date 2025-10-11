import { Router } from 'express'
import signUpRouter from './signUp'
import signInRouter from './signIn'
import checkUsernameRouter from './checkUsername'
import signOutRouter from './signOut'
import sessionRouter from './session'
import profileRouter from './profile'
import changePasswordRouter from './changePassword'
import bookmarksRouter from './bookmarks'
import updateNameRouter from './updateName'
import updateUsernameRouter from './updateUsername'
import updateBirthDateRouter from './updateBirthDate'

const router = Router()

router.use('/sign-up', signUpRouter)
router.use('/sign-in', signInRouter)
router.use('/check-username', checkUsernameRouter)
router.use('/sign-out', signOutRouter)
router.use('/session', sessionRouter)
router.use('/profile', profileRouter)
router.use('/profile', bookmarksRouter)
router.use('/profile/name', updateNameRouter)
router.use('/profile/username', updateUsernameRouter)
router.use('/profile/birthdate', updateBirthDateRouter)
router.use('/change-password', changePasswordRouter)

export default router

