'use client';
import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { api } from '@/lib/api-client';
import type { User } from '@/types';

export default function Page() {
  const [u, setU] = useState<User | null>(null); const [name, setName] = useState(''); const [msg, setMsg] = useState('');
  useEffect(() => { api<User>('/users/me').then((x) => { setU(x); setName(x.name); }); }, []);
  if (!u) return null;
  return (
    <>
      <PageHeader title="Profile" />
      <div className="max-w-md space-y-4">
        <div><Label>Email</Label><Input value={u.email} disabled /></div>
        <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
        <Button onClick={async () => { await api('/users/me', { method: 'PATCH', body: { name } }); setMsg('Saved'); }}>Save</Button> <span className="text-sm text-green-600">{msg}</span>
      </div>
    </>
  );
}
