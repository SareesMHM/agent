'use client';
import { api } from '@/lib/api-client';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { EmptyState } from '../shared/EmptyState';
import type { Approval } from '@/types';

export function ApprovalInbox({ approvals, onChange }: { approvals: Approval[]; onChange: () => void }) {
  async function decide(id: string, action: 'approve' | 'reject') {
    const note = action === 'reject' ? prompt('Reason for rejection (optional)') ?? undefined : undefined;
    await api(`/approvals/${id}/${action}`, { method: 'POST', body: { note } });
    onChange();
  }
  if (!approvals.length) return <EmptyState title="No approvals yet" hint="Tasks marked 'needs approval' appear here after an agent finishes them." />;
  return (
    <div className="space-y-3">
      {approvals.map((a) => (
        <Card key={a.id}>
          <div className="flex items-start justify-between"><div><p className="font-medium">{a.task?.title ?? a.kind}</p><p className="text-sm text-slate-500">{a.payload?.summary}</p></div><Badge value={a.status} /></div>
          {a.task?.output?.content && <pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap rounded bg-slate-50 p-3 text-xs">{a.task.output.content}</pre>}
          {a.status === 'PENDING' && <div className="mt-3 flex gap-2"><Button onClick={() => decide(a.id, 'approve')}>Approve</Button><Button variant="danger" onClick={() => decide(a.id, 'reject')}>Reject</Button></div>}
        </Card>
      ))}
    </div>
  );
}
