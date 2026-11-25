'use client';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const tabs = ['', 'roles', 'agents', 'tasks', 'workflows', 'documents', 'approvals', 'analytics'];

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const { projectId } = useParams<{ projectId: string }>();
  const path = usePathname();
  return (
    <>
      <nav className="mb-6 flex flex-wrap gap-1 border-b">
        {tabs.map((t) => {
          const href = `/projects/${projectId}${t ? '/' + t : ''}`;
          const active = t ? path.startsWith(href) : path === href;
          return <Link key={t} href={href} className={cn('px-3 py-2 text-sm capitalize', active ? 'border-b-2 border-brand-600 font-medium text-brand-700' : 'text-slate-500')}>{t || 'Overview'}</Link>;
        })}
      </nav>
      {children}
    </>
  );
}
