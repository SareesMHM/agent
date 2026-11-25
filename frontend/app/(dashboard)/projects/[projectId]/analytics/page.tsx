'use client';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useApi } from '@/hooks/useApi';

export default function Page() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: s } = useApi<any>(`/projects/${projectId}/stats`);
  if (!s) return <LoadingSpinner />;
  const cards = [['Progress', `${s.progress}%`], ['Tasks', s.total], ['Agents', s.agents], ['Agent runs', s.runs], ['Tokens used', s.tokens], ['Pending approvals', s.pendingApprovals]];
  return (
    <>
      <PageHeader title="Analytics" />
      <div className="mb-6 h-3 overflow-hidden rounded-full bg-slate-200"><div className="h-full bg-brand-600" style={{ width: `${s.progress}%` }} /></div>
      <div className="grid gap-4 md:grid-cols-3">{cards.map(([l, v]) => <Card key={l as string}><p className="text-sm text-slate-500">{l}</p><p className="text-2xl font-bold">{v}</p></Card>)}</div>
      <Card className="mt-4"><p className="mb-2 text-sm font-medium">Tasks by status</p>{Object.entries(s.byStatus).map(([k, v]) => <p key={k} className="text-sm text-slate-600">{k}: {v as number}</p>)}</Card>
    </>
  );
}
