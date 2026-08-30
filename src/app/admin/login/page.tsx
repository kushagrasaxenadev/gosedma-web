'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginInput = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();
  const nextRedirect = searchParams.get('next') || '/admin';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);

    try {
      // DEMO MODE BYPASS
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL && data.email === 'admin@gosedma.com' && data.password === 'demo123') {
        document.cookie = "gosedma_demo_admin=true; path=/; max-age=86400";
        router.push(nextRedirect);
        router.refresh();
        return;
      }

      // Authenticate with Supabase
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      // Check if user has an admin profile
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Authentication failed');
      }

      // Check profile role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || !profile || !['super_admin', 'content_admin'].includes(profile.role)) {
        // Sign out if unauthorized role
        await supabase.auth.signOut();
        throw new Error('Access denied. You do not have administrator permissions.');
      }

      router.push(nextRedirect);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 text-error text-sm rounded-lg" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          required
          error={errors.email?.message}
          placeholder="admin@gosedma.com"
          {...register('email')}
        />

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="form-label mb-0" htmlFor="password">
              Password <span className="text-error">*</span>
            </label>
          </div>
          <Input
            type="password"
            required
            error={errors.password?.message}
            placeholder="••••••••"
            {...register('password')}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full justify-center mt-2 py-3 bg-brand-navy hover:bg-brand-navy-light text-white text-base"
          loading={isLoading}
        >
          Sign In to Dashboard
        </Button>
      </form>
    </>
  );
}

function LoginFormFallback() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-10 bg-muted rounded-lg" />
      <div className="h-10 bg-muted rounded-lg" />
      <div className="h-12 bg-muted rounded-lg" />
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-hero pattern-overlay p-4">
      <div className="w-full max-w-md bg-surface rounded-2xl shadow-xl border border-border-light overflow-hidden animate-scale-in">
        <div className="p-6 md:p-8 bg-brand-deep-navy text-white text-center relative">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-green to-brand-green-light" />
          <h2 className="font-heading font-bold text-3xl tracking-wide uppercase text-white">
            GOSEDMA
          </h2>
          <p className="text-white/80 text-sm mt-1 uppercase tracking-wider">
            Richa Gaur Academy • Admin Portal
          </p>
        </div>

        <div className="p-6 md:p-8">
          <Suspense fallback={<LoginFormFallback />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
