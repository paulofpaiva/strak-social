import { z } from 'zod';

export const followUserSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
});

export const unfollowUserSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
});

export type FollowUserInput = z.infer<typeof followUserSchema>;
export type UnfollowUserInput = z.infer<typeof unfollowUserSchema>;
