'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Wallet } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';

const fluid = [0.32, 0.72, 0, 1] as const;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }
      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setDemoLoading(true);
    try {
      const res = await fetch('/api/auth/demo', { method: 'POST' });
      if (!res.ok) {
        setError('Could not start demo. Please try again.');
        setDemoLoading(false);
        return;
      }
      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setDemoLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center px-4 py-12">
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: fluid }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Wordmark */}
        <Link href="/" className="mb-8 flex flex-col items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl border border-accent/30 bg-accent/15">
            <Wallet size={20} strokeWidth={1.6} className="text-accent" />
          </span>
          <div className="text-center">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-text">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-text-muted">Sign in to continue to FinFlow</p>
          </div>
        </Link>

        <div className="bezel-shell">
          <div className="bezel-core p-7 sm:p-8">
            {/* Demo */}
            <button
              onClick={handleDemo}
              disabled={demoLoading || loading}
              className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-accent/25 bg-accent/[0.08] px-5 py-4 text-left transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-accent/45 hover:bg-accent/[0.12] active:scale-[0.99] disabled:opacity-60"
            >
              <span>
                <span className="block text-sm font-semibold text-text">
                  {demoLoading ? 'Preparing demo…' : 'Try the live demo'}
                </span>
                <span className="block text-xs text-text-muted">
                  No sign-up · 3 months of sample data
                </span>
              </span>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-bg transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                {demoLoading ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-bg/30 border-t-bg" />
                ) : (
                  <ArrowUpRight size={15} strokeWidth={2} />
                )}
              </span>
            </button>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-hairline" />
              <span className="eyebrow text-text-faint">or sign in</span>
              <span className="h-px flex-1 bg-hairline" />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 rounded-xl border border-negative/30 bg-negative/10 px-4 py-3 text-sm text-negative"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <Field
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                onEnter={handleSubmit}
                placeholder="you@email.com"
              />
              <Field
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                onEnter={handleSubmit}
                placeholder="••••••••"
              />

              <button
                onClick={handleSubmit}
                disabled={loading || demoLoading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-text py-3.5 font-semibold text-bg transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-text-muted">
              No account?{' '}
              <Link href="/register" className="font-semibold text-accent transition-colors hover:text-accent-soft">
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  onEnter,
  placeholder,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  onEnter: () => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-muted">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onEnter()}
        placeholder={placeholder}
        className="w-full rounded-xl border border-hairline bg-bg-elev px-4 py-3 text-text outline-none transition-all duration-300 placeholder:text-text-faint focus:border-accent/50 focus:ring-2 focus:ring-accent/15"
      />
    </label>
  );
}
