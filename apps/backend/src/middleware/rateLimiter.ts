import rateLimit from 'express-rate-limit'

export const signInLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again in 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export const signUpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: {
    success: false,
    message: 'Too many account creation attempts. Please try again in 1 hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export const changePasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: {
    success: false,
    message: 'Too many password change attempts. Please try again in 1 hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export const mediaUploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many media uploads. Please try again in 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export const avatarUploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many avatar uploads. Please try again in 1 hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export const coverUploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many cover uploads. Please try again in 1 hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export const checkUsernameLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many username checks. Please try again soon.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export const createPostLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many post creation attempts. Please try again in 1 hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export const createCommentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: 'Too many comment creation attempts. Please try again in 1 hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export const likeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: {
    success: false,
    message: 'Too many like actions. Please try again soon.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export const followLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many follow/unfollow actions. Please try again soon.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: 'Too many searches. Please try again soon.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export const bookmarkLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: {
    success: false,
    message: 'Too many bookmark actions. Please try again soon.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})