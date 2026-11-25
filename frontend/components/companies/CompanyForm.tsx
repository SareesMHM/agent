'use client';
import { useState } from 'react';
import { api } from '@/lib/api-client';
import { Button } from '../ui/button';
import { Input, Label, Textarea } from '../ui/input';
import { ErrorBox } from '../shared/LoadingSpinner';
import type { Company } from '@/types';

export function CompanyForm({ initial, onSaved }: { initial?: Company; onSaved: (c: Company) => void }) {
  const [f, setF] = useState({ name: initial?.name ?? '', industry: initial?.industry ?? '', description: initial?.description ?? '', objectives: initial?.objectives ?? '' });
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: any) => setF({ ...f, [k]: e.target.value });
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr('');
    try { onSaved(await api<Company>(initial ? `/organizations/${initial.id}` : '/organizations', { method: initial ? 'PATCH' : 'POST', body: f })); }
    catch (x) { setErr((x as Error).message); } finally { setBusy(false); }
  }
  return (
    <form onSubmit={submit} className="max-w-xl space-y-4">
      {err && <ErrorBox message={err} />}
      <div><Label>Company name</Label><Input required value={f.name} onChange={set('name')} /></div>
      <div><Label>Industry</Label><Input value={f.industry} onChange={set('industry')} placeholder="e.g. Retail, Software" /></div>
      <div><Label>Description</Label><Textarea value={f.description} onChange={set('description')} /></div>
      <div><Label>Objectives</Label><Textarea value={f.objectives} onChange={set('objectives')} /></div>
      <Button disabled={busy}>{busy ? 'Saving…' : 'Save company'}</Button>
    </form>
  );
}
