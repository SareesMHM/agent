'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { Button } from '../ui/button';
import { Input, Label, Textarea } from '../ui/input';
import { ErrorBox } from '../shared/LoadingSpinner';
import type { Project } from '@/types';

export function ProjectForm() {
  const r = useRouter();
  const [name, setName] = useState(''); const [description, setDescription] = useState('');
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr('');
    try { const p = await api<Project>('/projects', { method: 'POST', body: { name, description } }); r.push(`/projects/${p.id}`); }
    catch (x) { setErr((x as Error).message); setBusy(false); }
  }
  return (
    <form onSubmit={submit} className="max-w-2xl space-y-4">
      {err && <ErrorBox message={err} />}
      <div><Label>Project name</Label><Input required value={name} onChange={(e) => setName(e.target.value)} /></div>
      <div><Label>Describe your project in natural language</Label>
        <Textarea required minLength={10} className="min-h-[160px]" value={description} onChange={(e) => setDescription(e.target.value)}
          placeholder="Create an e-commerce platform for a Sri Lankan clothing brand with product management, online payments, customer accounts, order tracking and AI-powered recommendations." /></div>
      <Button disabled={busy}>{busy ? 'Analysing with AI…' : 'Create & analyse'}</Button>
    </form>
  );
}
