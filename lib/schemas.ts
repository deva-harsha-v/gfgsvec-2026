import { z } from 'zod';
import { RECRUITMENT_ROLES } from './roles';

export const ALLOWED_DOMAINS = RECRUITMENT_ROLES.map((role) => role.key) as [string, ...string[]];

export const ApplicantSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  rollNumber: z
    .string()
    .trim()
    .min(1, 'Roll number is required')
    .toUpperCase(),
  year: z.enum(['2nd Year', '3rd Year'] as const),
  section: z.string().trim().min(1, 'Section is required'),
  interestedFields: z.array(z.enum(ALLOWED_DOMAINS)).min(1, 'Select at least one field of interest'),
  hasPastExperience: z.boolean(),
  pastExperience: z.string().trim().optional().nullable(),
  previousWorkLinks: z.array(z.string().trim()),
  reasonForJoining: z.string().trim().min(10, 'Please provide a more detailed reason (minimum 10 characters)'),
  contribution: z.string().trim().min(10, 'Please detail how you want to contribute (minimum 10 characters)'),
  clubKnowledge: z.string().trim().min(10, 'Please share what you know about the club (minimum 10 characters)'),
});

export const AdminLoginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Passwords do not match',
  path: ['confirmNewPassword'],
});

export const EvaluationSchema = z.object({
  interviewPresented: z.boolean(),
  interviewRating: z.number().int().min(1).max(5).nullable().optional(),
  interviewNotes: z.string().trim().nullable().optional(),
  applicationStatus: z.enum(['NEW', 'UNDER_REVIEW', 'INTERVIEWED', 'SELECTED', 'REJECTED']),
}).refine((data) => {
  if (!data.interviewPresented && data.interviewRating !== null && data.interviewRating !== undefined) {
    return false;
  }
  return true;
}, {
  message: 'Rating must be null if the student did not present for the interview',
  path: ['interviewRating'],
});