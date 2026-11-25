'use client';
import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Table } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api-client';
import { useApi } from '@/hooks/useApi';
import type { Department } from '@/types';

export default function Page() {
  const { data, reload } = useApi<Department[]>('/departments');
  const [name, setName] = useState('');

  return (
    <div className="min-h-screen bg-base p-6 md:p-8">
      <PageHeader 
        title="Departments" 
        subtitle="Custom departments are supported alongside AI-generated ones." 
      />

      {/* Add Department Form Panel */}
      <div className="my-6 max-w-xl rounded-[1.5rem] border border-soft bg-panel p-6 shadow-soft">
        <h3 className="mb-4 font-serif text-lg font-semibold text-plum">Create a new department</h3>
        <form 
          className="flex gap-3" 
          onSubmit={async (e) => { 
            e.preventDefault(); 
            await api('/departments', { method: 'POST', body: { name } }); 
            setName(''); 
            reload(); 
          }}
        >
          <Input 
            required 
            placeholder="e.g., Marketing, Engineering" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full rounded-xl border-soft bg-base text-slate focus-visible:ring-sage"
          />
          <Button className="rounded-xl bg-terracotta px-6 font-medium text-white shadow-sm hover:bg-[#c9684a] hover:shadow-float transition-all">
            Add
          </Button>
        </form>
      </div>

      {/* Departments Table Panel */}
      <div className="rounded-[1.5rem] border border-soft bg-panel overflow-hidden shadow-soft max-w-3xl">
        <Table head={['Department Name', '']}>
          {data?.map((d) => (
            <tr key={d.id} className="border-b border-soft last:border-0 hover:bg-base/50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-plum">{d.name}</td>
              <td className="px-6 py-4 text-right">
                <Button 
                  variant="ghost" 
                  className="text-slate/60 hover:text-terracotta hover:bg-terracotta/10 rounded-lg transition-colors"
                  onClick={async () => { 
                    await api(`/departments/${d.id}`, { method: 'DELETE' }); 
                    reload(); 
                  }}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
          {(!data || data.length === 0) && (
            <tr>
              <td colSpan={2} className="px-6 py-8 text-center text-sm text-slate/50">
                No departments found. Create one above!
              </td>
            </tr>
          )}
        </Table>
      </div>
    </div>
  );
}