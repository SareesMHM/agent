'use client';
import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Table } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api-client';
import { useApi } from '@/hooks/useApi';

export default function Page() {
  const { data, reload } = useApi<any[]>('/integrations');
  const [provider, setProvider] = useState('github');
  return (
    <>
      <PageHeader title="Integrations" subtitle="Records only for now: GitHub/Slack/Jira connectors are on the roadmap. Never paste real secrets here until encryption at rest is added." />
      <form className="mb-4 flex max-w-md gap-2" onSubmit={async (e) => { e.preventDefault(); await api('/integrations', { method: 'POST', body: { provider, config: {} } }); reload(); }}>
        <Input value={provider} onChange={(e) => setProvider(e.target.value)} /><Button>Add</Button>
      </form>
      <Table head={['Provider', 'Enabled', '']}>{data?.map((i) => (
        <tr key={i.id}><td className="px-4 py-2">{i.provider}</td><td className="px-4 py-2">{String(i.enabled)}</td><td className="px-4 py-2 text-right"><Button variant="ghost" onClick={async () => { await api(`/integrations/${i.id}`, { method: 'DELETE' }); reload(); }}>Remove</Button></td></tr>
      ))}</Table>
    </>
  );
}
