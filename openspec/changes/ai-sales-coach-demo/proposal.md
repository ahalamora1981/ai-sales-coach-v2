## Why

Kraft Heinz China needs a proof-of-concept AI Sales Coach to demonstrate to stakeholders how AI can empower field sales reps with intelligent sauce recommendations and personalized sales training. The demo must be ready for an early July 2026 presentation and prove technical feasibility with a working prototype — not slides.

## What Changes

- **New application**: Full-stack Next.js web app with PostgreSQL database
- **User authentication**: Demo accounts for field sales reps with personalized profiles
- **Menu Scanner**: Upload restaurant menu photos → Vision AI extracts dishes → instant KHC sauce pairing recommendations
- **AI Sales Coach**: Conversational chatbot for sales training, product knowledge, and Q&A
- **Adaptive Memory System**: AI learns user preferences, experience level, and mistakes across sessions
- **Multi-LLM Support**: User can switch between Qwen (with vision) and DeepSeek models
- **Sauce Knowledge Base**: Structured data of KHC sauce products with pairing guides

## Capabilities

### New Capabilities
- `user-auth`: Authentication system with demo accounts, user profiles, and session management
- `menu-scanner`: Vision-powered menu image analysis with dish extraction and sauce recommendation engine
- `ai-coach`: Conversational AI sales coach with streaming responses, multi-LLM switching, and conversation history
- `adaptive-memory`: User memory system that tracks preferences, mistakes, experience level, and patterns across sessions
- `sauce-knowledge-base`: Structured sauce product data with pairing rules, cuisine mappings, and RAG-ready embeddings

### Modified Capabilities
<!-- No existing capabilities — this is a new application -->

## Impact

- **Code**: New Next.js application with App Router, TypeScript, Tailwind CSS, shadcn/ui
- **Database**: New PostgreSQL schema with tables for users, conversations, messages, menu items, sauce KB, and user memories
- **Dependencies**: Next.js 14+, Prisma 5.x, NextAuth.js 5.x, Vercel AI SDK 3.x, pgvector
- **External APIs**: Qwen (DashScope) for LLM + Vision, DeepSeek for alternative LLM
- **Deployment**: Local development only for demo; PostgreSQL required
