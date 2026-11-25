'use client';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { AgentConfigForm } from '@/components/agents/AgentConfigForm';
import { AgentStatusBadge } from '@/components/agents/AgentStatusBadge';
import { Card, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useAgent } from '@/hooks/useAgents';
import { fmtDate } from '@/lib/utils';

export default function Page() {
  const { agentId } = useParams<{ agentId: string }>();
  const { data: a, reload } = useAgent(agentId);
  if (!a) return <LoadingSpinner />;
  return (
    <>
      <PageHeader title={a.name} subtitle={`${a.roleName} · ${a.department?.name ?? ''}`} actions={<AgentStatusBadge status={a.status} />} />
      <div className="grid gap-6 md:grid-cols-2">
        <Card><CardTitle>Configuration</CardTitle><AgentConfigForm agent={a} onSaved={reload} /></Card>
        <Card><CardTitle>Execution history</CardTitle>
          <ul className="divide-y text-sm">{a.runs?.map((r: any) => <li key={r.id} className="flex justify-between py-2"><span>{fmtDate(r.startedAt)}</span><span className="flex items-center gap-2 text-slate-500">{r.tokens} tok <Badge value={r.status === 'completed' ? 'COMPLETED' : r.status === 'failed' ? 'FAILED' : 'RUNNING'} /></span></li>)}</ul>
          {!a.runs?.length && <p className="text-sm text-slate-500">No runs yet.</p>}</Card>
      </div>
    </>
  );
}
