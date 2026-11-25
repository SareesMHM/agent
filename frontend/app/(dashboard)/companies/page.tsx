'use client';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { CompanyCard } from '@/components/companies/CompanyCard';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useCompanies } from '@/hooks/useCompanies';

export default function Page() {
  const { data, loading } = useCompanies();

  return (
    <div className="min-h-screen bg-base p-6 md:p-8">
      <PageHeader 
        title="Companies" 
        subtitle="Manage your organizations and AI teams."
        actions={
          <Link href="/companies/new">
            <Button className="rounded-xl bg-terracotta px-6 font-medium text-white shadow-sm hover:bg-[#c9684a] hover:shadow-float transition-all">
              New company
            </Button>
          </Link>
        } 
      />

      <div className="mt-8">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : data?.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.map((c) => (
              <CompanyCard key={c.id} company={c} />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-soft bg-panel p-12 text-center shadow-soft">
            <EmptyState title="No companies yet" />
            <p className="mt-2 text-sm text-slate/60 mb-6">
              Get started by creating your first AI-powered organization.
            </p>
            <Link href="/companies/new">
              <Button className="rounded-xl bg-terracotta px-6 font-medium text-white shadow-sm hover:bg-[#c9684a] hover:shadow-float transition-all">
                Create your first company
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}