export const EmptyState = ({ title, hint }: { title: string; hint?: string }) => (
  <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center">
    <p className="font-medium text-slate-700">{title}</p>
    {hint && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
  </div>
);
