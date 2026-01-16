'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}

export default function GlassCard({ 
  children, 
  className = '', 
  delay = 0,
  hover = true 
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { 
        scale: 1.02, 
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        transition: { duration: 0.2 }
      } : {}}
      className={`
        backdrop-blur-lg bg-white/80 dark:bg-gray-800/80
        border border-white/20 dark:border-gray-700/20
        rounded-2xl shadow-xl
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}