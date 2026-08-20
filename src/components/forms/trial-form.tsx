'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { trialEnquirySchema } from '@/lib/validations/enquiry';
import { submitTrialEnquiry } from '@/actions/enquiries';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Turnstile } from '@/components/ui/turnstile';
import { PROGRAM_CATEGORIES } from '@/lib/constants';

import { z } from 'zod';

type TrialFormValues = z.infer<typeof trialEnquirySchema>;

export function TrialForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<any>({
    resolver: zodResolver(trialEnquirySchema),
    defaultValues: {
      name: '',
      age_group: '',
      phone: '',
      whatsapp: '',
      email: '',
      preferred_branch: '',
      interested_program: '',
      experience_level: '',
      preferred_time: '',
      message: '',
      privacy_consent: false,
      honeypot: '',
      turnstile_token: '',
    },
  });

  const onSubmit = async (data: any) => {
    setStatus('loading');
    try {
      const response = await submitTrialEnquiry(data);
      if (response.success) {
        setStatus('success');
        setMessage(response.message || 'Trial booked successfully!');
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
      <div className="card p-8 text-center max-w-lg mx-auto bg-white">
        <div className="w-16 h-16 bg-success/15 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-heading font-bold text-2xl text-brand-deep-navy mb-2">Thank You!</h3>
        <p className="text-foreground-secondary mb-6">{message}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={() => setStatus('idle')}>
            Book Another Trial
          </Button>
          <a
            href={`https://wa.me/919999999999?text=${encodeURIComponent('Hi GOSEDMA, I just submitted a trial booking online.')}`}
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-xl mx-auto card p-6 md:p-8 bg-white">
      <h3 className="font-heading font-bold text-2xl text-brand-deep-navy border-b border-border-light pb-3">
        Book a Free Trial
      </h3>

      {/* Honeypot field (spam prevention) */}
      <input type="text" className="hidden" {...register('honeypot')} />

      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Your Name" required error={errors.name?.message?.toString()} {...register('name')} />
        <Select
          label="Age Group"
          required
          error={errors.age_group?.message?.toString()}
          options={[
            { value: 'child', label: 'Child (5-12 years)' },
            { value: 'teen', label: 'Teen (13-17 years)' },
            { value: 'adult', label: 'Adult (18+ years)' },
          ]}
          placeholder="Select age group"
          {...register('age_group')}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Phone Number" required error={errors.phone?.message?.toString()} {...register('phone')} />
        <Input label="WhatsApp Number" error={errors.whatsapp?.message?.toString()} {...register('whatsapp')} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Email Address" error={errors.email?.message?.toString()} {...register('email')} />
        <Select
          label="Preferred Branch"
          required
          error={errors.preferred_branch?.message?.toString()}
          options={[
            { value: 'any', label: 'Any Branch / Flexible' },
            { value: 'malviya-nagar', label: 'Malviya Nagar' },
            { value: 'sitapura', label: 'Sitapura' },
          ]}
          placeholder="Select branch"
          {...register('preferred_branch')}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Select
          label="Interested Program"
          required
          error={errors.interested_program?.message?.toString()}
          options={PROGRAM_CATEGORIES.map((p) => ({ value: p.toLowerCase().replace(/\s+/g, '-'), label: p }))}
          placeholder="Select program"
          {...register('interested_program')}
        />
        <Select
          label="Experience Level"
          error={errors.experience_level?.message?.toString()}
          options={[
            { value: 'beginner', label: 'Beginner (No experience)' },
            { value: 'intermediate', label: 'Intermediate' },
            { value: 'advanced', label: 'Advanced athlete' },
          ]}
          {...register('experience_level')}
        />
      </div>

      <Select
        label="Preferred Timing"
        error={errors.preferred_time?.message?.toString()}
        options={[
          { value: 'morning', label: 'Morning batches' },
          { value: 'evening', label: 'Evening batches' },
          { value: 'flexible', label: 'Flexible / Any timing' },
        ]}
        {...register('preferred_time')}
      />

      <Textarea label="Message or Special Requests" error={errors.message?.message?.toString()} {...register('message')} />

      <div className="flex items-start gap-2.5">
        <input
          type="checkbox"
          id="privacy_consent"
          className="mt-1"
          {...register('privacy_consent')}
        />
        <label htmlFor="privacy_consent" className="text-sm text-foreground-secondary">
          I consent to the collection and processing of my contact information to schedule the trial class. *
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
        Submit Booking Request
      </Button>
    </form>
  );
}
