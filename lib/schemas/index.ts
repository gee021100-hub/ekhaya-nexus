import { z } from 'zod';

const mwkPhone = z
  .string()
  .trim()
  .regex(/^(?:00|\+?)?(?:265)?[17989]\d{8}$/, 'Enter a valid Malawi phone number');

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Enter your full name').max(120),
    email: z.string().trim().toLowerCase().email('Enter a valid email address'),
    password: z.string().min(8, 'Choose at least 8 characters'),
    confirmPassword: z.string(),
    mobile: mwkPhone,
    whatsapp: mwkPhone.optional().or(z.literal('').transform(() => undefined)),
    dateOfBirth: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date of birth (YYYY-MM-DD)')
      .optional(),
    location: z.string().trim().max(120).optional(),
    preferredChannel: z.enum(['email', 'sms', 'inapp']).default('email'),
    campaignSource: z.string().trim().max(80).optional(),
    agreeToTerms: z.boolean().refine((v) => v === true, 'You must accept the terms'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const signInSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter your email'),
  password: z.string().min(1, 'Enter your password'),
});
export type SignInInput = z.infer<typeof signInSchema>;

export const contactSchema = z.object({
  category: z.string().min(1, 'Choose a category'),
  message: z.string().trim().min(10, 'Tell us a bit more (min 10 characters)').max(2000),
  preferredChannel: z.enum(['email', 'sms', 'inapp']).default('email'),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const rejectionSchema = z.object({
  notes: z.string().trim().min(2, 'Add a note').max(500).optional(),
});
export type RejectionInput = z.infer<typeof rejectionSchema>;