"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { SITE } from "@/lib/data";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col justify-end overflow-hidden bg-grid bg-noise pb-16 pt-28 md:justify-center md:pb-24 md:pt-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 font-mono text-xs tracking-[0.22em] text-accent uppercase"
        >
          {SITE.name}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="max-w-4xl text-4xl leading-[1.05] font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Full-Stack Developer
          <br />
          <span className="text-muted">&amp; Data Engineer</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
        >
          Building high-performance web applications and optimizing
          high-throughput data systems—from MEAN/MERN platforms to real-time
          CDC pipelines.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.24 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href="#case-study"
            className="inline-flex items-center gap-2 bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            View case study
            <ArrowRight size={16} />
          </a>
          <a
            href="#pipeline"
            className="inline-flex items-center gap-2 border border-border-strong px-5 py-3 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            Explore pipeline
          </a>
        </motion.div>
      </div>

      <motion.a
        href="#skills"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 font-mono text-[11px] tracking-widest text-muted uppercase md:flex"
        aria-label="Scroll to skills"
      >
        <ArrowDown size={14} className="animate-bounce" />
        Scroll
      </motion.a>
    </section>
  );
}
