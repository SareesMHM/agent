'use client';
import Link from 'next/link';
import { Card, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { store } from '@/lib/api-client';
import type { Company } from '@/types';

export function CompanyCard({ company }: { company: Company }) {
  const active = store.orgId === company.id;
  return (
    <Card>
      <CardTitle><Link href={`/companies/${company.id}`} className="hover:underline">{company.name}</Link></CardTitle>
      <p className="text-sm text-slate-500">{company.industry ?? 'No industry'} · {company._count?.projects ?? 0} projects · {company._count?.members ?? 0} members</p>
      <Button className="mt-3" variant={active ? 'ghost' : 'outline'} disabled={active} onClick={() => { store.orgId = company.id; location.reload(); }}>{active ? 'Active' : 'Switch to'}</Button>
    </Card>
  );
}
