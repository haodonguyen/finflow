'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}

/**
 * Double-bezel card: an outer machined shell holding an inner core with a
 * concentric radius and an inset top highlight. Reveals with a heavy fade-up.
 */
export default function GlassCard({
  children,
  className = '',
  delay = 0,
  hover = true,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: [0.32, 0.72, 0, 1] }}
      whileHover={
        hover
          ? { y: -4, transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] } }
          : undefined
      }
      className="bezel-shell group/card"
    >
      <div className={`bezel-core h-full ${className}`}>{children}</div>
    </motion.div>
  );
}
