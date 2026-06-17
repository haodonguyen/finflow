'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Wallet,
  LineChart,
  Target,
  ShieldCheck,
  BellRing,
  ArrowDownToLine,
} from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';

const fluid = [0.32, 0.72, 0, 1] as const;

export default function Home() {
  const router = useRouter();
  const [demoLoading, setDemoLoading] = useState(false);

  const handleDemo = async () => {
    setDemoLoading(true);
    try {
      const res = await fetch('/api/auth/demo', { method: 'POST' });
      if (res.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setDemoLoading(false);
      }
    } catch {
      setDemoLoading(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] overflow-hidden">
      <AnimatedBackground />

      {/* ---- Floating glass island nav ---- */}
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center">
        <motion.nav
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: fluid }}
          className="mt-6 flex w-[min(92%,46rem)] items-center justify-between rounded-full border border-hairline bg-white/[0.04] px-3 py-2 backdrop-blur-2xl ambient"
        >
          <Link href="/" className="flex items-center gap-2.5 pl-2">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-accent/15 ring-1 ring-accent/30">
              <Wallet size={15} strokeWidth={1.6} className="text-accent" />
            </span>
            <span className="font-display text-[15px] font-semibold tracking-tight text-text">
              FinFlow
            </span>
          </Link>

          <div className="hidden items-center gap-7 text-[13px] text-text-muted sm:flex">
            <a href="#features" className="transition-colors duration-300 hover:text-text">Features</a>
            <a href="#security" className="transition-colors duration-300 hover:text-text">Security</a>
            <Link href="/login" className="transition-colors duration-300 hover:text-text">Sign in</Link>
          </div>

          <Link
            href="/register"
            className="group flex items-center gap-2 rounded-full bg-text py-2 pl-4 pr-2 text-[13px] font-semibold text-bg transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97]"
          >
            Get started
            <span className="grid h-6 w-6 place-items-center rounded-full bg-bg/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight size={14} strokeWidth={2} />
            </span>
          </Link>
        </motion.nav>
      </header>

      <main className="relative z-10">
        {/* ---- Hero ---- */}
        <section className="mx-auto flex min-h-[100dvh] max-w-6xl flex-col items-center justify-center px-4 pb-24 pt-40 text-center sm:px-6">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: fluid }}
            className="eyebrow mb-8 inline-flex items-center gap-2 rounded-full border border-hairline bg-white/[0.03] px-3 py-1.5 text-text-muted"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_var(--accent)]" />
            Personal finance, refined
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.05, ease: fluid }}
            className="font-display text-[clamp(2.9rem,9vw,6.5rem)] font-semibold leading-[0.95] tracking-tight text-text"
          >
            Money that
            <br />
            <span className="text-text-muted">moves with</span>{' '}
            <span className="bg-gradient-to-b from-accent-soft to-accent bg-clip-text text-transparent">
              clarity
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: fluid }}
            className="mt-7 max-w-xl text-base leading-relaxed text-text-soft sm:text-lg"
          >
            Track every dollar, set budgets that hold, and read your finances at a
            glance — in an interface designed to stay out of your way.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.32, ease: fluid }}
            className="mt-11 flex flex-col items-center gap-3.5 sm:flex-row"
          >
            <button
              onClick={handleDemo}
              disabled={demoLoading}
              className="group flex w-full items-center justify-center gap-2.5 rounded-full bg-accent py-3.5 pl-6 pr-3 font-semibold text-bg transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-[0_18px_50px_-12px_var(--accent-glow)] active:scale-[0.98] disabled:opacity-70 sm:w-auto"
            >
              {demoLoading ? 'Preparing demo…' : 'Try the live demo'}
              <span className="grid h-7 w-7 place-items-center rounded-full bg-bg/15 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                {demoLoading ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-bg/30 border-t-bg" />
                ) : (
                  <ArrowUpRight size={15} strokeWidth={2} />
                )}
              </span>
            </button>

            <Link
              href="/register"
              className="flex w-full items-center justify-center rounded-full border border-hairline-strong bg-white/[0.03] px-7 py-3.5 font-medium text-text-soft transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-white/25 hover:bg-white/[0.06] active:scale-[0.98] sm:w-auto"
            >
              Create free account
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-6 text-xs text-text-faint"
          >
            No card required · 3 months of demo data pre-loaded
          </motion.p>
        </section>

        {/* ---- Features bento ---- */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-28 sm:px-6">
          <div className="mb-16 max-w-2xl">
            <span className="eyebrow text-accent">What you get</span>
            <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.02] tracking-tight text-text">
              Built for people who
              <br className="hidden sm:block" /> actually check their money
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:auto-rows-[minmax(0,1fr)]">
            <Feature
              className="md:col-span-4 md:row-span-2"
              big
              icon={LineChart}
              title="See everything at a glance"
              body="Income, spending and balance resolve into one calm dashboard. No noise, no rainbow charts — just the numbers that matter, rendered with precision."
              delay={0}
            />
            <Feature
              className="md:col-span-2"
              icon={Wallet}
              title="Effortless tracking"
              body="Log a transaction in seconds and watch it land instantly."
              delay={0.05}
            />
            <Feature
              className="md:col-span-2"
              icon={Target}
              title="Budgets that hold"
              body="Set monthly limits per category and get a quiet nudge before you cross them."
              delay={0.1}
            />
            <Feature
              id="security"
              className="md:col-span-2"
              icon={ShieldCheck}
              title="Private by design"
              body="JWT auth, encrypted sessions, your data stays yours."
              delay={0.15}
            />
            <Feature
              className="md:col-span-2"
              icon={BellRing}
              title="Smart alerts"
              body="Know the moment a category drifts past its limit."
              delay={0.2}
            />
            <Feature
              className="md:col-span-2"
              icon={ArrowDownToLine}
              title="Export anytime"
              body="One click to a clean CSV — for taxes or your own records."
              delay={0.25}
            />
          </div>
        </section>

        {/* ---- Closing CTA ---- */}
        <section className="mx-auto max-w-6xl px-4 pb-32 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: fluid }}
            className="bezel-shell"
          >
            <div className="bezel-core relative overflow-hidden px-8 py-20 text-center sm:px-12">
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 0%, var(--accent-glow), transparent 70%)' }}
              />
              <div className="relative">
                <h2 className="font-display text-[clamp(2.1rem,6vw,4rem)] font-semibold leading-[1] tracking-tight text-text">
                  Take control today
                </h2>
                <p className="mx-auto mt-5 max-w-md text-text-muted">
                  Start with the demo or open a free account. It takes less than a
                  minute either way.
                </p>
                <div className="mt-10 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
                  <Link
                    href="/register"
                    className="group flex w-full items-center justify-center gap-2.5 rounded-full bg-text py-3.5 pl-6 pr-3 font-semibold text-bg transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] sm:w-auto"
                  >
                    Start your journey
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-bg/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      <ArrowUpRight size={15} strokeWidth={2} />
                    </span>
                  </Link>
                  <button
                    onClick={handleDemo}
                    disabled={demoLoading}
                    className="w-full rounded-full border border-hairline-strong bg-white/[0.03] px-7 py-3.5 font-medium text-text-soft transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-white/25 hover:bg-white/[0.06] active:scale-[0.98] disabled:opacity-70 sm:w-auto"
                  >
                    {demoLoading ? 'Preparing…' : 'Explore the demo'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <footer className="border-t border-hairline">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 text-sm text-text-faint sm:flex-row sm:px-6">
            <div className="flex items-center gap-2.5">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-accent/15 ring-1 ring-accent/30">
                <Wallet size={13} strokeWidth={1.6} className="text-accent" />
              </span>
              <span className="font-display font-medium text-text-soft">FinFlow</span>
            </div>
            <p>© {new Date().getFullYear()} FinFlow. Designed for clearer money.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

/* ---------- Feature card (double-bezel) ---------- */
function Feature({
  icon: Icon,
  title,
  body,
  className = '',
  big = false,
  delay = 0,
  id,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  title: string;
  body: string;
  className?: string;
  big?: boolean;
  delay?: number;
  id?: string;
}) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay, ease: fluid }}
      className={`group bezel-shell ${className}`}
    >
      <div className="bezel-core flex h-full flex-col p-7 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-1">
        <span className="grid h-11 w-11 place-items-center rounded-2xl border border-hairline bg-white/[0.04] text-accent transition-colors duration-500 group-hover:border-accent/40">
          <Icon size={big ? 22 : 19} strokeWidth={1.5} />
        </span>
        <h3 className={`mt-auto pt-8 font-display font-semibold tracking-tight text-text ${big ? 'text-2xl' : 'text-lg'}`}>
          {title}
        </h3>
        <p className={`mt-2.5 leading-relaxed text-text-muted ${big ? 'text-[15px] max-w-md' : 'text-sm'}`}>
          {body}
        </p>
      </div>
    </motion.div>
  );
}
