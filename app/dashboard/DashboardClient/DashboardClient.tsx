'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  LogOut,
  ArrowDownToLine,
  X,
} from 'lucide-react';
import { User } from '@/lib/auth';
import toast, { Toaster } from 'react-hot-toast';
import AnimatedNumber from '@/components/AnimatedNumber';
import GlassCard from '@/components/GlassCard';
import AnimatedBackground from '@/components/AnimatedBackground';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface Budget {
  category: string;
  limit: number;
}

const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Health', 'Other'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Other'];

const fluid = [0.32, 0.72, 0, 1] as const;
const inputCls =
  'w-full rounded-xl border border-hairline bg-bg-elev px-4 py-3 text-sm text-text outline-none transition-all duration-300 placeholder:text-text-faint focus:border-accent/50 focus:ring-2 focus:ring-accent/15';

export default function DashboardClient({ user }: { user: User }) {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>(
    EXPENSE_CATEGORIES.map(cat => ({ category: cat, limit: 0 }))
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: EXPENSE_CATEGORIES[0],
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    // Budget bars compare against current-month spending only
    const currentMonth = new Date().toISOString().slice(0, 7);
    const currentMonthExpensesByCategory = transactions
      .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    return { totalIncome, totalExpenses, balance, expensesByCategory, currentMonthExpensesByCategory };
  }, [transactions]);

  useEffect(() => {
    async function loadData() {
      try {
        const [txRes, budgetRes] = await Promise.all([
          fetch('/api/transactions'),
          fetch('/api/budgets'),
        ]);

        if (txRes.ok) {
          const data: Transaction[] = await txRes.json();
          setTransactions(data);
        }

        if (budgetRes.ok) {
          const dbBudgets: Array<{ category: string; limit: number }> = await budgetRes.json();
          setBudgets(prev =>
            prev.map(b => {
              const db = dbBudgets.find(d => d.category === b.category);
              return db ? { category: b.category, limit: db.limit } : b;
            })
          );
        }
      } catch {
        toast.error('Failed to load data');
      } finally {
        setDataLoading(false);
      }
    }
    loadData();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    toast.success('Logged out successfully!');
    router.push('/login');
    router.refresh();
  };

  const handleAddTransaction = async () => {
    if (!formData.amount || !formData.description) {
      toast.error('Please fill all fields');
      return;
    }

    const parsedAmount = parseFloat(formData.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Amount must be a positive number');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formData.type,
          amount: parsedAmount,
          category: formData.category,
          description: formData.description,
          date: formData.date,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || 'Failed to add transaction');
        return;
      }

      const newTransaction: Transaction = await res.json();
      setTransactions(prev => [newTransaction, ...prev]);
      setFormData({
        type: 'expense',
        amount: '',
        category: EXPENSE_CATEGORIES[0],
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
      setShowAddForm(false);
      toast.success(`${formData.type === 'income' ? 'Income' : 'Expense'} added successfully!`);
    } catch {
      toast.error('Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        toast.error('Failed to delete transaction');
        return;
      }
      setTransactions(prev => prev.filter(t => t.id !== id));
      toast.success('Transaction deleted');
    } catch {
      toast.error('Failed to delete transaction');
    }
  };

  const updateBudget = (category: string, limit: number) => {
    setBudgets(budgets.map(b =>
      b.category === category ? { ...b, limit } : b
    ));
  };

  const saveBudget = async (category: string, limit: number) => {
    try {
      const res = await fetch('/api/budgets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, limit }),
      });
      if (res.ok && limit > 0) toast.success(`Budget updated for ${category}`);
    } catch {
      toast.error('Failed to save budget');
    }
  };

  const exportToCSV = () => {
    if (transactions.length === 0) {
      toast.error('No transactions to export');
      return;
    }
    const csv = [
      ['Date', 'Type', 'Category', 'Description', 'Amount'],
      ...transactions.map(t => [
        t.date,
        t.type,
        t.category,
        t.description,
        t.amount.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Exported to CSV!');
  };

  return (
    <div className="relative min-h-[100dvh]">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--surface-2)',
            color: 'var(--text)',
            border: '1px solid var(--hairline)',
            borderRadius: '12px',
            fontSize: '14px',
          },
        }}
      />
      <AnimatedBackground />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {/* ---- Header ---- */}
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: fluid }}
          className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3.5">
            <span className="grid h-11 w-11 place-items-center rounded-2xl border border-accent/30 bg-accent/15">
              <Wallet size={20} strokeWidth={1.6} className="text-accent" />
            </span>
            <div>
              <span className="eyebrow text-text-faint">Dashboard</span>
              <h1 className="font-display text-2xl font-semibold tracking-tight text-text">
                Welcome back, {user.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <PillButton onClick={exportToCSV} icon={ArrowDownToLine}>
              Export
            </PillButton>
            <PillButton onClick={handleLogout} icon={LogOut} danger>
              Logout
            </PillButton>
          </div>
        </motion.header>

        {/* ---- Stat bento ---- */}
        <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            delay={0.05}
            label="Total income"
            value={stats.totalIncome}
            tone="positive"
            icon={ArrowUpRight}
          />
          <StatCard
            delay={0.12}
            label="Total expenses"
            value={stats.totalExpenses}
            tone="negative"
            icon={ArrowDownRight}
          />
          <StatCard
            delay={0.19}
            label="Net balance"
            value={stats.balance}
            tone={stats.balance >= 0 ? 'accent' : 'negative'}
            icon={Wallet}
          />
        </div>

        {/* ---- Budget + Category ---- */}
        <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <GlassCard delay={0.1} className="p-7">
            <div className="mb-6">
              <span className="eyebrow text-accent">Budgets</span>
              <h2 className="mt-2 font-display text-xl font-semibold tracking-tight text-text">
                Budget overview
              </h2>
              <p className="mt-1 text-xs text-text-muted">Spending vs limit, this month</p>
            </div>
            <div className="space-y-5">
              {budgets.map((budget) => {
                const spent = stats.currentMonthExpensesByCategory[budget.category] || 0;
                const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
                const barColor =
                  percentage > 100 ? 'var(--negative)' : percentage > 80 ? 'var(--warning)' : 'var(--accent)';
                return (
                  <div key={budget.category}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-text-soft">{budget.category}</span>
                      <input
                        type="number"
                        placeholder="Limit"
                        value={budget.limit || ''}
                        onChange={(e) => updateBudget(budget.category, parseFloat(e.target.value) || 0)}
                        onBlur={(e) => saveBudget(budget.category, parseFloat(e.target.value) || 0)}
                        className="w-24 rounded-lg border border-hairline bg-bg-elev px-3 py-1.5 text-right text-sm text-text outline-none transition-all duration-300 placeholder:text-text-faint focus:border-accent/50 focus:ring-2 focus:ring-accent/15 tnum"
                      />
                    </div>
                    {budget.limit > 0 && (
                      <>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(percentage, 100)}%` }}
                            transition={{ duration: 1, ease: fluid }}
                            className="h-full rounded-full"
                            style={{ background: barColor, boxShadow: `0 0 12px ${barColor}66` }}
                          />
                        </div>
                        <p className="mt-1.5 text-xs text-text-muted tnum">
                          ${spent.toFixed(2)} / ${budget.limit.toFixed(2)} · {percentage.toFixed(0)}%
                          {percentage > 100 && (
                            <span className="ml-2 font-semibold text-negative">Over budget</span>
                          )}
                        </p>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </GlassCard>

          <GlassCard delay={0.16} className="p-7">
            <div className="mb-6">
              <span className="eyebrow text-accent">Breakdown</span>
              <h2 className="mt-2 font-display text-xl font-semibold tracking-tight text-text">
                Spending by category
              </h2>
              <p className="mt-1 text-xs text-text-muted">All-time, highest first</p>
            </div>
            <div className="space-y-2">
              {(() => {
                const max = Math.max(...Object.values(stats.expensesByCategory), 1);
                return Object.entries(stats.expensesByCategory)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, amount], index) => (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04, ease: fluid }}
                      className="relative overflow-hidden rounded-xl border border-hairline bg-white/[0.02] px-4 py-3"
                    >
                      <div
                        className="absolute inset-y-0 left-0 bg-accent/[0.07]"
                        style={{ width: `${(amount / max) * 100}%` }}
                      />
                      <div className="relative flex items-center justify-between">
                        <span className="text-sm font-medium text-text-soft">{category}</span>
                        <span className="text-sm font-semibold text-text tnum">${amount.toFixed(2)}</span>
                      </div>
                    </motion.div>
                  ));
              })()}
              {Object.keys(stats.expensesByCategory).length === 0 && (
                <p className="py-10 text-center text-sm text-text-muted">No expenses yet</p>
              )}
            </div>
          </GlassCard>
        </div>

        {/* ---- Transactions ---- */}
        <GlassCard delay={0.22} className="p-7">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <span className="eyebrow text-accent">Activity</span>
              <h2 className="mt-2 font-display text-xl font-semibold tracking-tight text-text">
                Recent transactions
              </h2>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="group flex items-center gap-2 rounded-full bg-accent py-2.5 pl-4 pr-2.5 text-sm font-semibold text-bg transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97]"
            >
              {showAddForm ? 'Close' : 'Add'}
              <span className="grid h-6 w-6 place-items-center rounded-full bg-bg/15 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:rotate-90">
                {showAddForm ? <X size={14} strokeWidth={2} /> : <Plus size={14} strokeWidth={2} />}
              </span>
            </button>
          </div>

          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: fluid }}
                className="mb-6 overflow-hidden"
              >
                <div className="rounded-2xl border border-hairline bg-white/[0.02] p-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-muted">Type</span>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({
                          ...formData,
                          type: e.target.value as 'income' | 'expense',
                          category: e.target.value === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]
                        })}
                        className={inputCls}
                      >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-muted">Amount</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className={inputCls}
                        placeholder="0.00"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-muted">Category</span>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className={inputCls}
                      >
                        {(formData.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-muted">Date</span>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className={inputCls}
                      />
                    </label>
                    <label className="block md:col-span-2">
                      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-muted">Description</span>
                      <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className={inputCls}
                        placeholder="What was it for?"
                      />
                    </label>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={handleAddTransaction}
                      disabled={loading}
                      className="flex-1 rounded-full bg-accent py-3 text-sm font-semibold text-bg transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] disabled:opacity-50"
                    >
                      {loading ? 'Saving…' : 'Add transaction'}
                    </button>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="rounded-full border border-hairline-strong bg-white/[0.03] px-6 py-3 text-sm font-medium text-text-soft transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/[0.06] active:scale-[0.98]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Transaction list */}
          <div className="max-h-[500px] space-y-2.5 overflow-y-auto pr-1">
            {dataLoading ? (
              <div className="space-y-2.5">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-[68px] animate-pulse rounded-xl border border-hairline bg-white/[0.03]" />
                ))}
              </div>
            ) : (
              <AnimatePresence>
                {transactions.map((transaction, index) => {
                  const isIncome = transaction.type === 'income';
                  return (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: Math.min(index * 0.03, 0.3), ease: fluid }}
                      className="group flex items-center justify-between gap-4 rounded-xl border border-hairline bg-white/[0.02] px-4 py-3.5 transition-colors duration-300 hover:border-hairline-strong hover:bg-white/[0.04]"
                    >
                      <div className="flex min-w-0 items-center gap-3.5">
                        <span
                          className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                            isIncome ? 'bg-accent/12 text-accent' : 'bg-negative/12 text-negative'
                          }`}
                        >
                          {isIncome ? (
                            <ArrowUpRight size={16} strokeWidth={1.8} />
                          ) : (
                            <ArrowDownRight size={16} strokeWidth={1.8} />
                          )}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-medium text-text">{transaction.description}</p>
                            <span className="shrink-0 rounded-md border border-hairline bg-white/[0.03] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-text-muted">
                              {transaction.category}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-text-faint tnum">
                            {new Date(transaction.date + 'T12:00:00').toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-semibold tnum ${isIncome ? 'text-accent' : 'text-text'}`}>
                          {isIncome ? '+' : '−'}${transaction.amount.toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="grid h-8 w-8 place-items-center rounded-lg text-text-faint opacity-60 transition-all duration-300 hover:bg-negative/15 hover:text-negative focus-visible:opacity-100 focus-visible:text-negative group-hover:opacity-100"
                          aria-label="Delete transaction"
                        >
                          <Trash2 size={15} strokeWidth={1.6} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
            {!dataLoading && transactions.length === 0 && (
              <div className="py-14 text-center">
                <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl border border-hairline bg-white/[0.03] text-text-faint">
                  <Wallet size={22} strokeWidth={1.4} />
                </span>
                <p className="text-sm text-text-muted">No transactions yet — add your first one.</p>
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

/* ---------- Header pill button ---------- */
function PillButton({
  children,
  onClick,
  icon: Icon,
  danger = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97] ${
        danger
          ? 'border-negative/25 bg-negative/[0.06] text-negative hover:bg-negative/[0.12]'
          : 'border-hairline-strong bg-white/[0.03] text-text-soft hover:bg-white/[0.07]'
      }`}
    >
      <Icon size={15} strokeWidth={1.6} />
      {children}
    </button>
  );
}

/* ---------- Stat card (double-bezel) ---------- */
function StatCard({
  label,
  value,
  tone,
  icon: Icon,
  delay,
}: {
  label: string;
  value: number;
  tone: 'positive' | 'negative' | 'accent';
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  delay: number;
}) {
  const color =
    tone === 'negative' ? 'text-negative' : 'text-accent';
  const iconBg =
    tone === 'negative' ? 'bg-negative/12 text-negative' : 'bg-accent/12 text-accent';
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, delay, ease: fluid }}
      className="group bezel-shell"
    >
      <div className="bezel-core flex items-center justify-between p-6 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-1">
        <div>
          <span className="eyebrow text-text-faint">{label}</span>
          <p className={`mt-2.5 font-display text-3xl font-semibold tracking-tight tnum ${color}`}>
            <AnimatedNumber value={value} prefix="$" />
          </p>
        </div>
        <span className={`grid h-11 w-11 place-items-center rounded-2xl ${iconBg}`}>
          <Icon size={19} strokeWidth={1.6} />
        </span>
      </div>
    </motion.div>
  );
}
