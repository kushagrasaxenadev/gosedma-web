'use server';

import { createClient } from '@/lib/supabase/server';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { sendEmail } from '@/lib/email/service';
import {
  trialEnquirySchema,
  schoolWorkshopSchema,
  contactEnquirySchema,
} from '@/lib/validations/enquiry';

interface ActionResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function submitTrialEnquiry(formData: unknown): Promise<ActionResponse> {
  const result = trialEnquirySchema.safeParse(formData);

  if (!result.success) {
    return { success: false, error: 'Invalid form data. Please check all fields.' };
  }

  const data = result.data;

  // Verify Turnstile
  const isHuman = await verifyTurnstileToken(data.turnstile_token);
  if (!isHuman) {
    return { success: false, error: 'Spam protection check failed. Please try again.' };
  }

  // Attempt database persistence
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('trial_enquiries').insert({
      name: data.name,
      age_group: data.age_group,
      phone: data.phone,
      whatsapp: data.whatsapp || null,
      email: data.email || null,
      preferred_branch: data.preferred_branch === 'any' ? null : data.preferred_branch,
      interested_program: data.interested_program,
      experience_level: data.experience_level || null,
      preferred_time: data.preferred_time || null,
      message: data.message || null,
      privacy_consent: data.privacy_consent,
    });

    if (error) {
      // If table is missing or DB not configured, we log it but don't crash
      console.error('Database insert error:', error);
      if (error.code === 'PGRST116' || error.code === '42P01') {
        console.warn('Supabase DB tables do not exist yet. Running in fallback mode.');
      } else {
        throw new Error(error.message);
      }
    }
  } catch (dbErr) {
    console.error('Supabase persistence failed, running in fallback mode:', dbErr);
  }

  // Attempt email notification
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (adminEmail) {
    await sendEmail({
      to: adminEmail,
      subject: `New Trial Class Enquiry - ${data.name}`,
      html: `
        <h2>New Trial Class Enquiry</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Age Group:</strong> ${data.age_group}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>WhatsApp:</strong> ${data.whatsapp || 'N/A'}</p>
        <p><strong>Email:</strong> ${data.email || 'N/A'}</p>
        <p><strong>Branch ID:</strong> ${data.preferred_branch}</p>
        <p><strong>Program:</strong> ${data.interested_program}</p>
        <p><strong>Experience Level:</strong> ${data.experience_level || 'N/A'}</p>
        <p><strong>Preferred Time:</strong> ${data.preferred_time || 'N/A'}</p>
        <p><strong>Message:</strong> ${data.message || 'N/A'}</p>
      `,
    });
  }

  return { success: true, message: 'Your free trial class has been booked successfully!' };
}

export async function submitWorkshopEnquiry(formData: unknown): Promise<ActionResponse> {
  const result = schoolWorkshopSchema.safeParse(formData);

  if (!result.success) {
    return { success: false, error: 'Invalid form data. Please check all fields.' };
  }

  const data = result.data;

  // Verify Turnstile
  const isHuman = await verifyTurnstileToken(data.turnstile_token);
  if (!isHuman) {
    return { success: false, error: 'Spam protection check failed. Please try again.' };
  }

  // Attempt database persistence
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('workshop_enquiries').insert({
      institution_name: data.institution_name,
      institution_type: data.institution_type,
      contact_person: data.contact_person,
      designation: data.designation || null,
      phone: data.phone,
      whatsapp: data.whatsapp || null,
      email: data.email,
      city: data.city,
      student_grade_range: data.student_grade_range || null,
      participant_count: data.participant_count || null,
      preferred_date: data.preferred_date || null,
      preferred_duration: data.preferred_duration || null,
      venue: data.venue,
      workshop_type: data.workshop_type,
      goals: data.goals || null,
      message: data.message || null,
      privacy_consent: data.privacy_consent,
    });

    if (error) {
      console.error('Database insert error:', error);
      if (error.code === 'PGRST116' || error.code === '42P01') {
        console.warn('Supabase DB tables do not exist yet. Running in fallback mode.');
      } else {
        throw new Error(error.message);
      }
    }
  } catch (dbErr) {
    console.error('Supabase persistence failed, running in fallback mode:', dbErr);
  }

  // Attempt email notification
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (adminEmail) {
    await sendEmail({
      to: adminEmail,
      subject: `New School Workshop Request - ${data.institution_name}`,
      html: `
        <h2>New School/Institutional Workshop Request</h2>
        <p><strong>Institution Name:</strong> ${data.institution_name}</p>
        <p><strong>Institution Type:</strong> ${data.institution_type}</p>
        <p><strong>Contact Person:</strong> ${data.contact_person}</p>
        <p><strong>Designation:</strong> ${data.designation || 'N/A'}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>WhatsApp:</strong> ${data.whatsapp || 'N/A'}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>City:</strong> ${data.city}</p>
        <p><strong>Grade Range:</strong> ${data.student_grade_range || 'N/A'}</p>
        <p><strong>Participant Count:</strong> ${data.participant_count || 'N/A'}</p>
        <p><strong>Venue Option:</strong> ${data.venue}</p>
        <p><strong>Workshop Type:</strong> ${data.workshop_type}</p>
        <p><strong>Goals:</strong> ${data.goals || 'N/A'}</p>
        <p><strong>Message:</strong> ${data.message || 'N/A'}</p>
      `,
    });
  }

  return { success: true, message: 'Your workshop request has been submitted successfully!' };
}

export async function submitContactEnquiry(formData: unknown): Promise<ActionResponse> {
  const result = contactEnquirySchema.safeParse(formData);

  if (!result.success) {
    return { success: false, error: 'Invalid form data. Please check all fields.' };
  }

  const data = result.data;

  // Verify Turnstile
  const isHuman = await verifyTurnstileToken(data.turnstile_token);
  if (!isHuman) {
    return { success: false, error: 'Spam protection check failed. Please try again.' };
  }

  // Attempt database persistence
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('contact_enquiries').insert({
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      subject: data.subject || null,
      message: data.message,
      branch_id: data.branch_id === 'any' ? null : data.branch_id,
      privacy_consent: data.privacy_consent,
    });

    if (error) {
      console.error('Database insert error:', error);
      if (error.code === 'PGRST116' || error.code === '42P01') {
        console.warn('Supabase DB tables do not exist yet. Running in fallback mode.');
      } else {
        throw new Error(error.message);
      }
    }
  } catch (dbErr) {
    console.error('Supabase persistence failed, running in fallback mode:', dbErr);
  }

  // Attempt email notification
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (adminEmail) {
    await sendEmail({
      to: adminEmail,
      subject: `New Contact Enquiry - ${data.name}`,
      html: `
        <h2>New Contact Enquiry</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Email:</strong> ${data.email || 'N/A'}</p>
        <p><strong>Subject:</strong> ${data.subject || 'N/A'}</p>
        <p><strong>Message:</strong> ${data.message}</p>
      `,
    });
  }

  return { success: true, message: 'Your message has been sent successfully!' };
}
