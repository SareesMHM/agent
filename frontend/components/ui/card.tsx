import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

export const Card = ({ className, ...p }: HTMLAttributes<HTMLDivElement>) => <div className={cn('rounded-xl border border-slate-200 bg-white p-5 shadow-sm', className)} {...p} />;
export const CardTitle = ({ className, ...p }: HTMLAttributes<HTMLHeadingElement>) => <h3 className={cn('mb-2 text-base font-semibold', className)} {...p} />;
