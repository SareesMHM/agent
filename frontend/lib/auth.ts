import { api, store } from './api-client';
import type { User } from '@/types';

export async function login(email: string, password: string) {
  const r = await api<{ token: string; user: User }>('/auth/login', { method: 'POST', body: { email, password } });
  store.token = r.token;
  return r.user;
}
export async function register(name: string, email: string, password: string) {
  const r = await api<{ token: string; user: User }>('/auth/register', { method: 'POST', body: { name, email, password } });
  store.token = r.token;
  return r.user;
}
export function logout() {
  store.token = null;
  store.orgId = null;
  location.href = '/login';
}
