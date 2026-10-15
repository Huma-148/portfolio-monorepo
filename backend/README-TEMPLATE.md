# 🛡️ Enterprise Node.js GraphQL & Security Boilerplate

A production-grade, decoupled standalone backend infrastructure template built with TypeScript, Express, Prisma ORM, and Zod configuration schema validations.

## 🚀 Architectural Blueprint Included
- **Schema Validation Layer:** Powered by Zod, enforcing a "Fail-Fast" bootstrap strategy at application boot time with zero runtime fallback leaks for critical security properties.
- **Enterprise Middleware Security:** Secured using Helmet HTTP header policies, strict CORS configurations, and automated IP rate-limiting guards.
- **Context Identity Engine:** Implements high-speed JWT verification mapping to a frozen, immutable GraphQL Context Factory layer to eliminate authorization mutation vectors.
- **Cloud-Ready Logging Subsystem:** Integrated using Winston, configured to automatically format single-line structural JSON messages ready for consumption by production log parsers (e.g., AWS CloudWatch).

## 🛠️ Porting This Template to a New Project
1. Copy the `/backend` folder contents into your new repository workspace.
2. Edit `prisma/schema.prisma` to declare your new domain data models.
3. Run `npm install` followed by `npx prisma migrate dev --name init` to bind your new relational database tables.
4. Modify `src/graphql/typeDefs.ts` and `src/graphql/resolvers.ts` to map your custom API business actions.
