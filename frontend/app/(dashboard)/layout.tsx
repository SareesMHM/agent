'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { store } from '@/lib/api-client';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const r = useRouter(); 
  const [ok, setOk] = useState(false);

  useEffect(() => { 
    if (!store.token) r.replace('/login'); 
    else setOk(true); 
  }, [r]);

  if (!ok) return null;

  return (
    <div className="flex min-h-screen bg-base text-slate antialiased">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}