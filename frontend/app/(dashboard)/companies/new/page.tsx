'use client';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { CompanyForm } from '@/components/companies/CompanyForm';
import { store } from '@/lib/api-client';

export default function Page() {
  const r = useRouter();
  
  return (
    <div className="min-h-screen bg-base p-6 md:p-8">
      <PageHeader 
        title="New company" 
        subtitle="Create a new organization and start building your AI team." 
      />
      
      {/* Width constraint for the form */}
      <div className="max-w-3xl">
        <CompanyForm 
          onSaved={(c) => { 
            store.orgId = c.id; 
            r.push('/dashboard'); 
            setTimeout(() => location.reload(), 50); 
          }} 
        />
      </div>
    </div>
  );
}