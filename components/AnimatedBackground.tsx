'use client';

import { motion } from 'framer-motion';

/**
 * Calm ambient field — a deep OLED base with a single restrained mint
 * orb and a faint hairline grid. Animates only transform/opacity.
 */
export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-bg">
      {/* Faint structural grid */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage:
            'radial-gradient(ellipse 90% 70% at 50% 0%, #000 40%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 90% 70% at 50% 0%, #000 40%, transparent 100%)',
        }}
      />

      {/* Single accent orb, breathing slowly */}
      <motion.div
        aria-hidden
        animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.72, 0.5] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-40 left-1/2 -translate-x-1/2 h-[44rem] w-[44rem] rounded-full blur-[140px]"
        style={{ background: 'radial-gradient(circle, var(--accent-glow), transparent 70%)' }}
      />

      {/* Cool counter-glow lower-left for depth */}
      <motion.div
        aria-hidden
        animate={{ scale: [1.05, 1, 1.05], opacity: [0.35, 0.5, 0.35] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[-12rem] left-[-6rem] h-[34rem] w-[34rem] rounded-full blur-[150px]"
        style={{ background: 'radial-gradient(circle, rgba(96,120,255,0.10), transparent 70%)' }}
      />

      {/* Vignette to seat the OLED black */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 40%, transparent 40%, rgba(0,0,0,0.55) 100%)' }}
      />
    </div>
  );
}
