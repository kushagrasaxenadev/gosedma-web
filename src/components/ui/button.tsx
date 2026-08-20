import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'whatsapp' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants: Record<string, string> = {
      primary:
        'bg-brand-navy text-white hover:bg-brand-navy-light focus-visible:outline-brand-navy shadow-sm hover:shadow-md active:scale-[0.98]',
      secondary:
        'bg-brand-green text-white hover:bg-brand-green-dark focus-visible:outline-brand-green shadow-sm hover:shadow-md active:scale-[0.98]',
      outline:
        'border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white focus-visible:outline-brand-navy active:scale-[0.98]',
      ghost:
        'text-brand-navy hover:bg-brand-navy/5 focus-visible:outline-brand-navy',
      whatsapp:
        'bg-[#25D366] text-white hover:bg-[#20BD5A] focus-visible:outline-[#25D366] shadow-sm hover:shadow-md active:scale-[0.98]',
      danger:
        'bg-error text-white hover:bg-red-600 focus-visible:outline-error shadow-sm active:scale-[0.98]',
    };

    const sizes: Record<string, string> = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-5 text-sm',
      lg: 'h-12 px-6 text-base',
      xl: 'h-14 px-8 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export { Button };
