import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'navy' | 'green' | 'success' | 'warning' | 'error' | 'muted';
  className?: string;
}

export function Badge({ children, variant = 'navy', className }: BadgeProps) {
  const variants: Record<string, string> = {
    navy: 'badge-navy',
    green: 'badge-green',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    muted: 'bg-muted text-muted-foreground',
  };

  return (
    <span className={cn('badge', variants[variant], className)}>
      {children}
    </span>
  );
}
