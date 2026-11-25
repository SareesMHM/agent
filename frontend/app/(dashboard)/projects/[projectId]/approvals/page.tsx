'use client';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { ApprovalInbox } from '@/components/approvals/ApprovalInbox';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useApi } from '@/hooks/useApi';
import type { Approval } from '@/types';

export default function Page() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data, reload } = useApi<Approval[]>(`/approvals?projectId=${projectId}`);
  return <><PageHeader title="Approvals" subtitle="Human checkpoints for sensitive deliverables." />{data ? <ApprovalInbox approvals={data} onChange={reload} /> : <LoadingSpinner />}</>;
}
