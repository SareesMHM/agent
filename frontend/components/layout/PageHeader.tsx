import React from 'react';

export function PageHeader({ 
  title, 
  subtitle, 
  actions 
}: { 
  title: string; 
  subtitle?: string; 
  actions?: React.ReactNode 
}) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-plum">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-slate/60">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}