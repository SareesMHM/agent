'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { ErrorBox } from '@/components/shared/LoadingSpinner';

export default function Page() {
  const r = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      await login(email, password);
      r.push('/dashboard');
    } catch (x) {
      setErr((x as Error).message);
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-base p-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-5 rounded-[1.5rem] border border-soft bg-panel p-8 shadow-soft"
      >
        <div className="text-center mb-6">
          <h1 className="font-serif text-3xl font-semibold text-plum">Welcome back</h1>
          <p className="text-sm text-slate/60 mt-2">Log in to your AgentForge account</p>
        </div>

        {err && <ErrorBox message={err} />}

        <div className="space-y-1.5">
          <Label className="text-slate font-medium">Email</Label>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border-soft bg-base text-slate focus-visible:ring-sage"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-slate font-medium">Password</Label>
          <Input
            type="password"
            required
            minLength={1}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border-soft bg-base text-slate focus-visible:ring-sage"
            placeholder="••••••••"
          />
        </div>

        <Button
          className="w-full rounded-xl bg-terracotta py-3 font-medium text-white shadow-sm hover:bg-[#c9684a] hover:shadow-float transition-all"
          disabled={busy}
        >
          {busy ? 'Please wait…' : 'Log in'}
        </Button>

        <div className="text-center text-sm text-slate/60 pt-2 flex items-center justify-center gap-2">
          <Link href="/register" className="hover:text-terracotta transition-colors">
            Create an account
          </Link>
          <span>·</span>
          <Link href="/reset-password" className="hover:text-terracotta transition-colors">
            Forgot password?
          </Link>
        </div>
      </form>
    </main>
  );
}