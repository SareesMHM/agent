'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { api } from '@/lib/api-client';

function Inner() {
  const token = useSearchParams().get('token');
  const [msg, setMsg] = useState('Verifying…');
  useEffect(() => {
    if (!token) return setMsg('Missing token.');
    api('/auth/verify-email', { method: 'POST', body: { token } }).then(() => setMsg('Email verified. You can close this page.')).catch(() => setMsg('Verification failed.'));
  }, [token]);
  return <main className="flex min-h-screen items-center justify-center"><p>{msg}</p></main>;
}
export default function Page() { return <Suspense><Inner /></Suspense>; }
