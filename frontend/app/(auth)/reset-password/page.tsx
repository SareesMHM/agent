'use client';
import { useState } from 'react';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';

export default function Page() {
  const [email, setEmail] = useState(''); const [sent, setSent] = useState(false);
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <form className="w-full max-w-sm space-y-4 rounded-xl border bg-white p-8" onSubmit={async (e) => { e.preventDefault(); await api('/auth/forgot-password', { method: 'POST', body: { email } }); setSent(true); }}>
        <h1 className="text-xl font-bold">Reset password</h1>
        {sent ? <p className="text-sm text-slate-600">If that email exists, a reset link has been sent.</p> : (<>
          <div><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <Button className="w-full">Send reset link</Button></>)}
      </form>
    </main>
  );
}
