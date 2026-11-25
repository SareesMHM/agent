import Link from 'next/link';
import { Card, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import type { Project } from '@/types';

export const ProjectCard = ({ project }: { project: Project }) => (
  <Card>
    <div className="flex items-start justify-between"><CardTitle><Link href={`/projects/${project.id}`} className="hover:underline">{project.name}</Link></CardTitle><Badge value={project.status} /></div>
    <p className="line-clamp-3 text-sm text-slate-500">{project.description}</p>
  </Card>
);
