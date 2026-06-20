## Context

The AI Sales Coach is a greenfield proof-of-concept web application for Kraft Heinz China. It will be built from scratch by a solo developer (AI-assisted) over 5-7 working days for an early July 2026 stakeholder demo. The app runs locally only and uses demo data.

Current state: Empty project directory. No existing codebase.

Constraints:
- 1-week timeline
- Solo developer
- Local deployment only
- Demo/sample data (no production KHC knowledge base yet)
- Must work with Qwen (DashScope) and DeepSeek APIs

## Goals / Non-Goals

**Goals:**
- Working prototype that impresses stakeholders with "wow" AI capabilities
- Menu scanner that demonstrates Vision AI (photo → dish extraction → sauce pairing)
- Adaptive AI coach that shows personalization (different responses per user)
- Multi-LLM switching (Qwen ↔ DeepSeek) in real-time
- Clean, polished UI using the Kraft Heinz design system

**Non-Goals:**
- Production deployment or cloud hosting
- Native mobile app
- Real CRM/SAP integration
- Admin dashboard
- Taste Innovation Advisor (roadmap feature)
- Full i18n (Chinese-primary, English secondary)

## Decisions

### 1. Next.js 14+ with App Router

**Decision**: Use Next.js 14+ with App Router, TypeScript, and React Server Components.

**Rationale**: 
- App Router provides clean route organization and layout nesting
- API Routes eliminate need for separate backend
- React Server Components reduce client-side JavaScript
- Strong ecosystem for streaming AI responses

**Alternatives considered**:
- *Remix*: Good DX but smaller ecosystem for AI integrations
- *Plain React + Express*: More setup, no SSR benefits
- *Nuxt/Next*: Next.js has better Vercel AI SDK integration

### 2. PostgreSQL with pgvector

**Decision**: Use PostgreSQL 16+ with pgvector extension for both relational data and vector embeddings.

**Rationale**:
- Single database for users, conversations, memories, and sauce KB embeddings
- pgvector enables RAG search on sauce knowledge without separate vector DB
- Well-supported by Prisma
- Production-ready for future deployment

**Alternatives considered**:
- *SQLite + separate vector DB*: Simpler but two systems to manage
- *MongoDB*: Less structured, weaker Prisma support
- *Pinecone/Weaviate*: Overkill for demo scope

### 3. Prisma ORM

**Decision**: Use Prisma 5.x as the ORM.

**Rationale**:
- Excellent TypeScript type safety
- Schema-first approach matches our design
- Built-in migrations and seeding
- Good documentation and community

**Alternatives considered**:
- *Drizzle*: Lighter but less mature ecosystem
- *TypeORM*: Less TypeScript-native
- *Raw SQL*: More control but more boilerplate

### 4. NextAuth.js (Auth.js) for Authentication

**Decision**: Use NextAuth.js v5 (Auth.js) with Credentials provider for demo accounts.

**Rationale**:
- Quick setup for demo accounts with email/password
- Session management built-in
- Protects routes with middleware
- Can extend to OAuth later

**Alternatives considered**:
- *Custom auth*: More work for no benefit in demo
- *Clerk/Auth0*: External dependency, overkill for demo
- *JWT-only*: Less secure, no session management

### 5. Vercel AI SDK for LLM Integration

**Decision**: Use Vercel AI SDK 3.x with custom provider adapters for Qwen and DeepSeek.

**Rationale**:
- Built-in streaming support with React hooks
- Provider-agnostic interface
- Works seamlessly with Next.js
- Handles message formatting and streaming protocol

**Alternatives considered**:
- *LangChain*: Heavier, more abstraction than needed
- *Raw fetch calls*: More work, no streaming helpers
- *OpenAI SDK*: Limited to OpenAI models

### 6. Model Selection Strategy

**Decision**: Qwen as primary model (supports vision), DeepSeek as text-only alternative.

**Rationale**:
- Qwen via DashScope provides VL (Vision-Language) capability for menu scanning
- DeepSeek offers cost-effective text generation
- User can switch models mid-conversation
- Menu scanner locked to Qwen (DeepSeek lacks VL)

**Alternatives considered**:
- *Single model*: Less impressive for demo
- *OpenAI/Anthropic*: Not China-first, potential access issues

### 7. File Upload Strategy

**Decision**: Store uploaded menu images in local `public/uploads/` directory with unique filenames.

**Rationale**:
- Simple for demo (no cloud storage needed)
- Next.js serves from public/ automatically
- Temporary storage acceptable for prototype

**Alternatives considered**:
- *S3/Cloud Storage*: Overkill for local demo
- *Base64 in DB*: Bloates database, slow

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| **API rate limits during demo** | Pre-cache common responses; have fallback demo mode |
| **VL model accuracy varies** | Test with multiple menu photos; have manual override |
| **1-week timeline tight** | Focus on core features; defer polish if needed |
| **Demo data incomplete** | Research KHC sauce catalog; use realistic placeholders |
| **No internet at demo venue** | Prepare offline fallback or hotspot backup |
| **Memory system complexity** | Start with simple preference tracking; iterate |
| **Chinese text handling** | Use UTF-8 throughout; test with Chinese inputs |

## Migration Plan

This is a greenfield application — no migration needed.

**Development Setup**:
1. `pnpm install` — Install dependencies
2. `cp .env.example .env` — Configure API keys
3. `pnpm db:push` — Push Prisma schema to PostgreSQL
4. `pnpm db:seed` — Seed demo users and sauce data
5. `pnpm dev` — Start development server

**Demo Day**:
1. `pnpm build` — Production build
2. `pnpm start` — Start production server
3. Verify database connection and API keys
4. Test all demo flows

## Open Questions

| Question | Owner | Status |
|----------|-------|--------|
| Exact KHC sauce product list? | Infosys research | Pending |
| Qwen VL model version preference? | KHC IT | Pending |
| Branding/logo assets available? | KHC Marketing | Pending |
| Specific demo scenarios to highlight? | Stakeholders | Pending |
