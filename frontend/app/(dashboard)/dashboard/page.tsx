'use client';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorBox, LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useApi } from '@/hooks/useApi';
import { store } from '@/lib/api-client';

export default function Dashboard() {
  const { data, error, loading } = useApi<any>(store.orgId ? '/projects/overview' : null);

  // 1. No Company State
  if (!store.orgId) {
    return (
      <div className="min-h-screen bg-base p-6 md:p-8">
        <PageHeader title="Dashboard" />
        <div className="mt-8 flex max-w-xl flex-col items-center rounded-[1.5rem] border border-soft bg-panel p-12 text-center shadow-soft">
          <EmptyState title="Create your first company" />
          <p className="mt-2 text-sm text-slate/60 mb-6">
            Companies hold your projects, departments and AI agents.
          </p>
          <Link href="/companies/new">
            <Button className="rounded-xl bg-terracotta px-6 font-medium text-white shadow-sm hover:bg-[#c9684a] hover:shadow-float transition-all">
              New company
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // 2. Loading State
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base">
        <LoadingSpinner />
      </div>
    );
  }

  // 3. Error State
  if (error) {
    return (
      <div className="min-h-screen bg-base p-6 md:p-8">
        <PageHeader title="Dashboard" />
        <ErrorBox message={error} />
      </div>
    );
  }

  // 4. Main Dashboard
  const stats = [
    { label: 'Active projects', value: data.activeProjects, color: 'text-terracotta', bg: 'bg-terracotta/10' },
    { label: 'AI agents', value: data.agents, color: 'text-sage', bg: 'bg-sage/10' },
    { label: 'Pending tasks', value: data.pendingTasks, color: 'text-plum', bg: 'bg-plum/10' },
    { label: 'Completed', value: data.completedTasks, color: 'text-slate', bg: 'bg-slate/10' },
    { label: 'Failed', value: data.failedTasks, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  return (
    <div className="min-h-screen bg-base p-6 md:p-8">
      <PageHeader 
        title="Dashboard" 
        subtitle="Welcome back to your AI workspace."
        actions={
          <Link href="/projects/new">
            <Button className="rounded-xl bg-terracotta px-6 font-medium text-white shadow-sm hover:bg-[#c9684a] hover:shadow-float transition-all">
              New project
            </Button>
          </Link>
        } 
      />

      {/* Stats Grid */}
      <div className="mt-8 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.label} className="rounded-[1.5rem] border border-soft bg-panel p-5 shadow-soft transition-shadow hover:shadow-float">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate/60">{stat.label}</p>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${stat.bg}`}>
                <div className={`h-2 w-2 rounded-full ${stat.color.replace('text-', 'bg-')}`}></div>
              </div>
            </div>
            <p className={`mt-2 font-serif text-3xl font-semibold ${stat.color}`}>{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Recent Communications */}
      <h2 className="mb-4 mt-10 font-serif text-xl font-semibold text-plum">Recent agent communications</h2>
      
      {data.recentMessages?.length ? (
        <Card className="max-w-4xl overflow-hidden rounded-[1.5rem] border border-soft bg-panel p-0 shadow-soft">
          <div className="divide-y divide-soft">
            {data.recentMessages.map((m: any) => (
              <div key={m.id} className="flex gap-4 p-5 transition-colors hover:bg-base/50">
                {/* Mock Agent Avatar */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-plum/10 text-sm font-bold text-plum">
                  AI
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-sm text-slate/80 leading-relaxed">{m.content}</p>
                  <span className="mt-1 text-xs text-slate/40">Just now</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <div className="max-w-xl rounded-[1.5rem] border border-soft bg-panel p-12 text-center shadow-soft">
          <EmptyState title="No activity yet" />
          <p className="mt-2 text-sm text-slate/60">Your AI team hasn't started working yet.</p>
        </div>
      )}
    </div>
  );
}