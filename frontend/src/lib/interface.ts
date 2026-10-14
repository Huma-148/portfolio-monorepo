import type { ReactNode } from "react";


/* This is the interface for the section component */
export type SectionProps = {
  id: string;
  children: ReactNode;
  className?: string;
  enclosed?: boolean;
};

export type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

/* This is the interface for the Contact section */
export type FormState = {
  name: string;
  email: string;
  message: string;
};

export type FormErrors = Partial<Record<keyof FormState, string>>;

export type FieldProps = {
  id: string;
  label: string;
  value: string;
  error?: string;
  type?: string;
  onChange: (value: string) => void;
};

export interface PipelineStepI  {
    id: string;
    label: string;
    shortLabel: string;
    status: string;
    description: string
}

// ============================================================================
// FILE: src/lib/interface.ts
// DESCRIPTION: Strictly typed definitions for full-stack data pipeline case study
// ============================================================================

export interface PipelineStep {
    id: string;
    name: string;
    layer: 'Backend Infrastructure' | 'Data Engineering' | 'Full-Stack Development';
    desc: string;
  }
  
  export interface AnalyticsFeature {
    title: string;
    desc: string;
  }