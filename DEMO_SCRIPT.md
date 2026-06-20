# Demo Script — AI Sales Coach
## Kraft Heinz China Stakeholder Presentation

**Duration:** 15-20 minutes
**Audience:** KHC China stakeholders
**Goal:** Impress with AI capabilities, show practical value

---

## Opening (2 minutes)

### Hook
> "What if every field sales rep had an AI coach that knows every KHC sauce, every cuisine pairing, and every customer preference — right in their pocket?"

### Problem Statement
- Field reps visit 10-15 restaurants daily
- Each restaurant has unique menu and cuisine style
- Reps need to match KHC sauces to specific dishes
- Current process: manual, inconsistent, time-consuming

### Solution
> "AI Sales Coach — scan any menu, get instant sauce recommendations, and get personalized coaching that improves over time."

---

## Demo Flow

### Part 1: Login & Personalization (2 minutes)

1. **Show login page**
   - Demo accounts: 小王 (Beginner), 李姐 (Intermediate), 张总 (Expert)
   - Click 李姐 → auto-login

2. **Point out**
   - Clean, modern interface
   - Chinese language UI (language toggle available)
   - Experience level badge in profile

**Talking point:** "The system adapts to each user's experience level — beginners get simpler explanations, experts get advanced sales tactics."

---

### Part 2: Menu Scanner (5 minutes)

1. **Navigate to 菜单精灵 (Menu Scanner)**

2. **Show sample menus**
   - 5 menu images + 5 text menus
   - Click 川菜火锅 (Sichuan Hotpot)

3. **Click 开始扫描**
   - Show loading state
   - Wait for AI response

4. **Show results**
   - Extracted dishes with Chinese/English names
   - KHC sauce recommendations for each dish
   - Confidence levels (high/medium/low)
   - Rationale for each recommendation

5. **Highlight key features**
   - Vision AI identifies dishes from photo
   - Matches to KHC sauce portfolio
   - Provides sales-ready talking points

**Talking point:** "In 10 seconds, the rep knows exactly which sauces to recommend for every dish on the menu. What used to take 30 minutes of research now takes one photo."

---

### Part 3: AI Coach Chat (5 minutes)

1. **Navigate to 专属陪练 (AI Coach)**

2. **Show model selector**
   - Qwen (with vision)
   - DeepSeek (text-only)

3. **Start conversation**
   - "How do I sell Chili Garlic Sauce to a Sichuan restaurant?"
   - Show streaming response

4. **Show personalization**
   - AI references user's experience level
   - Adapts tone and depth

5. **Switch models**
   - Change to DeepSeek
   - Ask follow-up question
   - Show seamless model switching

6. **Show "Ask Coach" from scanner**
   - Go back to scanner results
   - Click "问我教练" on a dish
   - Shows contextual coaching

**Talking point:** "The AI remembers past conversations and adapts. Over time, it learns each rep's strengths and weaknesses."

---

### Part 4: Knowledge Base (2 minutes)

1. **Go to Dashboard**

2. **Show 菜品酱料知识库**
   - Expand 辣酱 category
   - Show 12 KHC sauces with details
   - Show 13 cuisine types

3. **Highlight**
   - Complete product knowledge at fingertips
   - Pairing guidelines for each sauce
   - Storage and shelf life info

**Talking point:** "Every rep has instant access to the full KHC sauce portfolio — no more flipping through product catalogs."

---

### Part 5: Conversation History (1 minute)

1. **Navigate to 历史记录 (History)**

2. **Show**
   - List of past conversations
   - Both chat and scan types
   - Click to view details

**Talking point:** "All interactions are saved. Reps can review past recommendations and learn from their history."

---

## Closing (2 minutes)

### Key Benefits Recap
1. **Efficiency** — Menu scan in 10 seconds vs 30 minutes
2. **Consistency** — AI ensures accurate sauce recommendations
3. **Personalization** — Adapts to each rep's level and preferences
4. **Knowledge** — Complete product info always available
5. **Improvement** — AI learns and gets better over time

### Technical Highlights
- Multi-LLM support (Qwen + DeepSeek)
- Vision AI for menu scanning
- Adaptive memory system
- Bilingual (Chinese/English)
- Mobile-first design

### Call to Action
> "This is a working prototype. With your feedback, we can customize it for KHC China's specific needs and deploy it to your field team."

---

## Q&A Preparation

### Likely Questions & Answers

**Q: How accurate are the sauce recommendations?**
A: "The AI combines Vision recognition with our sauce knowledge base. For the demo, we're using 12 KHC sauces. In production, we'd integrate your full product catalog."

**Q: Can it work offline?**
A: "The demo requires internet for AI APIs. For production, we could implement offline caching for sauce knowledge."

**Q: How does it handle regional preferences?**
A: "The adaptive memory learns regional preferences over time. We can also pre-configure regional recommendations."

**Q: What about data security?**
A: "For production, we'd implement enterprise authentication and data encryption. The demo uses local data only."

**Q: When can we deploy?**
A: "With stakeholder approval, we could have a production-ready version in 4-6 weeks."

---

## Demo Checklist

### Before Demo
- [ ] Docker containers running
- [ ] Database seeded
- [ ] API keys valid
- [ ] Internet connection stable
- [ ] Browser open to localhost:3000
- [ ] Clear browser cache

### During Demo
- [ ] Speak Chinese (audience preference)
- [ ] Keep cursor visible
- [ ] Pause for reactions
- [ ] Don't rush through features
- [ ] Highlight "wow" moments

### After Demo
- [ ] Collect feedback
- [ ] Note customization requests
- [ ] Schedule follow-up

---

## Backup Plan

If live demo fails:
1. Use screenshots in DEMO_SPEC.md
2. Show pre-recorded video (if available)
3. Walk through code architecture
4. Focus on technical discussion

---

*Script version 1.0 — 2026-06-20*
