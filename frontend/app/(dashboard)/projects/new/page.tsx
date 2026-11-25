import { PageHeader } from '@/components/layout/PageHeader';
import { ProjectForm } from '@/components/projects/ProjectForm';

export default function Page() {
  return <><PageHeader title="New project" subtitle="AI analyses your description to identify requirements, departments and roles." /><ProjectForm /></>;
}
