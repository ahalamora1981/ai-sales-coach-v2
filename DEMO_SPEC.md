# Demo Specification Document
## AI Sales Coach — Kraft Heinz China

| Field | Value |
|-------|-------|
| **Document Version** | 1.0 |
| **Date** | 2026-06-20 |
| **Status** | Draft |
| **Parent Document** | [BRD.md](./BRD.md) |
| **Design System** | [DESIGN-claude.md](./DESIGN-claude.md) |

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
- [10. Demo Data Strategy](#10-demo-data-strategy)
- [11. Development Timeline](#11-development-timeline)
- [12. Deployment](#12-deployment)

---

## 1. Overview

### 1.1 Purpose

This document specifies the technical implementation details for the **AI Sales Coach Demo** — a proof-of-concept web application to be presented to Kraft Heinz China stakeholders in early July 2026.

### 1.2 Demo Pitch

> "An AI-powered sales coach that lives in your pocket — scan any restaurant menu, get instant sauce recommendations, and learn smarter with an AI that adapts to you."

### 1.3 Key Differentiators to Showcase

| Differentiator | How It's Demonstrated |
|----------------|----------------------|
| **Vision AI** | Scan physical menu → instant sauce recommendations |
| **Adaptive Learning** | AI remembers user preferences, mistakes, and experience level |
| **Multi-LLM Support** | User can switch between Qwen and DeepSeek |
| **China-First** | Localized for Chinese cuisine, Chinese language, Chinese AI models |

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

### 3.1 In Scope

| Feature | Description |
|---------|-------------|
| 🔐 **User Authentication** | Login with demo accounts; personalized profiles |
| 🍽️ **Menu Scanner** | Upload photo → AI identifies dishes → recommends KHC sauces |
| 🤖 **AI Sales Coach** | Conversational chatbot for sales training and Q&A |
| 🧠 **Adaptive Memory** | AI learns from user interactions over time |

### 3.2 Out of Scope

- Taste Innovation Advisor (mentioned as roadmap)
- Integration with CRM/SAP
- Production deployment
- Admin dashboard
- Mobile app (Native)

### 3.3 Constraints

| Constraint | Detail |
|------------|--------|
| **Timeline** | 1 week (5-7 working days) |
| **Developer** | Solo developer (AI-assisted) |
| **Deployment** | Local machine only |
| **Data** | Sample/demo data (KHC KB not yet available) |

---

## 4. Key Features

### 4.1 Feature A — Menu Scanner & Sauce Recommender

**User Story:**
> As a field sales rep, I want to photograph a restaurant's menu and instantly see which KHC sauces pair with their dishes, so I can prepare targeted sales pitches.

**Acceptance Criteria:**

| # | Criterion |
|---|-----------|
| AC-A01 | User can upload menu image (camera or gallery) |
| AC-A02 | System extracts menu items using VL (Vision-Language) model |
| AC-A03 | System recommends matching KHC sauces for each dish |
| AC-A04 | Recommendations include pairing rationale (why this sauce works) |
| AC-A05 | Results are saved to user's history |
| AC-A06 | Works only with Qwen model (DeepSeek has no VL) |

**UI Components:**

```
┌─────────────────────────────────────────────────────┐
│  Menu Scanner                                       │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐   │
│  │                                             │   │
│  │    📷  Upload Menu Photo                    │   │
│  │    (tap to camera / gallery)                │   │
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  [Scan Menu]                                        │
│                                                     │
├─────────────────────────────────────────────────────┤
│  🍜 Recognized Dishes                              │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ 宫保鸡丁 (Kung Pao Chicken)                 │   │
│  │ → KHC Chili Garlic Sauce                    │   │
│  │ → KHC Hoisin Sauce                          │   │
│  │ Reason: Spicy + sweet balance               │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ 麻婆豆腐 (Mapo Tofu)                        │   │
│  │ → KHC Doubanjiang                           │   │
│  │ Reason: Authentic Sichuan flavor            │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

### 4.2 Feature B — Adaptive AI Sales Coach

**User Story:**
> As a field sales rep, I want an AI coach that learns my strengths, weaknesses, and preferences over time, so I get personalized training that improves my sales skills.

**Acceptance Criteria:**

| # | Criterion |
|---|-----------|
| AC-B01 | User can have natural language conversation with AI coach |
| AC-B02 | AI maintains conversation context within session |
| AC-B03 | AI remembers user preferences across sessions |
| AC-B04 | AI adapts response style based on user experience level |
| AC-B05 | AI tracks and avoids repeating user's past mistakes |
| AC-B06 | User can switch between Qwen and DeepSeek models |
| AC-B07 | Conversation history is persisted in database |

**UI Components:**

```
┌─────────────────────────────────────────────────────┐
│  AI Sales Coach                    [Qwen ▼]        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🤖 Hello! I'm your AI sales coach. How can I     │
│     help you today?                                 │
│                                                     │
│                              👤 How do I sell       │
│                                 sauce to a          │
│                                 Sichuan restaurant? │
│                                                     │
│  🤖 Great question! For Sichuan restaurants,       │
│     focus on our Chili Garlic Sauce. Here's         │
│     why...                                          │
│                                                     │
│                              👤 [Thumbs Up]         │
│                                                     │
├─────────────────────────────────────────────────────┤
│  Type your message...                    [Send]     │
└─────────────────────────────────────────────────────┘
```

**Personalization Dimensions:**

| Dimension | How It's Learned | How It's Used |
|-----------|------------------|---------------|
| **Experience Level** | Initial question complexity; explicit ask | Adjust explanation depth |
| **Cuisine Focus** | Menu scans; questions asked | Prioritize relevant sauces |
| **Regional Focus** | Restaurant locations mentioned | Local market insights |
| **Mistakes** | Corrections user receives | Avoid repeating errors |
| **Preferences** | Thumbs up/down feedback | Reinforce preferred content |
| **Sales Style** | Conversation patterns | Match communication style |

---

## 5. Technical Architecture

### 5.1 Tech Stack

| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| **Framework** | Next.js | 14+ | App Router, SSR, API Routes |
| **Language** | TypeScript | 5.x | End-to-end type safety |
| **Styling** | Tailwind CSS | 3.x | Utility-first, design system |
| **Components** | shadcn/ui | latest | Beautiful, accessible, customizable |
| **Database** | PostgreSQL | 16+ | Production-ready |
| **ORM** | Prisma | 5.x | Excellent TS support |
| **Auth** | NextAuth.js (Auth.js) | 5.x | Easy demo accounts |
| **AI Core** | Vercel AI SDK | 3.x | Streaming, model switching |
| **Vector DB** | pgvector | latest | RAG for sauce knowledge base |

### 5.2 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Next.js Frontend                      │   │
│  │  ┌─────────┐  ┌──────────────┐  ┌──────────────────┐   │   │
│  │  │  Login   │  │ Menu Scanner │  │   AI Chat UI     │   │   │
│  │  │  Page    │  │    Page      │  │   (Streaming)    │   │   │
│  │  └─────────┘  └──────────────┘  └──────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SERVER (Next.js)                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    API Layer (tRPC)                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│         ┌────────────────────┼────────────────────┐            │
│         ▼                    ▼                    ▼            │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────┐     │
│  │   Auth      │    │    Memory    │    │   LLM        │     │
│  │  (NextAuth) │    │    Engine    │    │  Adapter     │     │
│  └─────────────┘    └──────────────┘    └──────────────┘     │
│         │                    │                    │            │
│         ▼                    ▼                    ▼            │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────┐     │
│  │  PostgreSQL  │    │  PostgreSQL  │    │  Qwen API    │     │
│  │  (Users)    │    │  (Memory)    │    │  DeepSeek API│     │
│  └─────────────┘    └──────────────┘    └──────────────┘     │
│                    + pgvector (Sauce KB)                       │
└─────────────────────────────────────────────────────────────────┘
```

### 5.3 Project Structure

```
ai-sales-coach/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data (demo users, sauces)
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/            # Auth routes (login, register)
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/       # Protected routes
│   │   │   ├── chat/          # AI Coach chat
│   │   │   ├── scanner/       # Menu scanner
│   │   │   └── history/       # Past conversations
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth endpoints
│   │   │   ├── chat/          # Chat streaming
│   │   │   └── scanner/       # Menu processing
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing/redirect
│   │
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── chat/              # Chat-specific components
│   │   ├── scanner/           # Menu scanner components
│   │   └── layout/            # Nav, sidebar, etc.
│   │
│   ├── lib/
│   │   ├── ai/                # LLM integration
│   │   │   ├── providers/     # Qwen, DeepSeek adapters
│   │   │   ├── memory.ts      # Memory engine
│   │   │   └── prompts.ts     # System prompts
│   │   ├── db.ts              # Prisma client
│   │   ├── auth.ts            # NextAuth config
│   │   └── utils.ts           # Helpers
│   │
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript types
│   └── styles/
│       └── globals.css        # Tailwind + design tokens
│
├── public/
│   └── uploads/               # Menu image uploads
│
├── .env.example               # Environment template
├── .env                       # Environment variables
├── tailwind.config.ts         # Tailwind + design system
├── next.config.js             # Next.js config
└── package.json
```

---

## 6. Design System

### 6.1 Design Token Mapping

Adapted from [DESIGN-claude.md](./DESIGN-claude.md):

```typescript
// tailwind.config.ts
const theme = {
  colors: {
    canvas: '#faf9f5',
    'surface-soft': '#f5f0e8',
    'surface-card': '#efe9de',
    'surface-dark': '#181715',
    'surface-dark-elevated': '#252320',
    primary: {
      DEFAULT: '#cc785c',      // Coral
      active: '#a9583e',
      disabled: '#e6dfd8',
    },
    ink: '#141413',
    body: '#3d3d3a',
    'body-strong': '#252523',
    muted: '#6c6a64',
    'muted-soft': '#8e8b82',
    hairline: '#e6dfd8',
    success: '#5db872',
    warning: '#d4a017',
    error: '#c64545',
  },
  fontFamily: {
    display: ['Cormorant Garamond', 'serif'],
    body: ['Inter', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  borderRadius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    pill: '9999px',
  },
}
```

### 6.2 Page Layouts

#### Login Page
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    [Cream Canvas]                        │
│                                                         │
│              ┌─────────────────────┐                    │
│              │   🔥 AI Sales Coach │                    │
│              │                     │                    │
│              │   [Login Form]      │                    │
│              │   Email: [______]   │                    │
│              │   Pass:  [______]   │                    │
│              │                     │                    │
│              │   [Sign In] (Coral) │                    │
│              │                     │                    │
│              │   Demo Accounts:    │                    │
│              │   • Rep 1           │                    │
│              │   • Rep 2           │                    │
│              └─────────────────────┘                    │
│                                                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Main Dashboard
```
┌─────────────────────────────────────────────────────────────────┐
│  🔥 AI Sales Coach     [Scanner] [Chat] [History]    [User ▼] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Welcome back, [Name]! 👋                                     │
│                                                                 │
│   ┌─────────────────────────┐  ┌─────────────────────────┐    │
│   │   📷 Menu Scanner       │  │   🤖 AI Coach            │    │
│   │                         │  │                         │    │
│   │   Scan a restaurant     │  │   Chat with your AI     │    │
│   │   menu for sauce        │  │   sales coach for       │    │
│   │   recommendations       │  │   training & Q&A        │    │
│   │                         │  │                         │    │
│   │   [Start Scanning]      │  │   [Start Chatting]      │    │
│   └─────────────────────────┘  └─────────────────────────┘    │
│                                                                 │
│   Recent Activity:                                             │
│   • Scanned "Sichuan Garden" menu — 8 sauces recommended      │
│   • Chat: "How to sell to hot pot restaurants?"                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Menu Scanner Page
```
┌─────────────────────────────────────────────────────────────────┐
│  🔥 AI Sales Coach     [Scanner] [Chat] [History]    [User ▼] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   📷 Menu Scanner                                               │
│   ───────────────────────────────────────────────────────────  │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │                                                         │  │
│   │         📷                                              │  │
│   │    Drop menu image here                                 │  │
│   │    or click to upload                                   │  │
│   │                                                         │  │
│   │    [Choose File]    [Take Photo]                        │  │
│   │                                                         │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   Model: [Qwen (with Vision) ▼]  ← VL required for images     │
│                                                                 │
│   [🔍 Scan Menu]                                               │
│                                                                 │
│   ───────────────────────────────────────────────────────────  │
│   📋 Results                                                   │
│                                                                 │
│   (Results appear here after scanning)                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### AI Chat Page
```
┌─────────────────────────────────────────────────────────────────┐
│  🔥 AI Sales Coach     [Scanner] [Chat] [History]    [User ▼] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   🤖 AI Sales Coach                                             │
│   Model: [Qwen ▼]                                              │
│   ───────────────────────────────────────────────────────────  │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │                                                         │  │
│   │  🤖 Hello! I'm your AI sales coach for KHC sauces.     │  │
│   │     I can help you with:                                │  │
│   │     • Product knowledge                                 │  │
│   │     • Sales techniques                                  │  │
│   │     • Menu pairing advice                               │  │
│   │                                                         │  │
│   │     What would you like to learn about today?           │  │
│   │                                                         │  │
│   │                                        ┌─────────────┐ │  │
│   │                                        │ How do I    │ │  │
│   │                        👤              │ sell sauce  │ │  │
│   │                                        │ to a hot    │ │  │
│   │                                        │ pot place?  │ │  │
│   │                                        └─────────────┘ │  │
│   │                                                         │  │
│   │  🤖 Great question! For hot pot restaurants, focus on   │  │
│   │     our dipping sauce bases...                          │  │
│   │                                                         │  │
│   │                                         [👍] [👎]       │  │
│   │                                                         │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │ Type your message...                          [Send]    │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Database Schema

### 7.1 Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    User     │       │   Conversation  │       │     Message     │
├─────────────┤       ├─────────────────┤       ├─────────────────┤
│ id          │──┐    │ id              │──┐    │ id              │
│ name        │  │    │ userId          │  │    │ conversationId  │
│ email       │  │    │ title           │  │    │ role            │
│ password    │  │    │ model           │  │    │ content         │
│ image       │  │    │ createdAt       │  │    │ model           │
│ experience  │  │    │ updatedAt       │  │    │ createdAt       │
│ preferences │  │    └─────────────────┘  │    └─────────────────┘
│ createdAt   │  │                          │
└─────────────┘  │    ┌─────────────────┐   │    ┌─────────────────┐
                 │    │    MenuItem     │   │    │  SauceKB        │
                 │    ├─────────────────┤   │    ├─────────────────┤
                 └───>│ id              │   └───>│ id              │
                      │ conversationId  │        │ name            │
                      │ originalName    │        │ description     │
                      │ extractedName   │        │ category        │
                      │ recommendations │        │ pairingGuide    │
                      └─────────────────┘        │ cuisineTypes    │
                                                 └─────────────────┘
                      
                      ┌─────────────────┐
                      │  UserMemory     │
                      ├─────────────────┤
                      │ id              │
                      │ userId          │
                      │ memoryType      │
                      │ content         │
                      │ metadata        │
                      │ createdAt       │
                      └─────────────────┘
```

### 7.2 Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// === User Model ===
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  password      String
  image         String?
  experience    String?   @default("beginner") // beginner | intermediate | expert
  preferences   Json?     // { cuisine: string[], region: string[], ... }
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  conversations Conversation[]
  memories      UserMemory[]

  @@map("users")
}

// === Conversation Model ===
model Conversation {
  id          String    @id @default(cuid())
  userId      String
  title       String?
  model       String    @default("qwen") // qwen | deepseek
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  user        User      @relation(fields: [userId], references: [id])
  messages    Message[]
  menuItems   MenuItem[]

  @@map("conversations")
}

// === Message Model ===
model Message {
  id              String    @id @default(cuid())
  conversationId  String
  role            String    // user | assistant | system
  content         String
  model           String?   // which model generated this
  createdAt       DateTime  @default(now())

  conversation    Conversation @relation(fields: [conversationId], references: [id])

  @@map("messages")
}

// === MenuItem Model (Menu Scan Results) ===
model MenuItem {
  id              String    @id @default(cuid())
  conversationId  String
  originalName    String    // Original text from menu
  extractedName   String?   // Cleaned/enhanced name
  recommendations Json?     // [{ sauceId, reason, confidence }]

  conversation    Conversation @relation(fields: [conversationId], references: [id])

  @@map("menu_items")
}

// === Sauce Knowledge Base ===
model SauceKB {
  id            String    @id @default(cuid())
  name          String
  nameZh        String?   // Chinese name
  description   String
  category      String    // chili | soy | oyster | hoisin | etc
  pairingGuide  Json      // { cuisines: [], dishes: [], tips: [] }
  embedding     Unsupported("vector(1536)")?  // For RAG search

  @@map("sauce_kb")
}

// === User Memory (Adaptive Learning) ===
model UserMemory {
  id          String    @id @default(cuid())
  userId      String
  memoryType  String    // preference | mistake | experience | pattern
  content     String    // The actual memory content
  metadata    Json?     // Additional context
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  user        User      @relation(fields: [userId], references: [id])

  @@map("user_memories")
}
```

---

## 8. AI & Memory System

### 8.1 LLM Adapter Architecture

```typescript
// src/lib/ai/providers/index.ts

interface LLMProvider {
  id: string;
  name: string;
  supportsVision: boolean;
  
  chat(messages: Message[], options?: ChatOptions): AsyncIterable<string>;
  analyzeImage(imageUrl: string, prompt: string): Promise<string>;
}

// Provider implementations
const providers: Record<string, LLMProvider> = {
  qwen: new QwenProvider(),
  deepseek: new DeepseekProvider(),
};

export function getProvider(modelId: string): LLMProvider {
  const provider = providers[modelId];
  if (!provider) throw new Error(`Unknown model: ${modelId}`);
  return provider;
}
```

### 8.2 Memory Engine

```typescript
// src/lib/ai/memory.ts

interface MemoryContext {
  userProfile: UserProfile;
  recentMessages: Message[];
  relevantMemories: UserMemory[];
  currentSession: SessionContext;
}

class MemoryEngine {
  // Build personalized context for each AI request
  async buildContext(userId: string): Promise<MemoryContext> {
    const [profile, messages, memories] = await Promise.all([
      this.getUserProfile(userId),
      this.getRecentMessages(userId, 20),
      this.getRelevantMemories(userId),
    ]);

    return {
      userProfile: profile,
      recentMessages: messages,
      relevantMemories: memories,
      currentSession: this.sessionContext,
    };
  }

  // Extract and store new memories from conversation
  async processMessage(userId: string, message: Message): Promise<void> {
    // Analyze message for:
    // - Preferences (cuisine interests, sauce preferences)
    // - Mistakes (corrections, misunderstandings)
    // - Experience signals (question complexity, terminology)
    
    const insights = await this.extractInsights(message);
    
    for (const insight of insights) {
      await this.storeMemory(userId, insight);
    }
  }

  // Build system prompt with personalization
  buildSystemPrompt(context: MemoryContext): string {
    return `
      You are an AI sales coach for KHC sauces.
      
      User Profile:
      - Name: ${context.userProfile.name}
      - Experience: ${context.userProfile.experienceLevel}
      - Cuisine Focus: ${context.userProfile.preferredCuisines.join(', ')}
      
      User Memories:
      ${context.relevantMemories.map(m => `- ${m.content}`).join('\n')}
      
      Recent Conversation:
      ${context.recentMessages.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n')}
      
      Guidelines:
      - Adapt complexity to user's experience level
      - Reference past conversations when relevant
      - Avoid repeating past mistakes
      - Be encouraging and supportive
    `;
  }
}
```

### 8.3 Memory Types & Extraction

| Memory Type | Extraction Method | Storage | Usage |
|-------------|-------------------|---------|-------|
| **Preference** | Keyword detection, explicit feedback | `user_memories` | Tailor recommendations |
| **Mistake** | Correction detection, negative feedback | `user_memories` | Avoid repeating errors |
| **Experience** | Question complexity analysis | `user_profile` | Adjust explanation depth |
| **Pattern** | Frequency analysis over time | `user_memories` | Anticipate needs |

### 8.4 System Prompts

```typescript
// src/lib/ai/prompts.ts

export const MENU_ANALYSIS_PROMPT = `
You are a culinary expert analyzing restaurant menus for KHC sauce opportunities.

For each dish identified:
1. Name the dish (original + English if Chinese)
2. Recommend 1-2 KHC sauces that would enhance it
3. Explain why this pairing works (flavor profile, cuisine tradition)
4. Rate confidence (high/medium/low)

Format your response as JSON:
{
  "dishes": [
    {
      "originalName": "宫保鸡丁",
      "englishName": "Kung Pao Chicken",
      "recommendations": [
        {
          "sauce": "KHC Chili Garlic Sauce",
          "reason": "Enhances the spicy profile while adding garlic depth",
          "confidence": "high"
        }
      ]
    }
  ]
}
`;

export const SALES_COACH_PROMPT = `
You are an expert sales coach specializing in KHC sauce products for the China market.

Your role:
- Teach product knowledge (sauce types, pairings, use cases)
- Practice sales scenarios (objections, pitches, closing)
- Provide market insights (trends, competitor analysis)
- Be encouraging and adaptive to user's skill level

KHC Sauce Categories:
- Chili Sauces (辣酱): Chili Garlic, Sriracha, Sambal
- Soy Sauces (酱油): Premium Soy, Mushroom Soy
- Oyster Sauces (蚝油): Classic, Mushroom
- Hoisin/BBQ (海鲜酱/烧烤酱): Hoisin, BBQ
- Specialty: Doubanjiang, Black Bean, Sweet Chili

Always connect recommendations to real sales scenarios.
`;
```

---

## 9. User Experience Flow

### 9.1 Login Flow

```
┌─────────┐     ┌─────────────┐     ┌─────────────┐
│  Start   │────>│  Login Page │────>│  Dashboard  │
└─────────┘     └─────────────┘     └─────────────┘
                       │
                       ▼
                ┌─────────────┐
                │ Demo Account│
                │  Selection  │
                └─────────────┘
```

**Demo Accounts:**

| Name | Email | Experience | Focus |
|------|-------|------------|-------|
| 小王 (Xiao Wang) | wang@demo.com | Beginner | General |
| 李姐 (Li Jie) | li@demo.com | Intermediate | Sichuan cuisine |
| 张总 (Zhang Zong) | zhang@demo.com | Expert | Hot pot restaurants |

### 9.2 Menu Scanner Flow

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Upload   │───>│  VL      │───>│  Sauce   │───>│  Save    │
│  Image    │    │  Analyze │    │  Match   │    │  Results │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
     │               │               │               │
     ▼               ▼               ▼               ▼
 Camera/Gallery   Qwen VL API    Knowledge Base    Conversation
                                       + LLM        History
```

### 9.3 Adaptive Chat Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     User Sends Message                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Load User Context                          │
│  • Profile (experience, preferences)                        │
│  • Recent messages (last 20)                                │
│  • Relevant memories (preferences, mistakes)                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 Build Personalized Prompt                    │
│  System prompt + Context + User message                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Call LLM (Streaming)                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Post-Process Response                       │
│  • Extract new insights                                    │
│  • Update memory                                           │
│  • Track patterns                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 10. Demo Data Strategy

### 10.1 KHC Sauce Data (To Research)

| Sauce Category | Products to Include |
|----------------|---------------------|
| **Chili Sauces** | Chili Garlic Sauce, Sriracha, Sambal Oelek |
| **Soy Sauces** | Premium Soy Sauce, Mushroom Soy Sauce |
| **Oyster Sauces** | Classic Oyster Sauce, Mushroom Oyster Sauce |
| **Hoisin/BBQ** | Hoisin Sauce, Chinese BBQ Sauce |
| **Specialty** | Doubanjiang, Fermented Black Bean, Sweet Chili |

### 10.2 Sample Restaurant Menus

| Restaurant Type | Sample Dishes |
|-----------------|---------------|
| **Sichuan Restaurant** | 宫保鸡丁, 麻婆豆腐, 回锅肉, 水煮鱼 |
| **Cantonese Restaurant** | 叉烧, 白切鸡, 蒸鱼, 炒河粉 |
| **Hot Pot Place** | 涮羊肉, 各类丸子, 蔬菜拼盘, 豆腐 |
| **Noodle Shop** | 兰州拉面, 酸辣粉, 炸酱面, 刀削面 |

### 10.3 Training Content

| Topic | Content |
|-------|---------|
| **Product Knowledge** | Sauce descriptions, ingredients, usage |
| **Pairing Guidelines** | Which sauces go with which cuisines |
| **Sales Pitch Templates** | Opening lines, objection handling |
| **Competitor Intel** | How KHC differs from competitors |

---

## 11. Development Timeline

### 7-Day Sprint Plan

| Day | Morning | Afternoon | Deliverable |
|-----|---------|-----------|-------------|
| **Day 1** | Project setup, Prisma schema, DB setup | Auth (NextAuth), demo accounts | Working login |
| **Day 2** | LLM adapter (Qwen + DeepSeek) | Chat UI with streaming | Basic chat working |
| **Day 3** | Memory engine, user profiling | Memory extraction & storage | Personalization v1 |
| **Day 4** | Menu scanner (upload + VL) | Sauce KB integration | Menu scan working |
| **Day 5** | Adaptive prompt builder | Conversation history | Full adaptive chat |
| **Day 6** | UI polish, responsive | Animations, loading states | Production-quality UI |
| **Day 7** | Bug fixes, testing | Demo prep, rehearsal | Demo-ready app |

### Milestones

| Milestone | Target | Status |
|-----------|--------|--------|
| ✅ Auth + Login | Day 1 | ⬜ |
| ✅ Basic Chat | Day 2 | ⬜ |
| ✅ Memory System | Day 3 | ⬜ |
| ✅ Menu Scanner | Day 4 | ⬜ |
| ✅ Full Adaptive Flow | Day 5 | ⬜ |
| ✅ UI Polish | Day 6 | ⬜ |
| ✅ Demo Ready | Day 7 | ⬜ |

---

## 12. Deployment

### 12.1 Local Development

```bash
# Prerequisites
- Node.js 18+
- PostgreSQL 16+
- pnpm (recommended)

# Setup
pnpm install
cp .env.example .env  # Fill in API keys
pnpm db:push          # Push schema to DB
pnpm db:seed          # Seed demo data
pnpm dev              # Start dev server

# Access
http://localhost:3000
```

### 12.2 Demo Day Setup

```bash
# On demo day
pnpm build            # Production build
pnpm start            # Start production server

# Ensure:
# - .env has valid API keys
# - Database is seeded
# - Demo accounts work
# - Internet connection for LLM APIs
```

---

## Appendix

### A. API Keys Required

| Provider | Purpose | Get Key |
|----------|---------|---------|
| Qwen (DashScope) | Main LLM + Vision | https://dashscope.console.aliyun.com/ |
| DeepSeek | Alternative LLM | https://platform.deepseek.com/ |

### B. Browser Support

| Browser | Support Level |
|---------|---------------|
| Chrome 90+ | Full |
| Safari 15+ | Full |
| Edge 90+ | Full |
| Mobile Safari | Full |
| Mobile Chrome | Full |

### C. Open Questions

| Question | Owner | Status |
|----------|-------|--------|
| Exact KHC sauce list? | Infosys (research) | Pending |
| Qwen VL model version? | KHC IT | Pending |
| Branding guidelines? | KHC Marketing | Pending |

---

*Document will be updated as implementation progresses.*
