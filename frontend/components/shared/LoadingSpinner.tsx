export const LoadingSpinner = () => <div className="p-6 text-sm text-slate-500">Loading…</div>;
export const ErrorBox = ({ message }: { message: string }) => <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{message}</div>;
