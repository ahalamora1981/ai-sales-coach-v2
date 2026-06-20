## 1. Project Setup

- [x] 1.1 Initialize Next.js 14+ project with TypeScript, Tailwind CSS, and App Router
- [x] 1.2 Install and configure shadcn/ui components
- [x] 1.3 Set up Prisma with PostgreSQL connection
- [x] 1.4 Create database schema (users, conversations, messages, menu_items, sauce_kb, user_memories)
- [x] 1.5 Configure environment variables (.env with API keys, database URL)
- [x] 1.6 Set up ESLint and Prettier configuration

## 2. Database & Seeding

- [x] 2.1 Run Prisma migrations to create database tables
- [x] 2.2 Create seed script for demo users (小王, 李姐, 张总)
- [x] 2.3 Create seed script for KHC sauce knowledge base
- [x] 2.4 Add pgvector extension and enable vector embeddings on sauce_kb
- [x] 2.5 Run seed script to populate demo data

## 3. Authentication (user-auth)

- [x] 3.1 Configure NextAuth.js with Credentials provider
- [x] 3.2 Create login page with demo account selection
- [x] 3.3 Implement session management and JWT tokens
- [x] 3.4 Create auth middleware to protect routes
- [ ] 3.5 Add user profile display and session indicator

## 4. Core Layout & Navigation

- [x] 4.1 Create root layout with navigation header
- [x] 4.2 Build dashboard page with feature cards
- [x] 4.3 Create sidebar navigation (Scanner, Chat, History)
- [ ] 4.4 Implement responsive mobile layout
- [x] 4.5 Apply Kraft Heinz design system (colors, fonts, tokens)

## 5. AI LLM Integration

- [x] 5.1 Create LLM provider interface (chat, analyzeImage methods)
- [x] 5.2 Implement Qwen provider with DashScope API integration
- [x] 5.3 Implement DeepSeek provider with API integration
- [x] 5.4 Create provider factory and model switching logic
- [x] 5.5 Set up Vercel AI SDK streaming for chat responses

## 6. Sauce Knowledge Base (sauce-knowledge-base)

- [x] 6.1 Design sauce data model with pairing guidelines
- [x] 6.2 Create Prisma queries for sauce retrieval
- [x] 6.3 Implement vector embedding generation for sauces
- [x] 6.4 Build semantic search function for sauce recommendations
- [x] 6.5 Create sauce knowledge context builder for AI prompts

## 7. Menu Scanner (menu-scanner)

- [x] 7.1 Create menu scanner page with image upload UI
- [x] 7.2 Implement file upload handler with validation
- [x] 7.3 Build image preview component
- [x] 7.4 Create API route for menu analysis
- [x] 7.5 Integrate Qwen VL model for dish extraction
- [x] 7.6 Parse VL response into structured dish data
- [x] 7.7 Query sauce KB for recommendations per dish
- [x] 7.8 Display scan results with dishes and sauce pairings
- [x] 7.9 Save scan results to conversation history
- [x] 7.10 Add model restriction (Qwen only for scanning)

## 8. AI Coach Chat (ai-coach)

- [x] 8.1 Create chat page with message list and input
- [x] 8.2 Implement streaming message display
- [x] 8.3 Add model selector dropdown
- [x] 8.4 Create API route for chat with streaming response
- [x] 8.5 Integrate Vercel AI SDK for streaming
- [x] 8.6 Build conversation persistence (create, append messages)
- [x] 8.7 Add thumbs up/down feedback buttons
- [x] 8.8 Create system prompt with KHC sauce knowledge

## 9. Adaptive Memory (adaptive-memory)

- [x] 9.1 Create memory extraction function (analyze messages for insights)
- [x] 9.2 Implement preference detection (cuisine, region, style)
- [x] 9.3 Build mistake tracking from negative feedback
- [x] 9.4 Create experience level detection from question complexity
- [x] 9.5 Implement memory storage in user_memories table
- [x] 9.6 Build memory retrieval function with relevance scoring
- [x] 9.7 Create personalized prompt builder using user context
- [x] 9.8 Integrate memory engine into chat flow

## 10. Conversation History

- [x] 10.1 Create history page with conversation list
- [x] 10.2 Display conversation titles and timestamps
- [x] 10.3 Implement conversation detail view
- [x] 10.4 Add menu scan history with dish counts
- [x] 10.5 Enable loading past conversations into chat

## 11. UI Polish & Animations

- [x] 11.1 Add loading states for AI responses
- [x] 11.2 Implement typing indicator animation
- [ ] 11.3 Add smooth transitions between pages
- [x] 11.4 Create empty state illustrations
- [x] 11.5 Add error boundaries and error messages
- [ ] 11.6 Polish mobile responsiveness

## 12. Testing & Demo Prep

- [x] 12.1 Test all demo accounts login flow
- [ ] 12.2 Test menu scanner with sample images
- [ ] 12.3 Test chat with both Qwen and DeepSeek
- [ ] 12.4 Verify adaptive memory across sessions
- [x] 12.5 Run production build and test
- [ ] 12.6 Prepare demo script and talking points
