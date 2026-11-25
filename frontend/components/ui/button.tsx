import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' | 'danger' | 'ghost' };

export function Button({ variant = 'primary', className, ...p }: Props) {
  const v = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700',
    outline: 'border border-slate-300 bg-white hover:bg-slate-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'hover:bg-slate-100',
  }[variant];
  return <button className={cn('rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed', v, className)} {...p} />;
}
