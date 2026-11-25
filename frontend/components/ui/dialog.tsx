'use client';
import { Button } from './button';

export function Dialog({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="max-h-[85vh] w-full max-w-2xl overflow-auto rounded-xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">{title}</h2><Button variant="ghost" onClick={onClose}>Close</Button></div>
        {children}
      </div>
    </div>
  );
}
