'use client';
import { useApi } from './useApi';
import type { Project } from '@/types';

export const useProjects = () => useApi<Project[]>('/projects');
export const useProject = (id: string) => useApi<Project>(`/projects/${id}`);
