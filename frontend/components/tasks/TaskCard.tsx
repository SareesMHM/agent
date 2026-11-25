'use client';
import { useState } from 'react';
import { api } from '@/lib/api-client';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import type { Task } from '@/types';

export function TaskCard({ task, titles, onChange }: { task: Task; titles: Record<string, string>; onChange: () => void }) {
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  async function run() {
    setBusy(true);
    try { await api(`/tasks/${task.id}/execute`, { method: 'POST' }); } catch (e) { alert((e as Error).message); }
    setBusy(false); onChange();
  }
  return (
    <Card className="space-y-2 p-3">
      <div className="flex items-start justify-between gap-2"><p className="text-sm font-medium">{task.title}</p><Badge value={task.status} /></div>
      <p className="text-xs text-slate-500">{task.assignedAgent?.name ?? 'Unassigned'} · {task.phase ?? '—'} · P{task.priority}{task.requiresApproval ? ' · needs approval' : ''}</p>
      {!!task.dependencies?.length && <p className="text-xs text-slate-400">After: {task.dependencies.map((d) => titles[d.dependsOnId]).filter(Boolean).join(', ')}</p>}
      <div className="flex gap-2">
        {['PENDING', 'FAILED'].includes(task.status) && <Button className="px-2 py-1 text-xs" onClick={run} disabled={busy}>{busy ? 'Running…' : 'Execute'}</Button>}
        {task.output && <Button variant="outline" className="px-2 py-1 text-xs" onClick={() => setOpen(!open)}>{open ? 'Hide' : 'Output'}</Button>}
      </div>
      {open && <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded bg-slate-50 p-2 text-xs">{task.output?.content ?? JSON.stringify(task.output, null, 2)}</pre>}
    </Card>
  );
}
