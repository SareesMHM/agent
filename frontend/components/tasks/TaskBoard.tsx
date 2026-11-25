import { TaskCard } from './TaskCard';
import type { Task } from '@/types';

const COLUMNS = ['PENDING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'FAILED'];

export function TaskBoard({ tasks, onChange }: { tasks: Task[]; onChange: () => void }) {
  const titles = Object.fromEntries(tasks.map((t) => [t.id, t.title]));
  return (
    <div className="grid gap-4 md:grid-cols-5">
      {COLUMNS.map((c) => (
        <div key={c} className="rounded-xl bg-slate-100 p-2">
          <p className="mb-2 px-1 text-xs font-semibold text-slate-600">{c.replace('_', ' ')} ({tasks.filter((t) => t.status === c).length})</p>
          <div className="space-y-2">{tasks.filter((t) => t.status === c).map((t) => <TaskCard key={t.id} task={t} titles={titles} onChange={onChange} />)}</div>
        </div>
      ))}
    </div>
  );
}
