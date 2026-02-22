"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

interface StaggerChildrenProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  once?: boolean;
}

export default function StaggerChildren({
  children,
  className = "",
  delay = 0,
  staggerDelay = 0.1,
  once = true,
}: StaggerChildrenProps) {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-100px 0px" });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else if (!once) {
      controls.start("hidden");
    }
  }, [isInView, controls, once]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}