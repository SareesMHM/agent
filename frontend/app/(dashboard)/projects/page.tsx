'use client';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useProjects } from '@/hooks/useProjects';

export default function Page() {
  const { data, loading } = useProjects();
  return (
    <>
      <PageHeader title="Projects" actions={<Link href="/projects/new"><Button>New project</Button></Link>} />
      {loading ? <LoadingSpinner /> : data?.length ? <div className="grid gap-4 md:grid-cols-3">{data.map((p) => <ProjectCard key={p.id} project={p} />)}</div> : <EmptyState title="No projects yet" hint="Describe an idea and let AI build the team." />}
    </>
  );
}
