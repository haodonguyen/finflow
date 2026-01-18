'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Shield, Sparkles, ArrowRight, Zap, PieChart, Bell, Download } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="max-w-6xl mx-auto text-center">
            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm mb-8"
            >
              <Sparkles className="text-yellow-500" size={16} />
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Your Financial Journey Starts Here
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-6xl md:text-8xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                FinFlow
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 mb-4 font-light"
            >
              Your finances, flowing smoothly
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto"
            >
              Take control of your financial future with intelligent budgeting, 
              real-time tracking, and beautiful visualizations
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-xl overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started Free
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
                    initial={{ x: '100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </Link>

              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-800 dark:text-white rounded-2xl font-semibold text-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 transition shadow-lg"
                >
                  Sign In
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-600 dark:text-gray-400"
            >
              <div className="flex items-center gap-2">
                <Shield className="text-green-500" size={16} />
                <span>Bank-level security</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="text-yellow-500" size={16} />
                <span>Lightning fast</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="text-purple-500" size={16} />
                <span>Free forever</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Everything you need to thrive
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Powerful features designed for modern money management
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                  >
                    <DollarSign className="text-white" size={32} />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                    Smart Tracking
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Automatically categorize expenses and track every dollar with intelligent insights and real-time updates.
                  </p>
                </div>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                  >
                    <TrendingUp className="text-white" size={32} />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                    Budget Goals
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Set personalized budgets, track progress in real-time, and get alerts before overspending.
                  </p>
                </div>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                  >
                    <PieChart className="text-white" size={32} />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                    Visual Insights
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Beautiful charts and graphs that make understanding your finances effortless and engaging.
                  </p>
                </div>
              </motion.div>

              {/* Feature 4 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                  >
                    <Shield className="text-white" size={32} />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                    Bank-Level Security
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Your data is encrypted and secure with industry-standard JWT authentication and protection.
                  </p>
                </div>
              </motion.div>

              {/* Feature 5 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                  >
                    <Bell className="text-white" size={32} />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                    Smart Alerts
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Get notified when you're close to budget limits or when unusual spending is detected.
                  </p>
                </div>
              </motion.div>

              {/* Feature 6 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                  >
                    <Download className="text-white" size={32} />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                    Export Anywhere
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Download your financial data as CSV anytime for tax season or personal records.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 overflow-hidden shadow-2xl">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '40px 40px'
                }} />
              </div>

              <div className="relative z-10 text-center text-white">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="inline-block mb-6"
                >
                  <Sparkles size={48} />
                </motion.div>

                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Ready to take control?
                </h2>
                <p className="text-xl mb-8 opacity-90">
                  Join thousands of users who are successfully managing their money with FinFlow
                </p>

                <Link href="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-5 bg-white text-purple-600 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition"
                  >
                    Start Your Journey Free
                  </motion.button>
                </Link>

                <p className="mt-6 text-sm opacity-75">
                  No credit card required • Free forever • Cancel anytime
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 text-center text-gray-600 dark:text-gray-400">
          <p className="text-sm">
            © 2025 FinFlow. Made with ❤️ for better financial futures.
          </p>
        </footer>
      </div>
    </div>
  );
}