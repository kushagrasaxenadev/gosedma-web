'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactEnquirySchema } from '@/lib/validations/enquiry';
import { submitContactEnquiry } from '@/actions/enquiries';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Turnstile } from '@/components/ui/turnstile';

import { z } from 'zod';

type ContactFormValues = z.infer<typeof contactEnquirySchema>;

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<any>({
    resolver: zodResolver(contactEnquirySchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      subject: '',
      message: '',
      branch_id: '',
      privacy_consent: false,
      honeypot: '',
      turnstile_token: '',
    },
  });

  const onSubmit = async (data: any) => {
    setStatus('loading');
    try {
      const response = await submitContactEnquiry(data);
      if (response.success) {
        setStatus('success');
        setMessage(response.message || 'Message sent successfully!');
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
        <h3 className="font-heading font-bold text-2xl text-foreground mb-2">Message Sent!</h3>
        <p className="text-foreground-secondary mb-6">{message}</p>
        <Button variant="outline" onClick={() => setStatus('idle')}>
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-xl mx-auto card p-6 md:p-8 bg-surface">
      <h3 className="font-heading font-bold text-2xl text-foreground border-b border-border-light pb-3">
        Send Us a Message
      </h3>

      {/* Honeypot field (spam prevention) */}
      <input type="text" className="hidden" {...register('honeypot')} />

      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Your Name" required error={errors.name?.message?.toString()} {...register('name')} />
        <Input label="Phone Number" required error={errors.phone?.message?.toString()} {...register('phone')} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Email Address" error={errors.email?.message?.toString()} {...register('email')} />
        <Select
          label="Relevant Branch"
          error={errors.branch_id?.message?.toString()}
          options={[
            { value: 'any', label: 'General / All Branches' },
            { value: 'malviya-nagar', label: 'Malviya Nagar' },
            { value: 'sitapura', label: 'Sitapura' },
          ]}
          placeholder="Select branch"
          {...register('branch_id')}
        />
      </div>

      <Input label="Subject" error={errors.subject?.message?.toString()} {...register('subject')} />

      <Textarea label="Your Message" required error={errors.message?.message?.toString()} {...register('message')} />

      <div className="flex items-start gap-2.5">
        <input
          type="checkbox"
          id="privacy_consent"
          className="mt-1"
          {...register('privacy_consent')}
        />
        <label htmlFor="privacy_consent" className="text-sm text-foreground-secondary">
          I consent to having this website store my submitted information so they can respond to my inquiry. *
        </label>
      </div>
      {errors.privacy_consent && (
        <p className="form-error">{errors.privacy_consent.message?.toString()}</p>
      )}

      {/* Cloudflare Turnstile */}
      <div className="pt-2">
        <Turnstile onVerify={useCallback((token: string) => setValue('turnstile_token', token, { shouldValidate: true }), [setValue])} />
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
        Send Message
      </Button>
    </form>
  );
}
