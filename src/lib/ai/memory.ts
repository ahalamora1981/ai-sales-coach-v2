import { prisma } from "@/lib/db"

export interface MemoryContext {
  userProfile: {
    name?: string | null
    experience?: string | null
    preferences?: { cuisine?: string[]; region?: string[] } | null
  }
  recentMessages: Array<{ role: string; content: string }>
  relevantMemories: Array<{ content: string; memoryType: string }>
}

export async function buildMemoryContext(userId: string): Promise<MemoryContext> {
  const [user, messages, memories] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.message.findMany({
      where: {
        conversation: { userId },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.userMemory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ])

  return {
    userProfile: {
      name: user?.name,
      experience: user?.experience,
      preferences: user?.preferences as { cuisine?: string[]; region?: string[] } | null,
    },
    recentMessages: messages.reverse().map((m: { role: string; content: string }) => ({
      role: m.role,
      content: m.content,
    })),
    relevantMemories: memories.map((m: { content: string; memoryType: string }) => ({
      content: m.content,
      memoryType: m.memoryType,
    })),
  }
}

export async function extractAndStoreMemories(
  userId: string,
  message: string,
  role: "user" | "assistant"
): Promise<void> {
  if (role !== "user") return

  const messageLower = message.toLowerCase()

  // Detect cuisine preferences
  const cuisineKeywords: Record<string, string[]> = {
    sichuan: ["sichuan", "四川", "川菜", "麻辣", "辣"],
    cantonese: ["cantonese", "粤菜", "广东", "广式"],
    shanghai: ["shanghai", "上海", "本帮"],
    beijing: ["beijing", "北京", "京菜"],
  }

  for (const [cuisine, keywords] of Object.entries(cuisineKeywords)) {
    if (keywords.some((k) => messageLower.includes(k))) {
      await prisma.userMemory.create({
        data: {
          userId,
          memoryType: "preference",
          content: `User is interested in ${cuisine} cuisine`,
          metadata: { cuisine, source: "message_analysis" },
        },
      })
    }
  }

  // Detect experience level signals
  const expertSignals = [
    "margin",
    "markup",
    "distribution",
    "supply chain",
    "wholesale",
    "retail",
    "inventory",
    "promotion",
    "competitor",
  ]

  const beginnerSignals = [
    "what is",
    "how do",
    "can you explain",
    "i don't understand",
    "new to",
    "starting",
  ]

  if (expertSignals.some((s) => messageLower.includes(s))) {
    await prisma.user.update({
      where: { id: userId },
      data: { experience: "expert" },
    })
  } else if (beginnerSignals.some((s) => messageLower.includes(s))) {
    await prisma.user.update({
      where: { id: userId },
      data: { experience: "beginner" },
    })
  }
}

export async function getRelevantMemories(
  userId: string,
  context: string
): Promise<string[]> {
  const memories = await prisma.userMemory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  // Simple relevance scoring - prioritize recent and preference memories
  const scored = memories.map((m: { content: string; memoryType: string; createdAt: Date }) => {
    let score = 0

    // Recency score
    const daysSinceCreation =
      (Date.now() - new Date(m.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    score += Math.max(0, 10 - daysSinceCreation)

    // Type score
    if (m.memoryType === "preference") score += 5
    if (m.memoryType === "mistake") score += 3
    if (m.memoryType === "experience") score += 2

    // Context relevance (simple keyword matching)
    const contextLower = context.toLowerCase()
    const contentLower = m.content.toLowerCase()
    if (contextLower.split(" ").some((w) => contentLower.includes(w))) {
      score += 5
    }

    return { content: m.content, score }
  })

  // Return top memories sorted by score
  return scored
    .sort((a: { content: string; score: number }, b: { content: string; score: number }) => b.score - a.score)
    .slice(0, 10)
    .map((m: { content: string; score: number }) => m.content)
}

export async function updateExperienceLevel(
  userId: string,
  questionComplexity: "low" | "medium" | "high"
): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return

  const currentLevel = user.experience || "beginner"

  // Update based on question complexity signals
  if (
    questionComplexity === "high" &&
    currentLevel !== "expert"
  ) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        experience: currentLevel === "beginner" ? "intermediate" : "expert",
      },
    })
  }
}
