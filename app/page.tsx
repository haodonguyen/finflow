import Link from 'next/link';
import { DollarSign, TrendingUp, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Personal Finance Dashboard
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Take control of your finances. Track expenses, set budgets, and achieve your financial goals.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <DollarSign className="text-blue-600" size={48} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Track Expenses</h3>
            <p className="text-gray-600">
              Monitor your spending across different categories and keep your finances organized.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <TrendingUp className="text-green-600" size={48} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Set Budgets</h3>
            <p className="text-gray-600">
              Create monthly budgets for each category and track your progress in real-time.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <Shield className="text-purple-600" size={48} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Secure & Private</h3>
            <p className="text-gray-600">
              Your financial data is encrypted and secure. Only you have access to your information.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to take control of your finances?
          </h2>
          <p className="text-gray-600 mb-6">
            Join thousands of users who are successfully managing their money with our dashboard.
          </p>
          <Link
            href="/register"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Sign Up Free
          </Link>
        </div>
      </div>
    </div>
  );
}