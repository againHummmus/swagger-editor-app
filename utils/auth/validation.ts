import { z } from 'zod';

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'validation.emailRequired')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
      message: 'validation.emailInvalid',
    }),
  password: z.string().min(1, 'validation.passwordRequired'),
});

export const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, 'validation.emailRequired')
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
        message: 'validation.emailInvalid',
      }),
    password: z
      .string()
      .min(8, 'validation.passwordMinLength')
      .regex(/[\p{L}]/u, 'validation.passwordLetter')
      .regex(/\d/, 'validation.passwordDigit')
      .regex(/[^\w\s]/, 'validation.passwordSpecial'),
    confirmPassword: z.string().min(1, 'validation.confirmRequired'),
    userName: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'validation.confirmMismatch',
    path: ['confirmPassword'],
  });
