import { z } from 'zod'

const bioString = z.string().max(160, 'Bio must have at most 160 characters')
const locationString = z.string().max(80, 'Location must have at most 80 characters')
const websiteString = z.string().max(200, 'Website must have at most 200 characters')

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
  website: getMaxFromZodString(websiteString) ?? 200,
}


