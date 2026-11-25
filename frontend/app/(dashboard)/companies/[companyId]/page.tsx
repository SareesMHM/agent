'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useApi } from '@/hooks/useApi';
import type { Company } from '@/types';

export default function Page() {
  const { companyId } = useParams<{ companyId: string }>();
  const { data: c } = useApi<Company>(`/organizations/${companyId}`);
  
  if (!c) return <LoadingSpinner />;
  
  return (
    <div className="min-h-screen bg-base p-6 md:p-8">
      <PageHeader title={c.name} subtitle={c.industry ?? undefined} />
      
      {/* Info Card */}
      <Card className="mb-6 rounded-[1.5rem] border border-soft bg-panel p-6 shadow-soft">
        <p className="text-sm text-slate/80 leading-relaxed">
          {c.description || 'No description provided.'}
        </p>
        {c.objectives && (
          <div className="mt-4 pt-4 border-t border-soft">
            <p className="text-sm text-slate/80">
              <span className="font-semibold text-plum">Objectives:</span> {c.objectives}
            </p>
          </div>
        )}
      </Card>

      {/* Navigation Links */}
      <div className="flex flex-wrap gap-4 text-sm font-medium">
        <Link 
          href={`/companies/${c.id}/departments`} 
          className="rounded-lg bg-panel px-4 py-2.5 text-slate shadow-sm border border-soft transition-all hover:border-terracotta hover:text-terracotta hover:shadow-float"
        >
          Departments
        </Link>
        <Link 
          href={`/companies/${c.id}/members`} 
          className="rounded-lg bg-panel px-4 py-2.5 text-slate shadow-sm border border-soft transition-all hover:border-terracotta hover:text-terracotta hover:shadow-float"
        >
          Members
        </Link>
        <Link 
          href={`/companies/${c.id}/settings`} 
          className="rounded-lg bg-panel px-4 py-2.5 text-slate shadow-sm border border-soft transition-all hover:border-terracotta hover:text-terracotta hover:shadow-float"
        >
          Settings
        </Link>
      </div>
    </div>
  );
}