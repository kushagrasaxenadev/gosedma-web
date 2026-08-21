'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schoolWorkshopSchema } from '@/lib/validations/enquiry';
import { submitWorkshopEnquiry } from '@/actions/enquiries';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Turnstile } from '@/components/ui/turnstile';

import { z } from 'zod';

type WorkshopFormValues = z.infer<typeof schoolWorkshopSchema>;

export function WorkshopForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<any>({
    resolver: zodResolver(schoolWorkshopSchema),
    defaultValues: {
      institution_name: '',
      institution_type: '',
      contact_person: '',
      designation: '',
      phone: '',
      whatsapp: '',
      email: '',
      city: '',
      student_grade_range: '',
      participant_count: '', // Reset back to empty string since it is preprocessed
      preferred_date: '',
      preferred_duration: '',
      venue: '',
      workshop_type: '',
      goals: '',
      message: '',
      privacy_consent: false,
      honeypot: '',
      turnstile_token: '',
    },
  });

  const onSubmit = async (data: any) => {
    setStatus('loading');
    try {
      const response = await submitWorkshopEnquiry(data);
      if (response.success) {
        setStatus('success');
        setMessage(response.message || 'Request submitted successfully!');
        reset();
      } else {
        setStatus('error');
        setMessage(response.error || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setMessage('An unexpected error occurred. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="card p-8 text-center max-w-lg mx-auto bg-surface">
        <div className="w-16 h-16 bg-success/15 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-heading font-bold text-2xl text-brand-deep-navy mb-2">Request Submitted!</h3>
        <p className="text-foreground-secondary mb-6">{message}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={() => setStatus('idle')}>
            New Request
          </Button>
          <a
            href={`https://wa.me/919999999999?text=${encodeURIComponent('Hi GOSEDMA, I would like to discuss a self-defence workshop for our school.')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="whatsapp">
              Connect on WhatsApp
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-xl mx-auto card p-6 md:p-8 bg-surface">
      <h3 className="font-heading font-bold text-2xl text-brand-deep-navy border-b border-border-light pb-3">
        School / Institutional Workshop Enquiry
      </h3>

      {/* Honeypot field (spam prevention) */}
      <input type="text" className="hidden" {...register('honeypot')} />

      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Institution Name" required error={errors.institution_name?.message?.toString()} {...register('institution_name')} />
        <Select
          label="Institution Type"
          required
          error={errors.institution_type?.message?.toString()}
          options={[
            { value: 'school', label: 'School' },
            { value: 'college', label: 'College / University' },
            { value: 'ngo', label: 'NGO / Community Center' },
            { value: 'corporate', label: 'Corporate Office' },
            { value: 'other', label: 'Other Institution' },
          ]}
          placeholder="Select type"
          {...register('institution_type')}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Contact Person Name" required error={errors.contact_person?.message?.toString()} {...register('contact_person')} />
        <Input label="Designation" error={errors.designation?.message?.toString()} {...register('designation')} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Phone Number" required error={errors.phone?.message?.toString()} {...register('phone')} />
        <Input label="WhatsApp Number" error={errors.whatsapp?.message?.toString()} {...register('whatsapp')} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Email Address" required type="email" error={errors.email?.message?.toString()} {...register('email')} />
        <Input label="City" required error={errors.city?.message?.toString()} {...register('city')} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Student Grade Range" placeholder="e.g. 6th - 10th grade" error={errors.student_grade_range?.message?.toString()} {...register('student_grade_range')} />
        <Input label="Expected Participant Count" type="number" error={errors.participant_count?.message?.toString()} {...register('participant_count')} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Preferred Date" type="date" error={errors.preferred_date?.message?.toString()} {...register('preferred_date')} />
        <Select
          label="Preferred Duration"
          error={errors.preferred_duration?.message?.toString()}
          options={[
            { value: '1hr', label: '1 Hour Session' },
            { value: '2hr', label: '2 Hour Session' },
            { value: 'half-day', label: 'Half-Day Workshop' },
            { value: 'full-day', label: 'Full-Day Intensive' },
            { value: 'multi-day', label: 'Multi-Day Camp' },
          ]}
          placeholder="Select duration"
          {...register('preferred_duration')}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Select
          label="Workshop Venue"
          required
          error={errors.venue?.message?.toString()}
          options={[
            { value: 'at_institution', label: 'At Our Institution' },
            { value: 'at_academy', label: 'At GOSEDMA Academy' },
            { value: 'either', label: 'Flexible / Either' },
          ]}
          placeholder="Select venue"
          {...register('venue')}
        />
        <Select
          label="Workshop Focus"
          required
          error={errors.workshop_type?.message?.toString()}
          options={[
            { value: 'self-defence', label: 'Self-Defence Training' },
            { value: 'awareness', label: 'Situational Awareness & Safety' },
            { value: 'combined', label: 'Combined Safety & self-defence' },
            { value: 'custom', label: 'Custom Program' },
          ]}
          placeholder="Select focus"
          {...register('workshop_type')}
        />
      </div>

      <Textarea label="What are the main goals of this workshop?" error={errors.goals?.message?.toString()} {...register('goals')} />
      <Textarea label="Additional message or questions" error={errors.message?.message?.toString()} {...register('message')} />

      <div className="flex items-start gap-2.5">
        <input
          type="checkbox"
          id="privacy_consent"
          className="mt-1"
          {...register('privacy_consent')}
        />
        <label htmlFor="privacy_consent" className="text-sm text-foreground-secondary">
          I consent to the collection and processing of our contact details to discuss and schedule the workshop. *
        </label>
      </div>
      {errors.privacy_consent && (
        <p className="form-error">{errors.privacy_consent.message?.toString()}</p>
      )}

      {/* Cloudflare Turnstile */}
      <div className="pt-2">
        <Turnstile onVerify={(token) => setValue('turnstile_token', token, { shouldValidate: true })} />
        {errors.turnstile_token && (
          <p className="form-error">{errors.turnstile_token.message?.toString()}</p>
        )}
      </div>

      {status === 'error' && (
        <div className="p-3 bg-error/10 border border-error/20 text-error text-sm rounded-lg">
          {message}
        </div>
      )}

      <Button type="submit" variant="primary" fullWidth loading={status === 'loading'}>
        Submit Workshop Request
      </Button>
    </form>
  );
}
