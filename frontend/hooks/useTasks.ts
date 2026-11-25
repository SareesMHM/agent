'use client';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useApi } from './useApi';
import { store } from '@/lib/api-client';
import type { Task } from '@/types';

/** Task list with live refresh from the backend WebSocket gateway. */
export function useTasks(projectId: string) {
  const q = useApi<Task[]>(`/tasks?projectId=${projectId}`);
  useEffect(() => {
    if (!store.token || !store.orgId) return;
    const s = io(process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:4000');
    s.on('connect', () => s.emit('join', { token: store.token, organizationId: store.orgId }));
    s.on('agent-event', (e: any) => { if (e.projectId === projectId) q.reload(); });
    return () => { s.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);
  return q;
}
