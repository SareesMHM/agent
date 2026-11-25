import type { Task } from '@/types';

/** Phase-grouped dependency view (lightweight; swap for a graph lib such as reactflow later). */
export function TaskDependencyGraph({ tasks }: { tasks: Task[] }) {
  const titles = Object.fromEntries(tasks.map((t) => [t.id, t.title]));
  return (
    <ul className="space-y-1 text-sm">
      {tasks.filter((t) => t.dependencies?.length).map((t) => (
        <li key={t.id}><span className="text-slate-500">{t.dependencies!.map((d) => titles[d.dependsOnId]).join(', ')}</span> → <b>{t.title}</b></li>
      ))}
    </ul>
  );
}
