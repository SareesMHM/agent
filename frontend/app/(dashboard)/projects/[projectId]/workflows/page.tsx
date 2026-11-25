'use client';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/EmptyState';
import { useApi } from '@/hooks/useApi';
import { api } from '@/lib/api-client';
import type { Workflow } from '@/types';

export default function Page() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data, reload } = useApi<Workflow[]>(`/workflows?projectId=${projectId}`);
  async function run(id: string) { try { await api(`/workflows/${id}/run`, { method: 'POST' }); } catch (e) { alert((e as Error).message); } reload(); }
  return (
    <>
      <PageHeader title="Workflows" subtitle="Dependency-driven execution with parallel waves and approval checkpoints." />
      {!data?.length ? <EmptyState title="No workflows" hint="A default pipeline is created when tasks are planned." /> : data.map((w) => (
        <Card key={w.id} className="mb-3">
          <div className="flex items-center justify-between"><CardTitle>{w.name}</CardTitle><div className="flex items-center gap-2"><Badge value={w.status} /><Button onClick={() => run(w.id)}>Run</Button></div></div>
          <p className="text-sm text-slate-500">{w.steps.map((s) => s.name).join(' → ') || 'No phases'}</p>
        </Card>))}
    </>
  );
}
