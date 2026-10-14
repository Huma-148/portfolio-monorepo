"use client";

import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/layout/Section";
import { ICONS, SKILL_CATEGORIES } from "@/lib/data";


export function Skills() {
  return (
    <Section id="skills" className="border-t border-border">
      <SectionHeader
        eyebrow="Capabilities"
        title="Core skills"
        description="Hybrid expertise across application development and real-time data infrastructure."
      />

      <div className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
        {SKILL_CATEGORIES.map((category, index) => {
          const Icon = ICONS[category.id as keyof typeof ICONS];

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="bg-surface p-6 sm:p-8"
            >
              <div className="mb-5 flex items-center gap-3">
                <Icon size={18} className="text-accent" strokeWidth={1.75} />
                <h3 className="text-base font-medium tracking-tight text-foreground">
                  {category.title}
                </h3>
              </div>
              <p className="mb-6 text-sm leading-relaxed text-muted">
                {category.description}
              </p>
              <ul className="flex flex-col gap-2.5">
                {category.skills.map((skill) => (
                  <li
                    key={skill}
                    className="flex items-center gap-2 font-mono text-xs text-foreground/90"
                  >
                    <span className="h-px w-3 bg-accent/60" aria-hidden />
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
