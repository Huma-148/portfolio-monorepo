import {
  AlertTriangle,
  Gauge,
  Workflow,
  Code2,
  Link2,
  Mail,
  Activity,
  Database,
  LayoutDashboard,
  Radio,
  Server,
  Cloud,
} from "lucide-react";
import type {
  AnalyticsFeature,
  FormState,
  PipelineStep,
} from "./interface";

export const SITE = {
  name: "Huma Maryam",
  title: "Full-Stack Developer & Data Engineer",
  email: "huma@example.com",
  github: "https://github.com",
  linkedin: "https://linkedin.com/in",
} as const;

export const NAV_LINKS = [
  { href: "#skills", label: "Skills" },
  { href: "#case-study", label: "Case Study" },
  { href: "#pipeline", label: "Pipeline" },
  { href: "#contact", label: "Contact" },
] as const;

export const SKILL_CATEGORIES = [
  {
    id: "fullstack",
    title: "Full-Stack (Web)",
    description:
      "End-to-end application architecture across MEAN and MERN stacks.",
    skills: [
      "Angular (MEAN)",
      "React (MERN)",
      "Node.js",
      "Express",
      "Next.js",
      "Tailwind CSS",
    ],
  },
  {
    id: "data-cloud",
    title: "Data & Cloud Infrastructure",
    description:
      "Real-time ingestion, ETL, and observability for high-throughput systems.",
    skills: ["AWS Glue", "AWS CloudWatch", "Maxwell (CDC)", "Debezium"],
  },
  {
    id: "databases",
    title: "Databases",
    description:
      "Relational and document stores tuned for OLTP and analytics workloads.",
    skills: ["MySQL", "PostgreSQL", "MongoDB"],
  },
] as const;

export const CASE_STUDY = {
  title: "Real-Time Financial Analytics Sync & DB Offloading",
  problem:
    "A live, business-critical MySQL database was highly overloaded by analytical queries.",
  solution:
    "Implemented a Change Data Capture (CDC) pipeline using Maxwell/Debezium to stream data out of MySQL in near real-time, processing it into PostgreSQL to serve intensive financial analytics dashboards.",
  impact:
    "Offloaded heavy analytics from the primary database and comfortably met a 24-hour client SLA with near real-time pipeline performance.",
} as const;

export const BLOCKS = [
  {
    icon: AlertTriangle,
    label: "Problem",
    body: CASE_STUDY.problem,
    accent: "text-warning",
  },
  {
    icon: Workflow,
    label: "Solution",
    body: CASE_STUDY.solution,
    accent: "text-accent",
  },
  {
    icon: Gauge,
    label: "Impact",
    body: CASE_STUDY.impact,
    accent: "text-foreground",
  },
] as const;

export const socials = [
  { href: SITE.github, label: "GitHub", icon: Code2 },
  { href: SITE.linkedin, label: "LinkedIn", icon: Link2 },
  { href: `mailto:${SITE.email}`, label: "Email", icon: Mail },
] as const;

export const INITIAL: FormState = { name: "", email: "", message: "" };

export const STEP_ICONS = [
  Database,
  Radio,
  Server,
  Activity,
  LayoutDashboard,
] as const;

export const ICONS = {
  fullstack: Code2,
  "data-cloud": Cloud,
  databases: Database,
} as const;

export const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: "src-db",
    name: "Live MySQL DB",
    layer: "Backend Infrastructure",
    desc: "The mission-critical production database handling heavy transactions, which was severely overloaded by legacy reporting queries.",
  },
  {
    id: "cdc-stream",
    name: "CDC Layer (Maxwell/Debezium)",
    layer: "Data Engineering",
    desc: "Captures row-level database modifications in near real-time from the MySQL binary log without adding analytical query stress.",
  },
  {
    id: "dest-db",
    name: "Analytics PostgreSQL",
    layer: "Data Engineering",
    desc: "Dedicated target database configured strictly for heavy analytics indexing, materialized views, and fast read execution.",
  },
  {
    id: "analytics-api",
    name: "REST/GraphQL API (Node.js/Express)",
    layer: "Full-Stack Development",
    desc: "Built high-throughput aggregation endpoints with server-side caching to fetch multi-million row financial queries efficiently.",
  },
  {
    id: "dashboard-ui",
    name: "Interactive Financial Dashboard",
    layer: "Full-Stack Development",
    desc: "Engineered a highly responsive web application featuring real-time data charts, detailed tabular reports, dynamic date filtering, and multi-format report exports.",
  },
];

export const ANALYTICS_FEATURES: AnalyticsFeature[] = [
  {
    title: "Real-Time Visualizations",
    desc: "Interactive line charts, bar graphs, and breakdown grids rendering high-velocity financial metrics with smooth transitions.",
  },
  {
    title: "Granular Reporting Engine",
    desc: "Server-side paginated data tables featuring dynamic filtering, multi-column sorting, and asynchronous file generations for heavy datasets.",
  },
  {
    title: "SLA-Driven Architecture",
    desc: "Bypassed client-communicated 24-hour SLA targets by routing optimized PostgreSQL aggregations into client dashboards in near real-time.",
  },
];
