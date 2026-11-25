'use client';
import { useEffect } from 'react';
import { useCompanies } from '@/hooks/useCompanies';
import { store } from '@/lib/api-client';
import { logout } from '@/lib/auth';
import { Button } from '../ui/button';

export function Topbar() {
  const { data: companies } = useCompanies();

  useEffect(() => {
    if (companies?.length && (!store.orgId || !companies.some((c) => c.id === store.orgId))) { 
      store.orgId = companies[0].id; 
      location.reload(); 
    }
  }, [companies]);

  return (
    <header className="flex h-16 items-center justify-between border-b border-soft bg-panel px-6">
      
      {/* Company Selector */}
      <div className="flex items-center gap-4">
        <select 
          className="cursor-pointer rounded-xl border border-soft bg-base px-3 py-2 text-sm font-medium text-plum outline-none transition-all hover:border-sage/50 focus:border-sage focus:ring-2 focus:ring-sage/20" 
          value={store.orgId ?? ''} 
          onChange={(e) => { 
            store.orgId = e.target.value; 
            location.reload(); 
          }}
        >
          {!companies?.length && <option value="">No company yet</option>}
          {companies?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          onClick={logout}
          className="rounded-xl border-soft text-slate hover:bg-terracotta/10 hover:text-terracotta hover:border-terracotta/20 transition-all"
        >
          Log out
        </Button>
      </div>

    </header>
  );
}