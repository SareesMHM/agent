'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { Table } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ErrorBox } from '@/components/shared/LoadingSpinner';
import { api } from '@/lib/api-client';
import { useApi } from '@/hooks/useApi';
import type { Member } from '@/types';

export default function Page() {
  const { companyId } = useParams<{ companyId: string }>();
  const { data, reload } = useApi<Member[]>(`/organizations/${companyId}/members`);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [err, setErr] = useState('');

  return (
    <div className="min-h-screen bg-base p-6 md:p-8">
      <PageHeader title="Members" subtitle="Manage who has access to this organization." />
      
      {err && <ErrorBox message={err} />}

      {/* Invite Form Panel */}
      <div className="my-6 max-w-2xl rounded-[1.5rem] border border-soft bg-panel p-6 shadow-soft">
        <h3 className="mb-4 font-serif text-lg font-semibold text-plum">Invite a new member</h3>
        <form 
          className="flex flex-col sm:flex-row gap-3" 
          onSubmit={async (e) => { 
            e.preventDefault(); 
            setErr(''); 
            try { 
              await api(`/organizations/${companyId}/members`, { method: 'POST', body: { email, role } }); 
              setEmail(''); 
              reload(); 
            } catch (x) { 
              setErr((x as Error).message); 
            } 
          }}
        >
          <Input 
            type="email" 
            required 
            placeholder="registered user's email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full rounded-xl border-soft bg-base text-slate focus-visible:ring-sage"
          />
          <select 
            className="rounded-xl border border-soft bg-base px-3 py-2.5 text-sm text-slate outline-none focus:border-sage focus:ring-2 focus:ring-sage/20" 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
          >
            {['ADMIN', 'MEMBER', 'VIEWER'].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <Button className="rounded-xl bg-terracotta px-6 font-medium text-white shadow-sm hover:bg-[#c9684a] hover:shadow-float transition-all">
            Invite
          </Button>
        </form>
      </div>

      {/* Table Panel */}
      <div className="rounded-[1.5rem] border border-soft bg-panel overflow-hidden shadow-soft max-w-4xl">
        <Table head={['Name', 'Email', 'Role', '']}>
          {data?.map((m) => (
            <tr key={m.id} className="border-b border-soft last:border-0 hover:bg-base/50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-plum">{m.user.name}</td>
              <td className="px-6 py-4 text-sm text-slate/80">{m.user.email}</td>
              <td className="px-6 py-4 text-sm">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  m.role === 'OWNER' ? 'bg-plum/10 text-plum' : 
                  m.role === 'ADMIN' ? 'bg-terracotta/10 text-terracotta' : 
                  'bg-sage/10 text-sage'
                }`}>
                  {m.role}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                {m.role !== 'OWNER' && (
                  <Button 
                    variant="ghost" 
                    className="text-slate/60 hover:text-terracotta hover:bg-terracotta/10 rounded-lg transition-colors"
                    onClick={async () => { 
                      await api(`/organizations/${companyId}/members/${m.id}`, { method: 'DELETE' }); 
                      reload(); 
                    }}
                  >
                    Remove
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
}