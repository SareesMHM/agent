'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, FolderKanban, LayoutDashboard, Plug, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/companies', label: 'Companies', icon: Building2 },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/settings/integrations', label: 'Integrations', icon: Plug },
  { href: '/settings/profile', label: 'Profile', icon: User },
];

export function Sidebar() {
  const path = usePathname();
  
  return (
    <aside className="hidden w-64 shrink-0 border-r border-soft bg-panel p-4 md:flex md:flex-col">
      {/* Brand Logo area */}
      <div className="mb-8 flex items-center gap-3 px-2">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage font-serif font-bold text-lg text-white shadow-sm">
            A
          </div>
          <span className="font-serif text-xl font-bold tracking-tight text-plum">
            AgentForge
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5">
        {items.map(({ href, label, icon: Icon }) => {
          const isActive = path.startsWith(href);
          
          return (
            <Link 
              key={href} 
              href={href} 
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                isActive 
                  ? 'bg-terracotta/10 text-terracotta' 
                  : 'text-slate/70 hover:bg-base hover:text-plum'
              )}
            >
              <Icon 
                size={18} 
                className={cn(
                  "transition-colors",
                  isActive ? "text-terracotta" : "text-slate/50"
                )} 
              /> 
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}