# AI Sales Coach Demo

Kraft Heinz China AI-powered sales training tool for restaurant staff.

## Features

- **Menu Scanner** - Upload photos/text of restaurant menus, get AI analysis and sauce recommendations
- **AI Coach** - Conversational AI assistant for sales technique coaching (Qwen + DeepSeek)
- **Adaptive Memory** - AI learns from conversations and adapts to user expertise level
- **Sauce Knowledge Base** - 12 Kraft Heinz sauces with pairing recommendations
- **Bilingual UI** - Chinese/English toggle

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript, Tailwind CSS, shadcn/ui
- PostgreSQL with Prisma
- NextAuth.js v5 (Credentials)
- Qwen (DashScope) + DeepSeek APIs

## Quick Start

```bash
# Install dependencies
pnpm install

# Setup database
docker run -d --name ai-sales-coach-db -p 5434:5432 -e POSTGRES_PASSWORD=password -e POSTGRES_DB=ai_sales_coach pgvector/pgvector:0.8.2-pg17

# Push schema and seed
npx prisma db push
npx prisma db seed

# Start dev server
pnpm dev
```

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| 资深销售 | demo@khchina.com | demo123 |
| 新人销售 | new@khchina.com | demo123 |
| 区域经理 | manager@khchina.com | demo123 |

## Environment Variables

Copy `.env.example` to `.env` and add your API keys:

- `QWEN_API_KEY` - DashScope API key
- `DEEPSEEK_API_KEY` - DeepSeek API key
- `AUTH_SECRET` - NextAuth secret
- `DATABASE_URL` - PostgreSQL connection string
