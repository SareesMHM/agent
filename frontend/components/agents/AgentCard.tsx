import Link from 'next/link';
import { Card, CardTitle } from '../ui/card';
import { AgentStatusBadge } from './AgentStatusBadge';
import type { Agent } from '@/types';

export const AgentCard = ({ agent, projectId }: { agent: Agent; projectId: string }) => (
  <Card>
    <div className="flex items-start justify-between"><CardTitle><Link href={`/projects/${projectId}/agents/${agent.id}`} className="hover:underline">{agent.name}</Link></CardTitle><AgentStatusBadge status={agent.status} /></div>
    <p className="text-sm text-slate-500">{agent.roleName} · {agent.department?.name ?? '—'}</p>
    <p className="mt-2 text-xs text-slate-500">{agent._count?.tasks ?? 0} tasks · {agent._count?.runs ?? 0} runs</p>
    <div className="mt-2 flex flex-wrap gap-1">{agent.skills?.slice(0, 5).map((s) => <span key={s.id} className="rounded bg-brand-50 px-2 py-0.5 text-xs text-brand-700">{s.name}</span>)}</div>
  </Card>
);
