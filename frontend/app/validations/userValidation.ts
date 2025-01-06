import { z } from 'zod';

// Signup form validation schema
export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .trim(),
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long.' })
    .trim(),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .regex(/[a-zA-Z]/, { message: 'Password must contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Password must contain at least one special character.',
    })
    .trim()
});

// Signin form validation schema
export const SigninFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(1, { message: 'Please enter your password.' })
    .trim(),
});

// Types for the form states based on the schemas
export type SignupFormState = z.infer<typeof SignupFormSchema>;
export type SigninFormState = z.infer<typeof SigninFormSchema>;

export type FormState<T> = {
  errors?: Partial<Record<keyof T, string[]>>;
  message?: string;
};
