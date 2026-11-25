'use client';
import { useApi } from './useApi';
import type { Company } from '@/types';

export const useCompanies = () => useApi<Company[]>('/organizations');
