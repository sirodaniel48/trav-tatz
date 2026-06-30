"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { ReactNode } from "react";

interface RevealProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  index?: number;
  className?: string;
  variant?: any;
}

export function Reveal({ children, index = 0, className = "", variant = fadeUp, ...props }: RevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={variant}
      custom={index}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
