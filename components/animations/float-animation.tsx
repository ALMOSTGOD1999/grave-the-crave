"use client";

import { motion } from "framer-motion";

interface FloatAnimationProps {
  children: React.ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
  delay?: number;
}

export default function FloatAnimation({
  children,
  className = "",
  amplitude = 10,
  duration = 4,
  delay = 0,
}: FloatAnimationProps) {
  return (
    <motion.div
      className={className}
      initial={{ y: 0 }}
      animate={{ y: [0, -amplitude, 0, amplitude, 0] }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}