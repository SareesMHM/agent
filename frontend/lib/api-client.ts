const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export const store = {
  get token() { return typeof window === 'undefined' ? null : localStorage.getItem('af_token'); },
  set token(v: string | null) { v ? localStorage.setItem('af_token', v) : localStorage.removeItem('af_token'); },
  get orgId() { return typeof window === 'undefined' ? null : localStorage.getItem('af_org'); },
  set orgId(v: string | null) { v ? localStorage.setItem('af_org', v) : localStorage.removeItem('af_org'); },
};

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export async function api<T = any>(path: string, opts: { method?: string; body?: unknown } = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (store.token) headers.Authorization = `Bearer ${store.token}`;
  if (store.orgId) headers['x-organization-id'] = store.orgId;
  const res = await fetch(`${BASE}${path}`, { method: opts.method ?? 'GET', headers, body: opts.body ? JSON.stringify(opts.body) : undefined });
  if (res.status === 401 && typeof window !== 'undefined' && !location.pathname.startsWith('/login')) {
    store.token = null;
    location.href = '/login';
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, Array.isArray(data.message) ? data.message.join(', ') : data.message ?? res.statusText);
  return data as T;
}
