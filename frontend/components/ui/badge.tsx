import { cn } from '@/lib/utils';

const colors: Record<string, string> = {
  COMPLETED: 'bg-green-100 text-green-700', APPROVED: 'bg-green-100 text-green-700', READY: 'bg-green-100 text-green-700', IDLE: 'bg-slate-100 text-slate-600',
  IN_PROGRESS: 'bg-blue-100 text-blue-700', RUNNING: 'bg-blue-100 text-blue-700', ACTIVE: 'bg-blue-100 text-blue-700',
  REVIEW: 'bg-amber-100 text-amber-700', PENDING: 'bg-amber-100 text-amber-700', ANALYZING: 'bg-amber-100 text-amber-700',
  FAILED: 'bg-red-100 text-red-700', REJECTED: 'bg-red-100 text-red-700', ERROR: 'bg-red-100 text-red-700', BLOCKED: 'bg-red-100 text-red-700',
};
export const Badge = ({ value }: { value: string }) => (
  <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', colors[value] ?? 'bg-slate-100 text-slate-600')}>{value.replace('_', ' ')}</span>
);
