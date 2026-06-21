# Demo Specification Document
## AI Sales Coach — Kraft Heinz China

| Field | Value |
|-------|-------|
| **Document Version** | 3.0 |
| **Date** | 2026-06-21 |
| **Status** | Implementation Complete |
| **Repository** | https://github.com/ahalamora1981/ai-sales-coach-v2 |

---

## Table of Contents

- [1. Overview](#1-overview)
- [2. Demo Objectives](#2-demo-objectives)
- [3. Scope & Constraints](#3-scope--constraints)
- [4. Key Features](#4-key-features)
- [5. Technical Architecture](#5-technical-architecture)
- [6. Design System](#6-design-system)
- [7. Database Schema](#7-database-schema)
- [8. AI & Memory System](#8-ai--memory-system)
- [9. User Experience Flow](#9-user-experience-flow)
- [10. Demo Data](#10-demo-data)
- [11. Deployment](#11-deployment)

---

## 1. Overview

### 1.1 Purpose

A proof-of-concept web application for Kraft Heinz China stakeholders — an AI-powered sales coach that helps field reps recommend KHC sauces to restaurant customers.

### 1.2 Demo Pitch

> "An AI-powered sales coach that lives in your pocket — scan any restaurant menu, get instant sauce recommendations, and learn smarter with an AI that adapts to you."

### 1.3 Key Differentiators

| Differentiator | How It's Demonstrated |
|----------------|----------------------|
| **Vision AI** | Scan physical menu → instant sauce recommendations |
| **Adaptive Learning** | AI remembers user preferences, mistakes, and experience level |
| **Multi-LLM Support** | User can switch between Qwen and DeepSeek |
| **Bilingual** | Full Chinese/English UI with language toggle |
| **Knowledge Points** | Thumbs up saves extracted knowledge points for review |

---

## 2. Demo Objectives

| # | Objective | Success Criteria |
|---|-----------|------------------|
| 1 | Impress stakeholders with AI capabilities | "Wow" reaction during menu scan demo |
| 2 | Show adaptive personalization | AI gives different responses based on user history |
| 3 | Demonstrate multi-model flexibility | User can switch LLM mid-conversation |
| 4 | Prove technical feasibility | Working prototype, not slides |
| 5 | Open doors for production discussion | Stakeholders ask "when can we deploy?" |

---

## 3. Scope & Constraints

### 3.1 In Scope (Implemented)

| Feature | Status |
|---------|--------|
| User Authentication | Done — 3 demo accounts with auto-login |
| Menu Scanner (Image) | Done — Image upload + Qwen Vision AI |
| Menu Scanner (Text) | Done — Text menu analysis via Qwen |
| AI Sales Coach | Done — Streaming chat with model switching |
| Adaptive Memory | Done — Tracks sauces, restaurants, knowledge points |
| Conversation History | Done — Persistent chat/scan history |
| Bilingual UI | Done — Chinese/English toggle |
| Knowledge Base | Done — 12 sauces + 13 cuisines |
| Responsive Design | Done — Mobile bottom tabs + desktop navbar |
| Docker Deployment | Done — Production + dev with hot reload |
| Learning Profile | Done — 酱料大全, 已扫描菜单, 已学习知识点 |

### 3.2 Out of Scope

- Taste Innovation Advisor (roadmap)
- CRM/SAP integration
- Native mobile app
- Admin dashboard
- Production deployment

### 3.3 Constraints

| Constraint | Detail |
|------------|--------|
| **Timeline** | 1 week |
| **Developer** | Solo (AI-assisted) |
| **Deployment** | Local Docker |
| **Data** | Demo data only |

---

## 4. Key Features

### 4.1 Menu Scanner & Sauce Recommender

**What it does:**
- Upload menu photo (or use 5 built-in sample menus)
- Qwen Vision AI extracts dishes
- System recommends KHC sauces with rationale
- Results saved to conversation history
- Restaurant memory stored for tracking

**Supported input:**
- Image upload (JPG, PNG) → `/api/scanner`
- Built-in sample menus (5 images + 5 text menus)
- Text menu → `/api/scanner/text`

**Models:**
- Qwen only (DeepSeek lacks vision capability)

### 4.2 AI Sales Coach (专属陪练)

**What it does:**
- Natural language chat with AI coach
- Streaming responses
- Model switching (Qwen/DeepSeek)
- Personalized based on user profile and history
- Thumbs up saves knowledge points

**Chat UI:**
- AI 陪练 label on responses
- Thumbs up button inside each AI response
- Model selector in header
- Suggested prompts for quick start

### 4.3 Adaptive Memory System

**Memory types tracked:**

| Memory Type | What It Stores | How It's Used |
|-------------|----------------|---------------|
| `knowledge` | Sauces discussed in chat | 酱料大全 section |
| `restaurant` | Scanned menus with dishes | 已扫描菜单 section |
| `knowledge_point` | Extracted insights from thumbs up | 已学习知识点 section |

**Knowledge Point Extraction:**
- Analyzes AI response when user clicks thumbs up
- Extracts key sales tips, phrases, or product insights
- Stores as concise knowledge point (max 100 chars)
- Avoids exact duplicates

### 4.4 Dashboard Learning Profile

**Sections:**

| Section | Content | Source |
|---------|---------|--------|
| 酱料大全 (12) | All KHC sauces with details | Static knowledge base |
| 已扫描菜单 | Restaurants scanned with dishes | Menu scanner |
| 已学习知识点 | Extracted knowledge from thumbs up | Chat feedback |

### 4.5 Knowledge Base

**Sauces (12 products):**

| Category | Products |
|----------|----------|
| Chili Sauces (辣酱) | Chili Garlic, Sriracha, Sambal Oelek |
| Soy Sauces (酱油) | Premium Soy, Mushroom Soy |
| Oyster Sauces (蚝油) | Classic Oyster, Mushroom Oyster |
| Chinese Sauces (中式酱) | Hoisin, Chinese BBQ |
| Specialty (特色酱) | Doubanjiang, Fermented Black Bean, Sweet Chili |

**Cuisines (16 types):**
Sichuan, Cantonese, Hunan, Shandong, Jiangsu, Zhejiang, Fujian, Anhui, Henan, Northeast, Hubei, Xinjiang, Yunnan, Western, Japanese, Korean

### 4.6 Bilingual Support

- Full Chinese/English UI
- Language toggle in navbar (desktop) and profile drawer (mobile)
- AI responses match selected language
- Chinese names for cuisines in UI (川菜, 粤菜, etc.)

---

## 5. Technical Architecture

### 5.1 Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14+ (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Components** | shadcn/ui |
| **Database** | PostgreSQL + pgvector |
| **ORM** | Prisma 5.x |
| **Auth** | NextAuth.js v5 |
| **AI** | Custom LLM providers (Qwen + DeepSeek) |
| **Deployment** | Docker + Docker Compose |

### 5.2 Project Structure

```
ai-sales-coach-v2/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data (3 users, 12 sauces)
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/          # NextAuth endpoints
│   │   │   ├── chat/          # Streaming chat + feedback
│   │   │   ├── conversations/ # History API
│   │   │   ├── memories/      # Learning profile API
│   │   │   ├── scanner/       # Menu image analysis
│   │   │   │   └── text/      # Menu text analysis
│   │   │   └── dashboard/     # Stats + knowledge API
│   │   ├── dashboard/
│   │   │   ├── page.tsx       # Dashboard + Learning Profile
│   │   │   ├── scanner/       # Menu scanner
│   │   │   ├── chat/          # AI coach chat
│   │   │   └── history/       # Conversation history
│   │   ├── login/             # Login page
│   │   └── layout.tsx         # Root layout
│   │
│   ├── components/
│   │   ├── layout/            # Navbar with mobile tabs
│   │   ├── memory-display.tsx # Learning Profile component
│   │   ├── page-transition.tsx# Page animations
│   │   └── ui/                # Button, Collapsible, etc.
│   │
│   └── lib/
│       ├── ai/
│       │   ├── providers/     # Qwen, DeepSeek adapters
│       │   ├── memory.ts      # Memory system (6 functions)
│       │   ├── prompts.ts     # System prompts
│       │   └── sauce-kb.ts    # Sauce knowledge queries
│       ├── i18n/              # Translations, context
│       ├── knowledge-data.ts  # Sauce + cuisine knowledge
│       ├── auth.ts            # NextAuth config
│       └── db.ts              # Prisma client
│
├── public/
│   └── sample-menus/          # 5 images + 5 text menus
│
├── Dockerfile                 # Multi-stage production build
├── docker-compose.yml         # Production (uses *_PRD env vars)
├── docker-compose.dev.yml     # Development with hot reload
└── docker-entrypoint.sh       # Auto-seed on first run
```

### 5.3 API Routes

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/[...nextauth]` | GET/POST | Authentication |
| `/api/chat` | POST | Streaming chat with AI |
| `/api/chat/feedback` | POST | Thumbs up → save knowledge point |
| `/api/scanner` | POST | Menu image analysis |
| `/api/scanner/text` | POST | Menu text analysis (returns JSON) |
| `/api/memories` | GET | Learning profile data |
| `/api/conversations` | GET | List conversations |
| `/api/conversations/[id]` | GET | Get conversation detail |
| `/api/dashboard/stats` | GET | Usage statistics |
| `/api/dashboard/knowledge` | GET | Knowledge base stats |

---

## 6. Design System

### 6.1 Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `canvas` | `#faf9f5` | Page background |
| `surface-soft` | `#f5f0e8` | Soft surfaces |
| `surface-card` | `#efe9de` | Card backgrounds |
| `primary` | `#cc785c` | Coral accent |
| `ink` | `#141413` | Headings |
| `body` | `#3d3d3a` | Body text |
| `muted` | `#6c6a64` | Secondary text |
| `hairline` | `#e6dfd8` | Borders |
| `error` | `#c64545` | Destructive actions |

### 6.2 Typography

- **Font:** Inter (single family)
- **Base size:** 18px
- **Headings:** Bold, larger sizes
- **Buttons:** Larger touch targets

### 6.3 Responsive Layout

**Desktop (md+):**
- Top navbar with horizontal navigation
- User avatar with dropdown menu

**Mobile:**
- Bottom tab bar with 5 tabs:
  - 主页 (Home)
  - 菜单精灵 (Scanner)
  - 专属陪练 (Coach)
  - 历史记录 (History)
  - 我的 (Profile)
- Profile opens bottom sheet modal

---

## 7. Database Schema

### 7.1 Tables

```
users
├── id (String, PK)
├── name (String?)
├── email (String, unique)
├── password (String)
├── experience (String: beginner|intermediate|expert)
├── createdAt (DateTime)
└── updatedAt (DateTime)

conversations
├── id (String, PK)
├── userId (String, FK)
├── title (String?)
├── type (String: chat|scan)
├── model (String)
├── createdAt (DateTime)
└── updatedAt (DateTime)

messages
├── id (String, PK)
├── conversationId (String, FK)
├── role (String: user|assistant|system)
├── content (String)
├── model (String?)
├── feedback (String?: thumbs_up|thumbs_down)
├── createdAt (DateTime)

menu_items
├── id (String, PK)
├── conversationId (String, FK)
├── originalName (String)
├── extractedName (String?)
├── englishName (String?)
├── recommendations (Json?)

sauce_kb
├── id (String, PK)
├── name (String)
├── nameZh (String?)
├── description (String)
├── category (String)
└── pairingGuide (Json?)

user_memories
├── id (String, PK)
├── userId (String, FK)
├── memoryType (String: knowledge|restaurant|knowledge_point)
├── content (String)
├── metadata (Json?)
├── createdAt (DateTime)
└── updatedAt (DateTime)
```

---

## 8. AI & Memory System

### 8.1 LLM Providers

| Provider | Model | Vision | Streaming |
|----------|-------|--------|-----------|
| Qwen (DashScope) | qwen3.7-plus | Yes | Yes |
| DeepSeek | deepseek-chat | No | Yes |

### 8.2 Memory System

**Memory Functions:**

| Function | Purpose |
|----------|---------|
| `storeProductKnowledge()` | Track sauces discussed in chat |
| `storeRestaurantMemory()` | Track scanned menus |
| `storeKnowledgePoint()` | Extract knowledge from thumbs up |
| `getKnowledgeContext()` | Build prompt with known sauces |
| `getRestaurantContext()` | Build prompt with scan history |
| `getScenarioContext()` | Build prompt with practice history |

**Knowledge Point Extraction:**
1. Look for sales tips (话术, 建议, 可以强调)
2. Fallback to sentences about sauces/products
3. Clean up and limit to 100 chars

---

## 9. User Experience Flow

### 9.1 Login

1. User visits app → redirected to login
2. Click demo account → auto-login with password "demo123"
3. Redirect to dashboard

### 9.2 Dashboard

1. Welcome message with user name
2. Feature cards (菜单精灵, AI 专属陪练)
3. **Learning Profile:**
   - 酱料大全 — All 12 KHC sauces
   - 已扫描菜单 — Scan history
   - 已学习知识点 — Knowledge from thumbs up
4. 菜品酱料知识库 — Detailed sauce + cuisine knowledge

### 9.3 Menu Scanner

1. Click "菜单精灵" tab
2. Upload image or select sample menu
3. Click "开始扫描"
4. View extracted dishes + sauce recommendations
5. Click "问问陪练" to discuss with AI

### 9.4 AI Coach Chat (专属陪练)

1. Click "专属陪练" tab
2. Select model (Qwen/DeepSeek)
3. Type message or use suggested prompts
4. View streaming response
5. **Click 👍 inside AI response** → saves knowledge point

### 9.5 History

1. Click "历史记录" tab
2. View list of past conversations
3. Click to view details

---

## 10. Demo Data

### 10.1 Demo Accounts

| Name | Email | Password | Experience |
|------|-------|----------|------------|
| 小王 (Xiao Wang) | wang@demo.com | demo123 | Beginner |
| 李姐 (Li Jie) | li@demo.com | demo123 | Intermediate |
| 张总 (Zhang Zong) | zhang@demo.com | demo123 | Expert |

### 10.2 Sample Menus

Located in `public/sample-menus/`:
- 001-005: Menu images (JPG)
- 006-010: Menu text files (TXT)

---

## 11. Deployment

### 11.1 Docker Setup

**Development (hot reload):**
```bash
docker compose -f docker-compose.dev.yml up -d
# Edit files → auto-reload
```

**Production:**
```bash
docker compose up -d
# App: http://localhost:3000
# DB: localhost:5434
```

### 11.2 Environment Variables

```env
# Development
DATABASE_URL_DEV="postgresql://postgres:password@db:5432/ai_sales_coach"
NEXTAUTH_URL_DEV=http://localhost:3000
AUTH_URL_DEV=http://localhost:3000/api/auth

# Production
DATABASE_URL_PRD="postgresql://postgres:password@db:5432/ai_sales_coach"
NEXTAUTH_URL_PRD=https://johnnytao.com.cn
AUTH_URL_PRD=https://johnnytao.com.cn/api/auth

# AI APIs
QWEN_API_KEY=sk-xxx
QWEN_MODEL=qwen3.7-plus
DEEPSEEK_API_KEY=sk-xxx
```

### 11.3 Database

- Auto-seeded on first Docker start
- 3 demo users + 12 sauces
- Manual seed: `npx tsx prisma/seed.ts`

---

## Appendix

### A. Implemented Pages

| Route | Description |
|-------|-------------|
| `/login` | Login with demo accounts |
| `/dashboard` | Welcome + Learning Profile + Knowledge Base |
| `/dashboard/scanner` | Menu scanner with sample menus |
| `/dashboard/chat` | AI 陪练 with model selector + thumbs up |
| `/dashboard/history` | Conversation history list |

### B. Key Components

| Component | File |
|-----------|------|
| Navbar | `src/components/layout/navbar.tsx` |
| Memory Display | `src/components/memory-display.tsx` |
| Language Toggle | `src/components/ui/language-toggle.tsx` |
| Collapsible | `src/components/ui/collapsible.tsx` |
| Page Transition | `src/components/page-transition.tsx` |

### C. Git Branches

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code |

---

*Document reflects implementation as of 2026-06-21.*
