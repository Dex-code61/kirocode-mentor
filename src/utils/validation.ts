import { z } from 'zod';

// Auth validation schemas
export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const signUpSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password too long')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one lowercase letter, one uppercase letter, and one number'
      ),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password too long')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one lowercase letter, one uppercase letter, and one number'
      ),
    confirmPassword: z.string(),
    token: z.string().min(1, 'Reset token is required'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// User validation schemas
export const userSchema = z.object({
  id: z.string().cuid(),
  email: z.string().email(),
  username: z.string().min(3).max(20),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const userProfileSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid(),
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  avatar: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  currentLevel: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const learningPreferencesSchema = z.object({
  learningStyle: z.enum(['visual', 'auditory', 'kinesthetic', 'mixed']),
  preferredLanguages: z.array(z.string()),
  difficultyPreference: z.enum(['adaptive', 'challenging', 'comfortable']),
  sessionDuration: z.number().min(15).max(180), // 15 minutes to 3 hours
  notificationSettings: z.object({
    email: z.boolean(),
    push: z.boolean(),
    reminders: z.boolean(),
    achievements: z.boolean(),
  }),
});

// Exercise validation schemas
export const exerciseSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  type: z.enum(['coding', 'quiz', 'project', 'debugging']),
  difficulty: z.number().min(1).max(10),
  content: z.object({
    instructions: z.string().min(1),
    startingCode: z.string().optional(),
    expectedSolution: z.string().optional(),
    testCases: z.array(
      z.object({
        id: z.string().cuid(),
        input: z.any(),
        expectedOutput: z.any(),
        description: z.string().optional(),
      })
    ),
    hints: z.array(
      z.object({
        id: z.string().cuid(),
        content: z.string().min(1),
        order: z.number().min(0),
      })
    ),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const userProgressSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid(),
  exerciseId: z.string().cuid(),
  status: z.enum(['not_started', 'in_progress', 'completed', 'mastered']),
  attempts: z.number().min(0),
  timeSpent: z.number().min(0),
  masteryScore: z.number().min(0).max(1),
  lastAccessed: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Code analysis validation schemas
export const codeAnalysisSchema = z.object({
  id: z.string().cuid(),
  code: z.string().min(1),
  language: z.string().min(1),
  errors: z.array(
    z.object({
      line: z.number().min(1),
      column: z.number().min(1),
      message: z.string().min(1),
      severity: z.enum(['error', 'warning', 'info']),
      fixSuggestion: z.string().optional(),
      explanation: z.string().min(1),
    })
  ),
  warnings: z.array(
    z.object({
      line: z.number().min(1),
      column: z.number().min(1),
      message: z.string().min(1),
      type: z.string().min(1),
    })
  ),
  suggestions: z.array(
    z.object({
      line: z.number().min(1),
      column: z.number().min(1),
      message: z.string().min(1),
      improvement: z.string().min(1),
    })
  ),
  complexity: z.object({
    cyclomatic: z.number().min(0),
    cognitive: z.number().min(0),
    maintainability: z.number().min(0).max(100),
  }),
  patterns: z.array(
    z.object({
      name: z.string().min(1),
      description: z.string().min(1),
      confidence: z.number().min(0).max(1),
    })
  ),
});

// Utility functions for validation
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

export function isValidData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): data is T {
  return schema.safeParse(data).success;
}

// Type exports for auth
export type SignIn = z.infer<typeof signInSchema>;
export type SignUp = z.infer<typeof signUpSchema>;
export type ForgotPassword = z.infer<typeof forgotPasswordSchema>;
export type ResetPassword = z.infer<typeof resetPasswordSchema>;
