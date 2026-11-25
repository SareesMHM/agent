'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { TaskBoard } from '@/components/tasks/TaskBoard';
import { TaskDependencyGraph } from '@/components/tasks/TaskDependencyGraph';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useTasks } from '@/hooks/useTasks';
import { api } from '@/lib/api-client';

export default function Page() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data, loading, reload } = useTasks(projectId);
  const [busy, setBusy] = useState(false);
  async function runAll() { setBusy(true); try { await api(`/projects/${projectId}/run`, { method: 'POST' }); } catch (e) { alert((e as Error).message); } setBusy(false); reload(); }
  return (
    <>
      <PageHeader title="Task board" actions={<Button disabled={busy || !data?.length} onClick={runAll}>{busy ? 'Running…' : 'Run all'}</Button>} />
      {loading ? <LoadingSpinner /> : !data?.length ? <EmptyState title="No tasks yet" hint="Use “Plan tasks” on the project overview." /> : (<>
        <TaskBoard tasks={data} onChange={reload} />
        <Card className="mt-6"><CardTitle>Dependencies</CardTitle><TaskDependencyGraph tasks={data} /></Card></>)}
    </>
  );
}
