'use client';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { AgentCard } from '@/components/agents/AgentCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useAgents } from '@/hooks/useAgents';

export default function Page() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data, loading } = useAgents(projectId);
  return (
    <>
      <PageHeader title="AI agents" />
      {loading ? <LoadingSpinner /> : data?.length ? <div className="grid gap-4 md:grid-cols-3">{data.map((a) => <AgentCard key={a.id} agent={a} projectId={projectId} />)}</div> : <EmptyState title="No agents yet" hint="Approve roles to create agents." />}
    </>
  );
}
