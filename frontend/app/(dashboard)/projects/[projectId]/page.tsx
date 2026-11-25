'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { AnalysisResult } from '@/components/projects/AnalysisResult';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ErrorBox, LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useProject } from '@/hooks/useProjects';
import { api } from '@/lib/api-client';

export default function Page() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: p, reload } = useProject(projectId);
  const [busy, setBusy] = useState(''); const [msg, setMsg] = useState(''); const [err, setErr] = useState('');
  async function act(label: string, path: string) {
    setBusy(label); setErr(''); setMsg('');
    try { const r = await api(`/projects/${projectId}/${path}`, { method: 'POST' }); setMsg(`${label} done`); if (path === 'run') setMsg(`Executed ${r.executed} tasks`); reload(); }
    catch (e) { setErr((e as Error).message); } setBusy('');
  }
  if (!p) return <LoadingSpinner />;
  return (
    <>
      <PageHeader title={p.name} actions={<Badge value={p.status} />} />
      <Card className="mb-4"><p className="whitespace-pre-wrap text-sm">{p.description}</p></Card>
      {err && <ErrorBox message={err} />}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button variant="outline" disabled={!!busy} onClick={() => act('Generate roles', 'generate-roles')}>{busy === 'Generate roles' ? 'Generating…' : '1. Generate roles'}</Button>
        <span className="text-sm text-slate-500">then approve on the Roles tab →</span>
        <Button variant="outline" disabled={!!busy} onClick={() => act('Plan tasks', 'plan?force=true')}>{busy === 'Plan tasks' ? 'Planning…' : '2. Plan tasks'}</Button>
        <Button disabled={!!busy} onClick={() => act('Run all', 'run')}>{busy === 'Run all' ? 'Running…' : '3. Run all tasks'}</Button>
        {msg && <span className="text-sm text-green-600">{msg}</span>}
      </div>
      <AnalysisResult analysis={p.analysis} />
    </>
  );
}
