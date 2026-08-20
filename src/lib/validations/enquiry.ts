import { z } from 'zod';

export const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;

export const trialEnquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  age_group: z.string().min(1, 'Please select an age group'),
  phone: z.string().regex(phoneRegex, 'Please enter a valid phone number'),
  whatsapp: z.string().optional(),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  preferred_branch: z.string().min(1, 'Please select a preferred branch'),
  interested_program: z.string().min(1, 'Please select a program'),
  experience_level: z.string().optional(),
  preferred_time: z.string().optional(),
  message: z.string().max(1000, 'Message must be less than 1000 characters').optional(),
  privacy_consent: z.boolean().refine((val) => val === true, 'You must consent to the privacy policy'),
  honeypot: z.string().max(0, 'Spam detected').optional(), // Must be empty
  turnstile_token: z.string().min(1, 'Spam protection check required'),
});

export const schoolWorkshopSchema = z.object({
  institution_name: z.string().min(2, 'Institution name must be at least 2 characters').max(200),
  institution_type: z.string().min(1, 'Please select institution type'),
  contact_person: z.string().min(2, 'Contact person name must be at least 2 characters').max(100),
  designation: z.string().max(100).optional(),
  phone: z.string().regex(phoneRegex, 'Please enter a valid phone number'),
  whatsapp: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
  city: z.string().min(2, 'City name must be at least 2 characters').max(100),
  student_grade_range: z.string().max(100).optional(),
  participant_count: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().min(1).max(10000).optional()),
  preferred_date: z.string().optional().or(z.literal('')),
  preferred_duration: z.string().optional(),
  venue: z.string().min(1, 'Please select a venue option'),
  workshop_type: z.string().min(1, 'Please select a workshop type'),
  goals: z.string().max(1000).optional(),
  message: z.string().max(2000).optional(),
  privacy_consent: z.boolean().refine((val) => val === true, 'You must consent to the privacy policy'),
  honeypot: z.string().max(0, 'Spam detected').optional(), // Must be empty
  turnstile_token: z.string().min(1, 'Spam protection check required'),
});

export const contactEnquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().regex(phoneRegex, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  subject: z.string().max(200).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
  branch_id: z.string().optional(),
  privacy_consent: z.boolean().refine((val) => val === true, 'You must consent to the privacy policy'),
  honeypot: z.string().max(0, 'Spam detected').optional(), // Must be empty
  turnstile_token: z.string().min(1, 'Spam protection check required'),
});
