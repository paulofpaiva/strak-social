import { z } from 'zod';
import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core';
import { calculateAge } from '../utils/database';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  avatar: text('avatar'), 
  cover: text('cover'),
  bio: text('bio'),
  location: text('location'),
  website: text('website'),
  birthDate: timestamp('birth_date'),
  isVerified: boolean('is_verified').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const signUpSchema = z.object({
  email: z.string().email('Invalid email'),
  username: z.string()
    .min(3, 'Username must have at least 3 characters')
    .max(15, 'Username must have at most 15 characters')
    .regex(/^[a-zA-Z0-9_.]+$/, 'Username can only contain letters, numbers, underscores, and dots'),
  password: z.string().min(6, 'Password must have at least 6 characters'),
  name: z.string().min(2, 'Name must have at least 2 characters'),
  birthDate: z
    .string()
    .min(1, 'Birth date is required')
    .refine((date) => {
      const age = calculateAge(date)
      return age >= 18
    }, {
      message: 'You must be at least 18 years old to sign up'
    }),
});

export const signInSchema = z.object({
  emailOrUsername: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be at most 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  confirmPassword: z.string().min(1, "Please confirm your password")
}).refine((data: { newPassword: string; confirmPassword: string }) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const checkUsernameSchema = z.object({
  username: z.string()
    .min(3, 'Username must have at least 3 characters')
    .max(15, 'Username must have at most 15 characters')
    .regex(/^[a-zA-Z0-9_.]+$/, 'Username can only contain letters, numbers, underscores, and dots'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must have at least 2 characters').optional(),
  bio: z.string().max(160, 'Bio must have at most 160 characters').nullable().optional(),
  location: z.string().max(80, 'Location must have at most 80 characters').nullable().optional(),
  website: z.string()
    .refine((val) => {
      if (!val || val === '') return true
      
      const urlPattern = /^(?:https?:\/\/)?(?:[\w-]+\.)+[a-z]{2,}(?:\/[^\s]*)?$/i
      
      return urlPattern.test(val)
    }, {
      message: 'Website must be a valid URL (e.g., example.com or https://example.com)'
    })
    .refine((val) => !val || val.length <= 200, {
      message: 'Website must have at most 200 characters'
    })
    .nullable()
    .optional(),
  birthDate: z.string().optional(),
  username: z.string()
    .min(3, 'Username must have at least 3 characters')
    .max(15, 'Username must have at most 15 characters')
    .regex(/^[a-zA-Z0-9_.]+$/, 'Username can only contain letters, numbers, underscores, and dots')
    .optional(),
});

export const updateNameSchema = z.object({
  name: z.string().min(2, 'Name must have at least 2 characters').max(50, 'Name must have at most 50 characters'),
});

export const updateUsernameSchema = z.object({
  username: z.string()
    .min(3, 'Username must have at least 3 characters')
    .max(15, 'Username must have at most 15 characters')
    .regex(/^[a-zA-Z0-9_.]+$/, 'Username can only contain letters, numbers, underscores, and dots'),
});

export const updateBirthDateSchema = z.object({
  birthDate: z
    .string()
    .min(1, 'Birth date is required')
    .refine((date) => {
      const age = calculateAge(date)
      return age >= 18
    }, {
      message: 'You must be at least 18 years old'
    }),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type CheckUsernameInput = z.infer<typeof checkUsernameSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateNameInput = z.infer<typeof updateNameSchema>;
export type UpdateUsernameInput = z.infer<typeof updateUsernameSchema>;
export type UpdateBirthDateInput = z.infer<typeof updateBirthDateSchema>;
