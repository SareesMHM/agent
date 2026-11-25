'use client';
import { useState } from 'react';
import { api } from '@/lib/api-client';
import { Button } from '../ui/button';
import { Input, Label, Textarea } from '../ui/input';
import type { Agent } from '@/types';

export function AgentConfigForm({ agent, onSaved }: { agent: Agent; onSaved: () => void }) {
  const [name, setName] = useState(agent.name);
  const [systemPrompt, setPrompt] = useState(agent.systemPrompt);
  const [status, setStatus] = useState(agent.status);
  const [msg, setMsg] = useState('');
  async function save() {
    await api(`/agents/${agent.id}`, { method: 'PATCH', body: { name, systemPrompt, status } });
    setMsg('Saved'); onSaved();
  }
  async function toggle(tool: string, permitted: boolean) {
    await api(`/agents/${agent.id}/tools/${tool}`, { method: 'PATCH', body: { permitted } });
    onSaved();
  }
  return (
    <div className="space-y-4">
      <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
      <div><Label>Status</Label>
        <select className="rounded-lg border px-3 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
          {['IDLE', 'PAUSED'].map((s) => <option key={s}>{s}</option>)}
        </select></div>
      <div><Label>System instructions</Label><Textarea className="min-h-[220px] font-mono text-xs" value={systemPrompt} onChange={(e) => setPrompt(e.target.value)} /></div>
      <div><Label>Tool permissions</Label>
        <div className="space-y-1">{agent.tools?.map((t) => (
          <label key={t.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={t.permitted} onChange={(e) => toggle(t.toolName, e.target.checked)} /> {t.toolName}</label>
        ))}</div></div>
      <div className="flex items-center gap-3"><Button onClick={save}>Save agent</Button>{msg && <span className="text-sm text-green-600">{msg}</span>}</div>
    </div>
  );
}
