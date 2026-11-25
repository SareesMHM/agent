'use client';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { CompanyForm } from '@/components/companies/CompanyForm';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useApi } from '@/hooks/useApi';
import type { Company } from '@/types';

export default function Page() {
  const { companyId } = useParams<{ companyId: string }>();
  const { data, reload } = useApi<Company>(`/organizations/${companyId}`);
  
  if (!data) return <LoadingSpinner />;
  
  return (
    <div className="min-h-screen bg-base p-6 md:p-8">
      <PageHeader 
        title="Company settings" 
        subtitle="Manage your organization's details and preferences." 
      />
      
      {/* 
        Assuming your <CompanyForm> has its own internal wrapper. 
        If not, you can wrap it in a panel here like this:
        <div className="rounded-[1.5rem] border border-soft bg-panel p-6 shadow-soft">
          <CompanyForm initial={data} onSaved={() => reload()} />
        </div>
      */}
      <div className="max-w-3xl">
        <CompanyForm initial={data} onSaved={() => reload()} />
      </div>
    </div>
  );
}