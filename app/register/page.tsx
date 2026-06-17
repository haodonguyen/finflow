'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Wallet } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';

const fluid = [0.32, 0.72, 0, 1] as const;

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
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

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center px-4 py-12">
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: fluid }}
        className="relative z-10 w-full max-w-md"
      >
        <Link href="/" className="mb-8 flex flex-col items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl border border-accent/30 bg-accent/15">
            <Wallet size={20} strokeWidth={1.6} className="text-accent" />
          </span>
          <div className="text-center">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-text">
              Create your account
            </h1>
            <p className="mt-1 text-sm text-text-muted">Start tracking in under a minute</p>
          </div>
        </Link>

        <div className="bezel-shell">
          <div className="bezel-core p-7 sm:p-8">
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
              <Field label="Name" type="text" value={name} onChange={setName} placeholder="Jane Doe" />
              <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@email.com" />
              <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="At least 6 characters" />
              <Field
                label="Confirm password"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                onEnter={handleSubmit}
                placeholder="••••••••"
              />

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="group mt-2 flex w-full items-center justify-center gap-2.5 rounded-full bg-accent py-3.5 pl-6 pr-3 font-semibold text-bg transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Creating account…' : 'Create account'}
                <span className="grid h-7 w-7 place-items-center rounded-full bg-bg/15 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight size={15} strokeWidth={2} />
                </span>
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-text-muted">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-accent transition-colors hover:text-accent-soft">
                Sign in
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
  onEnter?: () => void;
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
        onKeyDown={(e) => onEnter && e.key === 'Enter' && onEnter()}
        placeholder={placeholder}
        required
        className="w-full rounded-xl border border-hairline bg-bg-elev px-4 py-3 text-text outline-none transition-all duration-300 placeholder:text-text-faint focus:border-accent/50 focus:ring-2 focus:ring-accent/15"
      />
    </label>
  );
}
