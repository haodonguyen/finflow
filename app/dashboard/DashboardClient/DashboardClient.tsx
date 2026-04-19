'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Trash2, TrendingUp, TrendingDown, DollarSign, LogOut, Download, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen relative">
      <Toaster position="top-right" />
      <AnimatedBackground />

      <div className="max-w-7xl mx-auto p-4 md:p-8 relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <motion.h1
              className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Finance Dashboard
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2"
            >
              <Sparkles className="text-yellow-500" size={20} />
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Welcome back, <span className="font-bold text-blue-600">{user.name}</span>! 👋
              </p>
            </motion.div>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition"
            >
              <Download size={20} />
              Export
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition"
            >
              <LogOut size={20} />
              Logout
            </motion.button>
          </div>
        </motion.header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassCard delay={0.1} className="p-6 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-400/10"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 font-medium">Total Income</p>
                <p className="text-3xl font-bold text-green-600">
                  <AnimatedNumber value={stats.totalIncome} prefix="$" />
                </p>
              </div>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <TrendingUp className="text-green-600" size={40} />
              </motion.div>
            </div>
          </GlassCard>

          <GlassCard delay={0.2} className="p-6 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-red-400/10 to-pink-400/10"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 font-medium">Total Expenses</p>
                <p className="text-3xl font-bold text-red-600">
                  <AnimatedNumber value={stats.totalExpenses} prefix="$" />
                </p>
              </div>
              <motion.div
                whileHover={{ rotate: -360 }}
                transition={{ duration: 0.5 }}
              >
                <TrendingDown className="text-red-600" size={40} />
              </motion.div>
            </div>
          </GlassCard>

          <GlassCard delay={0.3} className="p-6 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, delay: 2 }}
            />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 font-medium">Balance</p>
                <p className={`text-3xl font-bold ${stats.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  <AnimatedNumber value={stats.balance} prefix="$" />
                </p>
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <DollarSign className="text-blue-600" size={40} />
              </motion.div>
            </div>
          </GlassCard>
        </div>

        {/* Budget & Category Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <GlassCard delay={0.4} className="p-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
              Budget Overview
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">Spending vs limit this month</p>
            <div className="space-y-4">
              {budgets.map((budget, index) => {
                const spent = stats.currentMonthExpensesByCategory[budget.category] || 0;
                const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
                return (
                  <motion.div
                    key={budget.category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        {budget.category}
                      </span>
                      <input
                        type="number"
                        placeholder="Set limit"
                        value={budget.limit || ''}
                        onChange={(e) => updateBudget(budget.category, parseFloat(e.target.value) || 0)}
                        onBlur={(e) => saveBudget(budget.category, parseFloat(e.target.value) || 0)}
                        className="w-24 px-3 py-1 text-sm border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                      />
                    </div>
                    {budget.limit > 0 && (
                      <>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(percentage, 100)}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-3 rounded-full ${
                              percentage > 100
                                ? 'bg-gradient-to-r from-red-500 to-red-600'
                                : percentage > 80
                                ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                : 'bg-gradient-to-r from-green-500 to-emerald-500'
                            }`}
                          />
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          ${spent.toFixed(2)} / ${budget.limit.toFixed(2)} ({percentage.toFixed(0)}%)
                          {percentage > 100 && (
                            <span className="ml-2 text-red-500 font-semibold">⚠ Over budget!</span>
                          )}
                        </p>
                      </>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>

          <GlassCard delay={0.5} className="p-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6">
              Spending by Category
            </h2>
            <div className="space-y-3">
              {Object.entries(stats.expensesByCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount], index) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 backdrop-blur-sm"
                  >
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      {category}
                    </span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      ${amount.toFixed(2)}
                    </span>
                  </motion.div>
                ))}
              {Object.keys(stats.expensesByCategory).length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">No expenses yet</p>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Transactions */}
        <GlassCard delay={0.6} className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Recent Transactions
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition"
            >
              <PlusCircle size={20} />
              Add Transaction
            </motion.button>
          </div>

          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="p-6 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl backdrop-blur-sm border border-white/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                        Type
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({
                          ...formData,
                          type: e.target.value as 'income' | 'expense',
                          category: e.target.value === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]
                        })}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                      >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                        Amount
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                      >
                        {(formData.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                        Description
                      </label>
                      <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                        placeholder="Enter description"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddTransaction}
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Add Transaction'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowAddForm(false)}
                      className="px-6 py-3 rounded-xl font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Transaction List */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {dataLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 rounded-xl bg-gray-200/60 dark:bg-gray-700/60 animate-pulse" />
                ))}
              </div>
            ) : (
              <AnimatePresence>
                {transactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50/80 to-blue-50/80 dark:from-gray-800/80 dark:to-blue-900/80 backdrop-blur-sm border border-white/20 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                          transaction.type === 'income'
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                            : 'bg-gradient-to-r from-red-400 to-pink-500 text-white'
                        }`}>
                          {transaction.type}
                        </span>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                          {transaction.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{transaction.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {new Date(transaction.date + 'T12:00:00').toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-xl font-bold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            {!dataLoading && transactions.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="mx-auto text-gray-400 mb-4" size={48} />
                </motion.div>
                <p className="text-gray-500 text-lg">No transactions yet. Add your first one!</p>
              </motion.div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
