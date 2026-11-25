'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { useApi } from '@/hooks/useApi';
import { api } from '@/lib/api-client';
import { fmtDate } from '@/lib/utils';
import type { DocumentItem } from '@/types';

const TYPES = ['SRS', 'BRD', 'ARCHITECTURE', 'API_DOCS', 'DB_DESIGN', 'TEST_PLAN', 'REPORT', 'PROPOSAL', 'JOB_DESCRIPTIONS'];

export default function Page() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data, reload } = useApi<DocumentItem[]>(`/documents?projectId=${projectId}`);
  const [type, setType] = useState('SRS'); const [busy, setBusy] = useState(false); const [view, setView] = useState<DocumentItem | null>(null);
  async function gen() { setBusy(true); try { await api('/documents/generate', { method: 'POST', body: { projectId, type } }); reload(); } catch (e) { alert((e as Error).message); } setBusy(false); }
  return (
    <>
      <PageHeader title="Documents" actions={<>
        <select className="rounded-lg border px-2 text-sm" value={type} onChange={(e) => setType(e.target.value)}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select>
        <Button disabled={busy} onClick={gen}>{busy ? 'Generating…' : 'Generate'}</Button></>} />
      {!data?.length ? <EmptyState title="No documents yet" /> : <div className="space-y-2">{data.map((d) => (
        <Card key={d.id} className="flex items-center justify-between p-3"><div><p className="font-medium">{d.title}</p><p className="text-xs text-slate-500">{d.type} · {fmtDate(d.createdAt)}</p></div><Button variant="outline" onClick={() => setView(d)}>View</Button></Card>))}</div>}
      <Dialog open={!!view} title={view?.title ?? ''} onClose={() => setView(null)}><pre className="whitespace-pre-wrap text-sm">{view?.content}</pre></Dialog>
    </>
  );
}
