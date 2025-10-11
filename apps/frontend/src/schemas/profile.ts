import { z } from 'zod'
import { calculateAge } from '@/utils/date'

const bioString = z.string().max(160, 'Bio must have at most 160 characters')
const locationString = z.string().max(80, 'Location must have at most 80 characters')

const websiteString = z.string()
  .refine((val) => {
    if (val === '') return true
    
    // URL pattern that requires at least domain.tld format
    // Accepts: example.com, www.example.com, https://example.com, http://subdomain.example.com/path
    // Rejects: www, example, http://, just-text
    const urlPattern = /^(?:https?:\/\/)?(?:[\w-]+\.)+[a-z]{2,}(?:\/[^\s]*)?$/i
    
    return urlPattern.test(val)
  }, {
    message: 'Website must be a valid URL (e.g., example.com or https://example.com)'
  })
  .refine((val) => val.length <= 200, {
    message: 'Website must have at most 200 characters'
  })

export const editProfileSchema = z.object({
  bio: bioString.nullable().optional().or(z.literal('')),
  location: locationString.nullable().optional().or(z.literal('')),
  website: websiteString.nullable().optional().or(z.literal('')),
})

export type EditProfileFormData = z.infer<typeof editProfileSchema>

function getMaxFromZodString(str: z.ZodString): number | undefined {
  const def: any = (str as unknown as any)._def
  const checks: Array<{ kind: string; value?: number }> = def?.checks || []
  const maxCheck = checks.find((c) => c.kind === 'max')
  return maxCheck?.value
}

export const editProfileFieldMax = {
  bio: getMaxFromZodString(bioString) ?? 160,
  location: getMaxFromZodString(locationString) ?? 80,
  website: 200, // Max length defined in websiteString refine
}

export const editNameSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters')
})

export const editUsernameSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(15, 'Username must be at most 15 characters')
    .regex(/^[a-zA-Z0-9_.]+$/, 'Username can only contain letters (a-z, A-Z), numbers (0-9), underscores (_), and dots (.)')
})

export const editBirthDateSchema = z.object({
  birthDate: z
    .string()
    .min(1, 'Birth date is required')
    .refine((date) => {
      const age = calculateAge(date)
      return age >= 18
    }, {
      message: 'You must be at least 18 years old'
    })
})

export type EditNameFormData = z.infer<typeof editNameSchema>
export type EditUsernameFormData = z.infer<typeof editUsernameSchema>
export type EditBirthDateFormData = z.infer<typeof editBirthDateSchema>

