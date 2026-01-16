'use client';

import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900" />
      
      {/* Animated Blobs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          borderRadius: ["30% 70% 70% 30%", "70% 30% 30% 70%", "30% 70% 70% 30%"]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-400/30 blur-3xl"
      />
      
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [90, 0, 90],
          borderRadius: ["70% 30% 30% 70%", "30% 70% 70% 30%", "70% 30% 30% 70%"]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-pink-400/30 to-indigo-400/30 blur-3xl"
      />
      
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-cyan-400/20 to-blue-400/20 blur-3xl"
      />
    </div>
  );
}