"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/Section";
import {
  ANALYTICS_FEATURES,
  BLOCKS,
  CASE_STUDY,
  PIPELINE_STEPS,
  STEP_ICONS,
} from "@/lib/data";
import type { PipelineStep } from "@/lib/interface";

type ActiveTab = "pipeline" | "dashboard";

const LAYER_BADGE: Record<
  PipelineStep["layer"],
  { className: string; label: string }
> = {
  "Backend Infrastructure": {
    label: "Backend",
    className:
      "border-sky-500/40 bg-sky-500/10 text-sky-300",
  },
  "Data Engineering": {
    label: "Data Engineering",
    className:
      "border-violet-500/40 bg-violet-500/10 text-violet-300",
  },
  "Full-Stack Development": {
    label: "Full-Stack",
    className:
      "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  },
};

const MOCK_METRICS = [
  { label: "SLA Status", value: "99.8%", detail: "Near Real-Time" },
  { label: "Sync Lag", value: "1.2s", detail: "p95 latency" },
  { label: "Events / min", value: "14.6k", detail: "CDC throughput" },
  { label: "Primary Load", value: "−62%", detail: "Analytics offload" },
] as const;

const MOCK_ROWS = [
  { symbol: "AAPL", pnl: "+2.4%", volume: "1.2M", status: "Synced" },
  { symbol: "MSFT", pnl: "+1.1%", volume: "890K", status: "Synced" },
  { symbol: "NVDA", pnl: "−0.6%", volume: "2.1M", status: "Streaming" },
  { symbol: "JPM", pnl: "+0.9%", volume: "640K", status: "Synced" },
] as const;

const CHART_POINTS = [28, 36, 32, 48, 44, 62, 58, 74, 68, 82, 78, 92];

export function CaseStudy() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("pipeline");
  const [activeStepId, setActiveStepId] = useState(PIPELINE_STEPS[0].id);

  const activeStep =
    PIPELINE_STEPS.find((step) => step.id === activeStepId) ??
    PIPELINE_STEPS[0];
  const activeIndex = PIPELINE_STEPS.findIndex(
    (step) => step.id === activeStepId,
  );

  return (
    <Section id="case-study" className="border-t border-border">
      <SectionHeader
        eyebrow="Featured case study"
        title={CASE_STUDY.title}
        description="A dedicated look at offloading analytics from a live production database with a near real-time CDC pipeline."
      />

      <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
        <motion.aside
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-4"
        >
          <div className="sticky top-28 border border-border-strong bg-surface p-6 sm:p-8">
            <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
              Highlight metric
            </p>
            <p className="mt-4 text-4xl font-semibold tracking-tight text-accent sm:text-5xl">
              24h
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Client SLA met with near real-time pipeline performance while
              protecting the primary OLTP database.
            </p>
            <div className="mt-8 border-t border-border pt-6">
              <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
                Stack
              </p>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                MySQL · Maxwell / Debezium · AWS Glue · CloudWatch · PostgreSQL
              </p>
            </div>
          </div>
        </motion.aside>

        <div className="flex flex-col gap-6 lg:col-span-8">
          {BLOCKS.map((block, index) => {
            const Icon = block.icon;
            return (
              <motion.article
                key={block.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
                className="border border-border-strong bg-surface-raised p-6 sm:p-8"
              >
                <div className="mb-4 flex items-center gap-3">
                  <Icon size={18} className={block.accent} strokeWidth={1.75} />
                  <h3 className="font-mono text-xs tracking-[0.16em] text-muted uppercase">
                    {block.label}
                  </h3>
                </div>
                <p className="text-base leading-relaxed text-foreground/90 sm:text-lg">
                  {block.body}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>

      {/* Interactive tabs: pipeline infrastructure + mock analytics UI */}
      <div id="pipeline" className="mt-14 scroll-mt-24 md:mt-20">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 font-mono text-[11px] tracking-[0.18em] text-accent uppercase">
              Interactive architecture
            </p>
            <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Pipeline &amp; dashboard
            </h3>
          </div>

          <div
            role="tablist"
            aria-label="Case study views"
            className="inline-flex border border-border-strong bg-surface p-1"
          >
            {(
              [
                { id: "pipeline", label: "Data Pipeline" },
                { id: "dashboard", label: "Analytics UI" },
              ] as const
            ).map((tab) => {
              const selected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm transition-colors ${
                    selected
                      ? "bg-foreground text-background"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="border border-border-strong bg-surface p-5 sm:p-8">
          <AnimatePresence mode="wait">
            {activeTab === "pipeline" ? (
              <motion.div
                key="pipeline"
                role="tabpanel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {/* Desktop horizontal flow */}
                <div className="hidden md:block">
                  <ol className="relative flex items-stretch justify-between gap-2">
                    <div
                      className="pointer-events-none absolute top-[2.15rem] right-8 left-8 h-px bg-border-strong"
                      aria-hidden
                    >
                      <motion.div
                        className="h-full origin-left bg-accent"
                        initial={false}
                        animate={{
                          scaleX:
                            activeIndex / (PIPELINE_STEPS.length - 1) || 0.01,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 120,
                          damping: 20,
                        }}
                      />
                    </div>

                    {PIPELINE_STEPS.map((step, index) => {
                      const Icon = STEP_ICONS[index];
                      const isActive = step.id === activeStepId;
                      const isPast = index <= activeIndex;
                      const badge = LAYER_BADGE[step.layer];

                      return (
                        <li
                          key={step.id}
                          className="relative z-10 flex flex-1 flex-col items-center"
                        >
                          <button
                            type="button"
                            onClick={() => setActiveStepId(step.id)}
                            aria-pressed={isActive}
                            className={`group flex w-full max-w-[10.5rem] flex-col items-center text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${
                              isActive
                                ? "text-accent"
                                : "text-muted hover:text-foreground"
                            }`}
                          >
                            <motion.span
                              layout
                              className={`mb-3 flex h-10 w-10 items-center justify-center border transition-colors ${
                                isActive
                                  ? "border-accent bg-accent-dim text-accent"
                                  : isPast
                                    ? "border-border-strong bg-surface-raised text-foreground"
                                    : "border-border bg-background text-muted"
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.97 }}
                            >
                              <Icon size={16} strokeWidth={1.75} />
                            </motion.span>
                            <span className="text-xs font-medium tracking-tight text-foreground">
                              {step.name}
                            </span>
                            <span
                              className={`mt-2 border px-1.5 py-0.5 font-mono text-[9px] tracking-wide uppercase ${badge.className}`}
                            >
                              {badge.label}
                            </span>
                            {index < PIPELINE_STEPS.length - 1 ? (
                              <ArrowRight
                                size={12}
                                className="absolute top-[1.35rem] -right-2 text-border-strong opacity-0 lg:opacity-100"
                                aria-hidden
                              />
                            ) : null}
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                </div>

                {/* Mobile vertical flow */}
                <ol className="flex flex-col gap-3 md:hidden">
                  {PIPELINE_STEPS.map((step, index) => {
                    const Icon = STEP_ICONS[index];
                    const isActive = step.id === activeStepId;
                    const badge = LAYER_BADGE[step.layer];

                    return (
                      <li key={step.id}>
                        <button
                          type="button"
                          onClick={() => setActiveStepId(step.id)}
                          aria-pressed={isActive}
                          className={`flex w-full items-start gap-4 border p-4 text-left transition-colors ${
                            isActive
                              ? "border-accent bg-accent-dim"
                              : "border-border-strong bg-background hover:border-border-strong"
                          }`}
                        >
                          <span
                            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border ${
                              isActive
                                ? "border-accent text-accent"
                                : "border-border text-muted"
                            }`}
                          >
                            <Icon size={16} strokeWidth={1.75} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium text-foreground">
                              {step.name}
                            </span>
                            <span
                              className={`mt-2 inline-block border px-1.5 py-0.5 font-mono text-[9px] tracking-wide uppercase ${badge.className}`}
                            >
                              {badge.label}
                            </span>
                          </span>
                        </button>
                        {index < PIPELINE_STEPS.length - 1 ? (
                          <div className="flex justify-center py-1" aria-hidden>
                            <motion.div
                              className="h-4 w-px bg-border-strong"
                              animate={{ opacity: [0.35, 1, 0.35] }}
                              transition={{
                                duration: 1.6,
                                repeat: Infinity,
                                delay: index * 0.15,
                              }}
                            />
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                </ol>

                <div className="mt-8 border-t border-border pt-6 sm:mt-10 sm:pt-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <h4 className="text-lg font-medium tracking-tight text-foreground">
                          {activeStep.name}
                        </h4>
                        <span
                          className={`border px-2 py-0.5 font-mono text-[10px] tracking-wide uppercase ${LAYER_BADGE[activeStep.layer].className}`}
                        >
                          {activeStep.layer}
                        </span>
                      </div>
                      <p className="max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
                        {activeStep.desc}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  <div
                    className="relative mt-8 hidden h-1 overflow-hidden bg-border md:block"
                    aria-hidden
                  >
                    <motion.div
                      className="absolute top-0 h-full w-24 bg-gradient-to-r from-transparent via-accent to-transparent"
                      animate={{ left: ["-20%", "100%"] }}
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="dashboard"
                role="tabpanel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">
                      Mock analytics surface
                    </p>
                    <p className="mt-1 text-sm text-foreground">
                      Financial sync overview
                    </p>
                  </div>
                  <span className="border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 font-mono text-[10px] tracking-wide text-emerald-300 uppercase">
                    Live
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {MOCK_METRICS.map((metric) => (
                    <div
                      key={metric.label}
                      className="border border-border-strong bg-background p-4"
                    >
                      <p className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
                        {metric.label}
                      </p>
                      <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                        {metric.value}
                      </p>
                      <p className="mt-1 text-xs text-accent">{metric.detail}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-5">
                  <div className="border border-border-strong bg-background p-4 lg:col-span-3">
                    <p className="mb-4 font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
                      Throughput · last 12 intervals
                    </p>
                    <svg
                      viewBox="0 0 240 96"
                      className="h-36 w-full text-accent"
                      role="img"
                      aria-label="Dummy line chart of pipeline throughput"
                    >
                      <defs>
                        <linearGradient
                          id="chartFill"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="currentColor"
                            stopOpacity="0.25"
                          />
                          <stop
                            offset="100%"
                            stopColor="currentColor"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>
                      {[0, 1, 2, 3].map((i) => (
                        <line
                          key={i}
                          x1="0"
                          x2="240"
                          y1={20 + i * 20}
                          y2={20 + i * 20}
                          className="stroke-border-strong"
                          strokeWidth="1"
                        />
                      ))}
                      <path
                        d={buildAreaPath(CHART_POINTS)}
                        fill="url(#chartFill)"
                      />
                      <path
                        d={buildLinePath(CHART_POINTS)}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <div className="overflow-hidden border border-border-strong bg-background lg:col-span-2">
                    <div className="border-b border-border px-4 py-3">
                      <p className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
                        Latest sync rows
                      </p>
                    </div>
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-border text-muted">
                        <tr>
                          <th className="px-4 py-2 font-mono font-normal tracking-wide uppercase">
                            Symbol
                          </th>
                          <th className="px-2 py-2 font-mono font-normal tracking-wide uppercase">
                            PnL
                          </th>
                          <th className="hidden px-2 py-2 font-mono font-normal tracking-wide uppercase sm:table-cell">
                            Vol
                          </th>
                          <th className="px-4 py-2 font-mono font-normal tracking-wide uppercase">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {MOCK_ROWS.map((row) => (
                          <tr
                            key={row.symbol}
                            className="border-b border-border/80 last:border-0"
                          >
                            <td className="px-4 py-2.5 font-medium text-foreground">
                              {row.symbol}
                            </td>
                            <td
                              className={`px-2 py-2.5 ${
                                row.pnl.startsWith("+")
                                  ? "text-emerald-300"
                                  : "text-danger"
                              }`}
                            >
                              {row.pnl}
                            </td>
                            <td className="hidden px-2 py-2.5 text-muted sm:table-cell">
                              {row.volume}
                            </td>
                            <td className="px-4 py-2.5 text-muted">
                              {row.status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 border-t border-border pt-8 md:grid-cols-3">
                  {ANALYTICS_FEATURES.map((feature, index) => (
                    <motion.article
                      key={feature.title}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: index * 0.06 }}
                      className="border border-border-strong bg-background p-5"
                    >
                      <h4 className="text-sm font-medium tracking-tight text-foreground">
                        {feature.title}
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {feature.desc}
                      </p>
                    </motion.article>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}

function buildLinePath(points: number[]) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;

  return points
    .map((value, index) => {
      const x = (index / (points.length - 1)) * 240;
      const y = 88 - ((value - min) / range) * 68;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function buildAreaPath(points: number[]) {
  const line = buildLinePath(points);
  return `${line} L 240 96 L 0 96 Z`;
}
