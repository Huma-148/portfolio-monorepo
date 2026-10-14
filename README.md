# 🚀 Full-Stack Financial Analytics & Data Pipeline Monorepo

An enterprise-ready, decoupled monorepo application designed to solve real-world high-throughput database bottlenecks and serve performant client-facing financial visuals. 

## 🛠️ System Capabilities & Features

### 💻 Full-Stack Frontend Layout (`/frontend`)
- **Real-Time Visualizations:** Implements high-fidelity charts, graphs, and aggregate financial data components using Next.js (App Router) and Framer Motion.
- **Granular Reporting Engine:** Features multi-column sorting, server-side pagination, and complex tabular report filters optimized for heavy datasets.

### ⚙️ Standalone GraphQL Service (`/backend`)
- **Enterprise Middleware Security:** Secured using Helmet header protection, CORS configuration, and request Rate-Limiting.
- **Strict Role-Based Access Control (RBAC):** Built-in JWT authentication parsing that injects visitor identities (`ADMIN` vs `VISITOR`) directly into the GraphQL context execution layer.
- **Optimized Relational Tracking:** Includes custom flat PostgreSQL analytics schemas running B-Tree composite indexing to completely bypass the processing overhead of unoptimized JSONB parsing over 10+ lakh records.

## 🚢 CI/CD Orchestration
- Powered by **GitHub Actions** with strict **Path Filtering**. Frontend updates do not trigger backend compilation pipelines, reducing cloud build times and mirroring production architecture patterns.


