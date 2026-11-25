'use client';
import { useApi } from './useApi';
import type { Agent } from '@/types';

export const useAgents = (projectId: string) => useApi<Agent[]>(`/agents?projectId=${projectId}`);
export const useAgent = (id: string) => useApi<Agent>(`/agents/${id}`);
