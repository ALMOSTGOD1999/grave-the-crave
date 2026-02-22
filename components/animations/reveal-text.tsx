"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

interface RevealTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
}

export default function RevealText({
  children,
  className = "",
  delay = 0,
  duration = 0.5,
  once = true,
}: RevealTextProps) {
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
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { y: "100%" },
          visible: {
            y: 0,
            transition: {
              duration,
              delay,
              ease: [0.25, 0.1, 0.25, 1.0],
            },
          },
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}