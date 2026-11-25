'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorBox, LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useProject } from '@/hooks/useProjects';
import { api } from '@/lib/api-client';
import type { Role } from '@/types';

export default function Page() {
  const { projectId } = useParams<{ projectId: string }>();
  const r = useRouter();
  const { data: p, reload } = useProject(projectId);
  const [roles, setRoles] = useState<Role[]>([]); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  useEffect(() => { if (p?.roles) setRoles(p.roles); }, [p]);
  async function generate() { setBusy(true); setErr(''); try { await api(`/projects/${projectId}/generate-roles`, { method: 'POST' }); reload(); } catch (e) { setErr((e as Error).message); } setBusy(false); }
  async function approve() { setBusy(true); setErr(''); try { await api(`/projects/${projectId}/approve-roles`, { method: 'POST', body: { roles } }); r.push(`/projects/${projectId}/agents`); } catch (e) { setErr((e as Error).message); setBusy(false); } }
  if (!p) return <LoadingSpinner />;
  return (
    <>
      <PageHeader title="AI-generated roles" subtitle="Review, remove or approve. Approving creates departments and agents (replacing existing agents for this project)."
        actions={<><Button variant="outline" disabled={busy} onClick={generate}>{roles.length ? 'Regenerate' : 'Generate roles'}</Button>{!!roles.length && <Button disabled={busy} onClick={approve}>Approve & create agents</Button>}</>} />
      {err && <ErrorBox message={err} />}
      {!roles.length ? <EmptyState title="No roles yet" hint="Click “Generate roles”." /> : (
        <div className="grid gap-4 md:grid-cols-2">{roles.map((x, i) => (
          <Card key={x.name}>
            <div className="flex justify-between"><CardTitle>{x.name}</CardTitle><Button variant="ghost" onClick={() => setRoles(roles.filter((_, j) => j !== i))}>Remove</Button></div>
            <p className="text-xs text-brand-600">{x.department}</p><p className="mt-1 text-sm text-slate-600">{x.description}</p>
            <ul className="mt-2 list-inside list-disc text-xs text-slate-500">{x.responsibilities?.map((s) => <li key={s}>{s}</li>)}</ul>
          </Card>))}</div>)}
    </>
  );
}
